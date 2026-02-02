"use client";

import React from "react";
import { Code2, Sparkles, Zap, Brain, TrendingUp, Star, Award } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-6 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 shadow-lg shadow-accent/20 animate-glow">
            <Code2 className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-accent via-accent to-accent/80 bg-clip-text text-transparent">
            CodeReflex
          </span>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-accent/30 shadow-lg shadow-accent/10 animate-fade-in backdrop-blur-sm">
            <Star className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">Daily insights for developers</span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Headline with staggered animation */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground animate-fade-in stagger-1">
              Stay ahead of the
            </h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight gold-text-gradient animate-fade-in stagger-2">
              coding curve
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in stagger-3">
            Discover fascinating facts about algorithms, new discoveries, and innovative ideas 
            in the coding world. <span className="text-accent font-semibold">Learn something new every single day.</span>
          </p>

          {/* CTA Button with animation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in stagger-4">
            <Button 
              onClick={() => void signIn("google", { callbackUrl: "/" })}
              className="relative group px-10 py-7 text-lg font-bold rounded-2xl gold-gradient hover:opacity-90 transition-all duration-300 shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-accent-foreground">Continue with Google</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-accent/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        {/* Features Grid with staggered animations */}
        <div className="mt-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <FeatureCard
            icon={<Zap className="w-7 h-7" />}
            title="Daily Facts"
            description="New coding insights delivered fresh every day to keep your knowledge sharp."
            delay="stagger-1"
          />
          <FeatureCard
            icon={<Brain className="w-7 h-7" />}
            title="Weekly Deep Dives"
            description="In-depth explorations of algorithms, patterns, and programming concepts."
            delay="stagger-2"
          />
          <FeatureCard
            icon={<Award className="w-7 h-7" />}
            title="Latest Discoveries"
            description="Stay updated with breakthroughs and innovations in the tech world."
            delay="stagger-3"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 px-6 py-8 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm mb-2">Built for developers who never stop learning.</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
            <Star className="w-3 h-3 text-accent" />
            <span>Powered by AI • Curated with Care</span>
            <Star className="w-3 h-3 text-accent" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}) {
  return (
    <div className={`group relative p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 animate-fade-in-scale ${delay || ''}`}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent mb-6 group-hover:scale-110 transition-transform duration-300 border border-accent/20">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}