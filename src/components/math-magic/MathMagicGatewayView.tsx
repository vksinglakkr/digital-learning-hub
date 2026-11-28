import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Binary, 
  ExternalLink, 
  Sparkles, 
  Lightbulb, 
  Pencil, 
  Target, 
  BookOpen, 
  Sliders, 
  Trophy, 
  Info, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

interface MathMagicSection {
  id: string
  title: string
  hindiTitle: string
  description: string
  url: string
  icon: React.ReactNode
  badge: string
  colorTheme: {
    bg: string
    border: string
    hoverBorder: string
    iconBg: string
    iconColor: string
    badgeBg: string
    badgeText: string
  }
}

const MATH_MAGIC_SECTIONS: MathMagicSection[] = [
  {
    id: 'today',
    title: 'Today',
    hindiTitle: 'आज की नई Trick सीखें',
    description: 'प्रतिदिन एक नई वैदिक व मानसिक गणना ट्रिक, सरल उदाहरणों और व्याख्या के साथ।',
    url: 'https://vksingla.in/mathmagic#today',
    icon: <Lightbulb className="w-5 h-5" />,
    badge: 'दैनिक ट्रिक',
    colorTheme: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      hoverBorder: 'hover:border-amber-400',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800'
    }
  },
  {
    id: 'practice',
    title: 'Practice',
    hindiTitle: 'Tricks का अभ्यास करें',
    description: 'आज सीखी गई ट्रिक पर आधारित प्रश्नों का तुरंत अभ्यास करें और स्कोर बनाएं।',
    url: 'https://vksingla.in/mathmagic#practice',
    icon: <Pencil className="w-5 h-5" />,
    badge: 'अभ्यास अखाड़ा',
    colorTheme: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800'
    }
  },
  {
    id: 'challenge',
    title: 'Challenge',
    hindiTitle: 'अपनी Speed और Accuracy जाँचें',
    description: 'दैनिक बोनस सवाल हल करें, अपनी गति परखें और दोस्तों को चुनौती दें।',
    url: 'https://vksingla.in/mathmagic#challenge',
    icon: <Target className="w-5 h-5" />,
    badge: 'दैनिक चुनौती',
    colorTheme: {
      bg: 'bg-rose-50/50',
      border: 'border-rose-200',
      hoverBorder: 'hover:border-rose-400',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-700',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800'
    }
  },
  {
    id: 'library',
    title: 'Library',
    hindiTitle: 'पुरानी Tricks दोबारा देखें',
    description: 'पहले सिखाई गई सभी गणितीय ट्रिक्स और विधियों का संपूर्ण संग्रह एक स्थान पर।',
    url: 'https://vksingla.in/mathmagic#library',
    icon: <BookOpen className="w-5 h-5" />,
    badge: 'ट्रिक संग्रह',
    colorTheme: {
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800'
    }
  },
  {
    id: 'custom',
    title: 'Custom',
    hindiTitle: 'अपनी पसंद का अभ्यास करें',
    description: 'कठिनाई स्तर और संख्याओं का प्रकार चुनकर अपनी आवश्यकतानुसार अभ्यास करें।',
    url: 'https://vksinglakkr.github.io/math-magic-playground/custom-practice.html',
    icon: <Sliders className="w-5 h-5" />,
    badge: 'कस्टम अभ्यास',
    colorTheme: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800'
    }
  },
  {
    id: 'me',
    title: 'Me',
    hindiTitle: 'अपना Score और Progress देखें',
    description: 'अपने कुल अंक, सही उत्तरों की संख्या, स्ट्रीक और उपलब्धि प्रमाण-पत्र देखें।',
    url: 'https://vksingla.in/mathmagic#me',
    icon: <Trophy className="w-5 h-5" />,
    badge: 'मेरी प्रगति',
    colorTheme: {
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800'
    }
  },
  {
    id: 'about',
    title: 'About',
    hindiTitle: 'Math Magic के बारे में जानें',
    description: 'वैदिक गणित की प्रेरणा, सीखने का दर्शन और अंक प्रणाली के नियम समझें।',
    url: 'https://vksingla.in/mathmagic#about',
    icon: <Info className="w-5 h-5" />,
    badge: 'परिचय व नियम',
    colorTheme: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      hoverBorder: 'hover:border-slate-400',
      iconBg: 'bg-slate-200',
      iconColor: 'text-slate-700',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-800'
    }
  }
]

export const MathMagicGatewayView: React.FC = () => {
  return (
    <div className="pb-16">
      {/* 1. Hero Gateway Banner */}
      <section className="bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-12 sm:py-16 border-b border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-4">
              <Binary className="w-3.5 h-3.5 text-blue-300" />
              <span>Digital Learning Hub • Helping Tool</span>
            </div>

            {/* Main Header */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              Math Magic — गणित सीखना अब मजेदार!
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-blue-100 font-medium leading-relaxed mb-8">
              नई Tricks सीखें, अभ्यास करें, Challenge लें और अपनी प्रगति देखें।
            </p>

            {/* Main Action Button */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://vksingla.in/mathmagic"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-sm sm:text-base font-extrabold rounded-2xl shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-2.5 hover:scale-[1.02] cursor-pointer"
              >
                <span>Open Math Magic Portal</span>
                <ExternalLink className="w-4 h-4 text-slate-900" />
              </a>

              <div className="text-xs text-blue-200 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>सीधे ब्राउज़र में खुलता है • किसी लॉगिन की आवश्यकता नहीं</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Seven Navigation Cards Grid */}
      <section className="py-10 sm:py-14 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>पोर्टल के मुख्य 7 अनुभाग (Sections)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              अपनी रुचि का कोई भी अनुभाग चुनें और सीधे अभ्यास शुरू करें:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MATH_MAGIC_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={sec.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-white rounded-2xl p-5 border ${sec.colorTheme.border} ${sec.colorTheme.hoverBorder} shadow-xs hover:shadow-md hover:shadow-slate-200/60 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${sec.colorTheme.iconBg} ${sec.colorTheme.iconColor} flex items-center justify-center shrink-0`}>
                      {sec.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${sec.colorTheme.badgeBg} ${sec.colorTheme.badgeText}`}>
                      {sec.badge}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                        {sec.title}
                      </h3>
                      <span className="text-xs font-bold text-slate-500">— {sec.hindiTitle}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                  <span>पोर्टल पर खोलें</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          {/* 3. Existing Vedic Rapid Multiplication Reference Card */}
          <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">पुस्तकालय संदर्भ</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">4 रिसोर्स</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    Vedic Rapid Multiplication (वैदिक गुणन विधियाँ)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    2-Digit व 3-Digit क्रॉस-मल्टीप्लिकेशन, बेस 100/1000 डायग्राम व अभ्यास सामग्री।
                  </p>
                </div>
              </div>

              <Link
                to="/category/math-magic/topic/math-magic-vedic-multiplication"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>संदर्भ विषय देखें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Note about external window */}
          <div className="mt-6 text-center text-xs text-slate-500">
            नोट: Math Magic पोर्टल एक नए सुरक्षित टैब में खुलता है ताकि आपका Digital Learning Hub सेशन हमेशा खुला रहे।
          </div>
        </div>
      </section>
    </div>
  )
}
