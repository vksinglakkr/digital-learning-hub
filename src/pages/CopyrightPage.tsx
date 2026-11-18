import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { NoticeModal } from '../components/NoticeModal'
import { 
  ShieldCheck, 
  Copyright, 
  AlertCircle, 
  Video, 
  Eye, 
  HeartHandshake, 
  ArrowLeft,
  Mail
} from 'lucide-react'

export const CopyrightPage: React.FC = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const handleNotifyComingSoon = (featureName: string) => {
    setModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is in prototype mode. Data will connect to live services in Phase 2.`,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex flex-col justify-between">
      <div>
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs items={[{ label: 'Content Credits & Copyright' }]} />
        </div>

        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </Link>

            <div className="flex items-center gap-3 text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100 w-fit mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Ethics, Attribution & Intellectual Property</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Content Credits & Copyright Policy
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Digital Learning Hub is a free, non-profit community learning initiative. We deeply respect 
              intellectual property rights and are committed to transparent attribution for all educators, 
              creators, and technical authors whose work helps others grow.
            </p>
          </div>
        </section>

        {/* Detailed Sections */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

          {/* Section 1: Non-Ownership & Creator Rights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                <Copyright className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                1. No Claim of Ownership
              </h2>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              Digital Learning Hub <strong>does not claim ownership or proprietary rights</strong> over any third-party 
              educational videos, live recordings, cheat sheets, or articles referenced across our catalogs. 
              All titles, audio tracks, visual assets, trademarks, and associated copyrights belong solely to their respective 
              original creators, production channels, and publishing companies.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-700" />
                <span>Our Core Operating Principle:</span>
              </span>
              <p className="leading-relaxed">
                We function as a curated educational index and navigational road-map. Our goal is to connect independent learners 
                with high-value knowledge while ensuring that traffic, engagement metrics, watch-time, and creator monetization 
                flow directly back to the original creators' channels and platforms.
              </p>
            </div>
          </div>

          {/* Section 2: Technical Media Embedding & No Re-hosting */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                <Video className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Technical Policy: Official Embeds & No Re-Hosting
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              We adhere strictly to platform developer agreements and copyright law:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 list-disc pl-5 leading-relaxed">
              <li>
                <strong>No Local Media Storage:</strong> We do not download, copy, stream-rip, re-encode, or re-host any third-party video files or media streams on our servers.
              </li>
              <li>
                <strong>Standard Platform Players:</strong> Where available and permitted by creators, videos are rendered using the official embed mechanisms provided by YouTube or Facebook.
              </li>
              <li>
                <strong>Direct Referral Fallback:</strong> If a creator has disabled third-party embedding, we provide direct, prominent links to watch the video on the creator's official channel on the original host platform.
              </li>
            </ul>
          </div>

          {/* Section 3: Legal Clarification Regarding Non-Commercial Educational Use */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                3. Legal Clarification on Educational Use
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              While Digital Learning Hub is operated entirely as a free community educational resource, 
              <strong> we do not claim or imply that non-commercial educational use automatically confers copyright permission or blanket fair-use immunity</strong>.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We believe creators have the sovereign right to decide where, how, and whether their content is organized, 
              cataloged, or embedded. We respect that autonomy unconditionally.
            </p>
          </div>

          {/* Section 4: Content Removal & Attribution Request Protocol */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                4. Content Owner Objection & Removal Protocol
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              If you are a copyright owner, channel administrator, or authorized representative and you prefer that your 
              content not be indexed in Digital Learning Hub, or if you wish to adjust the attribution name, channel link, or description:
            </p>

            <div className="p-5 bg-teal-50/60 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950 space-y-3">
              <p className="font-semibold">
                We will promptly honor your preference and remove or update the catalog listing within 48 hours, no questions asked.
              </p>
              <p className="text-xs text-teal-900 leading-relaxed">
                When contacting our team, please provide the following details to help us expedite your request:
              </p>
              <ul className="list-disc pl-5 text-xs text-teal-900 space-y-1.5">
                <li>Your name and affiliation (or link to your verified channel/profile).</li>
                <li>The specific URL(s) of the resources listed on Digital Learning Hub.</li>
                <li>Your requested action (e.g. immediate removal, updated creator name, or corrected channel link).</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Official Contact Placeholder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                5. Copyright Inquiries & Contact Channel
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              For all copyright notices, attribution updates, or removal requests, please submit your notice through our official 
              contact channel below:
            </p>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-bold">
                  Copyright Notice Contact
                </span>
                <span className="text-teal-400 font-semibold">[Insert Copyright Contact Channel / Email Placeholder]</span>
              </div>
              <span className="text-[11px] font-sans text-slate-400 bg-slate-800 px-3 py-1 rounded-md border border-slate-700 self-start sm:self-auto">
                Prototype Notice Form
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              In this local prototype version, administrative changes can also be managed directly in the{' '}
              <Link to="/admin" className="text-teal-700 underline font-semibold hover:text-teal-800">
                Local Admin Studio
              </Link>{' '}
              to set any resource to <em>Draft</em> or <em>Hidden</em> status.
            </p>
          </div>

        </main>
      </div>

      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      <NoticeModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
