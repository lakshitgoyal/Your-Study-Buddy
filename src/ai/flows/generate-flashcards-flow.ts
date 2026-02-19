'use server';
/**
 * @fileOverview A Genkit flow for generating flashcards based on a given topic.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z
  .string()
  .describe('The topic for which to generate flashcards.');
export type GenerateFlashcardsInput = z.infer<
  typeof GenerateFlashcardsInputSchema
>;

const FlashcardSchema = z.object({
  front: z.string().describe('The question or term for the front of the flashcard.'),
  back: z.string().describe('The answer or definition for the back of the flashcard.'),
});

const GenerateFlashcardsOutputSchema = z
  .array(FlashcardSchema)
  .describe('An array of generated flashcards, each with a front and back.');
export type GenerateFlashcardsOutput = z.infer<
  typeof GenerateFlashcardsOutputSchema
>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an AI assistant that generates flashcards.

Generate a list of flashcards, each with a 'front' and 'back', based on the following topic. Ensure the output is a JSON array of objects, each containing 'front' and 'back' string fields.

Topic: {{{this}}}`, // 'this' refers to the string input
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
