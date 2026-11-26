import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  ArrowRight,
  Mail,
  BarChart3,
  Presentation,
  FileText,
  Video,
  RotateCcw,
  Filter,
  Clock,
  HardDrive,
  CheckSquare
} from 'lucide-react'
import { CURIOSITY_CARDS, type CuriosityCard } from '../data/curiosityBannerData'

export interface CuriosityBannerProps {
  title?: string
  badgeText?: string
  cards?: CuriosityCard[]
  ariaLabel?: string
  containerClassName?: string
}

export const CuriosityBanner: React.FC<CuriosityBannerProps> = ({
  title = 'अरे वाह! ये भी हो सकता है?',
  badgeText = 'रोचक ट्रिक',
  cards = CURIOSITY_CARDS,
  ariaLabel = 'रोचक और उपयोगी डिजिटल ट्रिक्स',
  containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 sm:pt-6 sm:pb-3',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeCards = cards.length > 0 ? cards : CURIOSITY_CARDS
  const total = activeCards.length
  const currentCard = activeCards[currentIndex] || activeCards[0]

  // Go to next card
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  // Go to previous card
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Automatic timer transition every 7 seconds
  useEffect(() => {
    // Respect reduced-motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches || isPaused || userInteracted) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      handleNext()
    }, 7000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, userInteracted, handleNext])

  // Render appropriate topic icon
  const renderCardIcon = (type: string) => {
    switch (type) {
      case 'mail':
        return <Mail className="w-5 h-5 text-rose-400" />
      case 'undo':
        return <RotateCcw className="w-5 h-5 text-rose-400" />
      case 'bar-chart':
        return <BarChart3 className="w-5 h-5 text-amber-400" />
      case 'clock':
        return <Clock className="w-5 h-5 text-amber-400" />
      case 'presentation':
        return <Presentation className="w-5 h-5 text-indigo-400" />
      case 'filter':
        return <Filter className="w-5 h-5 text-blue-400" />
      case 'drive':
        return <HardDrive className="w-5 h-5 text-emerald-400" />
      case 'task':
        return <CheckSquare className="w-5 h-5 text-teal-400" />
      case 'file-text':
      case 'template':
        return <FileText className="w-5 h-5 text-teal-400" />
      case 'video':
        return <Video className="w-5 h-5 text-purple-400" />
      default:
        return <Sparkles className="w-5 h-5 text-teal-400" />
    }
  }

  return (
    <section 
      aria-label={ariaLabel}
      className={containerClassName}
      onMouseEnter={() => setUserInteracted(true)}
      onMouseLeave={() => setUserInteracted(false)}
      onTouchStart={() => setUserInteracted(true)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 shadow-sm border border-teal-800/40">
        
        {/* Subtle background glow */}
        <div 
          aria-hidden="true" 
          className="absolute -right-16 -top-16 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -left-16 -bottom-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left Title Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                {badgeText}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none">
                {title}
              </h2>
            </div>
          </div>

          {/* Center: Current Card Message */}
          <div 
            key={currentCard.id}
            className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-opacity duration-300"
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-white/10 shrink-0 mt-0.5 sm:mt-0">
                {renderCardIcon(currentCard.iconType)}
              </div>
              <div className="min-w-0">
                {/* Problem in quotes */}
                <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-snug">
                  "{currentCard.problem}"
                </p>
                {/* Solution */}
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                  👉 {currentCard.solution}
                </p>
              </div>
            </div>

            {/* Action Link (Shown only if verified targetUrl exists) */}
            {currentCard.targetUrl ? (
              <Link
                to={currentCard.targetUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shrink-0 self-start sm:self-center shadow-xs"
              >
                <span>{currentCard.actionLabel || 'कैसे करें? सीखें'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/5 shrink-0 self-start sm:self-center">
                {currentCard.tag}
              </span>
            )}
          </div>

          {/* Right Controls: Prev, Play/Pause, Next & Progress */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            {/* Step Counter */}
            <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
              {currentIndex + 1} / {total}
            </span>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setUserInteracted(true)
                  handlePrev()
                }}
                aria-label="Previous tip"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserInteracted(true)
                  setIsPaused((prev) => !prev)
                }}
                aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isPaused ? 'चलाएँ' : 'रोकें'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserInteracted(true)
                  handleNext()
                }}
                aria-label="Next tip"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
