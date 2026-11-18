import type { AdminResourceType } from '../types'

export interface GitHubFileMetadata {
  isGitHub: boolean
  isRaw: boolean
  owner?: string
  repo?: string
  branch?: string
  filePath?: string
  fileName?: string
  fileExtension?: string
  fileType: AdminResourceType
  directContentUrl: string
  originalSourceUrl: string
  suggestedTitle: string
  isValidFormat: boolean
  error?: string
}

const SUPPORTED_IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp'])
const SUPPORTED_PDF_EXTENSIONS = new Set(['pdf'])

// Known acronyms and capitalization rules for technology terms
const ACRONYMS_AND_BRANDS: Record<string, string> = {
  powerbi: 'Power BI',
  'power-bi': 'Power BI',
  power_bi: 'Power BI',
  bi: 'BI',
  n8n: 'n8n',
  dax: 'DAX',
  sql: 'SQL',
  api: 'API',
  apis: 'APIs',
  pdf: 'PDF',
  pdfs: 'PDFs',
  ui: 'UI',
  ux: 'UX',
  etl: 'ETL',
  faq: 'FAQ',
  faqs: 'FAQs',
  cli: 'CLI',
  json: 'JSON',
  csv: 'CSV',
  html: 'HTML',
  css: 'CSS',
  http: 'HTTP',
  https: 'HTTPS',
  vs: 'vs',
}

/**
 * Formats a clean single word or CamelCase segment.
 */
function cleanSegment(segment: string): string {
  let text = segment
    // Separate letters and digits, e.g. Bases50 -> Bases 50, Step1 -> Step 1
    .replace(/([a-zA-Z]{2,})([0-9]+)/g, '$1 $2')
    .replace(/([0-9]+)([a-zA-Z]{2,})/g, '$1 $2')
    // Replace hyphens, underscores, dots, and plus signs with spaces
    .replace(/[-_.+]+/g, ' ')
    // Split CamelCase or PascalCase (e.g. SameDistance -> Same Distance)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')

  const words = text.trim().split(/\s+/).filter(Boolean)

  const formattedWords = words.map((word, idx) => {
    const lower = word.toLowerCase()
    if (ACRONYMS_AND_BRANDS[lower]) {
      return ACRONYMS_AND_BRANDS[lower]
    }
    // Minor words in lowercase unless first word
    if (idx > 0 && (lower === 'and' || lower === 'or' || lower === 'the' || lower === 'in' || lower === 'of' || lower === 'for' || lower === 'to' || lower === 'with')) {
      return lower
    }
    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  return formattedWords.join(' ')
}

/**
 * Converts a raw filename into a clean, human-readable Title.
 * Example: 'power-bi-drill-through.png' -> 'Power BI Drill Through'
 * Example: 'Bases50_SameDistance.png' -> 'Bases 50 — Same Distance'
 * Example: 'n8n_automation_cheatsheet.pdf' -> 'n8n Automation Cheatsheet'
 */
export function cleanFileNameToTitle(fileName: string): string {
  if (!fileName || !fileName.trim()) return ''

  // 1. Remove file extension
  let baseName = fileName.replace(/\.[a-zA-Z0-9]+$/, '')

  // 2. Decode URL encoding (e.g. %20 -> space)
  try {
    baseName = decodeURIComponent(baseName)
  } catch {
    // fallback if malformed URI component
  }

  // 3. Check if filename uses an underscore as a major clause/section divider between capitalized/CamelCase phrases
  // e.g. Bases50_SameDistance -> Bases 50 — Same Distance
  if (baseName.includes('_')) {
    const rawParts = baseName.split('_').filter(Boolean)
    const isClauseSeparated = 
      rawParts.length >= 2 && 
      rawParts.length <= 3 && 
      rawParts.every((p) => /[A-Z]/.test(p) || /[0-9]/.test(p))

    if (isClauseSeparated) {
      return rawParts.map((p) => cleanSegment(p)).join(' — ')
    }
  }

  return cleanSegment(baseName)
}

/**
 * Determines whether a file extension or filename represents a visual graphic.
 */
export function isImageExtension(extensionOrName: string): boolean {
  const ext = extractExtension(extensionOrName)
  return SUPPORTED_IMAGE_EXTENSIONS.has(ext)
}

/**
 * Determines whether a file extension or filename represents a PDF document.
 */
export function isPdfExtension(extensionOrName: string): boolean {
  const ext = extractExtension(extensionOrName)
  return SUPPORTED_PDF_EXTENSIONS.has(ext)
}

/**
 * Helper to extract clean lowercase extension from string without dot.
 */
function extractExtension(pathOrUrl: string): string {
  const clean = pathOrUrl.split('?')[0].split('#')[0].trim()
  const dotIndex = clean.lastIndexOf('.')
  if (dotIndex !== -1 && dotIndex < clean.length - 1) {
    return clean.slice(dotIndex + 1).toLowerCase()
  }
  // If no dot and it is a simple single-word extension token (e.g. 'png', 'pdf')
  if (/^[a-zA-Z0-9]{2,5}$/.test(clean)) {
    return clean.toLowerCase()
  }
  return ''
}

/**
 * Parses normal GitHub URLs, raw.githubusercontent.com URLs, and generic public PDF/Image links.
 * 
 * Supports:
 * - https://github.com/USER/REPO/blob/main/folder/file.png
 * - https://github.com/USER/REPO/raw/main/folder/file.pdf
 * - https://raw.githubusercontent.com/USER/REPO/main/folder/file.png
 * - Public direct images and PDFs from any server
 */
export function parseGitHubResourceUrl(inputUrl: string): GitHubFileMetadata {
  const trimmed = inputUrl.trim()
  if (!trimmed) {
    return {
      isGitHub: false,
      isRaw: false,
      fileType: 'External Link',
      directContentUrl: '',
      originalSourceUrl: '',
      suggestedTitle: '',
      isValidFormat: false,
      error: 'URL cannot be empty.',
    }
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(trimmed)
  } catch {
    return {
      isGitHub: false,
      isRaw: false,
      fileType: 'External Link',
      directContentUrl: trimmed,
      originalSourceUrl: trimmed,
      suggestedTitle: '',
      isValidFormat: false,
      error: 'Invalid URL structure. Please enter a valid HTTP or HTTPS link.',
    }
  }

  const hostname = parsedUrl.hostname.toLowerCase()
  const pathname = parsedUrl.pathname
  const cleanPath = pathname.replace(/^\/+/, '')
  const pathSegments = cleanPath.split('/').filter(Boolean)

  const extension = extractExtension(pathname)
  let fileType: AdminResourceType = 'External Link'
  if (isImageExtension(extension)) {
    fileType = 'Infographic'
  } else if (isPdfExtension(extension)) {
    fileType = 'PDF'
  }

  // ================= CASE 1: github.com URL =================
  if (hostname === 'github.com') {
    if (pathSegments.length < 2) {
      return {
        isGitHub: true,
        isRaw: false,
        fileType: 'External Link',
        directContentUrl: trimmed,
        originalSourceUrl: trimmed,
        suggestedTitle: '',
        isValidFormat: false,
        error: 'Incomplete GitHub URL. Must include repository owner and name.',
      }
    }

    const owner = pathSegments[0]
    const repo = pathSegments[1]
    const mode = pathSegments[2] // e.g. 'blob', 'raw', 'tree'

    // If it's a directory / tree view
    if (mode === 'tree') {
      return {
        isGitHub: true,
        isRaw: false,
        owner,
        repo,
        branch: pathSegments[3] || 'main',
        filePath: pathSegments.slice(4).join('/'),
        fileType: 'External Link',
        directContentUrl: trimmed,
        originalSourceUrl: trimmed,
        suggestedTitle: `${cleanFileNameToTitle(repo)} Folder`,
        isValidFormat: false,
        error: 'This link points to a GitHub folder or tree, not a specific file. Please link directly to an infographic image or PDF document.',
      }
    }

    if (mode === 'blob' || mode === 'raw') {
      if (pathSegments.length < 5) {
        return {
          isGitHub: true,
          isRaw: mode === 'raw',
          owner,
          repo,
          fileType,
          directContentUrl: trimmed,
          originalSourceUrl: trimmed,
          suggestedTitle: '',
          isValidFormat: false,
          error: 'GitHub file URL is missing branch or file path.',
        }
      }

      const branch = pathSegments[3]
      const fileSegments = pathSegments.slice(4)
      const filePath = fileSegments.join('/')
      const fileName = fileSegments[fileSegments.length - 1]

      const directContentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
      const originalSourceUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`
      const suggestedTitle = cleanFileNameToTitle(fileName)

      if (!extension) {
        return {
          isGitHub: true,
          isRaw: false,
          owner,
          repo,
          branch,
          filePath,
          fileName,
          fileType: 'External Link',
          directContentUrl,
          originalSourceUrl,
          suggestedTitle,
          isValidFormat: false,
          error: 'File does not have a recognizable file extension. Please link to an image (.png, .jpg, .svg, .webp) or PDF (.pdf).',
        }
      }

      if (fileType === 'External Link') {
        return {
          isGitHub: true,
          isRaw: false,
          owner,
          repo,
          branch,
          filePath,
          fileName,
          fileExtension: extension,
          fileType,
          directContentUrl,
          originalSourceUrl,
          suggestedTitle,
          isValidFormat: false,
          error: `Unsupported file format (.${extension}). Only Infographics (PNG, JPG, SVG, WEBP) and PDF files are supported.`,
        }
      }

      return {
        isGitHub: true,
        isRaw: mode === 'raw',
        owner,
        repo,
        branch,
        filePath,
        fileName,
        fileExtension: extension,
        fileType,
        directContentUrl,
        originalSourceUrl,
        suggestedTitle,
        isValidFormat: true,
      }
    }

    // Bare repo URL
    return {
      isGitHub: true,
      isRaw: false,
      owner,
      repo,
      fileType: 'External Link',
      directContentUrl: trimmed,
      originalSourceUrl: trimmed,
      suggestedTitle: cleanFileNameToTitle(repo),
      isValidFormat: false,
      error: 'This is a GitHub repository link rather than a specific Infographic or PDF file.',
    }
  }

  // ================= CASE 2: raw.githubusercontent.com URL =================
  if (hostname === 'raw.githubusercontent.com') {
    if (pathSegments.length < 4) {
      return {
        isGitHub: true,
        isRaw: true,
        fileType,
        directContentUrl: trimmed,
        originalSourceUrl: trimmed,
        suggestedTitle: '',
        isValidFormat: false,
        error: 'Incomplete raw.githubusercontent.com URL. Must include owner, repo, branch, and file path.',
      }
    }

    const owner = pathSegments[0]
    const repo = pathSegments[1]
    const branch = pathSegments[2]
    const fileSegments = pathSegments.slice(3)
    const filePath = fileSegments.join('/')
    const fileName = fileSegments[fileSegments.length - 1]

    const directContentUrl = trimmed
    const originalSourceUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`
    const suggestedTitle = cleanFileNameToTitle(fileName)

    if (fileType === 'External Link') {
      return {
        isGitHub: true,
        isRaw: true,
        owner,
        repo,
        branch,
        filePath,
        fileName,
        fileExtension: extension,
        fileType,
        directContentUrl,
        originalSourceUrl,
        suggestedTitle,
        isValidFormat: false,
        error: `Unsupported file format (.${extension}). Only Infographics (PNG, JPG, SVG, WEBP) and PDF files are supported.`,
      }
    }

    return {
      isGitHub: true,
      isRaw: true,
      owner,
      repo,
      branch,
      filePath,
      fileName,
      fileExtension: extension,
      fileType,
      directContentUrl,
      originalSourceUrl,
      suggestedTitle,
      isValidFormat: true,
    }
  }

  // ================= CASE 3: GitHub Pages URL (*.github.io) =================
  if (hostname.endsWith('.github.io')) {
    const owner = hostname.replace(/\.github\.io$/, '')

    if (pathSegments.length === 0) {
      return {
        isGitHub: true,
        isRaw: false,
        owner,
        repo: `${owner}.github.io`,
        fileType: 'External Link',
        directContentUrl: trimmed,
        originalSourceUrl: `https://github.com/${owner}/${owner}.github.io`,
        suggestedTitle: cleanFileNameToTitle(owner),
        isValidFormat: false,
        error: 'GitHub Pages site root. Please link directly to an infographic image or PDF document.',
      }
    }

    let repo: string
    let filePath: string
    let fileName: string

    // If first path segment has a file extension or only 1 path segment exists
    if (pathSegments.length === 1 || isImageExtension(extractExtension(pathSegments[0])) || isPdfExtension(extractExtension(pathSegments[0]))) {
      repo = `${owner}.github.io`
      filePath = pathSegments.join('/')
      fileName = pathSegments[pathSegments.length - 1]
    } else {
      // First segment is repository name (e.g. math-magic-playground)
      repo = pathSegments[0]
      const fileSegments = pathSegments.slice(1)
      filePath = fileSegments.join('/')
      fileName = fileSegments[fileSegments.length - 1] || repo
    }

    // Direct GitHub Pages URL serves image/PDF natively with correct MIME type
    const directContentUrl = trimmed
    // Link back to original repository file on GitHub
    const originalSourceUrl = `https://github.com/${owner}/${repo}/blob/main/${filePath}`
    const suggestedTitle = cleanFileNameToTitle(fileName)

    if (fileType === 'External Link') {
      return {
        isGitHub: true,
        isRaw: true,
        owner,
        repo,
        filePath,
        fileName,
        fileExtension: extension,
        fileType,
        directContentUrl,
        originalSourceUrl,
        suggestedTitle,
        isValidFormat: false,
        error: `Unsupported file format (.${extension}). Only Infographics (PNG, JPG, SVG, WEBP) and PDF files are supported.`,
      }
    }

    return {
      isGitHub: true,
      isRaw: true,
      owner,
      repo,
      filePath,
      fileName,
      fileExtension: extension,
      fileType,
      directContentUrl,
      originalSourceUrl,
      suggestedTitle,
      isValidFormat: true,
    }
  }

  // ================= CASE 4: Generic Public Web URL (Non-GitHub) =================
  const fileName = pathSegments[pathSegments.length - 1] || 'resource'
  const suggestedTitle = cleanFileNameToTitle(fileName)

  if (fileType === 'Infographic' || fileType === 'PDF') {
    return {
      isGitHub: false,
      isRaw: false,
      fileName,
      fileExtension: extension,
      fileType,
      directContentUrl: trimmed,
      originalSourceUrl: trimmed,
      suggestedTitle,
      isValidFormat: true,
    }
  }

  return {
    isGitHub: false,
    isRaw: false,
    fileName,
    fileExtension: extension,
    fileType: 'External Link',
    directContentUrl: trimmed,
    originalSourceUrl: trimmed,
    suggestedTitle,
    isValidFormat: true,
  }
}

/**
 * Reusable utility prepared for future bulk folder imports:
 * Parses a GitHub tree/folder URL to extract repo and branch info.
 */
export function parseGitHubTreeUrl(folderUrl: string): {
  isTree: boolean
  owner?: string
  repo?: string
  branch?: string
  folderPath?: string
  apiContentsUrl?: string
  rawBaseUrl?: string
  error?: string
} {
  try {
    const parsed = new URL(folderUrl.trim())
    if (parsed.hostname.toLowerCase() !== 'github.com') {
      return { isTree: false, error: 'Not a github.com URL.' }
    }
    const segments = parsed.pathname.replace(/^\/+/, '').split('/').filter(Boolean)
    if (segments.length < 4 || segments[2] !== 'tree') {
      return { isTree: false, error: 'Not a recognized GitHub tree/folder URL (expected https://github.com/USER/REPO/tree/BRANCH/PATH).' }
    }
    const owner = segments[0]
    const repo = segments[1]
    const branch = segments[3]
    const folderPath = segments.slice(4).join('/')

    return {
      isTree: true,
      owner,
      repo,
      branch,
      folderPath,
      apiContentsUrl: `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}?ref=${branch}`,
      rawBaseUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${folderPath}`,
    }
  } catch (err: any) {
    return { isTree: false, error: err?.message || 'Invalid folder URL.' }
  }
}
