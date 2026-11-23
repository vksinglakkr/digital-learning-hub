import { DEMO_CATEGORIES, DEMO_TOPICS } from '../data/mockData'
import type { CategoryItem, TopicItem, AdminResourceType } from '../types'

const CATEGORIES_STORAGE_KEY = 'dlh_local_demo_categories_v1'
const TOPICS_STORAGE_KEY = 'dlh_local_demo_topics_v1'

// Helper to normalize initial demo resources to include status & AdminResourceType
function normalizeInitialTopics(): TopicItem[] {
  return DEMO_TOPICS.map((topic, topicIdx) => ({
    ...topic,
    displayOrder: topicIdx + 1,
    resources: topic.resources.map((res, resIdx) => ({
      ...res,
      status: 'Published',
      type: (res.type === 'Video' ? 'YouTube Video' : res.type) as AdminResourceType,
      displayOrder: res.displayOrder || resIdx + 1,
    })),
  }))
}

function normalizeInitialCategories(): CategoryItem[] {
  return DEMO_CATEGORIES.map((cat, catIdx) => ({
    ...cat,
    displayOrder: catIdx + 1,
  }))
}

export const storageService = {
  // Load Categories
  getCategories(): CategoryItem[] {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // fallback to initial
    }
    const initial = normalizeInitialCategories()
    this.saveCategories(initial)
    return initial
  },

  saveCategories(categories: CategoryItem[]): void {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to save categories to localStorage:', e)
    }
  },

  // Load Topics
  getTopics(): TopicItem[] {
    try {
      const stored = localStorage.getItem(TOPICS_STORAGE_KEY)
      if (stored) {
        const parsed: TopicItem[] = JSON.parse(stored)
        // Ensure new demo topics are merged into existing stored state
        const initial = normalizeInitialTopics()
        const existingIds = new Set(parsed.map((t) => t.id))
        let hasNewTopics = false
        for (const initTopic of initial) {
          if (!existingIds.has(initTopic.id)) {
            parsed.push(initTopic)
            hasNewTopics = true
          }
        }
        if (hasNewTopics) {
          this.saveTopics(parsed)
        }
        return parsed
      }
    } catch {
      // fallback to initial
    }
    const initial = normalizeInitialTopics()
    this.saveTopics(initial)
    return initial
  },

  saveTopics(topics: TopicItem[]): void {
    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics))
    } catch (e) {
      console.error('Failed to save topics to localStorage:', e)
    }
  },

  // Reset to default demo data
  resetToDefault(): { categories: CategoryItem[]; topics: TopicItem[] } {
    const initialCategories = normalizeInitialCategories()
    const initialTopics = normalizeInitialTopics()
    this.saveCategories(initialCategories)
    this.saveTopics(initialTopics)
    return { categories: initialCategories, topics: initialTopics }
  },

  // Generate unique stable ID
  generateId(prefix: string): string {
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const timestamp = Date.now().toString(36)
    return `${prefix}-${timestamp}-${randomSuffix}`
  }
}
