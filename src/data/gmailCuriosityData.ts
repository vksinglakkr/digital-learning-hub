import type { CuriosityCard } from './curiosityBannerData'

/**
 * 6 Short, verified Gmail-specific curiosity cards approved by the teacher.
 * Each problem links to its existing, published Gmail tutorial route.
 */
export const GMAIL_CURIOSITY_CARDS: CuriosityCard[] = [
  {
    id: 'gmail-undo-send',
    problem: 'अरे! Email गलत भेज दी!',
    solution: 'Send करने के तुरंत बाद Undo कर सकते हैं.',
    targetUrl: '/category/gmail/topic/undo-send',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Undo Send',
    iconType: 'undo',
  },
  {
    id: 'gmail-templates',
    problem: 'एक ही Email बार-बार लिखनी पड़ती है!',
    solution: 'Gmail Templates से समय बचाएँ.',
    targetUrl: '/category/gmail/topic/gmail-templates',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Templates',
    iconType: 'template',
  },
  {
    id: 'gmail-filters',
    problem: 'इतनी सारी Emails! जरूरी कौन-सी है?',
    solution: 'Gmail Filters से Emails व्यवस्थित करें.',
    targetUrl: '/category/gmail/topic/gmail-filters',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Filters',
    iconType: 'filter',
  },
  {
    id: 'gmail-schedule-send',
    problem: 'कल सुबह Email भेजनी है?',
    solution: 'अभी लिखकर कल के लिए Schedule करें.',
    targetUrl: '/category/gmail/topic/schedule-send',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Schedule Send',
    iconType: 'clock',
  },
  {
    id: 'gmail-large-files-drive',
    problem: 'बड़ी File Email से नहीं जा रही?',
    solution: 'Google Drive से File साझा करें.',
    targetUrl: '/category/gmail/topic/large-files-drive',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Google Drive',
    iconType: 'drive',
  },
  {
    id: 'gmail-add-to-tasks',
    problem: 'Email पढ़कर काम भूल जाते हैं?',
    solution: 'Email को Task में बदलें.',
    targetUrl: '/category/gmail/topic/add-to-tasks',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Add to Tasks',
    iconType: 'task',
  },
]
