export interface CalendarProjectCard {
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

export const CALENDAR_PROJECT_CARDS: CalendarProjectCard[] = [
  {
    id: 'school-calendar-project',
    title: 'स्कूल व कॉलेज कैलेंडर — खुद बनाकर सीखें',
    subtitle: 'Step-by-Step Hands-on Practical Project',
    type: 'project',
    typeLabel: 'प्रैक्टिकल प्रोजेक्ट (8 Steps + 3 Practice)',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'एक नया स्कूल कैलेंडर बनाएँ, परीक्षा समय सारणी (Exam Schedule), खेल दिवस (Sports Day), अभिभावक बैठक (PTM) और शिक्षक बैठकें व्यवस्थित करें।',
    stepsCount: '8 स्टेप्स + 3 अभ्यास शीट्स',
    thumbnail: 'tutorials/calendar/projects/assets/school-1-overview.png',
    projectUrl: 'tutorials/calendar/projects/school-calendar/index.html',
    primaryTopicSlug: 'create-multiple-calendars',
    keyLearnings: [
      'नया कैलेंडर बनाना व नामकरण',
      'वार्षिक परीक्षा समय सारणी जोड़ना',
      'रंग कोडिंग व रिमाइंडर सेट करना',
      'अभिभावकों व शिक्षकों के साथ साझा करना'
    ],
  },
  {
    id: 'digital-class-calendar-system',
    title: 'डिजिटल क्लास अपॉइंटमेंट व टाइमटेबल सिस्टम',
    subtitle: 'EdTech & Institute Real-life Case Study',
    type: 'case-study',
    typeLabel: 'केस स्टडी (Case Study)',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'कोचिंग या कॉलेज के लिए कोर्स कैलेंडर वितरण, 1-on-1 स्टूडेंट परामर्श स्लॉट बुकिंग और व्हाट्सएप/ईमेल ऑटोमेशन का संपूर्ण मॉडल।',
    stepsCount: '4 इन्फोग्राफिक्स (Problem & Solution)',
    thumbnail: 'tutorials/calendar/projects/assets/digital-class-1-problem-solution.png',
    projectUrl: 'tutorials/calendar/projects/digital-class-calendar/index.html',
    primaryTopicSlug: 'appointment-schedules',
    keyLearnings: [
      'कोर्स टाइमटेबल की पब्लिक शेयरिंग',
      'छात्रों के लिए सेल्फ-सर्विस बुकिंग स्लॉट',
      'डबल-बुकिंग की समस्या का खात्मा',
      'स्वचालित कन्फर्मेशन व गूगल मीट लिंक'
    ],
  },
  {
    id: 'public-appointment-system',
    title: 'पब्लिक अपॉइंटमेंट सिस्टम (DC कुरुक्षेत्र मॉडल)',
    subtitle: 'Citizen Services Educational Case Study',
    type: 'case-study',
    typeLabel: 'शैक्षणिक केस स्टडी (Educational Model)',
    badgeColor: 'bg-amber-600 text-white',
    description: 'नागरिकों को कलेक्ट्रेट व सरकारी कार्यालयों में लंबी कतारों और समय की बर्बादी से बचाने के लिए टोकन व स्लॉट आधारित ऑनलाइन अपॉइंटमेंट सिस्टम का अध्ययन।',
    stepsCount: '2 विस्तृत इन्फोग्राफिक्स (चुनौती व समाधान)',
    thumbnail: 'tutorials/calendar/projects/assets/public-appointment-2-solution-system.png',
    projectUrl: 'tutorials/calendar/projects/public-appointment-system/index.html',
    primaryTopicSlug: 'appointment-schedules',
    keyLearnings: [
      'नागरिकों के समय की बचत व पारदर्शिता',
      'अधिकारियों के दैनिक शेड्यूल का सटीक प्रबंधन',
      'कागजी टोकन के स्थान पर डिजिटल स्लॉट',
      'ई-गवर्नेंस में गूगल कैलेंडर का प्रभावी उपयोग'
    ],
  },
]
