'use server';
/**
 * @fileOverview An AI flow for recognizing a worker's face for attendance.
 *
 * - recognizeWorkerFace - A function that handles the face recognition process.
 * - RecognizeWorkerFaceInput - The input type for the recognizeWorkerFace function.
 * - RecognizedWorker - The return type for the recognizeWorkerFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the structure for a single enrolled worker's data
const EnrolledWorkerSchema = z.object({
  labourerId: z.string().describe('The unique ID of the labourer.'),
  faceScanDataUri: z
    .string()
    .describe(
      'A previously captured photo of the worker to compare against, as a data URI.'
    ),
});

// Define the input schema for the AI flow
const RecognizeWorkerFaceInputSchema = z.object({
  capturedFaceDataUri: z
    .string()
    .describe(
      "A newly captured photo of a worker for attendance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  enrolledWorkers: z
    .array(EnrolledWorkerSchema)
    .describe('A list of all workers who have a face scan enrolled.'),
});
export type RecognizeWorkerFaceInput = z.infer<
  typeof RecognizeWorkerFaceInputSchema
>;

// Define the output schema for the AI flow
const RecognizedWorkerSchema = z.object({
  labourerId: z
    .string()
    .describe(
      'The ID of the worker that is the best match. If no suitable match is found, this will be an empty string.'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score from 0 to 1 on how certain the AI is about the match.'
    ),
  reasoning: z.string().describe('A brief explanation for the decision.'),
});
export type RecognizedWorker = z.infer<typeof RecognizedWorkerSchema>;

// This is the main function you'll call from your frontend.
export async function recognizeWorkerFace(
  input: RecognizeWorkerFaceInput
): Promise<RecognizedWorker> {
  // If there are no enrolled workers, we can't find a match.
  if (input.enrolledWorkers.length === 0) {
    return {
      labourerId: '',
      confidence: 0,
      reasoning: 'No workers are enrolled for face recognition.',
    };
  }
  return recognizeWorkerFlow(input);
}

// Define the Genkit prompt
const prompt = ai.definePrompt({
  name: 'recognizeWorkerPrompt',
  input: {schema: RecognizeWorkerFaceInputSchema},
  output: {schema: RecognizedWorkerSchema},
  prompt: `You are an advanced AI security system specializing in biometric face recognition for a worker attendance system.

Your task is to identify a worker from a newly captured photo by comparing it against a list of pre-enrolled worker photos.

Here is the data you will work with:
1.  **A Newly Captured Photo:** This is the person you need to identify.
    Photo to identify: {{media url=capturedFaceDataUri}}

2.  **A List of Enrolled Workers:** These are the potential candidates. Each one has an ID and a reference photo.
    {{#each enrolledWorkers}}
      - Worker ID: {{{this.labourerId}}}
        Reference Photo: {{media url=this.faceScanDataUri}}
    {{/each}}

**Your Goal:**
- Carefully compare the "Photo to identify" with each "Reference Photo".
- Look for matching facial features, structure, and key identity markers.
- Determine which enrolled worker is the best match.
- If you find a confident match (e.g., above 85% certainty), output their 'labourerId'.
- If you are not confident in any match, or if the person in the photo does not appear to match anyone, you MUST return an empty string for the 'labourerId'.

Provide a confidence score and a brief reasoning for your choice.
`,
});

// Define the Genkit flow
const recognizeWorkerFlow = ai.defineFlow(
  {
    name: 'recognizeWorkerFlow',
    inputSchema: RecognizeWorkerFaceInputSchema,
    outputSchema: RecognizedWorkerSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
