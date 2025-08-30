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
import * as FormData from 'form-data';
import * as https from 'https';
import { PassThrough } from 'stream';

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
    
    // Add the image to be searched for
    form.append('image', imageBuffer, {
        filename: 'captured_face.jpg',
        contentType: 'image/jpeg',
    });
    
    // Add all enrolled faces to the repository for comparison
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

    // 3. Call the external Face Analyzer API using https module for better control
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: 'faceanalyzer-ai.p.rapidapi.com',
            path: '/search-face-in-repository',
            headers: {
                ...form.getHeaders(),
                'x-rapidapi-host': 'faceanalyzer-ai.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            },
        };

        const req = https.request(options, (res) => {
            const chunks: Buffer[] = [];

            res.on('data', (chunk) => {
                chunks.push(chunk);
            });

            res.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                    console.error(`API Error (${res.statusCode}):`, body);
                    return reject(new Error(`The face recognition service failed with status: ${res.statusCode}`));
                }

                try {
                    const result = JSON.parse(body);

                    // 4. Process the API response
                    if (result && result.length > 0) {
                        const bestMatch = result[0];
                        const labourerId = bestMatch.filename.replace('.jpg', ''); // Extract ID from filename
                        const confidence = bestMatch.similarity;

                        if (confidence > 0.7) { // Example threshold
                            return resolve({
                                matchFound: true,
                                labourerId: labourerId,
                                confidence: confidence,
                            });
                        }
                    }
                    // If no matches or confidence is too low
                    return resolve({ matchFound: false });
                } catch (jsonError) {
                    console.error('Error parsing API response:', jsonError);
                    reject(new Error('Failed to parse response from face recognition service.'));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error calling Face Analyzer API:', error);
            reject(new Error('An error occurred while communicating with the face recognition service.'));
        });

        // Pipe the form data to the request
        form.pipe(req);
    });
  }
);
