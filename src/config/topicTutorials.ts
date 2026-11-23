import type { TopicItem } from '../types'

// Central registry mapping topic IDs to dedicated interactive tutorials
export interface TopicTutorialConfig {
  tutorialPath: string // Path relative to base URL, e.g. 'tutorials/power-bi/bookmark/index.html'
  title: string
  subtitle: string
  hasSimulator?: boolean
  hasQuiz?: boolean
  hasChallenge?: boolean
  difficultyBadge?: string
}

export const TOPIC_TUTORIAL_REGISTRY: Record<string, TopicTutorialConfig> = {
  'power-bi-bookmarks': {
    tutorialPath: 'tutorials/power-bi/bookmark/index.html',
    title: 'Power BI Bookmark Masterclass: एक Dashboard, कई कमाल',
    subtitle: 'Learn Power BI Bookmarks through 5 live demonstrations, 20 illustrated micro-steps, hands-on simulator, and interactive quiz.',
    hasSimulator: true,
    hasQuiz: true,
    hasChallenge: true,
    difficultyBadge: 'Beginner to Intermediate',
  },
}

/**
 * Returns tutorial configuration for a given topic ID, or null if none registered.
 */
export function getTopicTutorial(topicId: string): TopicTutorialConfig | null {
  return TOPIC_TUTORIAL_REGISTRY[topicId] || null
}

/**
 * Determines whether a topic has verified public learning material:
 * either a registered interactive tutorial or at least one published resource.
 */
export function isTopicPublished(topic: TopicItem): boolean {
  if (getTopicTutorial(topic.id)) return true
  return Array.isArray(topic.resources) && topic.resources.some((r) => r.status === 'Published')
}

/**
 * Builds a safe URL respecting the configured Vite BASE_PATH (supports local and GitHub Pages).
 */
export function buildTutorialUrl(tutorialPath: string, hash = ''): string {
  const rawBase = import.meta.env.BASE_URL || '/'
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`
  const path = tutorialPath.startsWith('/') ? tutorialPath.slice(1) : tutorialPath
  const cleanHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : ''
  return `${base}${path}${cleanHash}`
}
