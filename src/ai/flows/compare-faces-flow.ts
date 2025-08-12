'use server';
/**
 * @fileOverview An AI flow for comparing two faces for similarity.
 *
 * - compareFaces - A function that handles the face comparison process.
 * - CompareFacesInput - The input type for the compareFaces function.
 * - CompareFacesOutput - The return type for the compareFaces function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareFacesInputSchema = z.object({
  livePhotoUri: z
    .string()
    .describe(
      "A newly captured photo of a worker for attendance, as a data URI."
    ),
  enrolledPhotoUri: z
    .string()
    .describe(
      'A previously captured photo of the worker to compare against, as a data URI.'
    ),
});
export type CompareFacesInput = z.infer<typeof CompareFacesInputSchema>;

const CompareFacesOutputSchema = z.object({
  similarity: z
    .number()
    .describe(
      'A score from 0 to 1 indicating how similar the two faces are. 1 is identical, 0 is completely different.'
    ),
  reasoning: z
    .string()
    .describe('A brief explanation for the similarity score.'),
});
export type CompareFacesOutput = z.infer<typeof CompareFacesOutputSchema>;


export async function compareFaces(input: CompareFacesInput): Promise<CompareFacesOutput> {
  return compareFacesFlow(input);
}


const prompt = ai.definePrompt({
  name: 'compareFacesPrompt',
  input: {schema: CompareFacesInputSchema},
  output: {schema: CompareFacesOutputSchema},
  system: `You are an expert AI specializing in biometric face comparison. Your task is to determine if two photos are of the same person.

Carefully analyze both images. Compare facial features like eye spacing, nose shape, jawline, and any unique markers.

Provide a similarity score from 0.0 to 1.0. A score of 1.0 means you are absolutely certain they are the same person. A score of 0.0 means they are definitely different people. Also provide brief reasoning for your score.`,
  prompt: `- Photo 1 (Live Capture): {{media url=livePhotoUri}}
- Photo 2 (Enrolled Reference): {{media url=enrolledPhotoUri}}
`,
});

const compareFacesFlow = ai.defineFlow(
  {
    name: 'compareFacesFlow',
    inputSchema: CompareFacesInputSchema,
    outputSchema: CompareFacesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
