'use server';
/**
 * @fileOverview A Genkit flow for explaining concepts.
 *
 * - explainConcept - A function that handles the concept explanation process. 
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainConceptInputSchema = z.object({
  concept: z.string().describe('The concept to be explained.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the concept.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

const explainConceptPrompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: {schema: ExplainConceptInputSchema},
  output: {schema: ExplainConceptOutputSchema},
  // As per user request, use mistralai/Mistral-7B-Instruct-v0.2 for this task.
  defaultModel: 'mistralai/Mistral-7B-Instruct-v0.2',
  prompt: `You are an AI study buddy designed to help students understand complex topics.
Explain the following concept clearly, concisely, and in an easy-to-understand manner:

Concept: {{{concept}}}`,
});

const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async input => {
    const {output} = await explainConceptPrompt(input);
    return output!;
  }
);

export async function explainConcept(
  input: ExplainConceptInput
): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}
