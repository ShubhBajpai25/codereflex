"use client";

import { Badge } from "~/components/ui/badge";
import { Calendar, Lightbulb, Star, Sparkles, TrendingUp, Award } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-accent/5 to-accent/20 rounded-3xl blur-2xl opacity-50 animate-pulse" />
      
      <div className="relative p-10 md:p-16 rounded-3xl border-2 border-accent/30 bg-card/80 backdrop-blur-xl shadow-2xl shadow-accent/20 transition-all duration-500 hover:shadow-accent/30 hover:border-accent/50 hover:scale-[1.02]">
        
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-accent/20">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/40 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7 text-accent animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-accent/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-accent">
                  {viewMode === "DAILY" ? "Daily Fact" : "Weekly Deep Dive"}
                </h2>
                {viewMode === "DAILY" ? (
                  <Star className="w-4 h-4 text-accent animate-pulse" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-destructive animate-bounce" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
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
                ? "gold-gradient text-accent-foreground border-accent/40 shadow-lg shadow-accent/20" 
                : "bg-destructive/20 text-destructive border-destructive/40 shadow-lg shadow-destructive/20"
            } px-5 py-2 text-sm font-bold rounded-xl animate-fade-in stagger-1`}
          >
            {viewMode === "DAILY" ? "Languages" : "Databases"}
          </Badge>
        </div>

        {/* Title with gradient */}
        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight animate-fade-in stagger-2">
          <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            {fact.title}
          </span>
        </h1>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-10 animate-fade-in stagger-3">
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {fact.content}
          </p>
        </div>

        {/* Highlight Section with animation */}
        <div className="relative mb-10 animate-fade-in stagger-4">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-2xl blur-xl" />
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-accent/10 border-2 border-accent/30 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-accent mb-1">Did you know?</p>
                <p className="text-base text-foreground/90 font-medium leading-relaxed">
                  {fact.miniDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags with staggered animation */}
        <div className="flex flex-wrap gap-3 animate-fade-in stagger-5">
          {fact.tags.map((tag, index) => (
            <span 
              key={tag} 
              className="group px-4 py-2 text-sm font-semibold rounded-xl bg-secondary/50 text-muted-foreground border border-border hover:border-accent/50 hover:text-accent transition-all duration-300 hover:scale-105 backdrop-blur-sm cursor-pointer"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <span className="mr-1">#</span>
              {tag}
            </span>
          ))}
        </div>

        {/* Citations if available */}
        {fact.citations && fact.citations.length > 0 && (
          <div className="mt-12 pt-8 border-t border-accent/20 animate-fade-in stagger-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent" />
              <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
                Sources & Further Reading
              </h4>
            </div>
            <ul className="space-y-3">
              {fact.citations.map((citation, index) => (
                <li key={index} className="group flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                  {citation.startsWith('http') ? (
                    <a 
                      href={citation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
                    >
                      {citation}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">{citation}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}