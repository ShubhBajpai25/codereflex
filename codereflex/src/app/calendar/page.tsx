"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Code2, ArrowUp, ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

type ViewLevel = "year" | "month" | "days"
type TopicType = "DAILY" | "WEEKLY";

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [viewLevel, setViewLevel] = useState<ViewLevel>("days")
  const [showYearSelector, setShowYearSelector] = useState(false)

  // Fetch real data from database
  const { data: archive, isLoading } = api.topic.getArchives.useQuery({ 
    type: "DAILY" as TopicType 
  });

  // Helper to find a topic for a specific date
  const getTopicForDate = (date: Date) => {
    return archive?.find(topic => {
      const pubDate = new Date(topic.publishedAt);
      return (
        pubDate.getDate() === date.getDate() &&
        pubDate.getMonth() === date.getMonth() &&
        pubDate.getFullYear() === date.getFullYear()
      );
    });
  }

  // Count topics per month for year view
  const getTopicsForMonth = (year: number, month: number) => {
    if (!archive) return 0;
    return archive.filter(topic => {
      const pubDate = new Date(topic.publishedAt);
      return pubDate.getFullYear() === year && pubDate.getMonth() === month;
    }).length;
  }

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
    const days: { date: Date }[] = []

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(selectedYear, selectedMonth, i) })
    }

    return { days, firstDay }
  }, [selectedYear, selectedMonth])

  const isToday = (date: Date) => 
    date.getDate() === today.getDate() && 
    date.getMonth() === today.getMonth() && 
    date.getFullYear() === today.getFullYear()

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) { 
        setSelectedMonth(11); 
        setSelectedYear(selectedYear - 1) 
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) { 
        setSelectedMonth(0); 
        setSelectedYear(selectedYear + 1) 
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  const years = useMemo(() => {
    const currentYear = today.getFullYear()
    return Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Top Banner */}
      <div className="sticky top-0 z-50 flex justify-center py-3 bg-accent/10 border-b border-accent/20 backdrop-blur-sm">
        <Button 
          onClick={() => router.push("/")} 
          className="bg-accent text-accent-foreground hover:opacity-90 font-medium gap-2 shadow-lg"
        >
          <ArrowUp className="w-4 h-4" /> Jump Back to the Present!
        </Button>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-1.5 rounded-lg">
            <Code2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CodeReflex</span>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Archive</span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setShowYearSelector(!showYearSelector)}
          className="border-border text-muted-foreground hover:border-accent hover:text-foreground"
        >
          {showYearSelector ? "Hide Years" : "Show Years"}
        </Button>
      </header>

      {/* Year Selector */}
      {showYearSelector && (
        <div className="border-b border-border bg-card/50 p-4">
          <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
            {years.map(y => (
              <Button 
                key={y} 
                variant={y === selectedYear ? "default" : "outline"}
                className={y === selectedYear 
                  ? "bg-accent text-accent-foreground hover:opacity-90" 
                  : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
                }
                onClick={() => { 
                  setSelectedYear(y); 
                  setShowYearSelector(false);
                  setViewLevel("days");
                }}
              >
                {y}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Button 
          variant="ghost" 
          onClick={() => viewLevel === "days" ? navigateMonth("prev") : setSelectedYear(selectedYear - 1)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> 
          {viewLevel === "days" ? "Previous" : "2024"}
        </Button>
        
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-foreground">
            {viewLevel === "days" ? `${MONTHS[selectedMonth]} ${selectedYear}` : selectedYear}
          </h2>
          <button 
            onClick={() => setViewLevel(viewLevel === "days" ? "month" : "days")} 
            className="text-xs text-accent hover:underline mt-1"
          >
            {viewLevel === "days" ? "View All Months" : "Back to Calendar"}
          </button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => viewLevel === "days" ? navigateMonth("next") : setSelectedYear(selectedYear + 1)}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          {viewLevel === "days" ? "Next" : "2026"}
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p>Scanning historical records...</p>
          </div>
        ) : viewLevel === "month" ? (
          // Month Grid View
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {MONTHS.map((m, i) => {
              const topicCount = getTopicsForMonth(selectedYear, i);
              return (
                <button 
                  key={m} 
                  onClick={() => { 
                    setSelectedMonth(i); 
                    setViewLevel("days") 
                  }} 
                  className="p-8 rounded-xl border border-border bg-card hover:border-accent/50 transition-all text-left group"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {m}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          // Day Grid View
          <div className="max-w-7xl mx-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-xs font-bold text-muted-foreground uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: calendarDays.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              
              {calendarDays.days.map(({ date }) => {
                const topic = getTopicForDate(date)
                const isTodayDate = isToday(date)
                const isAvailable = !!topic

                return (
                  <button
                    key={date.toISOString()}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) {
                        const dateSlug = date.toISOString().split('T')[0];
                        router.push(`/?date=${dateSlug}`);
                      }
                    }}
                    className={cn(
                      "relative rounded-lg border p-3 text-left transition-all min-h-36 flex flex-col group",
                      isTodayDate 
                        ? "border-accent bg-accent/5 ring-2 ring-accent/20" 
                        : "border-border bg-card",
                      isAvailable 
                        ? "hover:border-accent/50 cursor-pointer hover:shadow-lg hover:shadow-accent/5" 
                        : "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-bold mb-2",
                      isTodayDate ? "text-accent" : "text-foreground"
                    )}>
                      {date.getDate()}
                      {isTodayDate && <span className="ml-1 text-accent">Today</span>}
                    </span>

                    {topic && (
                      <div className="mt-auto flex flex-col flex-1 justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 text-[9px] rounded-full bg-secondary text-muted-foreground border border-border mb-2">
                            History
                          </span>
                          <h4 className="text-[11px] font-semibold leading-tight line-clamp-2 text-foreground mb-1">
                            {topic.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {topic.miniDesc}
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}