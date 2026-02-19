'use client';

import React, { useState } from 'react';
import type { Flashcard } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Repeat } from 'lucide-react';

interface FlashcardDisplayProps {
  flashcards: Flashcard[];
}

export default function FlashcardDisplay({ flashcards }: FlashcardDisplayProps) {
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    Array(flashcards.length).fill(false)
  );

  const handleFlip = (index: number) => {
    const newFlippedStates = [...flippedStates];
    newFlippedStates[index] = !newFlippedStates[index];
    setFlippedStates(newFlippedStates);
  };

  return (
    <div className="w-full max-w-md p-4">
      <h3 className="text-lg font-semibold mb-4">Generated Flashcards</h3>
      <Carousel className="w-full">
        <CarouselContent>
          {flashcards.map((card, index) => (
            <CarouselItem key={index}>
              <div
                className={`flashcard w-full h-64 perspective-[1000px] cursor-pointer`}
                onClick={() => handleFlip(index)}
              >
                <div
                  className={`flashcard-inner relative w-full h-full ${
                    flippedStates[index] ? 'flipped' : ''
                  }`}
                >
                  {/* Front */}
                  <div className="flashcard-front absolute w-full h-full">
                    <Card className="w-full h-full flex flex-col justify-center items-center bg-secondary">
                      <CardContent className="p-6 text-center">
                        <p className="text-lg font-medium text-secondary-foreground">{card.front}</p>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Back */}
                  <div className="flashcard-back absolute w-full h-full">
                    <Card className="w-full h-full flex flex-col justify-center items-center bg-primary">
                      <CardContent className="p-6 text-center">
                        <p className="text-lg text-primary-foreground">{card.back}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-foreground" />
        <CarouselNext className="text-foreground" />
      </Carousel>
      <div className="text-center mt-4">
        <Button variant="ghost" size="sm" onClick={() => setFlippedStates(Array(flashcards.length).fill(false))}>
          <Repeat className="mr-2 h-4 w-4" />
          Reset Flips
        </Button>
      </div>
    </div>
  );
}
