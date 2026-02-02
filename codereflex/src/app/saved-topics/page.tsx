"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import {
  Code2,
  ArrowUp,
  Sparkles,
  Bookmark,
  Calendar,
  Lightbulb,
  TrendingUp,
  Tag,
  ExternalLink,
} from "lucide-react";
import { cn } from "~/lib/utils";

// Mock saved topics — replace with API when backend is ready
const MOCK_SAVED_TOPICS = [
  {
    id: "1",
    title: "The Rise of TypeScript in Modern Web Development",
    miniDesc: "TypeScript has become the de facto choice for large-scale frontend applications.",
    tags: ["TypeScript", "JavaScript", "Web"],
    publishedAt: new Date("2025-02-02"),
    type: "DAILY" as const,
  },
  {
    id: "2",
    title: "Understanding React Server Components",
    miniDesc: "RSC shifts the balance of where rendering happens and how data flows.",
    tags: ["React", "RSC", "Next.js"],
    publishedAt: new Date("2025-01-28"),
    type: "DAILY" as const,
  },
  {
    id: "3",
    title: "Database Indexing: B-Trees and Beyond",
    miniDesc: "How databases use indexes to turn O(n) lookups into O(log n).",
    tags: ["Databases", "SQL", "Performance"],
    publishedAt: new Date("2025-01-20"),
    type: "WEEKLY" as const,
  },
  {
    id: "4",
    title: "CSS Container Queries Are Here",
    miniDesc: "Style components based on their container, not just the viewport.",
    tags: ["CSS", "Layout", "Responsive"],
    publishedAt: new Date("2025-01-15"),
    type: "DAILY" as const,
  },
  {
    id: "5",
    title: "GraphQL vs REST: When to Use Which",
    miniDesc: "A practical guide to choosing the right API style for your product.",
    tags: ["API", "GraphQL", "REST"],
    publishedAt: new Date("2025-01-10"),
    type: "WEEKLY" as const,
  },
];

type FilterType = "ALL" | "DAILY" | "WEEKLY";

export default function SavedTopicsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("ALL");

  // In real app: const { data: savedTopics } = api.topic.getSaved.useQuery();
  const savedTopics = MOCK_SAVED_TOPICS;

  const filteredTopics = useMemo(() => {
    if (filter === "ALL") return savedTopics;
    return savedTopics.filter((t) => t.type === filter);
  }, [savedTopics, filter]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-obsidian-gold flex flex-col relative overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 gap-6">
        {/* Sticky top bar — glass, back to dashboard */}
        <div className="flex-shrink-0 flex items-center justify-center py-4 px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-[var(--champagne-gold)] hover:bg-white/10 gap-2 font-semibold transition-all duration-300 hover:scale-105 border border-white/10"
          >
            <ArrowUp className="w-4 h-4 animate-bounce" />
            Jump Back to the Present!
            <Sparkles className="w-4 h-4 animate-pulse" />
          </Button>
        </div>

        {/* Header — glass, branding + page title */}
        <header className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-black/20 border border-white/10 backdrop-blur-md">
              <Code2 className="w-6 h-6 text-[var(--champagne-gold)]" />
            </div>
            <div>
              <span className="text-2xl font-bold gold-text-gradient">CodeReflex</span>
              <p className="text-sm text-muted-foreground mt-0.5">Saved Topics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl p-1.5 bg-black/20 backdrop-blur-md border border-white/10">
            <Bookmark className="w-5 h-5 text-[var(--champagne-gold)] shrink-0" />
            <span className="text-sm font-semibold text-foreground">
              {filteredTopics.length} saved
            </span>
          </div>
        </header>

        {/* Filter pills */}
        <div className="flex-shrink-0 flex flex-wrap items-center gap-3 px-8">
          <span className="text-sm text-muted-foreground font-medium">Show:</span>
          {(["ALL", "DAILY", "WEEKLY"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
                filter === f
                  ? "gold-gradient text-accent-foreground border-[var(--champagne-gold)]/50 shadow-lg"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/20"
              )}
            >
              {f === "ALL" ? "All" : f === "DAILY" ? "Daily" : "Weekly"}
            </button>
          ))}
        </div>

        {/* Main content — grid of topic cards */}
        <main className="flex-1 min-h-0 p-8 pb-24">
          <AnimatePresence mode="wait">
            {filteredTopics.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bookmark className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    No saved topics yet
                  </h2>
                  <p className="text-muted-foreground max-w-sm">
                    Save topics from your daily or weekly feed to find them here later.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/")}
                  className="gold-gradient text-accent-foreground border border-[var(--champagne-gold)]/40 hover:opacity-90 font-semibold px-6 py-6 rounded-xl transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto"
              >
                {filteredTopics.map((topic, index) => (
                  <motion.article
                    key={topic.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-[var(--champagne-gold)]/40 hover:shadow-xl hover:shadow-[var(--champagne-gold)]/5"
                  >
                    {/* Gold accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--champagne-gold)]/60" />

                    <div className="flex flex-col flex-1 p-6 pt-7 gap-4">
                      {/* Type + date row */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border",
                            topic.type === "DAILY"
                              ? "bg-[var(--champagne-gold)]/10 text-[var(--champagne-gold)] border-[var(--champagne-gold)]/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          )}
                        >
                          {topic.type === "DAILY" ? (
                            <Lightbulb className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingUp className="w-3.5 h-3.5" />
                          )}
                          {topic.type === "DAILY" ? "Daily" : "Weekly"}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-[var(--champagne-gold)]/70" />
                          {formatDate(topic.publishedAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-[var(--champagne-gold)] transition-colors">
                        {topic.title}
                      </h3>

                      {/* Mini description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {topic.miniDesc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {topic.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-muted-foreground"
                          >
                            <Tag className="w-3 h-3 text-[var(--champagne-gold)]/70" />
                            {t}
                          </span>
                        ))}
                        {topic.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground/70">
                            +{topic.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* CTA — view full topic (placeholder: link to dashboard with date when backend exists) */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // When backend is ready: router.push(`/?date=${topic.publishedAt.toISOString().split("T")[0]}`);
                          router.push("/");
                        }}
                        className="w-full mt-auto border border-white/10 hover:border-[var(--champagne-gold)]/50 hover:bg-white/5 text-muted-foreground hover:text-[var(--champagne-gold)] font-semibold rounded-xl gap-2 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View topic
                      </Button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
