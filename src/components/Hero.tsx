import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Sparkles, ArrowRight } from 'lucide-react'

interface HeroProps {
  onSearchSubmit?: (query: string) => void
  onNotifyComingSoon?: (featureName: string) => void
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const quickTags = ['Power BI DAX', 'n8n Webhooks', 'Excel XLOOKUP', 'GitHub Branching', 'Smart Work AI', 'Vedic Math']

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      if (onSearchSubmit) onSearchSubmit(trimmed)
    }
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
    navigate(`/search?q=${encodeURIComponent(tag)}`)
    if (onSearchSubmit) onSearchSubmit(tag)
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <section id="home" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-linear-to-b from-slate-50/80 via-white to-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Curated Knowledge Library & Practical Academy</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
          Learn Something Useful, <br className="hidden sm:inline" />
          <span className="text-teal-700">Every Day.</span>
        </h1>

        {/* Short Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-normal">
          A focused, searchable repository of tutorials, cheat sheets, and structured learning paths 
          designed to boost your technical competence across data, automation, and modern digital work.
        </p>

        {/* Prominent Search Input Box */}
        <div className="max-w-2xl mx-auto mb-6">
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all p-1.5"
          >
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials, cheat sheets, or skills (e.g. DAX, webhooks, shortcuts)..."
              className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Search Tag Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto text-xs text-slate-500">
          <span className="font-medium text-slate-400">Popular topics:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/30 transition-all font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

