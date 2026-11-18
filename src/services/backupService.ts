import type { CategoryItem, TopicItem } from '../types'

export const BACKUP_SCHEMA_VERSION = '1.0'
export const SAFETY_BACKUP_STORAGE_KEY = 'dlh_safety_backup_before_import_v1'

export interface BackupSummary {
  categoryCount: number
  topicCount: number
  resourceCount: number
  videoCount: number
  clipCount: number
  infographicCount: number
  pdfCount: number
  tutorialCount: number
  otherCount: number
}

export interface LearningHubBackup {
  app: 'Digital Learning Hub'
  schemaVersion: string
  exportDate: string
  description: string
  summary: BackupSummary
  data: {
    categories: CategoryItem[]
    topics: TopicItem[]
  }
}

export interface SafetySnapshot {
  savedAt: string
  summary: BackupSummary
  data: {
    categories: CategoryItem[]
    topics: TopicItem[]
  }
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  backup?: LearningHubBackup
}

/**
 * Calculates item counts and resource breakdowns.
 */
export function calculateSummary(categories: CategoryItem[], topics: TopicItem[]): BackupSummary {
  let videoCount = 0
  let clipCount = 0
  let infographicCount = 0
  let pdfCount = 0
  let tutorialCount = 0
  let otherCount = 0

  let totalResources = 0

  topics.forEach((topic) => {
    (topic.resources || []).forEach((res) => {
      totalResources++
      const type = res.type as string

      if (type === 'YouTube Video' || type === 'Facebook Video' || type === 'Video') {
        videoCount++
        if (
          (res.startSeconds != null && res.startSeconds > 0) ||
          (res.endSeconds != null && res.endSeconds > 0) ||
          res.startTime ||
          res.endTime
        ) {
          clipCount++
        }
      } else if (type === 'Infographic') {
        infographicCount++
      } else if (type === 'PDF') {
        pdfCount++
      } else if (type === 'Tutorial') {
        tutorialCount++
      } else {
        otherCount++
      }
    })
  })

  return {
    categoryCount: categories.length,
    topicCount: topics.length,
    resourceCount: totalResources,
    videoCount,
    clipCount,
    infographicCount,
    pdfCount,
    tutorialCount,
    otherCount,
  }
}

export const backupService = {
  /**
   * Generates a complete backup object with current metadata, date, and schema version.
   */
  generateBackup(categories: CategoryItem[], topics: TopicItem[]): LearningHubBackup {
    const summary = calculateSummary(categories, topics)
    return {
      app: 'Digital Learning Hub',
      schemaVersion: BACKUP_SCHEMA_VERSION,
      exportDate: new Date().toISOString(),
      description: 'Full curriculum backup including categories, topics, resources, orderings, creator credits, and video clip timestamps.',
      summary,
      data: {
        categories: JSON.parse(JSON.stringify(categories)),
        topics: JSON.parse(JSON.stringify(topics)),
      },
    }
  },

  /**
   * Triggers browser download of backup JSON file.
   */
  downloadBackup(backup: LearningHubBackup): void {
    const jsonString = JSON.stringify(backup, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const dateStr = new Date()
      .toISOString()
      .slice(0, 16)
      .replace('T', '-')
      .replace(':', '')

    const filename = `digital-learning-hub-backup-${dateStr}.json`

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  /**
   * Strictly validates imported JSON string against required schema.
   */
  validateBackupJson(jsonString: string): ValidationResult {
    let parsed: any
    try {
      parsed = JSON.parse(jsonString)
    } catch {
      return {
        isValid: false,
        error: 'Invalid JSON format. Please ensure the file is a well-formed JSON document.',
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        isValid: false,
        error: 'Backup file must contain a valid JSON object.',
      }
    }

    // Verify app or data structure
    if (parsed.app && parsed.app !== 'Digital Learning Hub') {
      return {
        isValid: false,
        error: `Unrecognized application signature "${parsed.app}". Expected "Digital Learning Hub".`,
      }
    }

    if (!parsed.data || typeof parsed.data !== 'object') {
      return {
        isValid: false,
        error: 'Missing required "data" payload containing categories and topics.',
      }
    }

    const { categories, topics } = parsed.data

    if (!Array.isArray(categories)) {
      return {
        isValid: false,
        error: 'Invalid categories payload: "categories" must be an array.',
      }
    }

    if (!Array.isArray(topics)) {
      return {
        isValid: false,
        error: 'Invalid topics payload: "topics" must be an array.',
      }
    }

    // Validate category objects
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      if (!cat || typeof cat !== 'object') {
        return { isValid: false, error: `Category item at index ${i} is not a valid object.` }
      }
      if (typeof cat.id !== 'string' || !cat.id.trim()) {
        return { isValid: false, error: `Category at index ${i} is missing a required "id".` }
      }
      if (typeof cat.title !== 'string' || !cat.title.trim()) {
        return { isValid: false, error: `Category "${cat.id}" is missing a required "title".` }
      }
    }

    // Validate topic objects
    for (let i = 0; i < topics.length; i++) {
      const top = topics[i]
      if (!top || typeof top !== 'object') {
        return { isValid: false, error: `Topic item at index ${i} is not a valid object.` }
      }
      if (typeof top.id !== 'string' || !top.id.trim()) {
        return { isValid: false, error: `Topic at index ${i} is missing a required "id".` }
      }
      if (typeof top.title !== 'string' || !top.title.trim()) {
        return { isValid: false, error: `Topic at index ${i} is missing a required "title".` }
      }
      if (typeof top.categoryId !== 'string' || !top.categoryId.trim()) {
        return { isValid: false, error: `Topic "${top.title}" is missing a required "categoryId".` }
      }
      if (!Array.isArray(top.resources)) {
        return { isValid: false, error: `Topic "${top.title}" must have a "resources" array.` }
      }

      // Validate resources
      for (let j = 0; j < top.resources.length; j++) {
        const res = top.resources[j]
        if (!res || typeof res !== 'object') {
          return { isValid: false, error: `Resource at index ${j} in topic "${top.title}" is invalid.` }
        }
        if (typeof res.id !== 'string' || !res.id.trim()) {
          return { isValid: false, error: `Resource #${j + 1} in topic "${top.title}" is missing an "id".` }
        }
        if (typeof res.title !== 'string' || !res.title.trim()) {
          return { isValid: false, error: `Resource #${j + 1} in topic "${top.title}" is missing a "title".` }
        }
        if (typeof res.url !== 'string' || !res.url.trim()) {
          return { isValid: false, error: `Resource "${res.title}" in topic "${top.title}" is missing a "url".` }
        }
      }
    }

    const summary = calculateSummary(categories, topics)

    const normalizedBackup: LearningHubBackup = {
      app: 'Digital Learning Hub',
      schemaVersion: parsed.schemaVersion || BACKUP_SCHEMA_VERSION,
      exportDate: parsed.exportDate || new Date().toISOString(),
      description: parsed.description || 'Imported curriculum backup',
      summary,
      data: {
        categories,
        topics,
      },
    }

    return {
      isValid: true,
      backup: normalizedBackup,
    }
  },

  /**
   * Saves an automatic safety snapshot of current local data before an import overwrite.
   */
  createSafetySnapshot(categories: CategoryItem[], topics: TopicItem[]): void {
    try {
      const snapshot: SafetySnapshot = {
        savedAt: new Date().toISOString(),
        summary: calculateSummary(categories, topics),
        data: {
          categories: JSON.parse(JSON.stringify(categories)),
          topics: JSON.parse(JSON.stringify(topics)),
        },
      }
      localStorage.setItem(SAFETY_BACKUP_STORAGE_KEY, JSON.stringify(snapshot))
    } catch (e) {
      console.warn('Failed to save automatic safety snapshot:', e)
    }
  },

  /**
   * Retrieves previous safety snapshot if one exists.
   */
  getSafetySnapshot(): SafetySnapshot | null {
    try {
      const raw = localStorage.getItem(SAFETY_BACKUP_STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as SafetySnapshot
    } catch {
      return null
    }
  },

  /**
   * Clears safety snapshot.
   */
  clearSafetySnapshot(): void {
    try {
      localStorage.removeItem(SAFETY_BACKUP_STORAGE_KEY)
    } catch {}
  },
}
