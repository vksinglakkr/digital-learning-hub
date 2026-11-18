import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Send, ExternalLink, ShieldCheck } from 'lucide-react'

interface FooterProps {
  onNotifyComingSoon: (featureName: string) => void
}

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC<FooterProps> = ({ onNotifyComingSoon }) => {
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedbackEmail.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <footer id="about" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* About the Initiative (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Digital Learning Hub
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent, community-driven educational initiative focused on building practical 
              mastery in Power BI, workflow automation, modern spreadsheet modeling, code collaboration, 
              and cognitive mathematics.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-teal-400 font-medium pt-1">
              <span>Structured for self-paced independent learners</span>
            </div>
          </div>

          {/* Quick Section Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Overview & Search
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Topic Libraries
                </a>
              </li>
              <li>
                <a href="#learning-paths" className="hover:text-white transition-colors">
                  Step-by-Step Academies
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-white transition-colors">
                  Cheat Sheets & Guides
                </a>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-teal-300 text-teal-400 font-medium transition-colors flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Content Credits & Copyright</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Placeholder Contact & Feedback Section (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-200">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>Contact & Community Suggestions</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Have a tutorial topic request or resource to contribute? Leave your contact details below:
            </p>

            {submitted ? (
              <div className="p-3 bg-teal-950/60 border border-teal-800/80 rounded-xl text-xs text-teal-300">
                Thank you! Your suggestion was recorded in this prototype session.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Submit</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Demo prototype mode: No spam, no external marketing lists.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {CURRENT_YEAR} Digital Learning Hub. All learning resources structured for open education.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/copyright"
              className="hover:text-slate-200 transition-colors"
            >
              Credits & Copyright
            </Link>
            <span>•</span>
            <button
              onClick={() => onNotifyComingSoon('Contribution Guidelines')}
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Contribute</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <span>•</span>
            <button
              onClick={() => onNotifyComingSoon('Terms & Learning Policies')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms of Use
            </button>
          </div>
        </div>

      </div>
    </footer>
  )
}
