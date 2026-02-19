# **App Name**: AI StudyBuddy

## Core Features:

- Explain Concept: Use mistralai/Mistral-7B-Instruct-v0.2 to explain a given concept based on user input, acting as a study tool.
- Summarize Notes: Use mistralai/Mistral-7B-Instruct-v0.2 to summarize notes provided by the user, providing a concise overview for study.
- Generate Quiz: Use google/flan-t5-large to generate a quiz based on user-provided topics. A tool for self-assessment.
- Generate Flashcards: Employ google/flan-t5-large to create flashcards from a given subject to facilitate learning and memorization.
- PDF Upload: Enable users to upload PDF documents for analysis and question answering, extracting the text from the PDF file, and generating embeddings using sentence-transformers/all-MiniLM-L6-v2.
- Ask from PDF: Answer questions based on the content of the uploaded PDF using RAG: retrieve relevant chunks and respond using mistralai/Mistral-7B-Instruct-v0.2.
- Clean Chat UI: Provide a user-friendly chat-style interface to display prompts and model responses and supports single-page interaction for ease of use.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to convey a sense of intellect and focus.
- Background color: Light gray (#F0F0F0) to ensure readability and reduce eye strain in a dark theme.
- Accent color: Electric purple (#BF00FF) for interactive elements to guide user actions.
- Body and headline font: 'Inter', a grotesque-style sans-serif font, providing a modern, machined and neutral feel which is ideal for both headings and body text. 
- Code font: 'Source Code Pro' for displaying code snippets.
- Utilize simple, outlined icons from a set like Remix Icon to maintain a minimalistic design. Icons should be used to represent different study modes and file actions.
- Maintain a clean, single-page layout with a focus on readability. The chat interface should be the primary focus, with PDF upload and mode selection easily accessible.
- Incorporate subtle animations for loading states and transitions, enhancing the user experience without distracting from the primary task.