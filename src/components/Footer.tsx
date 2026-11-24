import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

interface FooterProps {
  onNotifyComingSoon?: (featureName: string) => void
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer id="about" className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block">
                Digital Learning Hub
              </span>
              <span className="text-xs text-slate-400 block -mt-0.5">
                Interactive Learning for Real Skills
              </span>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex items-center gap-5 text-sm text-slate-300">
            <Link to="/" className="hover:text-teal-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-700">|</span>
            <Link to="/copyright" className="hover:text-teal-400 transition-colors">
              About
            </Link>
            <span className="text-slate-700">|</span>
            <Link to="/copyright" className="hover:text-teal-400 transition-colors">
              Credits & Copyright
            </Link>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 text-center sm:text-left">
          <p>© {CURRENT_YEAR} Digital Learning Hub. All learning resources structured for open education.</p>
          <p className="text-slate-500 text-[11px]">Primary Learning Journey: Category → Topic → Lesson → Practice</p>
        </div>
      </div>
    </footer>
  )
}
