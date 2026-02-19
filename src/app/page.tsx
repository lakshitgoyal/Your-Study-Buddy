'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Lightbulb,
  ScrollText,
  FileQuestion,
  Layers,
  Send,
  Loader2,
} from 'lucide-react';

import type { StudyMode, Message, QuizQuestion, Flashcard } from '@/lib/types';
import { explainConcept } from '@/ai/flows/explain-concept';
import { summarizeNotes } from '@/ai/flows/summarize-notes-flow';
import { generateQuiz } from '@/ai/flows/generate-quiz';
import { generateFlashcards } from '@/ai/flows/generate-flashcards-flow';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import QuizDisplay from '@/components/study-tools/quiz-display';
import FlashcardDisplay from '@/components/study-tools/flashcard-display';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const modeConfig = {
  explain: {
    icon: Lightbulb,
    label: 'Explain Concept',
    placeholder: 'e.g., "the theory of relativity"',
  },
  summarize: {
    icon: ScrollText,
    label: 'Summarize Notes',
    placeholder: 'Paste your notes here...',
  },
  quiz: {
    icon: FileQuestion,
    label: 'Generate Quiz',
    placeholder: 'e.g., "mitochondria"',
  },
  flashcards: {
    icon: Layers,
    label: 'Generate Flashcards',
    placeholder: 'e.g., "JavaScript data types"',
  },
};

export default function StudyBuddyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<StudyMode>('explain');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: 'assistant',
        content: `Hello! I'm your AI Study Buddy. Choose a mode and let's get started!`,
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleModeChange = (newMode: StudyMode) => {
    setMode(newMode);
    setInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      let responseContent: Message['content'] | null = null;
      let responseType: Message['type'] | undefined = undefined;

      switch (mode) {
        case 'explain':
          const explanation = await explainConcept({ concept: input });
          responseContent = explanation.explanation;
          break;
        case 'summarize':
          const summary = await summarizeNotes({ notes: input });
          responseContent = summary.summary;
          break;
        case 'quiz':
          responseContent = await generateQuiz({ topic: input });
          responseType = 'quiz';
          break;
        case 'flashcards':
          responseContent = await generateFlashcards(input);
          responseType = 'flashcards';
          break;
      }

      if (responseContent) {
        const assistantMessage: Message = {
          id: Date.now().toString() + 'ai',
          role: 'assistant',
          content: responseContent,
          type: responseType,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now().toString() + 'err',
        role: 'assistant',
        content: `Sorry, something went wrong: ${error.message}`,
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-dvh bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex-shrink-0 bg-card border-r border-border flex-col p-4 space-y-6 hidden md:flex">
        <Logo />
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Study Mode
          </label>
          <Select value={mode} onValueChange={value => handleModeChange(value as StudyMode)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        <header className="p-4 border-b border-border flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Logo />
            </div>
            <Separator orientation="vertical" className="h-8 md:hidden" />
            <div className="flex items-center gap-2">
              {React.createElement(modeConfig[mode].icon, { className: 'h-6 w-6 text-primary' })}
              <h1 className="text-xl font-semibold">{modeConfig[mode].label}</h1>
            </div>
          </div>
          <div className="md:hidden w-40">
            <Select value={mode} onValueChange={value => handleModeChange(value as StudyMode)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(modeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-4 w-4" />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xl rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                )}
              >
                {message.type === 'quiz' ? (
                  <QuizDisplay questions={message.content as QuizQuestion[]} />
                ) : message.type === 'flashcards' ? (
                  <FlashcardDisplay flashcards={message.content as Flashcard[]} />
                ) : (
                  <p className="whitespace-pre-wrap text-sm">{message.content as string}</p>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <div className="max-w-xl rounded-lg px-4 py-3 bg-card flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={modeConfig[mode].placeholder}
              className="flex-1 resize-none bg-background focus:ring-1 focus:ring-primary"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
