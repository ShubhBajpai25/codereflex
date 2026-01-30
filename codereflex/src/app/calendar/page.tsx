"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Code2, ArrowUp, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { mockFacts, type Fact } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

type ViewLevel = "months" | "days"

export default function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [viewLevel, setViewLevel] = useState<ViewLevel>("days")
  const [showYearSelector, setShowYearSelector] = useState(false)

  // Get fact for a specific date
  const getFactForDate = (date: Date): Fact => {
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    const index = dayOfYear % mockFacts.daily.length
    return mockFacts.daily[index]
  }

  // Get days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth)
    const days: { date: Date; fact: Fact }[] = []

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i)
      days.push({
        date,
        fact: getFactForDate(date),
      })
    }

    return { days, firstDay }
  }, [selectedYear, selectedMonth])

  // Check if date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if date is in the past
  const isPast = (date: Date) => {
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    const todayCompare = new Date(today)
    todayCompare.setHours(0, 0, 0, 0)
    return compareDate < todayCompare
  }

  // Check if we're viewing current month/year
  const isCurrentPeriod = selectedYear === today.getFullYear() && selectedMonth === today.getMonth()

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  // Generate years for selector (5 years back, current, 1 year forward)
  const years = useMemo(() => {
    const currentYear = today.getFullYear()
    const yearList: number[] = []
    for (let i = currentYear - 5; i <= currentYear; i++) {
      yearList.push(i)
    }
    return yearList
  }, [today])

  // Handle month click from months view
  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setViewLevel("days")
  }

  // Handle year selection
  const handleYearClick = (year: number) => {
    setSelectedYear(year)
    setShowYearSelector(false)
  }

  // Jump back to today
  const jumpToPresent = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Jump Back to Present Button - Always visible on calendar page */}
      <div className="sticky top-0 z-50 flex justify-center py-3 bg-accent/10 border-b border-accent/20 backdrop-blur-sm">
        <Button
          onClick={jumpToPresent}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Jump Back to the Present!
        </Button>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
            <Code2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">CodeReflex</span>
        </div>

        {/* Center - Current view info */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-foreground">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">Archive</span>
        </div>

        {/* Right side - Year selector button */}
        <Button
          variant="outline"
          onClick={() => setShowYearSelector(!showYearSelector)}
          className="text-muted-foreground hover:text-foreground bg-transparent"
        >
          {showYearSelector ? "Hide Years" : "Show Years"}
        </Button>
      </header>

      {/* Year Selector */}
      {showYearSelector && (
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 animate-in slide-in-from-top duration-200">
          <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
            {years.map((year) => (
              <Button
                key={year}
                variant={year === selectedYear ? "default" : "outline"}
                onClick={() => handleYearClick(year)}
                className={cn(
                  "min-w-24",
                  year === selectedYear
                    ? "bg-accent text-accent-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        {viewLevel === "days" ? (
          <>
            <Button
              variant="ghost"
              onClick={() => navigateMonth("prev")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {MONTHS[selectedMonth]} {selectedYear}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewLevel("months")}
                className="text-muted-foreground hover:text-foreground"
              >
                View All Months
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigateMonth("next")}
              className="text-muted-foreground hover:text-foreground"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              {selectedYear - 1}
            </Button>
            <h2 className="text-2xl font-semibold text-foreground">{selectedYear}</h2>
            <Button
              variant="ghost"
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="text-muted-foreground hover:text-foreground"
            >
              {selectedYear + 1}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {viewLevel === "months" ? (
          /* Months Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {MONTHS.map((month, index) => {
              const isCurrentMonth = index === today.getMonth() && selectedYear === today.getFullYear()
              const isPastMonth = selectedYear < today.getFullYear() || 
                (selectedYear === today.getFullYear() && index < today.getMonth())
              
              return (
                <button
                  key={month}
                  onClick={() => handleMonthClick(index)}
                  className={cn(
                    "p-6 rounded-xl border text-left transition-all hover:scale-[1.02]",
                    isCurrentMonth
                      ? "border-accent bg-accent/10 hover:bg-accent/20"
                      : isPastMonth
                        ? "border-border bg-card hover:bg-card/80"
                        : "border-border/50 bg-card/50 opacity-50 cursor-not-allowed"
                  )}
                  disabled={!isPastMonth && !isCurrentMonth}
                >
                  <h3 className="text-lg font-semibold text-foreground">{month}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getDaysInMonth(selectedYear, index)} topics
                  </p>
                  {isCurrentMonth && (
                    <span className="inline-block mt-2 text-xs text-accent font-medium">
                      Current Month
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          /* Days Grid View */
          <div className="max-w-7xl mx-auto">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: calendarDays.firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {calendarDays.days.map(({ date, fact }) => {
                const isTodayDate = isToday(date)
                const isPastDate = isPast(date)
                const isAccessible = isPastDate || isTodayDate

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => isAccessible && router.push(`/?date=${date.toISOString()}`)}
                    disabled={!isAccessible}
                    className={cn(
                      "group relative rounded-lg border p-2 text-left transition-all min-h-32 flex flex-col",
                      isTodayDate
                        ? "border-accent bg-accent/10 hover:bg-accent/20"
                        : isPastDate
                          ? "border-border bg-card hover:bg-card/80 hover:scale-[1.02] cursor-pointer"
                          : "border-border/30 bg-card/30 opacity-40 cursor-not-allowed"
                    )}
                  >
                    {/* Date number */}
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isTodayDate ? "text-accent" : "text-foreground"
                    )}>
                      {date.getDate()}
                      {isTodayDate && (
                        <span className="ml-1 text-xs text-accent">Today</span>
                      )}
                    </div>

                    {/* Fact preview */}
                    {isAccessible && (
                      <>
                        {/* Placeholder image */}
                        <div className="w-full h-12 rounded bg-secondary/50 mb-2 flex items-center justify-center overflow-hidden">
                          <span className="text-xs text-muted-foreground/50 font-mono">
                            {fact.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                          {fact.title}
                        </h4>

                        {/* Short description */}
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-auto">
                          {fact.highlight || fact.content.substring(0, 50) + "..."}
                        </p>
                      </>
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
