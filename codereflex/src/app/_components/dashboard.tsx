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
import { Code2, LogOut, History, ArrowUp, Sparkles, Camera } from "lucide-react";
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
        <div className="bg-accent/10 border-b border-accent/20 py-2 px-6 flex items-center justify-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")}
            className="text-accent hover:bg-accent/20 gap-2 font-medium"
          >
            <ArrowUp className="w-4 h-4" /> Jump Back to the Present!
          </Button>
        </div>
      )}

      {/* Shared Header */}
      <DashboardHeader user={user} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Archive Button */}
      <div className="flex justify-center py-4 border-b border-border">
        <Button 
          onClick={() => router.push("/calendar")} 
          variant="ghost" 
          className="gap-2 text-accent hover:bg-accent/10 font-medium transition-all"
        >
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/")}
              className="border-border text-muted-foreground hover:border-accent hover:text-accent"
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
        <div className="h-8 w-3/4 bg-secondary rounded mb-6" />
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-secondary/70 rounded" />
          <div className="h-4 w-full bg-secondary/70 rounded" />
          <div className="h-4 w-2/3 bg-secondary/70 rounded" />
        </div>
        <div className="h-12 w-full bg-accent/5 rounded-lg border border-accent/20" />
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
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
          <Code2 className="w-5 h-5 text-accent-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">CodeReflex</span>
      </div>

      {/* Centered Toggle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-secondary rounded-lg p-1">
        <button
          onClick={() => setViewMode("DAILY")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "DAILY" 
              ? "bg-accent text-accent-foreground shadow-lg" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode("WEEKLY")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === "WEEKLY" 
              ? "bg-destructive text-destructive-foreground shadow-lg" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Weekly Deep Dive
        </button>
      </div>

      {/* User Avatar */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-secondary">
              <Avatar className="h-9 w-9 border-2 border-transparent hover:border-accent transition-all">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                  {user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-popover border-border">
            <div className="p-3 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{user?.name || "Developer"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "dev@example.com"}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
            >
              <Camera className="w-4 h-4 mr-2" /> Change profile picture
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={() => void signOut({ callbackUrl: "/sign-in" })} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}