"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Code2, ArrowUp, ChevronLeft, ChevronRight, Calendar, Loader2, Star, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden animate-fade-in">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Sticky Top Banner */}
      <div className="sticky top-0 z-50 flex justify-center py-4 bg-accent/10 border-b border-accent/30 backdrop-blur-xl shadow-lg shadow-accent/10 animate-fade-in">
        <Button 
          onClick={() => router.push("/")} 
          className="gold-gradient text-accent-foreground hover:opacity-90 font-bold gap-3 shadow-2xl shadow-accent/30 px-8 py-6 text-base rounded-2xl transition-all duration-300 hover:scale-105"
        >
          <ArrowUp className="w-5 h-5 animate-bounce" /> 
          Jump Back to the Present!
          <Sparkles className="w-5 h-5 animate-pulse" />
        </Button>
      </div>

      {/* Header */}
      <header className="relative z-40 flex items-center justify-between px-6 py-5 border-b border-border/50 backdrop-blur-md bg-background/90 animate-fade-in stagger-1">
        <div className="flex items-center gap-3">
          <div className="gold-gradient p-2 rounded-xl shadow-lg shadow-accent/20 animate-glow">
            <Code2 className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold gold-text-gradient">CodeReflex</span>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-accent animate-pulse" />
          <span className="font-bold text-xl text-foreground">Archive</span>
          <Star className="w-5 h-5 text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setShowYearSelector(!showYearSelector)}
          className="border-accent/30 text-accent hover:border-accent hover:bg-accent/10 font-semibold px-6 py-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
        >
          {showYearSelector ? "Hide Years" : "Show Years"}
        </Button>
      </header>

      {/* Year Selector with animation */}
      {showYearSelector && (
        <div className="relative z-30 border-b border-border/50 bg-card/80 backdrop-blur-md p-6 animate-fade-in-scale">
          <div className="flex justify-center gap-4 flex-wrap max-w-4xl mx-auto">
            {years.map((y, index) => (
              <Button 
                key={y} 
                variant={y === selectedYear ? "default" : "outline"}
                className={cn(
                  "font-bold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-110 shadow-lg animate-fade-in-scale",
                  y === selectedYear 
                    ? "gold-gradient text-accent-foreground shadow-accent/30" 
                    : "border-accent/30 text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/10"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
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
      <div className="relative z-30 flex items-center justify-between px-6 py-6 border-b border-border/50 backdrop-blur-sm bg-background/80 animate-fade-in stagger-2">
        <Button 
          variant="ghost" 
          onClick={() => viewLevel === "days" ? navigateMonth("prev") : setSelectedYear(selectedYear - 1)}
          className="text-muted-foreground hover:text-accent hover:bg-accent/10 font-semibold px-6 py-6 rounded-xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-accent/30"
        >
          <ChevronLeft className="w-6 h-6 mr-2" /> 
          {viewLevel === "days" ? "Previous" : selectedYear - 1}
        </Button>
        
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-black text-foreground mb-2">
            {viewLevel === "days" ? `${MONTHS[selectedMonth]} ${selectedYear}` : selectedYear}
          </h2>
          <button 
            onClick={() => setViewLevel(viewLevel === "days" ? "month" : "days")} 
            className="text-sm text-accent hover:text-accent/80 font-semibold transition-colors flex items-center gap-2 hover:underline"
          >
            {viewLevel === "days" ? "View All Months" : "Back to Calendar"}
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => viewLevel === "days" ? navigateMonth("next") : setSelectedYear(selectedYear + 1)}
          className="text-muted-foreground hover:text-accent hover:bg-accent/10 font-semibold px-6 py-6 rounded-xl transition-all duration-300 hover:scale-110 border border-transparent hover:border-accent/30"
        >
          {viewLevel === "days" ? "Next" : selectedYear + 1}
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-6 text-muted-foreground animate-fade-in">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="text-xl font-semibold">Scanning historical records...</p>
          </div>
        ) : viewLevel === "month" ? (
          // Month Grid View
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {MONTHS.map((m, i) => {
              const topicCount = getTopicsForMonth(selectedYear, i);
              return (
                <button 
                  key={m} 
                  onClick={() => { 
                    setSelectedMonth(i); 
                    setViewLevel("days") 
                  }} 
                  className="group relative p-10 rounded-2xl border-2 border-border bg-card/80 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 text-left hover:scale-105 shadow-lg hover:shadow-accent/20 animate-fade-in-scale"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="relative text-2xl font-black text-foreground mb-3 group-hover:text-accent transition-colors">
                    {m}
                  </h3>
                  <div className="relative flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    <p className="text-sm font-semibold text-muted-foreground group-hover:text-accent transition-colors">
                      {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          // Day Grid View
          <div className="max-w-7xl mx-auto">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-3 mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <div 
                  key={d} 
                  className="text-center text-sm font-black text-accent uppercase tracking-wider animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3">
              {Array.from({ length: calendarDays.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              
              {calendarDays.days.map(({ date }, index) => {
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
                      "group relative rounded-2xl border-2 p-4 text-left transition-all duration-300 min-h-40 flex flex-col animate-fade-in-scale",
                      isTodayDate 
                        ? "border-accent bg-accent/10 ring-4 ring-accent/20 shadow-lg shadow-accent/30 animate-glow" 
                        : "border-border bg-card/80 backdrop-blur-sm",
                      isAvailable 
                        ? "hover:border-accent/60 cursor-pointer hover:shadow-2xl hover:shadow-accent/20 hover:scale-105" 
                        : "opacity-40 cursor-not-allowed"
                    )}
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {isAvailable && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    
                    <span className={cn(
                      "relative text-base font-black mb-3 flex items-center gap-2",
                      isTodayDate ? "text-accent" : "text-foreground"
                    )}>
                      {date.getDate()}
                      {isTodayDate && (
                        <>
                          <Star className="w-4 h-4 text-accent animate-pulse" />
                          <span className="text-xs font-bold text-accent">Today</span>
                        </>
                      )}
                    </span>

                    {topic && (
                      <div className="relative mt-auto flex flex-col flex-1 justify-between">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] rounded-lg bg-accent/20 text-accent border border-accent/30 mb-2 font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            History
                          </span>
                          <h4 className="text-xs font-bold leading-tight line-clamp-2 text-foreground mb-2 group-hover:text-accent transition-colors">
                            {topic.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
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