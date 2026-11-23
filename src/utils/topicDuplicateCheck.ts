import type { TopicItem } from '../types'

export interface DuplicateCheckResult {
  hasDuplicateOrSimilar: boolean
  matchedTopic?: TopicItem
  matchType?: 'exact-slug' | 'exact-title' | 'similar-title'
  message?: string
}

/**
 * Normalizes a string for comparison: lowercase, removes punctuation and extra whitespace.
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

/**
 * Calculates similarity between two titles using word token overlap (Jaccard similarity).
 */
function calculateWordSimilarity(a: string, b: string): number {
  const wordsA = new Set(normalizeString(a).split(/\s+/).filter(Boolean))
  const wordsB = new Set(normalizeString(b).split(/\s+/).filter(Boolean))

  if (wordsA.size === 0 || wordsB.size === 0) return 0

  let intersectionCount = 0
  for (const word of wordsA) {
    if (wordsB.has(word)) {
      intersectionCount++
    }
  }

  const unionCount = new Set([...wordsA, ...wordsB]).size
  return unionCount === 0 ? 0 : intersectionCount / unionCount
}

/**
 * Checks whether a proposed topic title or slug collides with or is very similar
 * to an existing topic within the given category.
 */
export function checkTopicDuplicateOrSimilar(
  title: string,
  slug: string,
  categoryId: string,
  existingTopics: TopicItem[],
  currentTopicId?: string
): DuplicateCheckResult {
  const trimmedTitle = title.trim()
  const trimmedSlug = slug.trim().toLowerCase()

  if (!trimmedTitle && !trimmedSlug) {
    return { hasDuplicateOrSimilar: false }
  }

  const normalizedInputTitle = normalizeString(trimmedTitle)

  // Filter topics in the same category, excluding the topic being edited (if any)
  const categoryTopics = existingTopics.filter(
    (t) => t.categoryId === categoryId && (!currentTopicId || t.id !== currentTopicId)
  )

  for (const existing of categoryTopics) {
    // 1. Exact slug match
    if (trimmedSlug && existing.slug.toLowerCase() === trimmedSlug) {
      return {
        hasDuplicateOrSimilar: true,
        matchedTopic: existing,
        matchType: 'exact-slug',
        message: `A topic with the slug "/${existing.slug}" already exists in this category: "${existing.title}".`,
      }
    }

    // 2. Exact normalized title match
    const normalizedExistingTitle = normalizeString(existing.title)
    if (normalizedInputTitle && normalizedExistingTitle === normalizedInputTitle) {
      return {
        hasDuplicateOrSimilar: true,
        matchedTopic: existing,
        matchType: 'exact-title',
        message: `An identical topic titled "${existing.title}" already exists in this category.`,
      }
    }

    // 3. High word similarity or substring containment
    if (normalizedInputTitle && normalizedExistingTitle) {
      const similarity = calculateWordSimilarity(normalizedInputTitle, normalizedExistingTitle)
      const isSubstring = 
        (normalizedInputTitle.length > 4 && normalizedExistingTitle.includes(normalizedInputTitle)) ||
        (normalizedExistingTitle.length > 4 && normalizedInputTitle.includes(normalizedExistingTitle))

      if (similarity >= 0.6 || isSubstring) {
        return {
          hasDuplicateOrSimilar: true,
          matchedTopic: existing,
          matchType: 'similar-title',
          message: `A very similar topic titled "${existing.title}" (slug: /${existing.slug}) already exists in this category.`,
        }
      }
    }
  }

  return { hasDuplicateOrSimilar: false }
}
