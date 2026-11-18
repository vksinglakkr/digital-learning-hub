import type { AdminResourceType } from '../types'
import { parseGitHubResourceUrl } from './githubUrl'

export interface DetectedResourceMeta {
  type: AdminResourceType
  platform: 'YouTube' | 'Facebook' | 'Web'
  reason: string
  confidence: 'High' | 'Medium' | 'Low'
  suggestedDurationOrFormat: string
  suggestedCreator?: string
  suggestedCreatorUrl?: string
  suggestedTitle?: string
  directContentUrl?: string
  originalSourceUrl?: string
  isGitHub?: boolean
  fileName?: string
}

export function detectResourceTypeFromUrl(rawUrl: string): DetectedResourceMeta | null {
  const trimmed = rawUrl.trim().toLowerCase()
  if (!trimmed || trimmed.length < 4) return null

  // 1. YouTube Detection
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let suggestedCreator: string | undefined = undefined
    let suggestedCreatorUrl: string | undefined = undefined
    
    // Check if channel name is in URL e.g. youtube.com/@GuyInACube
    const atMatch = rawUrl.match(/@([a-zA-Z0-9_-]+)/)
    if (atMatch) {
      suggestedCreator = atMatch[1]
      suggestedCreatorUrl = `https://youtube.com/@${atMatch[1]}`
    }

    return {
      type: 'YouTube Video',
      platform: 'YouTube',
      reason: 'Recognized YouTube video domain',
      confidence: 'High',
      suggestedDurationOrFormat: '15 min video',
      suggestedCreator,
      suggestedCreatorUrl,
    }
  }

  // 2. Facebook Video Detection
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    return {
      type: 'Facebook Video',
      platform: 'Facebook',
      reason: 'Recognized Facebook video / watch domain',
      confidence: 'High',
      suggestedDurationOrFormat: '10 min video',
    }
  }

  // 3. GitHub Resource Detection (Images & PDFs with automatic raw URL mapping and GitHub Pages support)
  if (
    trimmed.includes('github.com') || 
    trimmed.includes('raw.githubusercontent.com') ||
    trimmed.includes('.github.io')
  ) {
    const ghMeta = parseGitHubResourceUrl(rawUrl)
    if (ghMeta.isValidFormat && (ghMeta.fileType === 'Infographic' || ghMeta.fileType === 'PDF')) {
      const isPages = trimmed.includes('.github.io')
      return {
        type: ghMeta.fileType,
        platform: 'Web',
        reason: ghMeta.fileType === 'Infographic'
          ? (isPages ? 'Recognized GitHub Pages visual infographic asset' : 'Recognized GitHub visual infographic asset')
          : (isPages ? 'Recognized GitHub Pages PDF reference document' : 'Recognized GitHub PDF reference document'),
        confidence: 'High',
        suggestedDurationOrFormat: ghMeta.fileType === 'Infographic' ? 'Visual Infographic' : 'PDF Document',
        suggestedCreator: ghMeta.owner || undefined,
        suggestedCreatorUrl: ghMeta.owner ? `https://github.com/${ghMeta.owner}` : undefined,
        suggestedTitle: ghMeta.suggestedTitle,
        directContentUrl: ghMeta.directContentUrl,
        originalSourceUrl: ghMeta.originalSourceUrl,
        isGitHub: true,
        fileName: ghMeta.fileName,
      }
    }
  }

  // 4. PDF Document Detection (Generic Web & Google Drive)
  if (
    trimmed.endsWith('.pdf') || 
    trimmed.includes('.pdf?') || 
    (trimmed.includes('drive.google.com') && trimmed.includes('pdf'))
  ) {
    const genericParsed = parseGitHubResourceUrl(rawUrl)
    return {
      type: 'PDF',
      platform: 'Web',
      reason: 'Recognized PDF document file extension',
      confidence: 'High',
      suggestedDurationOrFormat: 'PDF Reference',
      suggestedTitle: genericParsed.suggestedTitle || undefined,
      directContentUrl: rawUrl.trim(),
      originalSourceUrl: rawUrl.trim(),
      fileName: genericParsed.fileName,
    }
  }

  // 5. Infographic / Image Asset Detection (Generic Web)
  if (
    trimmed.endsWith('.png') ||
    trimmed.endsWith('.jpg') ||
    trimmed.endsWith('.jpeg') ||
    trimmed.endsWith('.svg') ||
    trimmed.endsWith('.webp')
  ) {
    const genericParsed = parseGitHubResourceUrl(rawUrl)
    return {
      type: 'Infographic',
      platform: 'Web',
      reason: 'Recognized visual graphic / direct image URL',
      confidence: 'High',
      suggestedDurationOrFormat: 'Visual Diagram',
      suggestedTitle: genericParsed.suggestedTitle || undefined,
      directContentUrl: rawUrl.trim(),
      originalSourceUrl: rawUrl.trim(),
      fileName: genericParsed.fileName,
    }
  }

  // 6. Google Drive Document Detection (Backup Storage)
  if (trimmed.includes('drive.google.com')) {
    return {
      type: 'PDF',
      platform: 'Web',
      reason: 'Recognized Google Drive document backup link',
      confidence: 'Medium',
      suggestedDurationOrFormat: 'Reference Document',
      directContentUrl: rawUrl.trim(),
      originalSourceUrl: rawUrl.trim(),
    }
  }

  // 7. GitHub Repository or Documentation Link (non-file)
  if (trimmed.includes('github.com')) {
    return {
      type: 'External Link',
      platform: 'Web',
      reason: 'Recognized GitHub repository / code guide',
      confidence: 'High',
      suggestedDurationOrFormat: 'Code Guide',
    }
  }

  // 8. General Web Link or Tutorial
  if (trimmed.includes('medium.com') || trimmed.includes('dev.to') || trimmed.includes('/tutorial') || trimmed.includes('/guide')) {
    return {
      type: 'Tutorial',
      platform: 'Web',
      reason: 'Recognized article / tutorial path',
      confidence: 'Medium',
      suggestedDurationOrFormat: '15 min read',
    }
  }

  return {
    type: 'External Link',
    platform: 'Web',
    reason: 'Standard external web reference',
    confidence: 'Low',
    suggestedDurationOrFormat: 'Reference Link',
  }
}

