import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

interface HeroProps {
  onSearchSubmit?: (query: string) => void
  onNotifyComingSoon?: (featureName: string) => void
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      if (onSearchSubmit) onSearchSubmit(trimmed)
    }
  }

  return (
    <section id="home" className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 bg-linear-to-b from-teal-50/40 via-white to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Text & Search Box */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-3">
              Learn Something Useful, <br />
              <span className="text-slate-900">Every Day.</span>
            </h1>

            {/* Subtitle in natural Hindi */}
            <p className="text-base sm:text-lg text-slate-600 font-medium mb-8">
              आसान Lessons • Interactive Practice • अपनी गति से सीखें
            </p>

            {/* Prominent Search Box */}
            <form 
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all p-1.5 max-w-xl mx-auto lg:mx-0"
            >
              <div className="pl-4 pr-2 text-slate-400">
                <Search className="w-5 h-5 text-slate-400" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="कौन-सा Topic या Lesson सीखना चाहते हैं?"
                className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Hero Illustration matching Infographic */}
          <div className="hidden lg:flex items-center justify-center shrink-0 w-80 xl:w-96">
            <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Plant Pot */}
              <rect x="290" y="220" width="36" height="32" rx="4" fill="#0284c7" />
              <ellipse cx="308" cy="220" rx="18" ry="4" fill="#38bdf8" />
              {/* Plant Leaves */}
              <path d="M308 218 C308 175 328 170 338 180 C345 190 325 210 308 218 Z" fill="#10b981" />
              <path d="M308 218 C308 180 290 175 282 188 C276 198 296 212 308 218 Z" fill="#059669" />
              <path d="M308 218 C304 165 316 160 322 170 C326 180 312 205 308 218 Z" fill="#34d399" />

              {/* Books Stack */}
              {/* Book 1 (Bottom Yellow) */}
              <rect x="300" y="260" width="75" height="12" rx="2" fill="#f59e0b" />
              <rect x="298" y="261" width="6" height="10" rx="1" fill="#d97706" />
              {/* Book 2 (Top Blue) */}
              <rect x="304" y="248" width="70" height="12" rx="2" fill="#0284c7" />
              <rect x="302" y="249" width="6" height="10" rx="1" fill="#0369a1" />

              {/* Laptop Body & Base */}
              <path d="M60 252 L320 252 C326 252 330 256 328 260 L318 266 C316 268 312 270 306 270 L74 270 C68 270 64 268 62 266 L52 260 C50 256 54 252 60 252 Z" fill="#cbd5e1" />
              <rect x="155" y="254" width="70" height="4" rx="2" fill="#94a3b8" />

              {/* Laptop Screen Bezel */}
              <rect x="80" y="65" width="220" height="185" rx="12" fill="#1e293b" />
              <circle cx="190" cy="74" r="3" fill="#64748b" />

              {/* Laptop Display (Canvas) */}
              <rect x="88" y="82" width="204" height="158" rx="6" fill="#f8fafc" />

              {/* Display Window Controls */}
              <circle cx="100" cy="94" r="3.5" fill="#f43f5e" />
              <circle cx="110" cy="94" r="3.5" fill="#f59e0b" />
              <circle cx="120" cy="94" r="3.5" fill="#10b981" />
              <line x1="88" y1="104" x2="292" y2="104" stroke="#e2e8f0" strokeWidth="1" />

              {/* Bar Chart Visual on Screen */}
              <rect x="135" y="170" width="16" height="44" rx="3" fill="#0284c7" />
              <rect x="158" y="148" width="16" height="66" rx="3" fill="#0ea5e9" />
              <rect x="181" y="130" width="16" height="84" rx="3" fill="#f59e0b" />
              <rect x="204" y="115" width="16" height="99" rx="3" fill="#10b981" />
              <line x1="120" y1="216" x2="260" y2="216" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Mini Trend Line */}
              <path d="M143 162 L166 140 L189 122 L212 108" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="212" cy="108" r="4" fill="#4f46e5" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  )
}
