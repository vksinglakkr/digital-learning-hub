import type { CuriosityCard } from './curiosityBannerData'

/**
 * 6 Short, verified Google Calendar-specific curiosity cards.
 * Uses real-life everyday situations rather than technical terms.
 */
export const CALENDAR_CURIOSITY_CARDS: CuriosityCard[] = [
  {
    id: 'cal-first-event',
    problem: 'याद तो था... पर समय पर याद नहीं रहा!',
    solution: 'Google Calendar में 1 मिनट में Event जोड़ें.',
    targetUrl: '/category/calendar/topic/create-event',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Create Event',
    iconType: 'clock',
  },
  {
    id: 'cal-traffic-departure',
    problem: 'रास्ते में ट्रैफिक था... फिर भी देर हो गई!',
    solution: 'Google Maps से निकलने का सही समय (Departure Time) जानें.',
    targetUrl: '/category/calendar/topic/departure-time',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Departure Time',
    iconType: 'drive',
  },
  {
    id: 'cal-share-family',
    problem: 'हर बार पूछना पड़ता है "मीटिंग किस दिन है?"',
    solution: 'पूरा Calendar 1-Click में परिवार या टीम से Share करें.',
    targetUrl: '/category/calendar/topic/share-calendar',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Share Calendar',
    iconType: 'mail',
  },
  {
    id: 'cal-appointment-booking',
    problem: 'बार-बार कॉल: "सर, आप कब फ्री हैं?"',
    solution: 'Appointment Schedule से अपना बुकिंग पेज शेयर करें.',
    targetUrl: '/category/calendar/topic/appointment-schedule',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Appointment Schedule',
    iconType: 'template',
  },
  {
    id: 'cal-trash-restore',
    problem: 'गलती से जरूरी मीटिंग डिलीट हो गई!',
    solution: 'Trash से 30 दिन के अंदर वापस Restore करें.',
    targetUrl: '/category/calendar/topic/trash-restore',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Trash & Restore',
    iconType: 'undo',
  },
  {
    id: 'cal-gmail-tickets',
    problem: 'हवाई जहाज या होटल का टिकट बुक किया?',
    solution: 'Gmail से खुद Calendar में Event बन जाता है.',
    targetUrl: '/category/calendar/topic/events-from-gmail',
    actionLabel: 'कैसे करें? सीखें',
    tag: 'Events from Gmail',
    iconType: 'mail',
  },
]
