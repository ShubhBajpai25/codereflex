"use client";

import { Badge } from "~/components/ui/badge";
import { Calendar, Lightbulb, Bookmark } from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";
import { cn } from "~/lib/utils";

interface FactCardProps {
  fact: {
    id: string; // Added ID for saving
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
  const [isSaved, setIsSaved] = useState(false); // You can initialize this from a prop later
  const date = new Date(fact.publishedAt);

  // tRPC mutation to save/unsave
  const toggleSave = api.topic.toggleSave.useMutation({
    onSuccess: () => setIsSaved(!isSaved),
  });

  return (
    <div className="w-full max-w-3xl mx-auto group">
      <div className="p-8 md:p-12 rounded-2xl border border-border bg-card shadow-lg relative">
        
        {/* Save Button Overlay */}
        <button 
          onClick={() => toggleSave.mutate({ topicId: fact.id, shouldSave: !isSaved })}
          className="absolute top-8 right-8 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Bookmark 
            className={cn(
              "w-6 h-6 transition-all", 
              isSaved ? "fill-accent text-accent" : "text-muted-foreground"
            )} 
          />
        </button>

        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                {viewMode === "DAILY" ? "Daily Reflex" : "Weekly Deep Dive"}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="w-3 h-3" />
                <span>{date.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            {viewMode}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-card-foreground leading-tight">
          {fact.title}
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {fact.content}
          </p>
        </div>

        {/* Highlight Section */}
        <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-accent font-medium italic">
            " {fact.miniDesc} "
          </p>
        </div>

        {/* Citations Section */}
        {fact.citations && fact.citations.length > 0 && (
          <div className="mt-12 pt-6 border-t border-border/50">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Sources & Further Reading
            </h4>
            <ul className="space-y-2">
              {fact.citations.map((citation, index) => (
                <li key={index} className="text-sm text-accent hover:underline cursor-pointer">
                  {/* If it's a URL, we can make it a link; otherwise, just text */}
                  {citation.startsWith('http') ? (
                    <a href={citation} target="_blank" rel="noopener noreferrer">
                      {citation}
                    </a>
                  ) : (
                    <span>{citation}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {fact.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}