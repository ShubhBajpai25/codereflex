"use client";

import React from "react";
import { Code2, Sparkles, Zap, Brain } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
            <Code2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CodeReflex</span>
        </div>
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Stay ahead of the
            <span className="block text-accent mt-2">coding curve</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover fascinating facts about algorithms, new discoveries, and innovative ideas 
            in the coding world. Learn something new every single day.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={() => void signIn("google", { callbackUrl: "/" })}
              className="bg-primary text-primary-foreground hover:opacity-90 px-8 h-12 text-base font-medium rounded-lg gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
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
    <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 group">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-accent mb-4 group-hover:bg-accent/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}