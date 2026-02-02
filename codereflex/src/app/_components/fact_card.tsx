"use client";

import { Badge } from "~/components/ui/badge";
import { Calendar, Lightbulb } from "lucide-react";

interface FactCardProps {
  fact: {
    id: string;
    title: string;
    content: string;
    miniDesc: string;
    tags: string[];
    image?: string | null;
    citations: string[];
    publishedAt: Date | string;
  };
  viewMode: "DAILY" | "WEEKLY";
}

export function FactCard({ fact, viewMode }: FactCardProps) {
  const date = new Date(fact.publishedAt);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-8 md:p-12 rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-muted">
        
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 border border-accent/30">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                {viewMode === "DAILY" ? "Daily Fact" : "Weekly Deep Dive"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70 mt-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={`${
              viewMode === "DAILY" 
                ? "bg-accent/10 text-accent border-accent/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
            } px-3 py-1`}
          >
            {viewMode === "DAILY" ? "Languages" : "Databases"}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-card-foreground leading-tight">
          {fact.title}
        </h1>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {fact.content}
          </p>
        </div>

        {/* Highlight Section */}
        <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-accent font-medium">
            Did you know? {fact.miniDesc}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {fact.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground border border-border hover:border-accent/50 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}