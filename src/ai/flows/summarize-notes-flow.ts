'use server';
/**
 * @fileOverview A Genkit flow that summarizes user-provided notes by calling a backend API.
 *
 * - summarizeNotes - A function that handles the summarization process by interacting with the backend.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

/**
 * Genkit tool to call the backend FastAPI /summarize API endpoint.
 * This tool abstracts the HTTP call to the backend service that performs the actual summarization
 * using the mistralai/Mistral-7B-Instruct-v0.2 model as specified in the project requirements.
 */
const summarizeNotesApiTool = ai.defineTool(
  {
    name: 'summarizeNotesApi',
    description: 'Calls the backend API to summarize notes using Mistral-7B-Instruct-v0.2.',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async (input) => {
    // The backend URL should be configured via environment variables.
    // Using a placeholder and default for development.
    const backendUrl = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${backendUrl}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: input.notes }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend API error: ${response.status} - ${errorText}`);
      }

      const data: SummarizeNotesOutput = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling summarizeNotesApiTool:', error);
      throw new Error(`Failed to summarize notes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

/**
 * Defines the Genkit flow for summarizing notes. This flow orchestrates the call
 * to the `summarizeNotesApiTool` which in turn communicates with the FastAPI backend.
 */
const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async (input) => {
    // Execute the tool to call the backend API for summarization.
    const result = await summarizeNotesApiTool(input);
    return result;
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
