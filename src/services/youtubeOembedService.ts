import { extractYouTubeVideoId } from '../utils/youtubeEmbed'

export interface YouTubeOembedResult {
  title: string
  authorName: string
  authorUrl: string
  thumbnailUrl: string
  providerName: string
}

export interface FetchMetadataResponse {
  success: boolean
  data?: YouTubeOembedResult
  error?: string
}

/**
 * Fetches verified public YouTube metadata using the official YouTube oEmbed endpoint
 * through the local Vite development proxy (/api/youtube-oembed).
 * 
 * IMPORTANT: This runs locally via the dev server proxy to safely bypass browser CORS restrictions.
 * It uses zero paid APIs, zero AI, and requires no YouTube Data API keys.
 */
export async function fetchYouTubeOembedMetadata(videoUrl: string): Promise<FetchMetadataResponse> {
  const trimmed = videoUrl.trim()
  if (!trimmed) {
    return {
      success: false,
      error: 'Please enter a YouTube video URL first.',
    }
  }

  const videoId = extractYouTubeVideoId(trimmed)
  if (!videoId) {
    return {
      success: false,
      error: 'The entered URL is not recognized as a valid YouTube video. Please use a link like https://www.youtube.com/watch?v=... or https://youtu.be/...',
    }
  }

  // Canonical clean YouTube watch URL for oEmbed query
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`
  const endpoint = `/api/youtube-oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (response.status === 404) {
      return {
        success: false,
        error: 'Video not found (HTTP 404). The video may be private, unlisted with restricted access, or removed by the author.',
      }
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        error: 'Access restricted (HTTP ' + response.status + '). This video is marked private or embedding is restricted by its creator.',
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: `YouTube oEmbed service returned HTTP status ${response.status} (${response.statusText}).`,
      }
    }

    const data = await response.json()

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: 'Received malformed response from YouTube oEmbed service.',
      }
    }

    return {
      success: true,
      data: {
        title: data.title || '',
        authorName: data.author_name || '',
        authorUrl: data.author_url || '',
        thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        providerName: data.provider_name || 'YouTube',
      },
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network request failed. Make sure your local Vite dev server is running with the proxy enabled.',
    }
  }
}

