import type { CategoryItem, TopicItem, TopicResource } from '../types'

export const PUBLISHED_CURRICULUM_SCHEMA_VERSION = '1.0'

export interface PublishedCurriculumSummary {
  categoryCount: number
  topicCount: number
  publishedResourceCount: number
  excludedDraftCount: number
  excludedHiddenCount: number
  videoCount: number
  clipCount: number
  infographicCount: number
  pdfCount: number
  tutorialCount: number
  otherCount: number
}

export interface PublishedCurriculumPayload {
  app: 'Digital Learning Hub'
  schemaVersion: string
  generatedAt: string
  description: string
  summary: PublishedCurriculumSummary
  categories: CategoryItem[]
  topics: TopicItem[]
}

export interface PublishedCurriculumResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  publishedPayload?: PublishedCurriculumPayload
  stats: {
    totalInputCategories: number
    totalInputTopics: number
    totalInputResources: number
    publishedResourcesCount: number
    excludedDraftsCount: number
    excludedHiddenCount: number
  }
}

/**
 * Validates a single URL string for well-formed HTTP/HTTPS protocol,
 * or simulated demo:// protocol for baseline prototype demo items.
 */
function isValidResourceUrl(urlStr: string, isDemo?: boolean): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false
  const trimmed = urlStr.trim()
  if (!trimmed) return false

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return true
    }
    if (isDemo && parsed.protocol === 'demo:') {
      return true
    }
    return false
  } catch {
    return false
  }
}

/**
 * Deep clones an object safely without mutating source inputs.
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Pure generator function: transforms working categories and topics into
 * a strictly validated, production-ready curriculum payload containing ONLY
 * published content.
 * 
 * Rules:
 * - Omits Draft and Hidden resources completely
 * - Omits Draft/Hidden categories or topics if status is present
 * - Preserves all metadata (YouTube clip seconds, creator info, GitHub links, keywords)
 * - Sorts deterministically and normalizes displayOrder
 * - Updates category resourceCount to match published resources
 * - Performs schema validation and returns clear errors/warnings
 */
export function generatePublishedCurriculum(
  inputCategories: CategoryItem[],
  inputTopics: TopicItem[]
): PublishedCurriculumResult {
  const errors: string[] = []
  const warnings: string[] = []

  let totalInputCategories = 0
  let totalInputTopics = 0
  let totalInputResources = 0
  let publishedResourcesCount = 0
  let excludedDraftsCount = 0
  let excludedHiddenCount = 0

  if (!Array.isArray(inputCategories)) {
    return {
      isValid: false,
      errors: ['Invalid input: categories must be an array.'],
      warnings: [],
      stats: {
        totalInputCategories: 0,
        totalInputTopics: 0,
        totalInputResources: 0,
        publishedResourcesCount: 0,
        excludedDraftsCount: 0,
        excludedHiddenCount: 0,
      },
    }
  }

  if (!Array.isArray(inputTopics)) {
    return {
      isValid: false,
      errors: ['Invalid input: topics must be an array.'],
      warnings: [],
      stats: {
        totalInputCategories: inputCategories.length,
        totalInputTopics: 0,
        totalInputResources: 0,
        publishedResourcesCount: 0,
        excludedDraftsCount: 0,
        excludedHiddenCount: 0,
      },
    }
  }

  totalInputCategories = inputCategories.length
  totalInputTopics = inputTopics.length

  // Count total resources across all input topics
  inputTopics.forEach((t) => {
    if (Array.isArray(t?.resources)) {
      totalInputResources += t.resources.length
    }
  })

  // Deep clone to ensure zero input mutation
  const rawCategories = deepClone(inputCategories)
  const rawTopics = deepClone(inputTopics)

  // 1. Filter and Validate Categories
  const categoryIdSet = new Set<string>()
  const categorySlugSet = new Set<string>()
  const validCategories: CategoryItem[] = []

  for (let i = 0; i < rawCategories.length; i++) {
    const cat = rawCategories[i]
    const idxLabel = `Category at index ${i}`

    if (!cat || typeof cat !== 'object') {
      errors.push(`${idxLabel} is not a valid object.`)
      continue
    }

    // Exclude Draft/Hidden categories if status exists
    const catStatus = (cat as any).status
    if (catStatus === 'Draft' || catStatus === 'Hidden') {
      warnings.push(`Category "${cat.title || cat.id}" excluded because its status is ${catStatus}.`)
      continue
    }

    if (!cat.id || typeof cat.id !== 'string' || !cat.id.trim()) {
      errors.push(`${idxLabel} is missing a required 'id'.`)
      continue
    }

    if (!cat.title || typeof cat.title !== 'string' || !cat.title.trim()) {
      errors.push(`Category '${cat.id}' is missing a required 'title'.`)
      continue
    }

    if (!cat.slug || typeof cat.slug !== 'string' || !cat.slug.trim()) {
      errors.push(`Category '${cat.id}' is missing a required 'slug'.`)
      continue
    }

    if (categoryIdSet.has(cat.id)) {
      errors.push(`Duplicate category ID found: '${cat.id}'.`)
      continue
    }

    if (categorySlugSet.has(cat.slug.toLowerCase())) {
      errors.push(`Duplicate category slug found: '${cat.slug}'.`)
      continue
    }

    categoryIdSet.add(cat.id)
    categorySlugSet.add(cat.slug.toLowerCase())
    validCategories.push(cat)
  }

  // 2. Filter and Validate Topics & Resources
  const topicIdSet = new Set<string>()
  const validTopics: TopicItem[] = []

  let videoCount = 0
  let clipCount = 0
  let infographicCount = 0
  let pdfCount = 0
  let tutorialCount = 0
  let otherCount = 0

  for (let i = 0; i < rawTopics.length; i++) {
    const topic = rawTopics[i]
    const idxLabel = `Topic at index ${i}`

    if (!topic || typeof topic !== 'object') {
      errors.push(`${idxLabel} is not a valid object.`)
      continue
    }

    // Exclude Draft/Hidden topics if status exists
    const topicStatus = (topic as any).status
    if (topicStatus === 'Draft' || topicStatus === 'Hidden') {
      warnings.push(`Topic "${topic.title || topic.id}" excluded because its status is ${topicStatus}.`)
      continue
    }

    if (!topic.id || typeof topic.id !== 'string' || !topic.id.trim()) {
      errors.push(`${idxLabel} is missing a required 'id'.`)
      continue
    }

    if (!topic.categoryId || typeof topic.categoryId !== 'string' || !topic.categoryId.trim()) {
      errors.push(`Topic '${topic.id}' is missing a required 'categoryId'.`)
      continue
    }

    // Verify parent category exists among valid categories
    if (!categoryIdSet.has(topic.categoryId)) {
      errors.push(
        `Topic '${topic.id}' ("${topic.title || 'Untitled'}") references categoryId '${topic.categoryId}', which does not exist in published categories.`
      )
      continue
    }

    if (!topic.title || typeof topic.title !== 'string' || !topic.title.trim()) {
      errors.push(`Topic '${topic.id}' is missing a required 'title'.`)
      continue
    }

    if (!topic.slug || typeof topic.slug !== 'string' || !topic.slug.trim()) {
      errors.push(`Topic '${topic.id}' is missing a required 'slug'.`)
      continue
    }

    if (topicIdSet.has(topic.id)) {
      errors.push(`Duplicate topic ID found: '${topic.id}'.`)
      continue
    }

    topicIdSet.add(topic.id)

    // Process and filter resources within topic
    const validTopicResources: TopicResource[] = []
    const rawResources = Array.isArray(topic.resources) ? topic.resources : []

    for (let rIdx = 0; rIdx < rawResources.length; rIdx++) {
      const res = rawResources[rIdx]
      const resLabel = `Resource #${rIdx + 1} in topic '${topic.title}'`

      if (!res || typeof res !== 'object') {
        errors.push(`${resLabel} is not a valid object.`)
        continue
      }

      const status = res.status || 'Published'

      // STRICT EXCLUSION: Draft and Hidden
      if (status === 'Draft') {
        excludedDraftsCount++
        continue
      }
      if (status === 'Hidden') {
        excludedHiddenCount++
        continue
      }

      if (status !== 'Published') {
        // Any other non-published status
        excludedDraftsCount++
        continue
      }

      // Validate Published Resource Fields
      if (!res.id || typeof res.id !== 'string' || !res.id.trim()) {
        errors.push(`${resLabel} is missing a required 'id'.`)
        continue
      }

      if (!res.title || typeof res.title !== 'string' || !res.title.trim()) {
        errors.push(`Resource '${res.id}' in topic '${topic.title}' is missing a title.`)
        continue
      }

      if (!res.url || !isValidResourceUrl(res.url, Boolean(res.isDemo))) {
        errors.push(`Resource '${res.id}' ("${res.title}") has an invalid or malformed URL: "${res.url}".`)
        continue
      }

      // Tally resource types
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

      publishedResourcesCount++
      validTopicResources.push(res)
    }

    // Sort published resources deterministically by displayOrder
    validTopicResources.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

    // Re-index displayOrder sequentially 1..N
    validTopicResources.forEach((res, resIdx) => {
      res.displayOrder = resIdx + 1
    })

    topic.resources = validTopicResources
    validTopics.push(topic)
  }

  // 3. Deterministic Category and Topic Ordering
  validCategories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  validCategories.forEach((cat, idx) => {
    cat.displayOrder = idx + 1
  })

  validTopics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  validTopics.forEach((top, idx) => {
    top.displayOrder = idx + 1
  })

  // 4. Update category resourceCount strictly to reflect published resources
  validCategories.forEach((cat) => {
    const catTopics = validTopics.filter((t) => t.categoryId === cat.id)
    const count = catTopics.reduce((acc, t) => acc + t.resources.length, 0)
    cat.resourceCount = count
  })

  const isValid = errors.length === 0

  const summary: PublishedCurriculumSummary = {
    categoryCount: validCategories.length,
    topicCount: validTopics.length,
    publishedResourceCount: publishedResourcesCount,
    excludedDraftCount: excludedDraftsCount,
    excludedHiddenCount: excludedHiddenCount,
    videoCount,
    clipCount,
    infographicCount,
    pdfCount,
    tutorialCount,
    otherCount,
  }

  const payload: PublishedCurriculumPayload | undefined = isValid
    ? {
        app: 'Digital Learning Hub',
        schemaVersion: PUBLISHED_CURRICULUM_SCHEMA_VERSION,
        generatedAt: new Date().toISOString(),
        description:
          'Official published curriculum dataset containing verified educational categories, topics, and multi-format learning resources.',
        summary,
        categories: validCategories,
        topics: validTopics,
      }
    : undefined

  return {
    isValid,
    errors,
    warnings,
    publishedPayload: payload,
    stats: {
      totalInputCategories,
      totalInputTopics,
      totalInputResources,
      publishedResourcesCount,
      excludedDraftsCount,
      excludedHiddenCount,
    },
  }
}

/**
 * Validates a parsed or JSON-stringified published curriculum payload against the published schema.
 */
export function validatePublishedCurriculumJson(jsonString: string): {
  isValid: boolean
  error?: string
  payload?: PublishedCurriculumPayload
} {
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
      error: 'Curriculum file must contain a valid JSON object.',
    }
  }

  if (parsed.app !== 'Digital Learning Hub') {
    return {
      isValid: false,
      error: `Unrecognized application signature: "${parsed.app}". Expected "Digital Learning Hub".`,
    }
  }

  if (parsed.schemaVersion !== PUBLISHED_CURRICULUM_SCHEMA_VERSION) {
    return {
      isValid: false,
      error: `Unsupported schema version: "${parsed.schemaVersion}". Expected version "${PUBLISHED_CURRICULUM_SCHEMA_VERSION}".`,
    }
  }

  if (!Array.isArray(parsed.categories)) {
    return {
      isValid: false,
      error: 'Corrupt curriculum data: "categories" must be an array.',
    }
  }

  if (!Array.isArray(parsed.topics)) {
    return {
      isValid: false,
      error: 'Corrupt curriculum data: "topics" must be an array.',
    }
  }

  return {
    isValid: true,
    payload: parsed as PublishedCurriculumPayload,
  }
}

/**
 * Triggers browser download of curriculum.json encoded as UTF-8.
 */
export function downloadPublishedCurriculum(payload: PublishedCurriculumPayload): void {
  const jsonString = JSON.stringify(payload, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const filename = 'curriculum.json'

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

