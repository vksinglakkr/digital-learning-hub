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
  'gmail-translate': {
    tutorialPath: 'tutorials/gmail/translate/index.html',
    title: 'Translate — Email को अपनी भाषा में समझें',
    subtitle: 'कठिन या अंग्रेज़ी भाषा के लंबे Email को बस 3 आसान Steps में अपनी पसंदीदा भाषा में अनुवादित करके पढ़ें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-inbox-categories': {
    tutorialPath: 'tutorials/gmail/inbox-categories/index.html',
    title: 'Inbox Categories — Primary, Updates, Social को समझें',
    subtitle: 'Gmail आपके जरूरी ईमेल को अलग-अलग श्रेणियों में क्यों बाँटता है, और कौन-से Tabs इनबॉक्स में दिखें यह कैसे कस्टमाइज़ करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-search-operators': {
    tutorialPath: 'tutorials/gmail/search-operators/index.html',
    title: 'Advanced Search — Search Operators से तेज़ी से Email ढूँढें',
    subtitle: 'Gmail के पावर सर्च कमांड्स का उपयोग करके जरूरी फाइल्स, बैंक अलर्ट और महीनों पुराने ईमेल 10 सेकंड में खोजें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-schedule-send': {
    tutorialPath: 'tutorials/gmail/schedule-send/index.html',
    title: 'Schedule Send — Email बाद में कैसे भेजें?',
    subtitle: 'Email अभी लिखें और अपनी पसंद के समय पर अपने आप भेजें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-email-summarize': {
    tutorialPath: 'tutorials/gmail/email-summarize/index.html',
    title: 'Email Summarize — लंबे Email का सार पाना',
    subtitle: 'लंबे या कई Replies वाले Group Emails को पूरा पढ़े बिना कुछ ही सेकंड में मुख्य सार (Summary) समझना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-preview-pane': {
    tutorialPath: 'tutorials/gmail/preview-pane/index.html',
    title: 'Preview Pane — बिना बार-बार Back किए Email पढ़ें',
    subtitle: 'Desktop (Web) Gmail में Split View चालू करके Inbox छोड़े बिना ही किसी भी Email का Content तुरंत देखना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-inbox-density': {
    tutorialPath: 'tutorials/gmail/inbox-density/index.html',
    title: 'Inbox Density — Email खोले बिना अधिक जानकारी देखें',
    subtitle: 'अपने Mobile App या Desktop Gmail में Density Setting बदलकर Default, Comfortable और Compact View में से सही विकल्प चुनें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-inbox-type': {
    tutorialPath: 'tutorials/gmail/inbox-type/index.html',
    title: 'Inbox Type व Star vs Important — जरूरी Email सबसे ऊपर रखें',
    subtitle: 'Star और Important का असली अंतर समझें और Inbox Type (Sorting) बदलकर अपने जरूरी Emails को सबसे ऊपर देखना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
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
