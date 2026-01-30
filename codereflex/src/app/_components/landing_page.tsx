"use client";

import React from "react";
import { Code2, Sparkles, Zap, Brain } from "lucide-react";
import { AuthButtons } from "~/app/_components/auth-buttons";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
            <Code2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CodeReflex</span>
        </div>
        
        {/* Pass isSignedIn={false} because this component only shows for logged-out users */}
        <AuthButtons isSignedIn={false} />
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Daily insights for developers</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground text-balance">
            Stay ahead of the
            <span className="block text-accent">coding curve</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Discover fascinating facts about algorithms, new discoveries, and innovative ideas 
            in the coding world. Learn something new every single day.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             {/* Using your AuthButtons here for consistent Google Login logic */}
             <AuthButtons isSignedIn={false} />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Daily Facts"
            description="New coding insights delivered fresh every day to keep your knowledge sharp."
          />
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="Weekly Deep Dives"
            description="In-depth explorations of algorithms, patterns, and programming concepts."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Latest Discoveries"
            description="Stay updated with breakthroughs and innovations in the tech world."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          Built for developers who never stop learning.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-accent mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}