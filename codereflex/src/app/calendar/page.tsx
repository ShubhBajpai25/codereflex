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

type ViewLevel = "months" | "days"

type TopicType = "DAILY" | "WEEKLY";

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [viewLevel, setViewLevel] = useState<ViewLevel>("days")
  const [showYearSelector, setShowYearSelector] = useState(false)

  // 1. Fetch real data from Neon
  const { data: archive, isLoading } = api.topic.getArchives.useQuery({ 
    type: "DAILY" as TopicType 
  });

  // 2. Helper to find a topic for a specific date from the archive
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

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  // 3. Generate the grid
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

  const isPast = (date: Date) => {
    const d = new Date(date).setHours(0,0,0,0)
    const t = new Date(today).setHours(0,0,0,0)
    return d < t
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1) }
      else setSelectedMonth(selectedMonth - 1)
    } else {
      if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1) }
      else setSelectedMonth(selectedMonth + 1)
    }
  }

  const years = useMemo(() => {
    const currentYear = today.getFullYear()
    return Array.from({ length: 6 }, (_, i) => currentYear - 5 + i)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 flex justify-center py-3 bg-accent/10 border-b border-accent/20 backdrop-blur-sm">
        <Button onClick={() => router.push("/")} className="bg-accent text-accent-foreground font-medium">
          <ArrowUp className="w-4 h-4 mr-2" /> Jump Back to the Present!
        </Button>
      </div>

      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-1.5 rounded-lg"><Code2 className="w-5 h-5 text-accent-foreground" /></div>
          <span className="text-xl font-semibold">CodeReflex</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-foreground">Archive</span>
        </div>
        <Button variant="outline" onClick={() => setShowYearSelector(!showYearSelector)}>
          {selectedYear}
        </Button>
      </header>

      {showYearSelector && (
        <div className="border-b border-border bg-card/50 p-4">
          <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
            {years.map(y => (
              <Button key={y} variant={y === selectedYear ? "default" : "outline"} onClick={() => { setSelectedYear(y); setShowYearSelector(false) }}>
                {y}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Button variant="ghost" onClick={() => navigateMonth("prev")}><ChevronLeft className="w-5 h-5 mr-1" /> Prev</Button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">{MONTHS[selectedMonth]} {selectedYear}</h2>
          <button onClick={() => setViewLevel(viewLevel === "days" ? "months" : "days")} className="text-xs text-accent hover:underline mt-1">
            {viewLevel === "days" ? "Switch to Month View" : "Switch to Day View"}
          </button>
        </div>
        <Button variant="ghost" onClick={() => navigateMonth("next")}>Next <ChevronRight className="w-5 h-5 ml-1" /></Button>
      </div>

      <main className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p>Scanning historical records...</p>
          </div>
        ) : viewLevel === "months" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {MONTHS.map((m, i) => (
              <button key={m} onClick={() => { setSelectedMonth(i); setViewLevel("days") }} className="p-8 rounded-xl border border-border bg-card hover:border-accent transition-all text-left">
                <h3 className="text-lg font-semibold">{m}</h3>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-xs font-bold text-muted-foreground uppercase">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: calendarDays.firstDay }).map((_, i) => <div key={i} />)}
              
              {calendarDays.days.map(({ date }) => {
                const topic = getTopicForDate(date)
                const isTodayDate = isToday(date)
                const isAvailable = !!topic

                return (
                  <button
                    key={date.toISOString()}
                    disabled={!isAvailable}
                    onClick={() => {
                      // Format to YYYY-MM-DD to avoid timezone shifts in the URL
                      const dateSlug = date.toISOString().split('T')[0];
                      router.push(`/?date=${dateSlug}`); // Assuming Dashboard is at the root
                    }}
                    className={cn(
                      "relative rounded-lg border p-3 text-left transition-all min-h-36 flex flex-col group",
                      isTodayDate ? "border-accent bg-accent/5" : "border-border bg-card",
                      isAvailable ? "hover:border-accent cursor-pointer shadow-sm" : "opacity-40 cursor-default"
                    )}
                    >
                    <span className={cn("text-sm font-bold", isTodayDate && "text-accent")}>
                      {date.getDate()} {isTodayDate && "-"}
                    </span>

                    {topic && (
                      <div className="mt-2 flex flex-col flex-1">
                        {topic.image && (
                          <div className="w-full h-16 rounded mb-2 overflow-hidden bg-secondary">
                            <img src={topic.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                          </div>
                        )}
                        <h4 className="text-[10px] font-bold leading-tight line-clamp-2 uppercase tracking-tighter text-foreground mb-1">
                          {topic.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-auto">
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