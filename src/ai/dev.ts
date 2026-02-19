import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/generate-flashcards-flow.ts';
import '@/ai/flows/explain-concept.ts';
import '@/ai/flows/ask-from-pdf-flow.ts';
import '@/ai/flows/summarize-notes-flow.ts';