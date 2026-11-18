import React from 'react'
import { 
  X, 
  PlayCircle, 
  Video as VideoIcon, 
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  Globe, 
  ExternalLink, 
  ShieldCheck,
  User,
  Tv,
  Scissors
} from 'lucide-react'
import { GithubIcon } from './common/GithubIcon'
import type { TopicResource } from '../types'
import { buildYouTubeEmbedUrl, extractYouTubeVideoId } from '../utils/youtubeEmbed'
import { formatClipDuration, formatSecondsToTime } from '../utils/timeFormat'

interface ResourceDemoModalProps {
  resource: TopicResource | null
  onClose: () => void
}

export const ResourceDemoModal: React.FC<ResourceDemoModalProps> = ({ resource, onClose }) => {
  if (!resource) return null

  const isVideo = 
    resource.type === 'YouTube Video' || 
    resource.type === 'Facebook Video' || 
    (resource.type as string) === 'Video'

  const getIcon = () => {
    switch (resource.type) {
      case 'YouTube Video':
      case 'Video' as any:
        return <PlayCircle className="w-5 h-5 text-rose-600" />
      case 'Facebook Video':
        return <VideoIcon className="w-5 h-5 text-blue-600" />
      case 'Infographic':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />
      case 'PDF':
        return <FileText className="w-5 h-5 text-amber-600" />
      case 'Tutorial':
        return <BookOpen className="w-5 h-5 text-indigo-600" />
      case 'External Link':
        return <Globe className="w-5 h-5 text-teal-600" />
      default:
        return <Globe className="w-5 h-5 text-teal-600" />
    }
  }

  // Build YouTube Embed URL with official start and end parameters
  const embedUrl = isVideo 
    ? buildYouTubeEmbedUrl(resource.url, resource.startSeconds, resource.endSeconds) 
    : null

  const hasClipRange = Boolean(
    (resource.startSeconds != null && resource.startSeconds > 0) || 
    (resource.endSeconds != null && resource.endSeconds > 0)
  )

  const clipDurationText = formatClipDuration(resource.startSeconds, resource.endSeconds)

  // External watch URL with start timestamp if available
  const getWatchOnPlatformUrl = () => {
    if (resource.url.startsWith('demo://')) return '#'
    const videoId = extractYouTubeVideoId(resource.url)
    if (videoId && resource.startSeconds && resource.startSeconds > 0) {
      return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(resource.startSeconds)}s`
    }
    return resource.url
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              {getIcon()}
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                {resource.type} • Order #{resource.displayOrder}
              </span>
              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                {resource.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Attribution Box for Videos */}
        {isVideo && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-teal-700" />
              <span className="text-slate-500 font-medium">Original Creator:</span>
              {resource.creatorUrl ? (
                <a
                  href={resource.creatorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-teal-800 hover:underline flex items-center gap-1"
                >
                  <span>{resource.creatorName || 'Channel Author'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="font-bold text-slate-900">
                  {resource.creatorName || 'Educational Creator / Channel'}
                </span>
              )}
            </div>

            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              Third-Party Content
            </span>
          </div>
        )}

        {/* Clip Time Range Badge if clip is selected */}
        {isVideo && hasClipRange && (
          <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-medium mb-4">
            <Scissors className="w-4 h-4 text-rose-600 shrink-0" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-rose-700">Selected Clip Range:</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 text-rose-800 font-semibold">
                {resource.startTime || formatSecondsToTime(resource.startSeconds)}
              </span>
              <span>to</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 text-rose-800 font-semibold">
                {resource.endTime || (resource.endSeconds ? formatSecondsToTime(resource.endSeconds) : 'End')}
              </span>
              {clipDurationText && (
                <span className="text-rose-600 font-normal">
                  ({clipDurationText})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Video Embed Player or Fallback Container */}
        {isVideo && (
          <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 text-white">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  title={resource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-slate-950">
                <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 shadow-lg">
                  <Tv className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  Official Platform Video Referral
                </h4>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
                  We respect creators by embedding only via official APIs and strictly never re-hosting or downloading video media.
                </p>
                <a
                  href={getWatchOnPlatformUrl()}
                  target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
                  rel="noreferrer"
                  onClick={(e) => {
                    if (resource.url.startsWith('demo://')) {
                      e.preventDefault()
                      alert('This is a simulated demo resource link. In production, this opens the official video on the host platform.')
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <span>Watch on Original Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="px-3.5 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Streams via official provider • Views & ad monetization credit original creator</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            </div>
          </div>
        )}

        {/* Infographic Image Viewer */}
        {resource.type === 'Infographic' && (
          <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center">
            <div className="w-full p-4 flex items-center justify-center bg-slate-900/5">
              <img
                src={resource.directContentUrl || resource.thumbnailUrl || resource.url}
                alt={resource.title}
                className="max-h-96 w-auto max-w-full rounded-lg shadow-xs object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).alt = 'Image preview unavailable. Click "View Resource" below to view directly.'
                }}
              />
            </div>
            <div className="w-full px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Visual Infographic Guide</span>
              <a
                href={resource.directContentUrl || resource.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
              >
                <span>View Full Resolution</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* PDF Reference Card */}
        {resource.type === 'PDF' && (
          <div className="mb-5 rounded-xl overflow-hidden border border-amber-200 bg-amber-50/60 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Official PDF Reference Document ({resource.durationOrPages || 'PDF Reference'})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={resource.directContentUrl || resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Prototype Demo Banner */}
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl mb-5 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Educational Attribution Notice</span>
            <span>
              Digital Learning Hub does not claim ownership of this content. For copyright removal requests or attribution corrections, see our{' '}
              <a href="/copyright" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-950">
                Credits & Copyright Policy
              </a>.
            </span>
          </div>
        </div>

        {/* Resource Details */}
        <div className="space-y-3 mb-6 text-xs text-slate-600">
          <p className="text-sm text-slate-700 leading-relaxed">
            {resource.description || 'No additional description provided.'}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Length / Format</span>
              <span className="font-semibold text-slate-800 text-xs">{resource.durationOrPages || 'Standard Resource'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Level</span>
              <span className="font-semibold text-slate-800 text-xs">{resource.difficulty || 'All Levels'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] break-all border border-slate-800">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans mb-1 font-bold">Original URL</span>
            {resource.url}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            {isVideo ? (
              <a
                href={getWatchOnPlatformUrl()}
                target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
                rel="noreferrer"
                onClick={(e) => {
                  if (resource.url.startsWith('demo://')) {
                    e.preventDefault()
                    alert('This is a simulated demo resource link. In production, this opens the official video on the host platform.')
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
              >
                <span>Watch on Original Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <a
                href={resource.directContentUrl || resource.url}
                target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
              >
                <span>View Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {resource.originalSourceUrl && resource.originalSourceUrl.includes('github.com') && (
              <a
                href={resource.originalSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Open Original GitHub File</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}
