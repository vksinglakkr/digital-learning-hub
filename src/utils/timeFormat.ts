/**
 * Utilities for parsing and formatting YouTube video clip timestamps
 * Accepts: MM:SS, HH:MM:SS, or raw seconds (e.g. "90", "01:30", "01:15:30")
 */

export function parseTimeToSeconds(input?: string | null): number | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  // If raw integer string
  if (/^\d+$/.test(trimmed)) {
    const sec = parseInt(trimmed, 10)
    return isNaN(sec) || sec < 0 ? null : sec
  }

  // Format MM:SS or HH:MM:SS
  const parts = trimmed.split(':')
  if (parts.length === 2) {
    const min = parseInt(parts[0], 10)
    const sec = parseInt(parts[1], 10)
    if (isNaN(min) || isNaN(sec) || min < 0 || sec < 0 || sec >= 60) return null
    return min * 60 + sec
  }

  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10)
    const min = parseInt(parts[1], 10)
    const sec = parseInt(parts[2], 10)
    if (isNaN(hours) || isNaN(min) || isNaN(sec) || hours < 0 || min < 0 || min >= 60 || sec < 0 || sec >= 60) return null
    return hours * 3600 + min * 60 + sec
  }

  return null
}

export function formatSecondsToTime(totalSeconds?: number | null): string {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds < 0) return ''
  const hours = Math.floor(totalSeconds / 3600)
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad(remainingMinutes)}:${pad(seconds)}`
  }
  return `${pad(remainingMinutes)}:${pad(seconds)}`
}

export function formatClipDuration(startSec?: number | null, endSec?: number | null): string | null {
  if (startSec != null && endSec != null && endSec > startSec) {
    const diff = endSec - startSec
    const min = Math.floor(diff / 60)
    const sec = diff % 60
    if (min > 0 && sec > 0) return `${min}m ${sec}s clip`
    if (min > 0) return `${min}m clip`
    return `${sec}s clip`
  }
  if (startSec != null && startSec > 0) {
    return `Starts at ${formatSecondsToTime(startSec)}`
  }
  if (endSec != null && endSec > 0) {
    return `Until ${formatSecondsToTime(endSec)}`
  }
  return null
}

export interface TimeValidationResult {
  isValid: boolean
  error?: string
  startSeconds?: number
  endSeconds?: number
}

export function validateClipTimeRange(startTimeStr?: string, endTimeStr?: string): TimeValidationResult {
  const hasStart = Boolean(startTimeStr && startTimeStr.trim())
  const hasEnd = Boolean(endTimeStr && endTimeStr.trim())

  if (!hasStart && !hasEnd) {
    return { isValid: true }
  }

  const startSec = hasStart ? parseTimeToSeconds(startTimeStr) : null
  const endSec = hasEnd ? parseTimeToSeconds(endTimeStr) : null

  if (hasStart && startSec == null) {
    return {
      isValid: false,
      error: 'Start Time format is invalid. Use MM:SS or HH:MM:SS (e.g. 01:30 or 1:15:00).',
    }
  }

  if (hasEnd && endSec == null) {
    return {
      isValid: false,
      error: 'End Time format is invalid. Use MM:SS or HH:MM:SS (e.g. 04:45 or 1:20:00).',
    }
  }

  if (startSec != null && endSec != null) {
    if (endSec <= startSec) {
      return {
        isValid: false,
        error: `End Time (${formatSecondsToTime(endSec)}) must be greater than Start Time (${formatSecondsToTime(startSec)}).`,
        startSeconds: startSec,
        endSeconds: endSec,
      }
    }
  }

  return {
    isValid: true,
    startSeconds: startSec ?? undefined,
    endSeconds: endSec ?? undefined,
  }
}

