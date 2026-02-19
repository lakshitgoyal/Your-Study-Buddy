import { Bot } from 'lucide-react';
import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Bot className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        StudyBuddy
      </h1>
    </div>
  );
}
