'use server';
/**
 * @fileOverview A Genkit flow to generate quizzes based on a given topic.
 *
 * - generateQuiz - A function that generates a multiple-choice quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the generateQuiz flow.
 */
const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a quiz.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

/**
 * Defines the output schema for the generateQuiz flow.
 */
const GenerateQuizOutputSchema = z.array(
  z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('An array of possible answer options.'),
    answer: z.string().describe('The correct answer among the options.'),
  })
);

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

/**
 * Defines a prompt for generating a multiple-choice quiz.
 * The model used is google/flan-t5-large as specified.
 */
const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `Generate a multiple-choice quiz with 5 questions based on the following topic: "{{{topic}}}".
Each question should have 4 options, and one correct answer.
Provide the output in JSON format, strictly adhering to the following schema:

Output Schema: {{{output.schema}}}
`,
});

/**
 * Defines the Genkit flow for generating a quiz.
 */
const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);

/**
 * Wrapper function to call the generateQuizFlow.
 * @param input The input containing the topic for the quiz.
 * @returns A promise that resolves to the generated quiz.
 */
export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}
