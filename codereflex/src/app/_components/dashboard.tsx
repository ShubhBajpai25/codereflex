"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
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
import { Code2, LogOut, History, X } from "lucide-react"; // Added X icon
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

export function Dashboard({ user }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<TopicType>("DAILY");

  // 1. Check for a date parameter in the URL
  const dateParam = searchParams.get("date");

  // 2. Conditional query logic
  // If date exists, use getByDate. Otherwise, use getLatest.
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
      {/* Archive Warning Banner */}
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

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        {/* ... Logo and View Mode Toggle remain same ... */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
            <Code2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CodeReflex</span>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-secondary rounded-lg p-1">
          <button
            onClick={() => setViewMode("DAILY")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "DAILY" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("WEEKLY")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "WEEKLY" ? "bg-red-600 text-white shadow-sm" : "text-red-400 hover:text-red-300"
            }`}
          >
            Weekly
          </button>
        </div>

        {/* Profile Dropdown remains same */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 p-3">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/" })} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero Action */}
      <div className="flex justify-center py-4 border-b border-border bg-secondary/30">
        <Button onClick={() => router.push("/calendar")} variant="ghost" className="gap-2 text-accent font-semibold">
          <History className="w-4 h-4" /> See what you've missed!
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Pulling data from the void...</p>
          </div>
        ) : topic ? (
          <FactCard fact={topic} viewMode={viewMode} />
        ) : (
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Nothing found for this date.</p>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              Back to Today
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}