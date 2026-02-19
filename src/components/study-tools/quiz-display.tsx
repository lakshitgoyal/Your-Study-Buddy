'use client';

import React, { useState } from 'react';
import type { QuizQuestion } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface QuizDisplayProps {
  questions: QuizQuestion[];
}

export default function QuizDisplay({ questions }: QuizDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const getResultIcon = (questionIndex: number, option: string) => {
    if (!isSubmitted) return null;
    const correctAnswer = questions[questionIndex].answer;
    const userAnswer = selectedAnswers[questionIndex];

    if (option === correctAnswer) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (option === userAnswer && option !== correctAnswer) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getLabelClass = (questionIndex: number, option: string) => {
    if (!isSubmitted) return '';
    const correctAnswer = questions[questionIndex].answer;
    const userAnswer = selectedAnswers[questionIndex];

    if (option === correctAnswer) {
      return 'text-green-400';
    }
    if (option === userAnswer && option !== correctAnswer) {
      return 'text-red-400';
    }
    return '';
  };

  return (
    <div className="w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-2">Generated Quiz</h3>
      <Accordion type="single" collapsible className="w-full">
        {questions.map((q, qIndex) => (
          <AccordionItem value={`item-${qIndex}`} key={qIndex}>
            <AccordionTrigger>
              <span className="text-left">{`Question ${qIndex + 1}: ${q.question}`}</span>
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                onValueChange={value => handleAnswerChange(qIndex, value)}
                value={selectedAnswers[qIndex]}
                disabled={isSubmitted}
              >
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                    <RadioGroupItem value={option} id={`q${qIndex}-o${oIndex}`} />
                    <Label
                      htmlFor={`q${qIndex}-o${oIndex}`}
                      className={cn('flex-1 cursor-pointer', getLabelClass(qIndex, option))}
                    >
                      {option}
                    </Label>
                    {getResultIcon(qIndex, option)}
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {!isSubmitted && (
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Check Answers
        </Button>
      )}
    </div>
  );
}
