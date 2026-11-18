import type { CategoryItem, TopicItem, AdminResourceType, ResourceStatus } from '../types'
import { extractYouTubeVideoId } from './youtubeEmbed'

export interface ResourcePlacement {
  categoryId: string
  categoryTitle: string
  categorySlug?: string
  topicId: string
  topicTitle: string
  topicSlug?: string
  resourceId: string
  resourceTitle: string
  resourceType: AdminResourceType
  url: string
  directContentUrl?: string
  originalSourceUrl?: string
  status: ResourceStatus
  displayOrder: number
}

export interface ResourceUsageSummary {
  canonicalKey: string
  primaryTitle: string
  resourceType: AdminResourceType
  displayUrl: string
  placements: ResourcePlacement[]
  totalPlacements: number
}

/**
 * Normalizes GitHub owner, repo, and filePath into a deterministic key.
 * Example: 'github:vksinglakkr/math-magic-playground/multiplication/bases50_samedistance.png'
 */
export function getGitHubCanonicalKey(owner: string, repo: string, filePath: string): string {
  const normOwner = owner.trim().toLowerCase()
  const normRepo = repo.trim().toLowerCase()
  const normPath = decodeURIComponent(filePath.trim())
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
  return `github:${normOwner}/${normRepo}/${normPath}`
}

/**
 * Computes a deterministic canonical key for any resource URL representation.
 * Supports:
 * - GitHub blob: https://github.com/USER/REPO/blob/BRANCH/PATH
 * - GitHub raw: https://raw.githubusercontent.com/USER/REPO/BRANCH/PATH
 * - GitHub Pages: https://USER.github.io/REPO/PATH
 * - YouTube: youtube.com/watch?v=ID, youtu.be/ID
 * - Other Web URLs: normalized direct URL
 */
export function getCanonicalResourceKey(
  url?: string,
  directContentUrl?: string,
  originalSourceUrl?: string
): string {
  const candidateUrls = [url, directContentUrl, originalSourceUrl].filter(Boolean) as string[]

  for (const rawUrl of candidateUrls) {
    const key = extractSingleCanonicalKey(rawUrl)
    if (key) return key
  }

  return ''
}

function extractSingleCanonicalKey(rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (!trimmed) return ''

  // 1. YouTube video ID
  const ytId = extractYouTubeVideoId(trimmed)
  if (ytId) {
    return `youtube:${ytId}`
  }

  // 2. Parse URL for GitHub representations
  try {
    const parsed = new URL(trimmed)
    const hostname = parsed.hostname.toLowerCase()
    const pathParts = parsed.pathname.replace(/^\/+/, '').split('/').filter(Boolean)

    // github.com/OWNER/REPO/(blob|raw)/BRANCH/PATH
    if (hostname === 'github.com') {
      if (pathParts.length >= 5 && (pathParts[2] === 'blob' || pathParts[2] === 'raw')) {
        const owner = pathParts[0].toLowerCase()
        const repo = pathParts[1].toLowerCase()
        const filePath = decodeURIComponent(pathParts.slice(4).join('/')).toLowerCase()
        return `github:${owner}/${repo}/${filePath}`
      }
    }

    // raw.githubusercontent.com/OWNER/REPO/BRANCH/PATH
    if (hostname === 'raw.githubusercontent.com') {
      if (pathParts.length >= 4) {
        const owner = pathParts[0].toLowerCase()
        const repo = pathParts[1].toLowerCase()
        const filePath = decodeURIComponent(pathParts.slice(3).join('/')).toLowerCase()
        return `github:${owner}/${repo}/${filePath}`
      }
    }

    // OWNER.github.io/REPO/PATH
    if (hostname.endsWith('.github.io')) {
      const owner = hostname.replace(/\.github\.io$/, '').toLowerCase()
      if (pathParts.length >= 2) {
        const repo = pathParts[0].toLowerCase()
        const filePath = decodeURIComponent(pathParts.slice(1).join('/')).toLowerCase()
        return `github:${owner}/${repo}/${filePath}`
      } else if (pathParts.length === 1) {
        const repo = `${owner}.github.io`
        const filePath = decodeURIComponent(pathParts[0]).toLowerCase()
        return `github:${owner}/${repo}/${filePath}`
      }
    }

    // Generic Web URL: normalize protocol, host, and path
    const cleanUrl = `${hostname}${parsed.pathname}`.toLowerCase().replace(/\/+$/, '')
    return `url:${cleanUrl}`
  } catch {
    return `text:${trimmed.toLowerCase().replace(/\s+/g, ' ')}`
  }
}

/**
 * Finds all placements of a resource across all categories and topics using its canonical key.
 */
export function findResourcePlacements(
  canonicalKey: string,
  categories: CategoryItem[],
  topics: TopicItem[]
): ResourcePlacement[] {
  if (!canonicalKey) return []

  const categoryMap = new Map<string, CategoryItem>()
  categories.forEach((c) => categoryMap.set(c.id, c))

  const placements: ResourcePlacement[] = []

  for (const topic of topics) {
    const category = categoryMap.get(topic.categoryId)
    const categoryTitle = category ? category.title : 'Uncategorized'
    const categorySlug = category?.slug

    for (const res of topic.resources) {
      const resKey = getCanonicalResourceKey(res.url, res.directContentUrl, res.originalSourceUrl)
      if (resKey && resKey === canonicalKey) {
        placements.push({
          categoryId: topic.categoryId,
          categoryTitle,
          categorySlug,
          topicId: topic.id,
          topicTitle: topic.title,
          topicSlug: topic.slug,
          resourceId: res.id,
          resourceTitle: res.title,
          resourceType: res.type,
          url: res.url,
          directContentUrl: res.directContentUrl,
          originalSourceUrl: res.originalSourceUrl,
          status: res.status || 'Published',
          displayOrder: res.displayOrder,
        })
      }
    }
  }

  return placements
}

/**
 * Searches and groups all resource placements across all topics in the curriculum.
 * Supports filtering by title, URL, filename, topic, or category.
 */
export function searchAllResourceUsage(
  query: string,
  categories: CategoryItem[],
  topics: TopicItem[]
): ResourceUsageSummary[] {
  const categoryMap = new Map<string, CategoryItem>()
  categories.forEach((c) => categoryMap.set(c.id, c))

  // Group all resources in the curriculum by canonical key
  const groupsMap = new Map<string, {
    canonicalKey: string
    primaryTitle: string
    resourceType: AdminResourceType
    displayUrl: string
    placements: ResourcePlacement[]
  }>()

  for (const topic of topics) {
    const category = categoryMap.get(topic.categoryId)
    const categoryTitle = category ? category.title : 'Uncategorized'
    const categorySlug = category?.slug

    for (const res of topic.resources) {
      const canonicalKey = getCanonicalResourceKey(res.url, res.directContentUrl, res.originalSourceUrl)
      if (!canonicalKey) continue

      const placement: ResourcePlacement = {
        categoryId: topic.categoryId,
        categoryTitle,
        categorySlug,
        topicId: topic.id,
        topicTitle: topic.title,
        topicSlug: topic.slug,
        resourceId: res.id,
        resourceTitle: res.title,
        resourceType: res.type,
        url: res.url,
        directContentUrl: res.directContentUrl,
        originalSourceUrl: res.originalSourceUrl,
        status: res.status || 'Published',
        displayOrder: res.displayOrder,
      }

      if (!groupsMap.has(canonicalKey)) {
        groupsMap.set(canonicalKey, {
          canonicalKey,
          primaryTitle: res.title,
          resourceType: res.type,
          displayUrl: res.directContentUrl || res.url,
          placements: [placement],
        })
      } else {
        groupsMap.get(canonicalKey)!.placements.push(placement)
      }
    }
  }

  const allSummaries: ResourceUsageSummary[] = Array.from(groupsMap.values()).map((g) => ({
    ...g,
    totalPlacements: g.placements.length,
  }))

  const trimmedQuery = query.trim().toLowerCase()
  if (!trimmedQuery) {
    // Return all, sorted by most reused first, then by title
    return allSummaries.sort((a, b) => {
      if (b.totalPlacements !== a.totalPlacements) {
        return b.totalPlacements - a.totalPlacements
      }
      return a.primaryTitle.localeCompare(b.primaryTitle)
    })
  }

  // Filter based on query
  return allSummaries.filter((summary) => {
    if (summary.primaryTitle.toLowerCase().includes(trimmedQuery)) return true
    if (summary.canonicalKey.toLowerCase().includes(trimmedQuery)) return true
    if (summary.displayUrl.toLowerCase().includes(trimmedQuery)) return true

    // Check individual placements
    return summary.placements.some((p) =>
      p.resourceTitle.toLowerCase().includes(trimmedQuery) ||
      p.topicTitle.toLowerCase().includes(trimmedQuery) ||
      p.categoryTitle.toLowerCase().includes(trimmedQuery) ||
      p.url.toLowerCase().includes(trimmedQuery) ||
      (p.directContentUrl && p.directContentUrl.toLowerCase().includes(trimmedQuery)) ||
      (p.originalSourceUrl && p.originalSourceUrl.toLowerCase().includes(trimmedQuery))
    )
  }).sort((a, b) => {
    if (b.totalPlacements !== a.totalPlacements) {
      return b.totalPlacements - a.totalPlacements
    }
    return a.primaryTitle.localeCompare(b.primaryTitle)
  })
}

