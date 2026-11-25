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
  'gmail-multiple-inboxes': {
    tutorialPath: 'tutorials/gmail/multiple-inboxes/index.html',
    title: 'Multiple Inboxes — जरूरी Emails हमेशा सामने रखें',
    subtitle: 'Desktop (Web) Gmail में एक ही स्क्रीन पर Drafts, Starred और Important जैसे अलग-अलग Sections बनाना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-filters': {
    tutorialPath: 'tutorials/gmail/gmail-filters/index.html',
    title: 'Gmail Filters — Emails को अपने-आप व्यवस्थित करें',
    subtitle: 'हर महीने आने वाले Bills और Bank Statements पर Filter बनाकर Gmail से अपने-आप Label लगवाना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-block-spam-phishing': {
    tutorialPath: 'tutorials/gmail/block-spam-phishing/index.html',
    title: 'Block, Report Spam व Phishing — सही विकल्प चुनें',
    subtitle: 'अनचाही या संदिग्ध Email आने पर Block, Report Spam और Report Phishing में से सही विकल्प चुनकर सुरक्षित रहना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-snooze-email': {
    tutorialPath: 'tutorials/gmail/snooze-email/index.html',
    title: 'Snooze Email — तय समय पर Email वापस पाएँ',
    subtitle: 'जिस Email का काम कुछ दिन बाद करना हो, उसे Snooze करके सही समय पर फिर से Inbox में सबसे ऊपर पाएँ।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-confidential-mode': {
    tutorialPath: 'tutorials/gmail/confidential-mode/index.html',
    title: 'Confidential Mode — गोपनीय Email सुरक्षित भेजें',
    subtitle: 'Email पर Expiry Time और Passcode लगाकर Forward, Copy, Print व Download को सीमित करना और Access वापस लेना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-undo-send': {
    tutorialPath: 'tutorials/gmail/undo-send/index.html',
    title: 'Undo Send — भेजी हुई Email को कुछ सेकंड में वापस लें',
    subtitle: 'गलत Attachment या गलत Recipient पर Send दब जाने पर कुछ सेकंड के भीतर Email को वापस Draft में लाना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-archive-email': {
    tutorialPath: 'tutorials/gmail/archive-email/index.html',
    title: 'Archive Email — Inbox साफ और Emails सुरक्षित रखें',
    subtitle: 'जानें कि Archive करने से Email Delete नहीं होती, और All Mail से वापस Inbox में कैसे लाएँ।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-email-suggestions-contacts': {
    tutorialPath: 'tutorials/gmail/email-suggestions-contacts/index.html',
    title: 'Email Suggestions व Contacts — सही व्यक्ति को Email भेजें',
    subtitle: 'Google Contacts और Email Suggestions को सही तरह मैनेज करके गलत पते पर Email भेजने से बचें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-conversation-view': {
    tutorialPath: 'tutorials/gmail/conversation-view/index.html',
    title: 'Conversation View — पूरी Email बातचीत एक साथ देखें',
    subtitle: 'एक ही विषय के सभी Replies एक जगह जुड़कर कैसे दिखते हैं, और अपनी पसंद से Conversation View ON या OFF कैसे करें, सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-add-to-tasks': {
    tutorialPath: 'tutorials/gmail/add-to-tasks/index.html',
    title: 'Add to Tasks — Email को काम (Task) में बदलें',
    subtitle: 'जरूरी Email पर Action लेना न भूलें — सीधे Email से Google Task बनाएँ, Due Date सेट करें और समय पर पूरा करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-signature': {
    tutorialPath: 'tutorials/gmail/gmail-signature/index.html',
    title: 'Gmail Signature — हर Email में अपना परिचय अपने-आप जोड़ें',
    subtitle: 'एक बार अपना नाम, पद और संपर्क विवरण सेट करें ताकि Desktop Gmail में हर नई Email Professional दिखे।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-templates': {
    tutorialPath: 'tutorials/gmail/gmail-templates/index.html',
    title: 'Gmail Templates — बार-बार भेजी जाने वाली Emails सेव करें',
    subtitle: 'एक ही जैसा उत्तर बार-बार टाइप करने के बजाय Desktop Gmail में Template सेव करें और 1-Click में उपयोग करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-vacation-responder': {
    tutorialPath: 'tutorials/gmail/vacation-responder/index.html',
    title: 'Vacation Responder — अनुपस्थिति में Auto Reply सेट करें',
    subtitle: 'छुट्टी या Training पर होने पर Gmail से अपने-आप उत्तर (Out of Office Auto Reply) भेजना और सही निजता विकल्प चुनना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-storage': {
    tutorialPath: 'tutorials/gmail/gmail-storage/index.html',
    title: 'Gmail Storage — 15 GB Space कैसे भरती है और खाली कैसे करें',
    subtitle: 'जानें कि Gmail, Google Photos और Google Drive एक ही 15 GB Storage शेयर करते हैं, और बिना पैसे खर्च किए Space कैसे खाली करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-large-files-drive': {
    tutorialPath: 'tutorials/gmail/large-files-drive/index.html',
    title: 'Google Drive से बड़ी Files भेजें (25 MB से ऊपर)',
    subtitle: 'Gmail में 25 MB से बड़ी Presentation, Video या ZIP फाइल भेजने के लिए Compose में Google Drive आइकन का उपयोग करना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-contact-labels': {
    tutorialPath: 'tutorials/gmail/contact-labels/index.html',
    title: 'Contact Labels — पूरे Group को 1-Click में Email भेजें',
    subtitle: 'बार-बार 20-40 लोगों के Email अलग-अलग टाइप करने के बजाय Google Contacts में Label (Group) बनाकर एक साथ Email भेजना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-mute-conversation': {
    tutorialPath: 'tutorials/gmail/mute-conversation/index.html',
    title: 'Mute Conversation — Reply All के शोर को शांत करें',
    subtitle: 'किसी Group Email में लगातार आने वाले "OK", "Noted" जैसे अनावश्यक Replies को Inbox से रोकना और जरूरत पर Unmute करना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-mobile-vs-desktop': {
    tutorialPath: 'tutorials/gmail/mobile-vs-desktop/index.html',
    title: 'Mobile vs Desktop Gmail — कौन-सा फीचर कहाँ मिलेगा?',
    subtitle: 'जानें कि कौन-से Gmail फीचर्स Mobile App में तुरंत मिलते हैं और किन एडवांस सेटिंग्स के लिए Desktop/Web Gmail खोलना जरूरी है।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-delegation': {
    tutorialPath: 'tutorials/gmail/gmail-delegation/index.html',
    title: 'Gmail Delegation — पासवर्ड बताए बिना Gmail एक्सेस दें',
    subtitle: 'अपने सहायक या टीम मेंबर को अपना Gmail पासवर्ड दिए बिना सुरक्षित रूप से Emails पढ़ने और भेजने की अनुमति देना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-forward-as-attachment': {
    tutorialPath: 'tutorials/gmail/forward-as-attachment/index.html',
    title: 'Forward as Attachment — कई Emails एक साथ अटैचमेंट बनाकर भेजें',
    subtitle: '10 अलग-अलग Emails को एक-एक करके Forward करने की झंझट खत्म — सभी को एक ही नई Email में .eml अटैचमेंट बनाकर भेजें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-alias': {
    tutorialPath: 'tutorials/gmail/gmail-alias/index.html',
    title: 'Gmail Alias (+ Addressing) — एक ही इनबॉक्स में कई पहचान बनाएँ',
    subtitle: 'बिना नया अकाउंट बनाए अपने Gmail में + का जादू उपयोग करें और अलग-अलग कामों के लिए अलग Email Address पाएँ।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-offline': {
    tutorialPath: 'tutorials/gmail/offline-gmail/index.html',
    title: 'Offline Gmail — बिना इंटरनेट के भी ईमेल पढ़ें, खोजें और लिखें',
    subtitle: 'सफर में या खराब नेटवर्क के दौरान भी कंप्यूटर पर Gmail चलाना, पुराने ईमेल पढ़ना और ड्राफ्ट लिखना सीखें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
  },
  'gmail-nudges': {
    tutorialPath: 'tutorials/gmail/gmail-nudges/index.html',
    title: 'Gmail Nudges — जरूरी ईमेल का जवाब देना कभी न भूलें',
    subtitle: 'Gmail का स्मार्ट AI असिस्टेंट जो भूली हुई पुरानी Emails को अपने-आप इनबॉक्स के सबसे ऊपर लाकर याद दिलाता है।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-smart-reply-smart-compose': {
    tutorialPath: 'tutorials/gmail/smart-reply-smart-compose/index.html',
    title: 'Smart Reply व Smart Compose — AI से ईमेल टाइपिंग करें सुपरफास्ट',
    subtitle: 'Gmail के दो जादुई AI टूल्स — 1-टैप में पूरा रिप्लाई चुनें और Tab दबाकर अपने अधूरे वाक्य चुटकियों में पूरे करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-multiple-stars': {
    tutorialPath: 'tutorials/gmail/multiple-stars/index.html',
    title: 'Multiple Stars & Colors — ईमेल को रंग-बिरंगे स्टार्स से सजाएँ व प्राथमिकता दें',
    subtitle: 'सिर्फ पीले स्टार से काम नहीं चलता? लाल, हरा, नीला, विस्मयादिबोधक (!) और सवालिया (?) चिह्न वाले स्टार्स से ईमेल छाँटें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-send-and-archive': {
    tutorialPath: 'tutorials/gmail/send-and-archive/index.html',
    title: 'Send & Archive — 1-क्लिक में रिप्लाई भी करें और इनबॉक्स भी साफ रखें',
    subtitle: 'ईमेल का जवाब देने के बाद उसे अलग से Archive करने की जरूरत नहीं — Send & Archive बटन से दोनों काम एक साथ करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-swipe-actions': {
    tutorialPath: 'tutorials/gmail/swipe-actions/index.html',
    title: 'Mobile Swipe Actions — अंगूठे से स्वाइप करें और इनबॉक्स साफ करें',
    subtitle: 'मोबाइल पर ईमेल खोलकर बटन ढूँढने की जरूरत नहीं — बस Left या Right स्वाइप करके ईमेल Archive, Delete या Snooze करें।',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Beginner',
  },
  'gmail-keyboard-shortcuts': {
    tutorialPath: 'tutorials/gmail/keyboard-shortcuts/index.html',
    title: 'Keyboard Shortcuts — माउस छुए बिना रॉकेट की स्पीड से Gmail चलाएँ',
    subtitle: 'सिर्फ एक बटन दबाएँ और ईमेल कंपोज़, रिप्लाई, आर्काइव या डिलीट करें — Desktop उपयोगकर्ताओं के लिए असली सुपरपावर!',
    hasSimulator: false,
    hasQuiz: false,
    hasChallenge: true,
    difficultyBadge: 'Intermediate',
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
