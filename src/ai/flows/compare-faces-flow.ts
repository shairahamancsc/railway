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
import FormData from 'form-data';


// Input: The image captured from the webcam
const CompareFacesInputSchema = z.object({
  capturedFaceDataUri: z
    .string()
    .describe(
      "A photo of a person to identify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
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

// Converts a data URI to a Buffer object
function dataURItoBuffer(dataURI: string) {
    if (!dataURI.includes(',')) {
        throw new Error('Invalid data URI format');
    }
    return Buffer.from(dataURI.split(',')[1], 'base64');
}


const compareFacesFlow = ai.defineFlow(
  {
    name: 'compareFacesFlow',
    inputSchema: CompareFacesInputSchema,
    outputSchema: CompareFacesOutputSchema,
  },
  async (input) => {
    try {
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

        // 2. Prepare the form data for the external API call using form-data library
        const form = new FormData();
        const imageBuffer = dataURItoBuffer(input.capturedFaceDataUri);
        
        form.append('image', imageBuffer, {
            filename: 'captured_face.jpg',
            contentType: 'image/jpeg',
        });
        
        labourers.forEach((labourer) => {
            if(labourer.face_scan_data_uri) {
                try {
                    const repoImageBuffer = dataURItoBuffer(labourer.face_scan_data_uri);
                    form.append('repository[]', repoImageBuffer, {
                        filename: `${labourer.id}.jpg`,
                        contentType: 'image/jpeg',
                    });
                } catch (e) {
                    console.warn(`Could not process face scan for labourer ${labourer.id}. Skipping.`);
                }
            }
        });
        
        // 3. Call the external Face Analyzer API using fetch
        const response = await fetch('https://faceanalyzer-ai.p.rapidapi.com/search-face-in-repository', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                'x-rapidapi-host': 'faceanalyzer-ai.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            },
            body: form,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error (${response.status}):`, errorBody);
            throw new Error(`The face recognition service failed with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 4. Process the API response
        if (result && result.length > 0) {
            const bestMatch = result[0];
            const labourerId = bestMatch.filename.replace('.jpg', ''); // Extract ID from filename
            const confidence = bestMatch.similarity;

            // Using a threshold to ensure the match is reasonably confident
            if (confidence > 0.7) { 
                return {
                    matchFound: true,
                    labourerId: labourerId,
                    confidence: confidence,
                };
            }
        }

        // If no matches are found or confidence is too low
        return { matchFound: false };

    } catch (error: any) {
        console.error('An error occurred in the compareFacesFlow:', error);
        // Re-throw a more user-friendly error to be displayed on the client
        throw new Error('Failed to communicate with the face recognition service. Please check the server logs.');
    }
  }
);
