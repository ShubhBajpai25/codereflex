"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Code2, LogOut, History, ArrowUp, Sparkles, Camera, Star, TrendingUp } from "lucide-react";
import { FactCard } from "~/app/_components/fact_card"; 
import { api } from "~/trpc/react";

interface DashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

type TopicType = "DAILY" | "WEEKLY";

// 1. THE WRAPPER (Handles Suspense for build/prerender safety)
export function Dashboard({ user }: DashboardProps) {
  return (
    <Suspense fallback={<DashboardSkeleton user={user} />}>
      <DashboardContent user={user} />
    </Suspense>
  );
}

// 2. THE MAIN CONTENT
function DashboardContent({ user }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<TopicType>("DAILY");

  const dateParam = searchParams.get("date");

  const { data: topic, isLoading } = dateParam
    ? api.topic.getByDate.useQuery({ 
        date: new Date(dateParam), 
        type: viewMode 
      })
    : api.topic.getLatest.useQuery({ 
        type: viewMode 
      });

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden animate-fade-in">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {dateParam && (
        <div className="relative z-40 bg-accent/10 border-b border-accent/30 py-3 px-6 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")}
            className="text-accent hover:bg-accent/20 gap-2 font-semibold transition-all duration-300 hover:scale-105"
          >
            <ArrowUp className="w-4 h-4 animate-bounce" /> 
            <span>Jump Back to the Present!</span>
          </Button>
        </div>
      )}

      {/* Header - Fixed positioning to prevent overlap */}
      <DashboardHeader user={user} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Archive Button */}
      <div className="relative z-10 flex justify-center py-6 border-b border-border/50 backdrop-blur-sm bg-background/80 animate-fade-in stagger-2">
        <Button 
          onClick={() => router.push("/calendar")} 
          variant="ghost" 
          className="group gap-3 text-accent hover:bg-accent/10 font-semibold px-6 py-6 rounded-xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-accent/30"
        >
          <History className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" /> 
          <span>See what you've missed!</span>
          <Star className="w-4 h-4 animate-pulse" />
        </Button>
      </div>

      {/* Main content with proper spacing to avoid overlap */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pb-20">
        {isLoading ? (
          <FactCardSkeleton />
        ) : topic ? (
          <div className="animate-fade-in-scale">
            <FactCard fact={topic} viewMode={viewMode} />
          </div>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <Sparkles className="w-16 h-16 text-muted-foreground/20 mx-auto animate-pulse" />
            <p className="text-xl text-muted-foreground">Nothing found for this selection.</p>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.push("/")}
              className="border-border text-muted-foreground hover:border-accent hover:text-accent transition-all duration-300 hover:scale-105"
            >
              Back to Today
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

// 3. THE SKELETON COMPONENTS
function FactCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="p-10 md:p-16 rounded-3xl border border-accent/20 bg-card/50 backdrop-blur-sm shadow-2xl shadow-accent/5">
        <div className="flex justify-between mb-10">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 animate-shimmer" />
            <div className="space-y-3">
              <div className="h-5 w-32 bg-accent/10 rounded animate-shimmer" />
              <div className="h-4 w-40 bg-accent/5 rounded animate-shimmer" />
            </div>
          </div>
          <div className="h-8 w-24 bg-accent/10 rounded-full animate-shimmer" />
        </div>
        <div className="h-10 w-3/4 bg-accent/10 rounded mb-8 animate-shimmer" />
        <div className="space-y-4 mb-10">
          <div className="h-5 w-full bg-accent/10 rounded animate-shimmer" />
          <div className="h-5 w-full bg-accent/10 rounded animate-shimmer" />
          <div className="h-5 w-2/3 bg-accent/10 rounded animate-shimmer" />
        </div>
        <div className="h-16 w-full bg-accent/10 rounded-xl border border-accent/20 animate-shimmer" />
      </div>
    </div>
  );
}

// Fallback for the entire page
function DashboardSkeleton({ user }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader user={user} viewMode="DAILY" setViewMode={() => {}} />
      <div className="flex-1 flex items-center justify-center p-6">
        <FactCardSkeleton />
      </div>
    </div>
  );
}

// Helper: Reusable Header with proper z-index
function DashboardHeader({ 
  user, 
  viewMode, 
  setViewMode 
}: { 
  user: any; 
  viewMode: TopicType; 
  setViewMode: (v: TopicType) => void;
}) {
  return (
    <header className="relative z-50 flex items-center justify-between px-6 py-5 border-b border-border/50 backdrop-blur-md bg-background/90 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 shadow-lg shadow-accent/20 animate-glow">
          <Code2 className="w-6 h-6 text-accent-foreground" />
        </div>
        <span className="text-2xl font-bold gold-text-gradient">CodeReflex</span>
      </div>

      {/* Centered Toggle - uses grid for better positioning */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-xl p-1.5 border border-accent/20 shadow-lg">
        <button
          onClick={() => setViewMode("DAILY")}
          className={`relative px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
            viewMode === "DAILY" 
              ? "gold-gradient text-accent-foreground shadow-lg scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          {viewMode === "DAILY" && (
            <div className="absolute inset-0 rounded-lg bg-accent/20 animate-pulse" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Daily
          </span>
        </button>
        <button
          onClick={() => setViewMode("WEEKLY")}
          className={`relative px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
            viewMode === "WEEKLY" 
              ? "bg-destructive text-destructive-foreground shadow-lg scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          {viewMode === "WEEKLY" && (
            <div className="absolute inset-0 rounded-lg bg-destructive/20 animate-pulse" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly Deep Dive
          </span>
        </button>
      </div>

      {/* User Avatar - with high z-index to prevent overlap */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-11 w-11 rounded-xl hover:bg-secondary/50 transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-accent/30"
            >
              <Avatar className="h-11 w-11 border-2 border-accent/30 shadow-lg shadow-accent/10">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="gold-gradient text-accent-foreground font-bold text-lg">
                  {user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          {/* Dropdown with very high z-index */}
          <DropdownMenuContent 
            align="end" 
            className="w-72 bg-popover/95 backdrop-blur-xl border-accent/30 shadow-2xl shadow-accent/20 z-[100] mt-2"
          >
            <div className="p-4 flex items-center gap-4 border-b border-accent/20">
              <Avatar className="h-14 w-14 border-2 border-accent/30">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="gold-gradient text-accent-foreground font-bold">
                  {user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate text-lg">
                  {user?.name || "Developer"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || "dev@example.com"}
                </p>
              </div>
            </div>
            <div className="p-2">
              <DropdownMenuItem 
                className="text-muted-foreground hover:text-accent hover:bg-accent/10 cursor-pointer rounded-lg py-3 px-4 transition-all duration-200"
              >
                <Camera className="w-5 h-5 mr-3" /> 
                <span className="font-medium">Change profile picture</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-accent/20" />
            <div className="p-2">
              <DropdownMenuItem 
                onClick={() => void signOut({ callbackUrl: "/sign-in" })} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg py-3 px-4 transition-all duration-200 font-medium"
              >
                <LogOut className="w-5 h-5 mr-3" /> 
                Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}