"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-obsidian-gold flex flex-col relative overflow-hidden animate-fade-in">
      {/* Gold radial gradients in corners (via ::before in .bg-obsidian-gold) */}

      {/* Strict flex layout: no overlap */}
      <div className="flex flex-col flex-1 min-h-0 gap-6">
        {dateParam && (
          <div className="flex-shrink-0 flex items-center justify-center py-4 px-8 bg-white/5 backdrop-blur-md border-b border-white/10 animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-[var(--champagne-gold)] hover:bg-white/10 gap-2 font-semibold transition-all duration-300 hover:scale-105 border border-white/10"
            >
              <ArrowUp className="w-4 h-4 animate-bounce" />
              <span>Jump Back to the Present!</span>
            </Button>
          </div>
        )}

        <DashboardHeader user={user} viewMode={viewMode} setViewMode={setViewMode} />

        <div className="flex-shrink-0 flex justify-center py-6 px-8 bg-white/5 backdrop-blur-md border-b border-white/10 animate-fade-in">
          <Button
            onClick={() => router.push("/calendar")}
            variant="ghost"
            className="group gap-3 text-[var(--champagne-gold)] hover:bg-white/10 font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 border border-white/10"
          >
            <History className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>See what you&apos;ve missed!</span>
            <Star className="w-4 h-4 animate-pulse" />
          </Button>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center min-h-0 p-8 pb-24 gap-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full flex justify-center"
              >
                <FactCardSkeleton />
              </motion.div>
            ) : topic ? (
              <motion.div
                key="fact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <FactCard fact={topic} viewMode={viewMode} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col items-center gap-6"
              >
                <Sparkles className="w-16 h-16 text-muted-foreground/20 animate-pulse" />
                <p className="text-xl text-muted-foreground">Nothing found for this selection.</p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/")}
                  className="border-white/10 text-muted-foreground hover:border-[var(--champagne-gold)] hover:text-[var(--champagne-gold)] transition-all duration-300 hover:scale-105"
                >
                  Back to Today
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// 3. THE SKELETON COMPONENTS
function FactCardSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="p-10 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
        <div className="flex justify-between mb-10 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 animate-shimmer" />
            <div className="space-y-3">
              <div className="h-5 w-32 bg-white/10 rounded animate-shimmer" />
              <div className="h-4 w-40 bg-white/5 rounded animate-shimmer" />
            </div>
          </div>
          <div className="h-8 w-24 bg-white/10 rounded-full animate-shimmer" />
        </div>
        <div className="h-10 w-3/4 bg-white/10 rounded mb-8 animate-shimmer" />
        <div className="space-y-4 mb-10">
          <div className="h-5 w-full bg-white/10 rounded animate-shimmer" />
          <div className="h-5 w-full bg-white/10 rounded animate-shimmer" />
          <div className="h-5 w-2/3 bg-white/10 rounded animate-shimmer" />
        </div>
        <div className="h-16 w-full bg-white/10 rounded-xl border border-white/10 animate-shimmer" />
      </div>
    </div>
  );
}

// Fallback for the entire page
function DashboardSkeleton({ user }: DashboardProps) {
  return (
    <div className="min-h-screen bg-obsidian-gold flex flex-col gap-6">
      <DashboardHeader user={user} viewMode="DAILY" setViewMode={() => {}} />
      <div className="flex-shrink-0 flex justify-center py-6 px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="h-14 w-64 rounded-xl bg-white/10 animate-shimmer" />
      </div>
      <div className="flex-1 flex items-center justify-center p-8 pb-24">
        <FactCardSkeleton />
      </div>
    </div>
  );
}

// Helper: Reusable Header — glass, champagne gold, strict flex (no overlap)
function DashboardHeader({
  user,
  viewMode,
  setViewMode
}: {
  user: DashboardProps["user"];
  viewMode: TopicType;
  setViewMode: (v: TopicType) => void;
}) {
  return (
    <header className="flex-shrink-0 grid grid-cols-3 items-center gap-6 px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Code2 className="w-6 h-6 text-[var(--champagne-gold)]" />
        </div>
        <span className="text-2xl font-bold gold-text-gradient">CodeReflex</span>
      </div>

      <div className="flex items-center justify-center gap-1 rounded-xl p-1.5 bg-black/20 backdrop-blur-md border border-white/10">
        <button
          onClick={() => setViewMode("DAILY")}
          className={`relative px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
            viewMode === "DAILY"
              ? "gold-gradient text-accent-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          {viewMode === "DAILY" && (
            <span className="absolute inset-0 rounded-lg border border-[var(--champagne-gold)]/50" />
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
              ? "bg-destructive text-destructive-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          {viewMode === "WEEKLY" && (
            <span className="absolute inset-0 rounded-lg border border-destructive/50" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly Deep Dive
          </span>
        </button>
      </div>

      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-11 w-11 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[var(--champagne-gold)]/50"
            >
              <Avatar className="h-11 w-11 border-2 border-[var(--champagne-gold)]/40">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="gold-gradient text-accent-foreground font-bold text-lg">
                  {user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-black/20 backdrop-blur-xl border-white/10 shadow-2xl z-[100] mt-2"
          >
            <div className="p-4 flex items-center gap-4 border-b border-white/10">
              <Avatar className="h-14 w-14 border-2 border-[var(--champagne-gold)]/40">
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
                className="text-muted-foreground hover:text-[var(--champagne-gold)] hover:bg-white/5 cursor-pointer rounded-lg py-3 px-4 transition-all duration-200"
              >
                <Camera className="w-5 h-5 mr-3 text-[var(--champagne-gold)]" />
                <span className="font-medium">Change profile picture</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="p-2">
              <DropdownMenuItem
                onClick={() => void signOut({ callbackUrl: "/sign-in" })}
                className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg py-3 px-4 transition-all duration-200 font-medium"
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