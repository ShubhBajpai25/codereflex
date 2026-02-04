"use client";

import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import ReactMarkdown from 'react-markdown';
import {
  Calendar,
  Lightbulb,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  Bookmark,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

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

const SAVED_TOAST_DURATION_MS = 6000;

export function FactCard({ fact, viewMode }: FactCardProps) {
  const date = new Date(fact.publishedAt);
  const router = useRouter();

  const { data: savedTopicIds = [] } = api.topic.getSavedTopicIds.useQuery();
  const utils = api.useUtils();
  const toggleSave = api.topic.toggleSave.useMutation({
    onSuccess: (_, variables) => {
      void utils.topic.getSavedTopicIds.invalidate();
      if (variables.shouldSave) {
        toast.success("Topic saved! You can revisit it anytime.", {
          duration: SAVED_TOAST_DURATION_MS,
          dismissible: true,
          action: {
            label: "View Saved Topics",
            onClick: () => router.push("/saved-topics"),
          },
        });
      }
    },
  });

  const isSaved = savedTopicIds.includes(fact.id);
  const isSaving = toggleSave.isPending;

  const handleSaveClick = () => {
    toggleSave.mutate({ topicId: fact.id, shouldSave: !isSaved });
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative p-10 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-[var(--champagne-gold)]/30 overflow-hidden">
        {/* Champagne gold progress bar accent at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-[var(--champagne-gold)]/60"
          style={{ width: "100%" }}
          aria-hidden
        />

        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
              <Lightbulb className="w-7 h-7 text-[var(--champagne-gold)]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-[var(--champagne-gold)]">
                  {viewMode === "DAILY" ? "Daily Fact" : "Weekly Deep Dive"}
                </h2>
                {viewMode === "DAILY" ? (
                  <Star className="w-4 h-4 text-[var(--champagne-gold)]" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-[var(--champagne-gold)]/80" />
                <span>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`
                h-11 w-11 rounded-xl border transition-all duration-200 shrink-0
                ${isSaved
                  ? "bg-[var(--champagne-gold)]/20 border-[var(--champagne-gold)]/50 text-[var(--champagne-gold)] hover:bg-[var(--champagne-gold)]/30"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:border-[var(--champagne-gold)]/50 hover:text-[var(--champagne-gold)]"
                }
              `}
              aria-label={isSaved ? "Unsave topic" : "Save topic"}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
            <Badge
              variant="secondary"
              className={`${
                viewMode === "DAILY"
                  ? "gold-gradient text-accent-foreground border-[var(--champagne-gold)]/40"
                  : "bg-destructive/20 text-destructive border-destructive/40"
              } px-5 py-2 text-sm font-bold rounded-xl animate-fade-in stagger-1 border`}
            >
              {viewMode === "DAILY" ? "Languages" : "Databases"}
            </Badge>
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight animate-fade-in stagger-2">
          <span className="bg-gradient-to-r from-foreground via-[var(--champagne-gold)] to-foreground bg-clip-text text-transparent">
            {fact.title}
          </span>
        </h1>

        {/* Updated Content Section */}
        <div className="prose prose-invert max-w-none mb-10 animate-fade-in stagger-3">
          <ReactMarkdown
            components={{
              // 1. Smaller headers sharing the Title's font style
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-black mt-10 mb-4 bg-gradient-to-r from-foreground via-[var(--champagne-gold)] to-foreground bg-clip-text text-transparent">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-black mt-8 mb-4 bg-gradient-to-r from-foreground via-[var(--champagne-gold)] to-foreground bg-clip-text text-transparent">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg md:text-xl font-black mt-6 mb-3 text-[var(--champagne-gold)]">
                  {children}
                </h3>
              ),
              // 2. Spaced out paragraphs
              p: ({ children }) => (
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 last:mb-0">
                  {children}
                </p>
              ),
              // 3. Code Detection and Containerization
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="relative group my-8">
                    {/* Language Label */}
                    <div className="absolute right-4 top-0 -translate-y-1/2 bg-[var(--champagne-gold)] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest z-10 shadow-lg">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl border border-white/10 !bg-black/40 !p-6 shadow-2xl"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm text-[var(--champagne-gold)]" {...props}>
                    {children}
                  </code>
                );
              },
              // Styled lists
              ul: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-3 text-muted-foreground">{children}</ul>,
              li: ({ children }) => <li className="text-lg md:text-xl">{children}</li>,
            }}
          >
            {fact.content}
          </ReactMarkdown>
        </div>

        {/* Highlight Section — glass + gold border */}
        <div className="relative mb-10 animate-fade-in stagger-4">
          <div className="p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-[var(--champagne-gold)] flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-[var(--champagne-gold)] mb-1">Did you know?</p>
                <p className="text-base text-foreground/90 font-medium leading-relaxed">
                  {fact.miniDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags — active border champagne gold on hover */}
        <div className="flex flex-wrap gap-3 animate-fade-in stagger-5">
          {fact.tags.map((tag, index) => (
            <span
              key={tag}
              className="group px-4 py-2 text-sm font-semibold rounded-xl bg-white/5 text-muted-foreground border border-white/10 hover:border-[var(--champagne-gold)]/50 hover:text-[var(--champagne-gold)] transition-all duration-300 backdrop-blur-sm cursor-pointer"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <span className="mr-1">#</span>
              {tag}
            </span>
          ))}
        </div>

        {/* Citations if available */}
        {fact.citations && fact.citations.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10 animate-fade-in stagger-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[var(--champagne-gold)]" />
              <h4 className="text-sm font-bold text-[var(--champagne-gold)] uppercase tracking-wider">
                Sources & Further Reading
              </h4>
            </div>
            <ul className="space-y-3">
              {fact.citations.map((citation, index) => (
                <li key={index} className="group flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--champagne-gold)]/50 group-hover:bg-[var(--champagne-gold)] transition-colors" />
                  {citation.startsWith("http") ? (
                    <a
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-[var(--champagne-gold)] transition-colors underline underline-offset-4 decoration-[var(--champagne-gold)]/30 hover:decoration-[var(--champagne-gold)]"
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