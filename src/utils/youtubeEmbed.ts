/**
 * YouTube Embed URL builder with start and end parameters
 * Official parameters: https://developers.google.com/youtube/player_parameters#start
 */

export function extractYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl) return null
  const trimmed = rawUrl.trim()
  
  // Handles:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - demo://... (not a real YouTube URL)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = trimmed.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function buildYouTubeEmbedUrl(
  rawUrl: string, 
  startSeconds?: number | null, 
  endSeconds?: number | null,
  autoplay: boolean = false
): string | null {
  const videoId = extractYouTubeVideoId(rawUrl)
  if (!videoId) return null

  const params = new URLSearchParams()
  params.set('rel', '0') // Do not show unrelated videos

  if (startSeconds != null && startSeconds > 0) {
    params.set('start', Math.floor(startSeconds).toString())
  }

  if (endSeconds != null && endSeconds > 0) {
    params.set('end', Math.floor(endSeconds).toString())
  }

  if (autoplay) {
    params.set('autoplay', '1')
  }

  const query = params.toString()
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`
}

