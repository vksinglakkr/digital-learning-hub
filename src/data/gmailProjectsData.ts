export interface GmailProjectCard {
  id: string
  title: string
  subtitle: string
  type: 'project' | 'case-study'
  typeLabel: string
  badgeColor: string
  description: string
  stepsCount: string
  thumbnail: string
  projectUrl: string
  primaryTopicSlug: string
  keyLearnings: string[]
}

export const GMAIL_PROJECT_CARDS: GmailProjectCard[] = [
  {
    id: 'smart-inbox-automation',
    title: 'Smart Inbox & Automation (स्मार्ट इनबॉक्स ऑटोमेशन)',
    subtitle: 'Step-by-Step Hands-on Practical Project',
    type: 'project',
    typeLabel: 'प्रैक्टिकल प्रोजेक्ट (6 Guided Steps)',
    badgeColor: 'bg-teal-600 text-white',
    description: 'बिजली व अन्य जरूरी बिलों को ढूँढ़ने, Bills Label बनाने, Filters द्वारा ऑटोमेशन सेट करने और Stars व Archive से इनबॉक्स को 100% व्यवस्थित करने का संपूर्ण गाइडेड प्रोजेक्ट।',
    stepsCount: '6 गाइडेड स्टेप्स',
    thumbnail: 'tutorials/gmail/gmail-filters/assets/day-9-status-1.png',
    projectUrl: 'tutorials/gmail/projects/smart-inbox/index.html',
    primaryTopicSlug: 'gmail-filters',
    keyLearnings: [
      'Inbox Categories में बिल ढूँढ़ना',
      'Search Operators से सटीक सर्च',
      'Bills Label व स्वचालित Filter बनाना',
      'Stars व Archive से इनबॉक्स साफ़ रखना'
    ],
  },
  {
    id: 'heavy-file-sharing',
    title: 'Digital Document & Heavy File Sharing (हैवी फाइल शेयरिंग)',
    subtitle: 'Large Files & Multi-Document Sharing Project',
    type: 'project',
    typeLabel: 'प्रैक्टिकल प्रोजेक्ट (5 Guided Steps)',
    badgeColor: 'bg-blue-600 text-white',
    description: '25 MB से बड़ी 50 MB प्रेजेंटेशन फाइल को Google Drive द्वारा साझा करने, रिसीपिएंट एक्सेस परमिशन जाँचने और कई महत्वपूर्ण ईमेल्स को एक साथ सुरक्षित अटैचमेंट की तरह भेजने का तरीका।',
    stepsCount: '5 गाइडेड स्टेप्स',
    thumbnail: 'tutorials/gmail/large-files-drive/assets/day-23-status-1.png',
    projectUrl: 'tutorials/gmail/projects/heavy-file-sharing/index.html',
    primaryTopicSlug: 'gmail-large-files-drive',
    keyLearnings: [
      '25 MB अटैचमेंट सीमा का कारण व समाधान',
      'Google Drive लिंक इंसर्शन व एक्सेस परमिशन',
      'Forward as Attachment से मल्टीपल ईमेल शेयरिंग',
      'Confidential Mode द्वारा सुरक्षित शेयरिंग'
    ],
  },
  {
    id: 'office-communication',
    title: 'Professional Office Communication (ऑफिस कम्युनिकेशन वर्कफ़्लो)',
    subtitle: 'Workplace Email & Follow-up Management Project',
    type: 'project',
    typeLabel: 'प्रैक्टिकल प्रोजेक्ट (5 Guided Steps)',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'पेशेवर ईमेल सिग्नेचर तैयार करने, त्वरित रिप्लाई के लिए Templates (Canned Responses) का उपयोग करने, Schedule Send, Undo Send (30s कैंसिलेशन) और Google Tasks/Nudges से टाइमली फॉलो-अप का संपूर्ण वर्कफ़्लो।',
    stepsCount: '5 गाइडेड स्टेप्स',
    thumbnail: 'tutorials/gmail/gmail-signature/assets/day-19-status-1.png',
    projectUrl: 'tutorials/gmail/projects/office-communication/index.html',
    primaryTopicSlug: 'gmail-signature',
    keyLearnings: [
      'प्रोफेशनल ईमेल सिग्नेचर सेटअप',
      'Templates (Canned Responses) का त्वरित उपयोग',
      'Schedule Send व Undo Send (30s कैंसिलेशन)',
      'Google Tasks व Nudges से टाइमली फॉलो-अप'
    ],
  },
  {
    id: 'account-safety',
    title: 'Gmail Safety & Recovery Readiness (सुरक्षा व रिकवरी तैयारी)',
    subtitle: 'Anti-Phishing & Google Account Security Project',
    type: 'project',
    typeLabel: 'प्रैक्टिकल प्रोजेक्ट (5 Guided Steps)',
    badgeColor: 'bg-rose-600 text-white',
    description: 'फर्जी बैंक/KYC ईमेल (Phishing) के संकेतों की तुरंत पहचान, Block vs Spam vs Report Phishing में अंतर, Confidential Mode से संवेदनशील डेटा सुरक्षा, बिना पासवर्ड दिए Delegation और Google Security Checkup।',
    stepsCount: '5 गाइडेड स्टेप्स',
    thumbnail: 'tutorials/gmail/block-spam-phishing/assets/day-10-status-1.png',
    projectUrl: 'tutorials/gmail/projects/account-safety/index.html',
    primaryTopicSlug: 'gmail-block-spam-phishing',
    keyLearnings: [
      'फर्जी बैंक ईमेल (Phishing) के संकेतों की पहचान',
      'Block, Spam व Phishing रिपोर्ट का सही उपयोग',
      'Confidential Mode (पासकोड व एक्सेस रिवोक)',
      'Gmail Delegation व Google 2FA Security Checkup'
    ],
  },
]
