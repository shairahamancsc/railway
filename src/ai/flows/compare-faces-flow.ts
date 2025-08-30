'use server';
/**
 * @fileOverview A flow to compare a face with a repository of worker faces.
 *
 * - compareFaces - A function that takes a captured image and finds the best match.
 * - CompareFacesInput - The input type for the compareFaces function.
 * - CompareFacesOutput - The return type for the compareFaces function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { supabase } from '@/lib/supabaseClient';
import type { Labourer } from '@/types';

// Input: The image captured from the webcam
const CompareFacesInputSchema = z.object({
  capturedFaceDataUri: z
    .string()
    .describe(
      "A photo of a person to identify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CompareFacesInput = z.infer<typeof CompareFacesInputSchema>;

// Output: The ID of the matched worker and confidence score
const CompareFacesOutputSchema = z.object({
  matchFound: z.boolean().describe('Whether a match was found.'),
  labourerId: z.string().optional().describe('The ID of the matched worker.'),
  confidence: z.number().optional().describe('The confidence score of the match (0 to 1).'),
});
export type CompareFacesOutput = z.infer<typeof CompareFacesOutputSchema>;

// This is the main function that will be called from the client
export async function compareFaces(input: CompareFacesInput): Promise<CompareFacesOutput> {
  return compareFacesFlow(input);
}


// Converts a data URI to a Blob object
function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}


const compareFacesFlow = ai.defineFlow(
  {
    name: 'compareFacesFlow',
    inputSchema: CompareFacesInputSchema,
    outputSchema: CompareFacesOutputSchema,
  },
  async (input) => {
    // 1. Fetch all workers who have a face scan enrolled from Supabase
    const { data: labourers, error: dbError } = await supabase
      .from('labourers')
      .select('id, fullName, face_scan_data_uri')
      .not('face_scan_data_uri', 'is', null);

    if (dbError) {
      console.error('Supabase error fetching labourers:', dbError);
      throw new Error('Could not fetch worker data from the database.');
    }

    if (!labourers || labourers.length === 0) {
      console.log("No workers with enrolled faces found.");
      return { matchFound: false };
    }

    // 2. Prepare the form data for the external API call
    const formData = new FormData();
    const imageBlob = dataURItoBlob(input.capturedFaceDataUri);
    formData.append('image', imageBlob, 'captured_face.jpg');
    
    // Add all enrolled faces to the repository for comparison
    labourers.forEach((labourer) => {
        const repoImageBlob = dataURItoBlob(labourer.face_scan_data_uri!);
        // The API expects the repository images to be named with the identifier
        formData.append('repository[]', repoImageBlob, `${labourer.id}.jpg`);
    });

    // 3. Call the external Face Analyzer API
    try {
      const response = await fetch('https://faceanalyzer-ai.p.rapidapi.com/search-face-in-repository', {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'faceanalyzer-ai.p.rapidapi.com',
          // IMPORTANT: Replace with your actual RapidAPI key, preferably from environment variables
          'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error (${response.status}):`, errorBody);
        throw new Error(`The face recognition service failed with status: ${response.status}`);
      }

      const result = await response.json();

      // 4. Process the API response
      // The API returns an array of matches. We'll take the best one.
      if (result && result.length > 0) {
        const bestMatch = result[0];
        const labourerId = bestMatch.filename.replace('.jpg', ''); // Extract ID from filename
        const confidence = bestMatch.similarity;

        // You might want to set a threshold for confidence
        if (confidence > 0.7) { // Example threshold
          return {
            matchFound: true,
            labourerId: labourerId,
            confidence: confidence,
          };
        }
      }
      
      // If no matches or confidence is too low
      return { matchFound: false };

    } catch (error) {
      console.error('Error calling Face Analyzer API:', error);
      throw new Error('An error occurred while communicating with the face recognition service.');
    }
  }
);