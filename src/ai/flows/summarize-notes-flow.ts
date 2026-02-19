'use server';
/**
 * @fileOverview A Genkit flow that summarizes user-provided notes.
 *
 * - summarizeNotes - A function that handles the summarization process.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema for the summarize notes flow
const SummarizeNotesInputSchema = z.object({
  notes: z.string().describe('The notes text to be summarized.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

// Output Schema for the summarize notes flow
const SummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('The summarized version of the notes.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

const summarizeNotesPrompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: { schema: SummarizeNotesInputSchema },
  output: { schema: SummarizeNotesOutputSchema },
  prompt: `You are an AI study buddy designed to help students by summarizing their notes.
Summarize the following notes clearly and concisely:

Notes:
{{{notes}}}
`,
});

/**
 * Defines the Genkit flow for summarizing notes. This flow uses a prompt to summarize the text directly.
 */
const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeNotesPrompt(input);
    return output!;
  }
);

/**
 * Wrapper function to invoke the summarizeNotesFlow.
 * @param input - The notes to be summarized.
 * @returns A promise that resolves to the summarized notes.
 */
export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}
