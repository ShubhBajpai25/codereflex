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
import { Code2, LogOut, History, X, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-background flex flex-col">
      {dateParam && (
        <div className="bg-accent/10 border-b border-accent/20 py-2 px-6 flex items-center justify-between">
          <p className="text-xs text-accent font-medium">
            Viewing archived reflex from <span className="underline">{dateParam}</span>
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="h-6 text-xs text-accent hover:bg-accent/20"
          >
            <X className="w-3 h-3 mr-1" /> Return to Present
          </Button>
        </div>
      )}

      {/* Shared Header (Internal component to keep it clean) */}
      <DashboardHeader user={user} viewMode={viewMode} setViewMode={setViewMode} />

      <div className="flex justify-center py-4 border-b border-border bg-secondary/30">
        <Button onClick={() => router.push("/calendar")} variant="ghost" className="gap-2 text-accent font-semibold">
          <History className="w-4 h-4" /> See what you've missed!
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <FactCardSkeleton />
        ) : topic ? (
          <FactCard fact={topic} viewMode={viewMode} />
        ) : (
          <div className="text-center space-y-4">
            <Sparkles className="w-12 h-12 text-muted-foreground/20 mx-auto" />
            <p className="text-muted-foreground">Nothing found for this selection.</p>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
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
    <div className="w-full max-w-3xl mx-auto animate-pulse">
      <div className="p-8 md:p-12 rounded-2xl border border-border bg-card/50">
        <div className="flex justify-between mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-secondary rounded" />
              <div className="h-3 w-32 bg-secondary/50 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-secondary rounded-full" />
        </div>
        <div className="aspect-video w-full bg-secondary rounded-xl mb-8" />
        <div className="h-8 w-3/4 bg-secondary rounded mb-6" />
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-secondary/70 rounded" />
          <div className="h-4 w-full bg-secondary/70 rounded" />
          <div className="h-4 w-2/3 bg-secondary/70 rounded" />
        </div>
        <div className="h-12 w-full bg-accent/5 rounded-lg border border-border/50" />
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

// Helper: Reusable Header
function DashboardHeader({ user, viewMode, setViewMode }: { user: any, viewMode: TopicType, setViewMode: (v: TopicType) => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
          <Code2 className="w-5 h-5 text-accent-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">CodeReflex</span>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-secondary rounded-lg p-1">
        {(["DAILY", "WEEKLY"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === mode ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode.charAt(0) + mode.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
             <div className="p-3">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
             </div>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/sign-in" })} className="text-destructive">
               <LogOut className="w-4 h-4 mr-2" /> Sign out
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}