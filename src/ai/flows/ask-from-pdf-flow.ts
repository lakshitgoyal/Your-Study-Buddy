'use server';
/**
 * @fileOverview This file defines the Genkit flow for asking questions from an uploaded document.
 * It interacts with a backend API to retrieve relevant information and generate an answer
 * using a RAG system.
 *
 * - askFromPdf - A function that handles asking a question about a document.
 * - AskFromPdfInput - The input type for the askFromPdf function.
 * - AskFromPdfOutput - The return type for the askFromPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFromPdfInputSchema = z.object({
  question: z.string().describe('The question to ask about the document content.'),
});
export type AskFromPdfInput = z.infer<typeof AskFromPdfInputSchema>;

const AskFromPdfOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question based on the document content.'),
});
export type AskFromPdfOutput = z.infer<typeof AskFromPdfOutputSchema>;

export async function askFromPdf(input: AskFromPdfInput): Promise<AskFromPdfOutput> {
  return askFromPdfFlow(input);
}

const askFromPdfFlow = ai.defineFlow(
  {
    name: 'askFromPdfFlow',
    inputSchema: AskFromPdfInputSchema,
    outputSchema: AskFromPdfOutputSchema,
  },
  async (input) => {
    // In a real application, replace this with your actual backend URL.
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'; // Placeholder for backend URL

    try {
      const response = await fetch(`${backendUrl}/ask-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input.question }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { answer: data.answer }; // Assuming the backend returns { "answer": "..." }
    } catch (error) {
      console.error('Error asking from document:', error);
      throw new Error(`Failed to get answer from document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
