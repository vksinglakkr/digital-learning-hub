export interface CalendarReferencePoster {
  id: string
  title: string
  englishTitle: string
  description: string
  categoryBadge: string
  imagePath: string
  relatedTopicSlug: string
  relatedTopicName: string
}

export const CALENDAR_REFERENCE_POSTERS: CalendarReferencePoster[] = [
  {
    id: 'poster-appendix-a',
    title: 'कंप्यूटर / डेस्कटॉप इंटरफेस गाइड',
    englishTitle: 'Appendix A: Desktop Interface Quick Guide',
    description: 'गूगल कैलेंडर का संपूर्ण वेब इंटरफेस — व्यू स्विचर, साइडबार, मिनी कैलेंडर, सेटिंग्स गियर और कीबोर्ड शॉर्टकट एरिया का त्वरित नक्शा।',
    categoryBadge: 'इंटरफेस संदर्भ (Appendix A)',
    imagePath: 'tutorials/calendar/reference-posters/assets/appendix-a-desktop-interface.png',
    relatedTopicSlug: 'calendar-interface-desktop',
    relatedTopicName: 'Day 01: Desktop Interface',
  },
  {
    id: 'poster-appendix-b',
    title: 'मोबाइल ऐप इंटरफेस गाइड',
    englishTitle: 'Appendix B: Mobile App Interface Guide',
    description: 'एंड्रॉइड और आईफोन ऐप का संपूर्ण लेआउट — शेड्यूल व्यू, फ्लोटिंग (+) बटन, साइड मेन्यू, मल्टीपल अकाउंट स्विचिंग और क्विक नेविगेशन।',
    categoryBadge: 'मोबाइल संदर्भ (Appendix B)',
    imagePath: 'tutorials/calendar/reference-posters/assets/appendix-b-mobile-interface.png',
    relatedTopicSlug: 'calendar-interface-mobile',
    relatedTopicName: 'Day 02: Mobile App Interface',
  },
  {
    id: 'poster-appendix-c',
    title: 'क्विक इवेंट क्रिएशन गाइड',
    englishTitle: 'Appendix C: Quick Event Creation Guide',
    description: 'त्वरित इवेंट पॉपअप स्क्रीन — शीर्षक, समय, अतिथि आमंत्रण, गूगल मीट वीडियो कॉल और लोकेशन जोड़ने के सभी मुख्य विकल्प।',
    categoryBadge: 'इवेंट क्रिएशन (Appendix C)',
    imagePath: 'tutorials/calendar/reference-posters/assets/appendix-c-create-event.png',
    relatedTopicSlug: 'create-event',
    relatedTopicName: 'Day 03: Create First Event',
  },
  {
    id: 'poster-appendix-d',
    title: 'विस्तृत इवेंट सेटिंग्स व ऑप्शन्स',
    englishTitle: 'Appendix D: Event Details & Options Screen',
    description: 'फुल-स्क्रीन इवेंट एडिटर — नोटिफिकेशन टाइमिंग, रिकरेंस नियम (Repeat), डिस्क्रिप्शन, अटैचमेंट और विजिबिलिटी सेटिंग्स।',
    categoryBadge: 'इवेंट सेटिंग्स (Appendix D)',
    imagePath: 'tutorials/calendar/reference-posters/assets/appendix-d-event-details.png',
    relatedTopicSlug: 'create-event',
    relatedTopicName: 'Day 03: Event Details',
  },
  {
    id: 'poster-appendix-e',
    title: 'छुपे हुए फीचर्स व शॉर्टकट्स',
    englishTitle: 'Appendix E: Calendar Hidden Features & Shortcuts',
    description: 'डेस्कटॉप कीबोर्ड शॉर्टकट (D, W, M, C, /), वर्ल्ड क्लॉक, टाइम ज़ोन सपोर्ट और पावर-यूज़र टूल्स का त्वरित संदर्भ चार्ट।',
    categoryBadge: 'पावर फीचर्स (Appendix E)',
    imagePath: 'tutorials/calendar/reference-posters/assets/appendix-e-hidden-features.png',
    relatedTopicSlug: 'keyboard-shortcuts',
    relatedTopicName: 'Day 26: Keyboard Shortcuts',
  },
  {
    id: 'poster-how-to-use',
    title: 'इस ट्यूटोरियल गाइड का उपयोग कैसे करें',
    englishTitle: 'How To Use This Tutorial Guide',
    description: '30-दिवसीय कैलेंडर मास्टरी सीखने की सही पद्धति — रंग कोडिंग, सिंबल अर्थ, चरणबद्ध अभ्यास और नोट्स बनाने का व्यावहारिक तरीका।',
    categoryBadge: 'अध्ययन गाइड (Guide)',
    imagePath: 'tutorials/calendar/reference-posters/assets/how-to-use-tutorial.png',
    relatedTopicSlug: 'calendar-interface-desktop',
    relatedTopicName: 'Day 01: Getting Started',
  },
  {
    id: 'poster-why-use',
    title: 'गूगल कैलेंडर क्यों सीखना आवश्यक है',
    englishTitle: 'Why You Should Master Google Calendar',
    description: 'समय प्रबंधन, तनाव मुक्ति, समय पर उपस्थिति, काम और निजी जीवन के संतुलन के लिए डिजिटल कैलेंडर के 10 शक्तिशाली लाभ।',
    categoryBadge: 'प्रेरणा व लाभ (Why Follow)',
    imagePath: 'tutorials/calendar/reference-posters/assets/why-use-google-calendar.png',
    relatedTopicSlug: 'calendar-interface-desktop',
    relatedTopicName: 'Day 01: Benefits of Calendar',
  },
  {
    id: 'poster-topic-roadmap',
    title: 'विषयवार 30-दिवसीय लर्निंग रोडमैप',
    englishTitle: 'Topic-wise 30-Day Learning Roadmap',
    description: 'फाउंडेशन से लेकर एडवांस ऑटोमेशन तक 30 दिनों का व्यवस्थित विषय-वार मानचित्र — अपनी प्रगति ट्रैक करें और अगला लक्ष्य तय करें।',
    categoryBadge: 'लर्निंग रोडमैप (Roadmap)',
    imagePath: 'tutorials/calendar/reference-posters/assets/topic-wise-roadmap.png',
    relatedTopicSlug: 'google-ecosystem',
    relatedTopicName: 'Day 30: Google Ecosystem',
  },
]
