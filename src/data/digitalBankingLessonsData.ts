export interface DigitalBankingLesson {
  id: string
  sequenceNumber: number
  hindiTitle: string
  englishTitle: string
  category: string
  shortDescription: string
  realLifeProblem: string
  whatYouWillLearn: string[]
  simpleExplanation: string
  safePracticalActivity: string
  keyTakeaway: string
  infographicImages: string[]
  relatedLearningComponents: {
    scamIds?: string[]
    habitIds?: string[]
    emergencyGuideIds?: string[]
    projectIds?: string[]
    posterIds?: string[]
    lessonIds?: string[]
  }
  updatedSafetyNote?: string
}

export interface DigitalBankingPoster {
  id: string
  sequenceNumber: number
  title: string
  englishTitle: string
  categoryBadge: string
  description: string
  imagePath: string
  keyHighlights: string[]
  relatedLessonId: string
}

export interface DigitalBankingBookend {
  id: string
  sequenceNumber: number
  title: string
  englishTitle: string
  role: 'Cover' | 'Index' | 'Manifesto' | 'AuthorProfile'
  imagePath: string
  description: string
}

export const DIGITAL_BANKING_BOOKENDS: DigitalBankingBookend[] = [
  {
    id: 'bookend-cover',
    sequenceNumber: 1,
    title: 'डिजिटल बैंकिंग और सुरक्षा गाइड — मुख्य पृष्ठ',
    englishTitle: 'Cover Page: Digital Banking & Safety Guide',
    role: 'Cover',
    imagePath: '/tutorials/digital-banking/assets/01-cover-page.png',
    description: 'वरिष्ठ नागरिकों और नए डिजिटल उपयोगकर्ताओं के लिए सरल, प्रामाणिक और आत्मविश्वास जगाने वाली संपूर्ण मार्गदर्शिका। लेखक: श्री विनोद सिंगला (भूतपूर्व वरिष्ठ निदेशक एवं डीआईओ, एनआईसी, कुरुक्षेत्र)।'
  },
  {
    id: 'bookend-index',
    sequenceNumber: 2,
    title: 'मास्टर इंडेक्स — 5-स्तंभ शैक्षणिक रूपरेखा',
    englishTitle: 'Master Index: 5-Pillar Curriculum Framework',
    role: 'Index',
    imagePath: '/tutorials/digital-banking/assets/02-master-index.png',
    description: 'सीखें • समझें • सुरक्षित रहें — 5 प्रमुख स्तंभ: डर दूर करें, बैंकिंग व बचत, डिजिटल भुगतान, 10 आदतें, और साइबर अपराधों से बचाव।'
  },
  {
    id: 'bookend-manifesto',
    sequenceNumber: 3,
    title: 'शैक्षणिक घोषणापत्र — डिजिटल दुनिया मुश्किल नहीं है',
    englishTitle: 'Educational Manifesto: Knowledge is Protection',
    role: 'Manifesto',
    imagePath: '/tutorials/digital-banking/assets/03-digital-banking-and-safety-guide.png',
    description: 'सही जानकारी और थोड़ी सावधानी ही सबसे बड़ी सुरक्षा है। वरिष्ठ नागरिकों को आत्मविश्वास के साथ डिजिटल तकनीक अपनाने का प्रेरक संदेश।'
  },
  {
    id: 'bookend-profile',
    sequenceNumber: 72,
    title: 'आभार, लेखक परिचय एवं राष्ट्रीय हेल्पलाइन',
    englishTitle: 'Author Dedication, Profile & National Helplines',
    role: 'AuthorProfile',
    imagePath: '/tutorials/digital-banking/assets/72-back-page.png',
    description: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) में 34 वर्षों की सेवा के उपरांत सेवानिवृत्ति के बाद समाज और वरिष्ठ नागरिकों के डिजिटल सशक्तिकरण हेतु समर्पित मार्गदर्शिका।'
  }
];

export const DIGITAL_BANKING_CORE_LESSONS: DigitalBankingLesson[] = [
  {
    id: 'lesson-01',
    sequenceNumber: 1,
    hindiTitle: 'डिजिटल बैंकिंग का डर कैसे भगाएं? (वस्तु विनिमय से UPI तक)',
    englishTitle: 'Overcoming the Fear of Digital Banking: Evolution from Barter to UPI',
    category: '1. Banking का डर दूर करें',
    shortDescription: 'मन के दो सबसे बड़े डर — "मुझसे कोई गलती हो जाएगी" और "मोबाइल खो गया तो?" — को समझकर सही आदत से दूर करें।',
    realLifeProblem: 'कई वरिष्ठ नागरिक मोबाइल से पैसे भेजने या बिल भरने से इसलिए डरते हैं कि कहीं एक गलत बटन दबाने से जीवनभर की पेंशन न कट जाए या फोन चोरी होने पर बैंक खाली न हो जाए।',
    whatYouWillLearn: [
      'लेनदेन के 9-चरणीय इतिहास को समझना (Barter से UPI तक)',
      'नकदी (Cash) रखने के वास्तविक जोखिम बनाम डिजिटल सुरक्षा की तुलना',
      'गलत बटन दबाने के डर का समाधान: हर भुगतान पर दोहरी पुष्टि (Confirmation & PIN)',
      'फोन गुम होने पर बैंक सुरक्षित रखने की पूर्व-तैयारी'
    ],
    simpleExplanation: 'जैसे हमने चेक लिखना या ATM से पैसे निकालना सीखा था, वैसे ही डिजिटल बैंकिंग भी एक स्वाभाविक कदम है। UPI में जब तक आप अपना गोपनीय 4 या 6 अंकों का UPI PIN नहीं डालते, आपके खाते से एक रुपया भी नहीं कट सकता। फोन लॉक और सिम लॉक लगाने के बाद फोन गुम होने पर भी आपका बैंक पूरी तरह सुरक्षित रहता है।',
    safePracticalActivity: 'अपने फोन की Settings खोलें → Display या Lock Screen चुनें → "Screen Timeout" को 30 सेकंड पर सेट करें। यह आपके फोन की पहली और सबसे सरल सुरक्षा ढाल है।',
    keyTakeaway: 'डिजिटल तकनीक में गलती रोकने के लिए सुरक्षा ताले (PIN और पासवर्ड) होते हैं। सावधानी सीखने से डर हमेशा के लिए दूर हो जाता है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/04-apprehension-in-using-digital-banking.png',
      '/tutorials/digital-banking/assets/05-payments-of-old-methods.png',
      '/tutorials/digital-banking/assets/06-payment-old-methods-and-fear.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-02', 'habit-07', 'habit-08'],
      emergencyGuideIds: ['emergency-01', 'emergency-02'],
      projectIds: ['project-safe-upi-setup', 'project-lost-phone-lockdown']
    }
  },
  {
    id: 'lesson-02',
    sequenceNumber: 2,
    hindiTitle: 'बैंक के प्रकार और सरकारी सुरक्षा नियम (RBI व DICGC बीमा)',
    englishTitle: 'Types of Banks & Regulatory Protection (RBI & DICGC Safety)',
    category: '2. Banking, Savings & Schemes',
    shortDescription: 'राष्ट्रीयकृत (PSU), निजी, सहकारी और क्षेत्रीय ग्रामीण बैंकों में क्या अंतर है और आपकी जमा पूंजी पर सरकारी गारंटी कैसे काम करती है।',
    realLifeProblem: 'अखबारों में किसी सहकारी बैंक पर पाबंदी की खबर पढ़कर बुजुर्ग घबरा जाते हैं कि उनका बैंक कितना सुरक्षित है और उनका पैसा सुरक्षित हाथों में है या नहीं।',
    whatYouWillLearn: [
      'भारतीय रिजर्व बैंक (RBI) की नियामक भूमिका और बैंकों का वर्गीकरण',
      'DICGC के तहत प्रत्येक बैंक में ₹5 लाख तक की मूलधन व ब्याज जमा सुरक्षा गारंटी',
      'सहकारी बैंक (Co-operative) बनाम अनुसूचित वाणिज्यिक बैंकों के सुरक्षा नियम',
      'बैंक में शिकायत निवारण और RBI बैंकिंग लोकपाल (Banking Ombudsman) प्रणाली'
    ],
    simpleExplanation: 'भारत में सभी बैंकों का नियमन भारतीय रिजर्व बैंक (RBI) करता है। भारत सरकार के कानून के तहत DICGC प्रत्येक जमाकर्ता के खाते (बचत, चालू, FD, RD) में अधिकतम ₹5 लाख तक की राशि का पूर्ण बीमा प्रदान करता है। यदि आप अपनी बचत को एक से अधिक अनुसूचित बैंकों में विभाजित रखते हैं, तो आपकी पूरी जमा पूंजी सुरक्षित रहती है।',
    safePracticalActivity: 'अपनी बैंक पासबुक या चेकबुक के पहले पन्ने पर देखें कि आपकी बैंक शाखा का नाम और IFSC कोड क्या है। गूगल पर अपने बैंक का नाम लिखकर देखें कि क्या वह "Scheduled Commercial Bank" की श्रेणी में है।',
    keyTakeaway: 'सरकारी नियमों के तहत आपका ₹5 लाख तक का बैंक डिपॉजिट पूरी तरह बीमित होता है। बड़ी बचत को अलग-अलग राष्ट्रीयकृत या बड़े वाणिज्यिक बैंकों में रखना समझदारी है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/08-types-of-banks.png',
      '/tutorials/digital-banking/assets/24-banking-system.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-04', 'habit-08'],
      posterIds: ['poster-04']
    },
    updatedSafetyNote: 'DICGC जमा बीमा सीमा प्रति बैंक प्रति जमाकर्ता ₹5,00,000 है। बैंक के आधिकारिक पोर्टल पर हमेशा RBI लाइसेंस और लोकपाल का विवरण अवश्य जांचें।'
  },
  {
    id: 'lesson-03',
    sequenceNumber: 3,
    hindiTitle: 'बैंक खाता कितने प्रकार के होते हैं? (वरिष्ठ नागरिक खाता और नियम)',
    englishTitle: 'Types of Bank Accounts: Senior Citizen Accounts and Requirements',
    category: '2. Banking, Savings & Schemes',
    shortDescription: 'बचत खाता (Savings), चालू खाता (Current), वरिष्ठ नागरिक खाता, वेतन खाता और जन-धन खाते के उद्देश्य और न्यूनतम बैलेंस नियम।',
    realLifeProblem: 'वरिष्ठ नागरिक अक्सर साधारण बचत खाते में ही पेंशन रखते हैं, जिससे उन्हें वरिष्ठ नागरिकों के लिए मिलने वाले अतिरिक्त ब्याज और विशेष सुविधाओं का लाभ नहीं मिल पाता।',
    whatYouWillLearn: [
      'बचत खाता (Savings A/C) बनाम चालू खाता (Current A/C) का मुख्य अंतर',
      'वरिष्ठ नागरिक बचत खाते (Senior Citizen Savings Account) के विशेष लाभ और रियायतें',
      'न्यूनतम औसत शेष राशि (MAB) के नियम और पेनाल्टी से बचाव',
      'नॉमिनेशन (Nomination) दर्ज कराने का अत्यधिक महत्व'
    ],
    simpleExplanation: 'बचत खाता व्यक्तिगत बचत और दैनिक खर्च के लिए होता है जिस पर बैंक ब्याज देता है। 60 वर्ष या उससे अधिक आयु के व्यक्तियों के लिए अधिकांश बैंक "Senior Citizen Account" प्रदान करते हैं जिसमें शाखा में प्राथमिकता, अतिरिक्त ब्याज और निःशुल्क सेवाएं मिलती हैं। हर खाते में नॉमिनी (उत्तराधिकारी) का नाम दर्ज होना अत्यंत आवश्यक है।',
    safePracticalActivity: 'अपनी बैंक पासबुक का पहला पन्ना खोलें और जांचें कि क्या उसमें "Nominee Registered: YES" लिखा है। यदि नहीं लिखा है, तो बैंक शाखा जाकर फॉर्म DA-1 भरकर नॉमिनी दर्ज कराएं।',
    keyTakeaway: '60 वर्ष की आयु के बाद अपने खाते को वरिष्ठ नागरिक बचत खाते में बदलवाएं और नॉमिनी का नाम हमेशा अपडेट रखें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/09-types-of-bank-accounts.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-08'],
      lessonIds: ['lesson-04']
    }
  },
  {
    id: 'lesson-04',
    sequenceNumber: 4,
    hindiTitle: 'बचत की विभिन्न योजनाएं, ब्याज और टैक्स नियम (FD, RD, SCSS, PPF)',
    englishTitle: 'Savings Schemes & Tax Rules: FD, RD, SCSS, POMIS, PPF',
    category: '2. Banking, Savings & Schemes',
    shortDescription: 'सावधि जमा (FD), आवर्ती जमा (RD), वरिष्ठ नागरिक बचत योजना (SCSS), डाकघर मासिक आय (POMIS) और टैक्स छूट का संपूर्ण विवरण।',
    realLifeProblem: 'पेंशन और सेवानिवृत्ति ग्रेच्युटी की पूंजी को सुरक्षित रखते हुए नियमित मासिक आय कैसे प्राप्त की जाए और आयकर अधिनियम के तहत छूट कैसे ली जाए।',
    whatYouWillLearn: [
      'FD (सावधि जमा) और RD (आवर्ती जमा) में अंतर और वरिष्ठ नागरिकों को 0.50% अतिरिक्त ब्याज',
      'वरिष्ठ नागरिक बचत योजना (SCSS) के नियम, अधिकतम सीमा (₹30 लाख) और त्रैमासिक ब्याज',
      'डाकघर मासिक आय योजना (POMIS) से नियमित घरेलू खर्च चलाना',
      'आयकर की धारा 80C और 80TTB (वरिष्ठ नागरिकों के लिए ₹50,000 तक ब्याज पर टैक्स छूट)'
    ],
    simpleExplanation: 'वरिष्ठ नागरिकों के लिए पूंजी की सुरक्षा पहली प्राथमिकता है। SCSS (सीनियर सिटीजन सेविंग्स स्कीम) भारत सरकार की सर्वोच्च सुरक्षित योजना है जिसमें हर तिमाही ब्याज सीधे खाते में आता है। धारा 80TTB के तहत बैंक व पोस्ट ऑफिस ब्याज आय पर वरिष्ठ नागरिकों को सालाना ₹50,000 तक कोई टैक्स नहीं देना होता (फॉर्म 15H जमा करने पर TDS नहीं कटता)।',
    safePracticalActivity: 'अपने बैंक स्टेटमेंट में देखें कि क्या पिछले वित्तीय वर्ष में आपकी ब्याज आय पर बैंक ने TDS काटा है। यदि आपकी कुल आय टैक्स सीमा से कम है, तो बैंक में जाकर फॉर्म 15H जमा करने का समय नोट करें।',
    keyTakeaway: 'सरकारी गारंटी वाली योजनाओं (SCSS/POMIS/FD) में पूंजी सुरक्षित रहती है। अनधिकृत पोंजी स्कीमों या अज्ञात प्राइवेट फाइनेंस कंपनियों के भारी ब्याज के लालच में कभी न आएं।',
    infographicImages: [
      '/tutorials/digital-banking/assets/10-types-of-savings.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-09'],
      habitIds: ['habit-06']
    },
    updatedSafetyNote: 'लघु बचत योजनाओं (SCSS, POMIS) की ब्याज दरें भारत सरकार के वित्त मंत्रालय द्वारा हर तिमाही संशोधित की जाती हैं। निवेश से पूर्व वर्तमान तिमाही की आधिकारिक दरें अवश्य जांचें।'
  },
  {
    id: 'lesson-05',
    sequenceNumber: 5,
    hindiTitle: 'लोन (ऋण) के प्रकार और सावधानियां (सुरक्षित vs असुरक्षित ऋण)',
    englishTitle: 'Types of Loans & Safety Rules: Secured vs Unsecured Loans',
    category: '2. Banking, Savings & Schemes',
    shortDescription: 'होम लोन, पर्सनल लोन, गोल्ड लोन, पेंशनर लोन के नियम और ऑनलाइन इंस्टेंट लोन ऐप के जालसाजी से बचने के तरीके।',
    realLifeProblem: 'आपातकालीन पैसे की जरूरत पड़ने पर इंटरनेट या SMS पर आने वाले "बिना दस्तावेज के 5 मिनट में ₹1 लाख लोन" के विज्ञापन में फंसकर लोग ब्लैकमेलिंग का शिकार हो जाते हैं।',
    whatYouWillLearn: [
      'सुरक्षित ऋण (Secured Loan जैसे गोल्ड लोन, होम लोन) बनाम असुरक्षित ऋण (Personal Loan)',
      'पेंशनभोगियों के लिए बैंकों का विशेष "Pensioner Loan" और उसकी न्यूनतम ब्याज दरें',
      'प्रोसेसिंग फीस, फोरक्लोजर चार्ज और छिपे हुए शुल्कों की जांच',
      'अवैध मोबाइल लोन ऐप और RBI पंजीकृत NBFC की पहचान कैसे करें'
    ],
    simpleExplanation: 'लोन हमेशा केवल RBI से मान्यता प्राप्त अनुसूचित बैंकों या पंजीकृत NBFC से ही लेना चाहिए। वैध बैंक आपके आधार, पैन और आय प्रमाण की जांच के बाद ही लोन स्वीकृत करते हैं। व्हाट्सएप या एसएमएस पर मिलने वाले चीनी/अवैध इंस्टेंट लोन ऐप्स फोन के कॉन्टैक्ट्स और तस्वीरें चुराकर ब्लैकमेल करते हैं।',
    safePracticalActivity: 'यदि आपको कभी लोन की जरूरत हो, तो अपने उस बैंक की शाखा में जाएं जहां आपकी पेंशन या बचत खाता है। वहां के लोन अधिकारी से "Pensioner Loan" के दस्तावेज और EMI चार्ट समझें।',
    keyTakeaway: 'किसी भी अज्ञात मोबाइल ऐप से लोन न लें। पेंशनभोगियों के लिए सरकारी बैंकों का पेंशनर लोन सबसे कम ब्याज पर और 100% सुरक्षित होता है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/11-type-of-loans.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-01'],
      habitIds: ['habit-05', 'habit-09']
    },
    updatedSafetyNote: 'केवल RBI की आधिकारिक वेबसाइट (`rbi.org.in`) पर सूचीबद्ध पंजीकृत NBFC और बैंकों से ही ऋण लें। किसी भी ऐप को अपने संपर्कों (Contacts) और गैलरी का एक्सेस न दें।'
  },
  {
    id: 'lesson-06',
    sequenceNumber: 6,
    hindiTitle: 'बैंक ड्राफ्ट (DD) और सरकारी चालान (ऑफलाइन से ऑनलाइन प्रक्रिया)',
    englishTitle: 'Bank Draft (DD) & Government Challans: Offline and Online Process',
    category: '2. Banking, Savings & Schemes',
    shortDescription: 'डिमांड ड्राफ्ट (DD) क्यों नहीं बाउंस होता, इसे कैसे बनवाएं और कोर्ट फीस या रजिस्ट्री हेतु सरकारी चालान का ऑनलाइन भुगतान कैसे करें।',
    realLifeProblem: 'मकान की रजिस्ट्री, कोर्ट केस या सरकारी संस्थान में फीस जमा करने के लिए डीडी या ई-चालान मांगते हैं, जिससे वरिष्ठ नागरिकों को घंटों कतार में लगना पड़ता है।',
    whatYouWillLearn: [
      'डिमांड ड्राफ्ट (DD) और साधारण चेक में अंतर (डीडी पहले से भुगतान की गारंटी है)',
      'बैंक शाखा में जाकर डीडी बनवाने के 6 आसान चरण और कमीशन दरें',
      'सरकारी ई-चालान (CRN - Challan Reference Number) का अर्थ',
      'इंटरनेट बैंकिंग या UPI से घर बैठे सरकारी चालान का भुगतान और रसीद डाउनलोड करना'
    ],
    simpleExplanation: 'चेक बाउंस हो सकता है लेकिन बैंक ड्राफ्ट कभी बाउंस नहीं होता क्योंकि इसका पैसा बैंक पहले ही आपके खाते से काट लेता है। आज अधिकांश सरकारी विभाग (जैसे स्टांप शुल्क, म्युनिसिपल टैक्स, बिजली चालान) ई-चालान प्रणाली पर काम करते हैं। आप बैंक शाखा में जाने के बजाय अपने घर बैठे नेट बैंकिंग से सीधे चालान भर सकते हैं।',
    safePracticalActivity: 'अपने किसी पुराने सरकारी चालान या संपत्ति कर की रसीद पर "Challan Number / CRN" और "Bank Transaction Reference (CIN)" को पहचानें।',
    keyTakeaway: 'डीडी और ई-चालान सरकारी व कानूनी लेन-देन में सबसे भरोसेमंद दस्तावेज हैं। ऑनलाइन चालान भरने के बाद हमेशा PDF रसीद डाउनलोड कर प्रिंट निकालें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/12-bank-draft.png',
      '/tutorials/digital-banking/assets/14-government-challan.png'
    ],
    relatedLearningComponents: {
      posterIds: ['poster-02'],
      lessonIds: ['lesson-08']
    }
  },
  {
    id: 'lesson-07',
    sequenceNumber: 7,
    hindiTitle: 'डिजिटल वॉलेट्स और पॉकेट मनी सिस्टम (सुरक्षित छोटे भुगतान)',
    englishTitle: 'Digital Wallets & Pocket Money: Safe Small Daily Payments',
    category: '3. Digital Payments & UPI',
    shortDescription: 'Paytm, Amazon Pay जैसे डिजिटल वॉलेट्स कैसे काम करते हैं और बच्चों या घरेलू खर्च के लिए सुरक्षित सीमा कैसे बनाएं।',
    realLifeProblem: 'दुकानदार या सब्जी वाले को ₹20–₹50 का भुगतान करते समय मुख्य बैंक खाता लिंक होने से खाता खाली होने का डर बना रहता है।',
    whatYouWillLearn: [
      'डिजिटल वॉलेट (Prepaid Wallet) और सीधे बैंक खाते में क्या अंतर है',
      'वॉलेट में महीने का निश्चित बजट (जैसे ₹1,000–₹2,000) ट्रांसफर करने का तरीका',
      'बच्चों को डिजिटल पॉकेट मनी देने का सुरक्षित तरीका (मुख्य खाते से पूरी तरह अलग)',
      'वॉलेट से छोटे भुगतान करने पर मुख्य बैंक स्टेटमेंट का साफ़-सुथरा रहना'
    ],
    simpleExplanation: 'डिजिटल वॉलेट एक अलग डिजिटल पर्स की तरह है। इसमें आप अपने बैंक से केवल ₹500 या ₹1,000 डालते हैं। यदि आप किसी चाय वाले या किराना दुकान पर वॉलेट से भुगतान करते हैं, तो कोई भी व्यक्ति आपके मुख्य बैंक खाते तक नहीं पहुँच सकता। यदि वॉलेट में पैसे खत्म हो जाएं तो और नहीं कट सकते।',
    safePracticalActivity: 'अपने फोन में यदि कोई UPI ऐप (Paytm या PhonePe) है, तो उसमें "Wallet" विकल्प खोलकर देखें कि आपका वर्तमान वॉलेट बैलेंस कितना है।',
    keyTakeaway: 'दैनिक छोटे लेन-देन के लिए डिजिटल वॉलेट एक मजबूत सुरक्षा दीवार (Firewall) का काम करता है जो आपके जीवनभर की बचत को सुरक्षित रखता है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/15-difference-between-digital-wallet-and-pocket-money.png',
      '/tutorials/digital-banking/assets/17-digital-wallets.png',
      '/tutorials/digital-banking/assets/27-paytm-pocket-money.png',
      '/tutorials/digital-banking/assets/29-paytm-wallet.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-08'],
      projectIds: ['project-safe-upi-setup']
    }
  },
  {
    id: 'lesson-08',
    sequenceNumber: 8,
    hindiTitle: 'नेट बैंकिंग — घर बैठे सुरक्षित उपयोग (पंजीकरण, लॉगिन और सुरक्षा)',
    englishTitle: 'Net Banking: Safe Usage from Home (Registration, Login & Security)',
    category: '3. Digital Payments & UPI',
    shortDescription: 'कंप्यूटर या लैपटॉप पर बैंक की आधिकारिक वेबसाइट से सुरक्षित लॉगिन, स्टेटमेंट देखना और FD बनाने का तरीका।',
    realLifeProblem: 'पासबुक प्रिंट कराने, खाता विवरण देखने या नई FD बनवाने के लिए बुजुर्गों को भरी दोपहरी या सर्दी में बैंक शाखा के चक्कर लगाने पड़ते हैं।',
    whatYouWillLearn: [
      'नेट बैंकिंग यूजर आईडी और लॉगिन पासवर्ड सेट करने का तरीका',
      'आधिकारिक वेबसाइट की पहचान (ब्राउज़र में सही URL और बैंक डोमेन)',
      'घर बैठे खाता विवरण (Statement) डाउनलोड करना और ब्याज प्रमाणपत्र लेना',
      'पब्लिक साइबर कैफे या साझा कंप्यूटर पर नेट बैंकिंग कभी न खोलने का नियम'
    ],
    simpleExplanation: 'नेट बैंकिंग आपके बैंक की पूरी शाखा को आपके कंप्यूटर पर ले आती है। आप घर बैठे अपनी पासबुक देख सकते हैं, पैसे ट्रांसफर कर सकते हैं और नई FD खोल सकते हैं। बैंक आपको दो पासवर्ड देता है: एक लॉगिन पासवर्ड (खाता देखने के लिए) और दूसरा ट्रांजैक्शन पासवर्ड (पैसे भेजने के लिए)। इसके अतिरिक्त हर लॉगिन पर आपके फोन पर SMS OTP आता है।',
    safePracticalActivity: 'अपने कंप्यूटर के वेब ब्राउज़र में अपने बैंक का नाम लिखें। सर्च रिजल्ट में देखें कि क्या URL के अंत में `.bank.in` या `.sbi` या आधिकारिक बैंक का नाम है। कभी भी पहले "Sponsored Ad" वाले लिंक पर क्लिक न करें।',
    keyTakeaway: 'नेट बैंकिंग से बैंक शाखा जाने की भागदौड़ खत्म हो जाती है। अपना पासवर्ड कभी किसी डायरी में लिखकर फोन के साथ न रखें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/16-net-banking.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-10'],
      habitIds: ['habit-01', 'habit-03', 'habit-04'],
      emergencyGuideIds: ['emergency-01']
    },
    updatedSafetyNote: 'नेट बैंकिंग हमेशा केवल अपने निजी कंप्यूटर या फोन पर ही उपयोग करें। किसी होटल, कैफे या मित्र के कंप्यूटर पर नेट बैंकिंग लॉगिन करने से बचें। केवल https:// होना पर्याप्त नहीं है; बैंक के सही डोमेन की वर्तनी अवश्य जांचें।'
  },
  {
    id: 'lesson-09',
    sequenceNumber: 9,
    hindiTitle: 'UPI सीखें — शुरुआत से सुरक्षित भुगतान तक',
    englishTitle: 'UPI Masterclass: Setup, PIN, QR Codes & Safe Payment Rules',
    category: '3. Digital Payments & UPI',
    shortDescription: 'UPI कैसे काम करता है, पैसे भेजने और पाने के नियम, और Google Pay में फिक्स अमाउंट QR कोड बनाने की विधि।',
    realLifeProblem: 'दुकान पर QR कोड स्कैन करते समय बुजुर्ग डरते हैं कि गलत राशि टाइप न हो जाए या पैसे पाने के लिए कोई उन्हें UPI PIN डालने को न कह दे।',
    whatYouWillLearn: [
      'UPI क्या है और यह 24×7 तुरंत पैसे कैसे पहुंचाता है',
      'सर्वोच्च सुनहरा नियम: पैसे प्राप्त (Receive) करने के लिए कभी UPI PIN की आवश्यकता नहीं होती',
      'दुकान पर QR कोड स्कैन करने के बाद मर्चेंट का नाम और राशि मिलाने का तरीका',
      'Google Pay में फिक्स अमाउंट QR कोड बनाकर सुरक्षित पैसे प्राप्त करना'
    ],
    simpleExplanation: 'UPI (Unified Payments Interface) भारत सरकार के NPCI द्वारा बनाया गया दुनिया का सबसे सुरक्षित और तेज भुगतान माध्यम है। जब आप किसी को पैसे भेजते हैं, तभी आपको अपना गोपनीय UPI PIN डालना होता है। यदि कोई व्यक्ति कहे कि "मैं आपको पेंशन/रिफंड भेज रहा हूँ, अपना पिन डालिए" — तो वह 100% धोखेबाज है!',
    safePracticalActivity: 'अपना Google Pay या PhonePe ऐप खोलें। अपनी प्रोफाइल फोटो पर टैप करें और अपना "My QR Code" देखें। समझें कि यह केवल पैसे प्राप्त करने का साधन है और इसे देखने के लिए किसी पिन की जरूरत नहीं होती।',
    keyTakeaway: 'याद रखें: पिन मतलब पैसे का जाना (Debit)। पैसे आने (Credit) के लिए कभी पिन नहीं लगता।',
    infographicImages: [
      '/tutorials/digital-banking/assets/18-upi.png',
      '/tutorials/digital-banking/assets/28-fix-amount-qr-code.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-04', 'scam-11'],
      habitIds: ['habit-01', 'habit-03', 'habit-08'],
      emergencyGuideIds: ['emergency-01', 'emergency-07'],
      projectIds: ['project-safe-upi-setup']
    },
    updatedSafetyNote: 'NPCI के दिशानिर्देशों के तहत सामान्य व्यक्ति-से-व्यक्ति (P2P) लेनदेन की दैनिक सीमा ₹1 लाख है। अस्पताल और शिक्षण संस्थानों के लिए यह सीमा ₹5 लाख तक मान्य है।'
  },
  {
    id: 'lesson-10',
    sequenceNumber: 10,
    hindiTitle: 'नियमित बिल भुगतान (बिजली, पानी, गैस, मोबाइल रिचार्ज)',
    englishTitle: 'Utility Bill Payments: Electricity, Water, Gas & Mobile Recharges',
    category: '3. Digital Payments & UPI',
    shortDescription: 'हर महीने बिजली, पानी, LPG गैस और मोबाइल बिलों का घर बैठे सुरक्षित भुगतान और स्वचालित रसीद प्राप्त करना।',
    realLifeProblem: 'हर महीने बिजली के बिल या पानी के बिल की अंतिम तिथि से पहले बिजली दफ्तर की कतार में लगना और रसीद खो जाने पर दोबारा बिल आने का डर।',
    whatYouWillLearn: [
      'BBPS (Bharat Bill Payment System) के जरिए सभी सरकारी बिलों का एक जगह भुगतान',
      'बिजली बिल में कंज्यूमर नंबर (Account ID) जोड़ना और देय राशि की स्वचालित जांच',
      'भुगतान के बाद 100% वैध डिजिटल रसीद (Transaction Reference Number) सहेजना',
      'गलत बिजली बिल भुगतान होने पर समाधान'
    ],
    simpleExplanation: 'भारत बिल पे (BBPS) एक केंद्रीकृत सरकारी प्रणाली है। जब आप अपने UPI ऐप (GPay, PhonePe, Paytm) में अपना बिजली खाता संख्या डालते हैं, तो बिल की सही राशि और उपभोक्ता का नाम स्क्रीन पर आ जाता है। भुगतान होते ही सरकारी विभाग को तुरंत पुष्टि मिल जाती है और आपको अधिकृत रसीद मिलती है जिसे आप WhatsApp पर भी सहेज सकते हैं।',
    safePracticalActivity: 'अपने घर का बिजली बिल लें। उसमें "Consumer Number / Account ID" ढूंढें। अपने UPI ऐप में "Electricity" सेक्शन खोलकर अपने राज्य का बोर्ड चुनें और नंबर डालकर देखें कि क्या स्क्रीन पर आपका ही नाम और सही राशि दिख रही है (बिना भुगतान किए बैक करें)।',
    keyTakeaway: 'डिजिटल बिल भुगतान से कतारों में लगने की परेशानी खत्म होती है और हर भुगतान की पक्की रसीद हमेशा आपके फोन में सुरक्षित रहती है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/26-regular-bills-payments.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-01', 'habit-02'],
      lessonIds: ['lesson-09']
    }
  },
  {
    id: 'lesson-11',
    sequenceNumber: 11,
    hindiTitle: 'क्रेडिट कार्ड क्या है? समझें और समझदारी से उपयोग करें',
    englishTitle: 'Credit Card Fundamentals: Safe Usage, Billing Cycles & Traps',
    category: '3. Digital Payments & UPI',
    shortDescription: 'क्रेडिट कार्ड और डेबिट कार्ड का अंतर, 45-दिन का ब्याज-मुक्त चक्र, न्यूनतम देय राशि (Minimum Due) का जाल और सुरक्षा नियम।',
    realLifeProblem: 'बैंक से क्रेडिट कार्ड मिलने के बाद बुजुर्ग अनजाने में केवल "Minimum Due" भरते रहते हैं, जिससे भारी 40% वार्षिक ब्याज का कर्ज बन जाता है।',
    whatYouWillLearn: [
      'क्रेडिट कार्ड (बैंक का उधार) बनाम डेबिट कार्ड (खाते का अपना पैसा) की बुनियादी समझ',
      'बिलिंग चक्र (Billing Cycle) और पेमेंट ड्यू डेट (Due Date) का सटीक गणित',
      '"Minimum Amount Due" का खतरनाक चक्रव्यूह और 36–42% ब्याज से बचाव',
      'CVV और कार्ड एक्सपायरी को छिपाकर रखना और ऑनलाइन ट्रांजैक्शन लिमिट तय करना'
    ],
    simpleExplanation: 'क्रेडिट कार्ड से खर्च करने पर तुरंत बैंक खाते से पैसा नहीं कटता, बल्कि बैंक 30 से 50 दिनों के लिए ब्याज-मुक्त उधार देता है। यदि आप अंतिम तिथि तक "Total Amount Due" का पूरा भुगतान कर देते हैं, तो कोई ब्याज नहीं लगता। लेकिन यदि आप केवल मिनिमम ड्यू भरते हैं, तो बैंक बचे हुए पैसों पर भारी ब्याज लगाता है। कार्ड के पीछे लिखे 3 अंकों के CVV को हमेशा छिपाकर रखें।',
    safePracticalActivity: 'अपने क्रेडिट कार्ड या डेबिट कार्ड को देखें। पहचानें कि आगे 16 अंकों का नंबर कहां है और पीछे 3 अंकों का CVV कहां है। अपने कार्ड के CVV पर एक छोटा अपारदर्शी स्टिकर चिपकाकर उसे सुरक्षित करें।',
    keyTakeaway: 'क्रेडिट कार्ड का केवल एक ही नियम है: जितना खर्च करें, महीने के अंत में 100% पूरा बिल भरें। कभी भी मिनिमम ड्यू के चक्कर में न पड़ें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/21-credit-card.png'
    ],
    relatedLearningComponents: {
      posterIds: ['poster-06'],
      habitIds: ['habit-03', 'habit-07']
    }
  },
  {
    id: 'lesson-12',
    sequenceNumber: 12,
    hindiTitle: 'विदेशी वेबसाइट्स और अंतरराष्ट्रीय कार्ड सुरक्षा (बिना OTP लेन-देन)',
    englishTitle: 'International Websites & Forex Safety: No-OTP Risks and Protections',
    category: '3. Digital Payments & UPI',
    shortDescription: 'विदेशी वेबसाइटों पर बिना OTP के पैसे कटने का जोखिम, अंतरराष्ट्रीय उपयोग को बंद रखना और विदेशी उपहार/पार्सल ठगी से बचाव।',
    realLifeProblem: 'कई वरिष्ठ नागरिकों के कार्ड से रात को अचानक विदेशी वेबसाइटों (जैसे Amazon US, Netflix आदि) पर बिना किसी OTP के डॉलर में पैसे कट जाते हैं।',
    whatYouWillLearn: [
      'अंतरराष्ट्रीय पेमेंट गेटवे पर भारतीय दोहरे सत्यापन (2FA / OTP) का अनिवार्य न होना',
      'अपने मोबाइल बैंकिंग ऐप से कार्ड के "International Usage" को हमेशा बंद (Disabled) रखना',
      'विदेशी मुद्रा रूपांतरण शुल्क (Forex Markup Charges) को समझना',
      'विदेश से उपहार आने और कस्टम्स ड्यूटी मांगने वाली सोशल मीडिया ठगी से बचाव'
    ],
    simpleExplanation: 'भारत में RBI के नियम के अनुसार हर कार्ड भुगतान पर SMS OTP आता है, लेकिन विदेशी वेबसाइटों पर कार्ड नंबर, एक्सपायरी और CVV डालते ही बिना किसी OTP के तुरंत पैसे कट जाते हैं। इसलिए यदि आप विदेश यात्रा नहीं कर रहे हैं, तो अपने मोबाइल ऐप में जाकर डेबिट और क्रेडिट कार्ड का "International Transaction" विकल्प हमेशा बंद (OFF) रखें।',
    safePracticalActivity: 'अपने बैंक के मोबाइल ऐप में लॉगिन करें → "Manage Cards" या "Card Controls" खोलें → देखें कि क्या "International Transactions" का बटन बंद (Disabled) है। यदि चालू है, तो उसे तुरंत बंद करें।',
    keyTakeaway: 'अपने कार्ड का इंटरनेशनल यूसेज हमेशा बंद रखें। जरूरत पड़ने पर ही इसे चालू करें और काम पूरा होते ही दोबारा बंद कर दें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/31-purchasing-from-foreign-websites.png',
      '/tutorials/digital-banking/assets/32-receipt-of-payment-or-payment-to-foreigner.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-08'],
      habitIds: ['habit-01', 'habit-03', 'habit-07'],
      emergencyGuideIds: ['emergency-01']
    }
  },
  {
    id: 'lesson-13',
    sequenceNumber: 13,
    hindiTitle: 'AutoPay और अनचाहे सब्सक्रिप्शन को ढूंढना व रोकना (Paytm, GPay, PhonePe)',
    englishTitle: 'AutoPay & Unwanted Subscriptions: Auditing and Canceling Mandates',
    category: '3. Digital Payments & UPI',
    shortDescription: 'हर महीने चुपचाप कटने वाले ऑटो-डेबिट (Auto-Pay) को खोजना, रद्द करना और बैंक खाते से अनचाही कटौती को स्थायी रूप से रोकना।',
    realLifeProblem: 'वरिष्ठ नागरिक किसी ऐप का फ्री ट्रायल या मनोरंजन सब्सक्रिप्शन लेते हैं, और बाद में हर महीने उनके खाते से ₹299 या ₹499 चुपचाप कटते रहते हैं जिसका उन्हें पता भी नहीं चलता।',
    whatYouWillLearn: [
      'UPI AutoPay और ई-मैंडेट (e-Mandate) कैसे काम करता है',
      'Google Pay, PhonePe और Paytm में "Active AutoPay" की पूरी सूची निकालना',
      'अनावश्यक या अनजाने में शुरू हुए ऑटो-डेबिट को 1 मिनट में Cancel (रद्द) करना',
      'बैंक नेट बैंकिंग और कार्ड लेवल पर मैंडेट ब्लॉक करने का तरीका'
    ],
    simpleExplanation: 'जब आप किसी ऐप में पहली बार पेमेंट करते हैं, तो कभी-कभी गलती से "Auto-Renew" या "Recurring Payment" की अनुमति मिल जाती है। इसके बाद हर महीने बिना आपकी अनुमति या पिन के बैंक से पैसे कटते रहते हैं। सभी UPI ऐप्स में एक समर्पित "AutoPay" मेनू होता है जहाँ आप सक्रिय मैंडेट्स को देखकर तुरंत "Cancel Mandate" पर टैप कर सकते हैं।',
    safePracticalActivity: 'Google Pay खोलें → ऊपर दाईं ओर अपनी प्रोफाइल फोटो पर टैप करें → "Autopay" चुनें। देखें कि क्या कोई सक्रिय ऑटोपे चल रहा है। यदि कोई ऐसा है जिसकी जरूरत नहीं है, तो उसे रद्द करने का विकल्प पहचानें।',
    keyTakeaway: 'महीने में एक बार अपने UPI ऐप में AutoPay सूची की जांच करें। जिस सेवा का उपयोग न कर रहे हों, उसका मैंडेट तुरंत रद्द करें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
      '/tutorials/digital-banking/assets/70-auto-deduct-all-apps.png'
    ],
    relatedLearningComponents: {
      projectIds: ['project-autopay-management'],
      habitIds: ['habit-01', 'habit-02'],
      emergencyGuideIds: ['emergency-01']
    },
    updatedSafetyNote: 'RBI के नियमों के अनुसार ₹15,000 से अधिक के किसी भी ई-मैंडेट निष्पादन से 24 घंटे पहले बैंक को ग्राहक को प्री-डेबिट नोटिफिकेशन SMS भेजना अनिवार्य है।'
  },
  {
    id: 'lesson-14',
    sequenceNumber: 14,
    hindiTitle: 'eSIM क्या है और इसके सुरक्षा फायदे (फिजिकल सिम चोरी से बचाव)',
    englishTitle: 'Understanding eSIM: Digital Security Advantages Against Handset Theft',
    category: '6. Phone & Identity Security',
    shortDescription: 'डिजिटल सिम (eSIM) और प्लास्टिक सिम में अंतर, फोन चोरी होने पर सिम निकालकर गलत उपयोग रोकने का आधुनिक सुरक्षा कवच।',
    realLifeProblem: 'फोन चोरी होने पर चोर सबसे पहले सिम कार्ड निकालकर किसी सस्ते बेसिक फोन में डाल लेते हैं और `*99#` या SMS से बैंक का पूरा नियंत्रण हासिल कर लेते हैं।',
    whatYouWillLearn: [
      'eSIM क्या होता है (फोन की मदरबोर्ड चिप में एम्बेडेड डिजिटल सिम)',
      'चोर द्वारा सिम कार्ड को फोन से बाहर निकालने की संभावना का शून्य होना',
      'अपने स्मार्टफोन में eSIM सपोर्ट जांचने का तरीका',
      'टेलीकॉम स्टोर से सुरक्षित एक्टिवेशन प्रक्रिया और सावधानियां'
    ],
    simpleExplanation: 'पारंपरिक प्लास्टिक सिम कार्ड को कोई भी पिन चुभाकर फोन से बाहर निकाल सकता है। लेकिन eSIM एक डिजिटल सिम होती है जो फोन के अंदर ही इलेक्ट्रॉनिक रूप से सक्रिय होती है। यदि आपका फोन चोरी भी हो जाए, तो चोर सिम को बाहर नहीं निकाल सकता। जब तक फोन में स्क्रीन लॉक रहेगा, आपका मोबाइल नंबर और उससे जुड़ा बैंक खाता पूरी तरह सुरक्षित रहेगा।',
    safePracticalActivity: 'अपने फोन की Settings खोलें → "Connections" या "Mobile Network" में जाएं → "SIM Manager" पर टैप करें। देखें कि क्या आपके फोन में "Add eSIM" का विकल्प उपलब्ध है।',
    keyTakeaway: 'यदि आपका फोन eSIM सपोर्ट करता है, तो फिजिकल सिम से eSIM पर अपग्रेड करना फोन चोरी की स्थिति में आपके बैंक खाते की सबसे बड़ी सुरक्षा है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/65-esim.png'
    ],
    relatedLearningComponents: {
      scamIds: ['scam-12'],
      habitIds: ['habit-07', 'habit-10'],
      emergencyGuideIds: ['emergency-02', 'emergency-05']
    },
    updatedSafetyNote: 'eSIM फोन चोरी होने पर सिम के भौतिक निष्कासन को रोकता है, लेकिन टेलीकॉम स्टोर पर होने वाली सोशल इंजीनियरिंग या फर्जी पहचान से सिम-स्वैप के जोखिम से बचाव के लिए सतर्कता हमेशा जरूरी है।'
  },
  {
    id: 'lesson-15',
    sequenceNumber: 15,
    hindiTitle: '4-इन-1 सुरक्षा ऑडिट: आधार, गूगल अकाउंट, वॉट्सऐप और पासवर्ड चेक',
    englishTitle: '4-in-1 Digital Security Audit: Aadhaar, Google, WhatsApp & Passwords',
    category: '6. Phone & Identity Security',
    shortDescription: 'महीने में 15 मिनट का सम्पूर्ण डिजिटल स्वास्थ्य चेकअप — आधार प्रमाणीकरण इतिहास, सक्रिय डिवाइस और वॉट्सऐप लिंक सत्र की जांच।',
    realLifeProblem: 'बुजुर्गों को महीनों तक पता नहीं चलता कि किसी अज्ञात कंप्यूटर पर उनका वॉट्सऐप खुला है या किसी अनजान व्यक्ति ने उनके आधार से नया सिम ले रखा है।',
    whatYouWillLearn: [
      'UIDAI पोर्टल पर अपने आधार का प्रमाणीकरण इतिहास (Authentication History) देखना',
      'Google Account Security में जाकर यह जांचना कि कौन-कौन से फोन/लैपटॉप लॉगिन हैं',
      'WhatsApp Settings → "Linked Devices" में अज्ञात कंप्यूटर सत्रों को तुरंत लॉगआउट करना',
      'गूगल पासवर्ड मैनेजर द्वारा कमजोर या लीक हुए पासवर्ड्स की स्वचालित पहचान'
    ],
    simpleExplanation: 'जैसे हम साल में एक बार स्वास्थ्य की जांच (Full Body Checkup) कराते हैं, वैसे ही अपने डिजिटल जीवन की सुरक्षा जांच जरूरी है। UIDAI की myAadhaar वेबसाइट पर आप देख सकते हैं कि पिछले 6 महीने में आपका आधार कहाँ-कहाँ OTP के लिए इस्तेमाल हुआ। WhatsApp में Linked Devices देखकर आप सुनिश्चित कर सकते हैं कि आपकी चैट कोई तीसरा व्यक्ति नहीं पढ़ रहा।',
    safePracticalActivity: 'अभी अपना WhatsApp खोलें → ऊपर दाईं ओर 3 डॉट्स पर टैप करें → "Linked Devices" चुनें। यदि वहां कोई भी Windows, Mac या अज्ञात ब्राउज़र दिख रहा है, तो उस पर टैप करके तुरंत "Log Out" करें।',
    keyTakeaway: 'महीने में एक बार 4-इन-1 ऑडिट करने से आप किसी भी गुप्त जासूसी या साइबर सेंधमारी को शुरुआत में ही पकड़कर निष्प्रभावी कर सकते हैं।',
    infographicImages: [
      '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png'
    ],
    relatedLearningComponents: {
      projectIds: ['project-digital-identity-audit'],
      scamIds: ['scam-11', 'scam-15'],
      habitIds: ['habit-07', 'habit-09']
    }
  },
  {
    id: 'lesson-16',
    sequenceNumber: 16,
    hindiTitle: 'मजबूत सुरक्षा की 3 कुंजियां — 2FA, Passkeys और Password Manager',
    englishTitle: 'Three Pillars of Modern Security: 2FA, Passkeys & Password Manager',
    category: '6. Phone & Identity Security',
    shortDescription: 'कठिन पासवर्ड याद रखने के तनाव से मुक्ति — बायोमेट्रिक पासकी (Passkey) और गूगल पासवर्ड मैनेजर का सरल एवं अभेद्य उपयोग।',
    realLifeProblem: 'वरिष्ठ नागरिक दर्जनों पासवर्ड याद नहीं रख पाते, इसलिए वे "123456" या अपना नाम व जन्मतिथि जैसा आसान पासवर्ड रखते हैं जो आसानी से हैक हो जाता है।',
    whatYouWillLearn: [
      'टू-फैक्टर ऑथेंटिकेशन (2FA) क्यों पासवर्ड चोरी होने पर भी सुरक्षा देता है',
      'Passkey (पासकी) क्या है: आपके चेहरे या फिंगरप्रिंट से सुरक्षित लॉगिन',
      'Google Password Manager में सुरक्षित तरीके से पासवर्ड सहेजना और ऑटो-फिल करना',
      'डायरी में पासवर्ड लिखने के सुरक्षित नियम (घर में सुरक्षित लॉकर में रखना)'
    ],
    simpleExplanation: 'अब आपको लंबे और जटिल पासवर्ड याद रखने की जरूरत नहीं है। आधुनिक तकनीक में "Passkey" आ गई है — यानी जिस तरह आप अपने फिंगरप्रिंट से फोन खोलते हैं, उसी तरह वेबसाइट्स भी आपके फिंगरप्रिंट से सुरक्षित खुल जाती हैं। इसके अलावा गूगल पासवर्ड मैनेजर आपके सभी पासवर्ड्स को तिजोरी की तरह सुरक्षित रखता है।',
    safePracticalActivity: 'अपने फोन की Settings खोलें → "Google" पर जाएं → "All services" या "Autofill" में जाकर "Google Password Manager" देखें। वहां देखें कि आपके कितने खातों के पासवर्ड सुरक्षित रूप से सेव हैं।',
    keyTakeaway: 'फिंगरप्रिंट और पासकी से सुरक्षा भी मजबूत होती है और पासवर्ड भूलने की चिंता भी हमेशा के लिए खत्म हो जाती है।',
    infographicImages: [
      '/tutorials/digital-banking/assets/67-two-factor-passkey-password-manager.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-07', 'habit-10'],
      lessonIds: ['lesson-15']
    }
  },
  {
    id: 'lesson-17',
    sequenceNumber: 17,
    hindiTitle: 'पुराना फोन बेचें या किसी को दें? 12-स्टेप सुरक्षा चेकलिस्ट',
    englishTitle: 'Selling or Giving Away Old Phone: 12-Step Security Reset Checklist',
    category: '6. Phone & Identity Security',
    shortDescription: 'पुराना फोन एक्सचेंज करने या किसी रिश्तेदार को देने से पहले निजी फोटो, बैंक ऐप और गूगल खाते को 100% मिटाने का तरीका।',
    realLifeProblem: 'नया फोन लेने के बाद पुराना फोन एक्सचेंज में दे देते हैं, लेकिन फोन से डेटा पूरी तरह न मिटने के कारण बैंक खाते और निजी पारिवारिक तस्वीरें दूसरों के हाथ लग जाती हैं।',
    whatYouWillLearn: [
      'डेटा का सुरक्षित बैकअप (Google Drive या कंप्यूटर पर) लेना',
      'फोन से फिजिकल सिम कार्ड और मेमोरी कार्ड (MicroSD) बाहर निकालना',
      'फैक्ट्री रीसेट से पहले Google Account को फोन से हटाना (FRP Lock से बचाव)',
      'फैक्ट्री डेटा रीसेट (Factory Data Reset) चलाकर फोन को दुकान जैसा नया बनाना'
    ],
    simpleExplanation: 'केवल गैलरी से फोटो डिलीट कर देना काफी नहीं होता; रिकवरी सॉफ्टवेयर से वे वापस आ सकती हैं। फोन देने से पहले सबसे पहले सेटिंग्स में जाकर अपना Google Account "Remove" करें, फिर "Factory Data Reset" चलाएं। इससे फोन की आंतरिक मेमोरी पूरी तरह एन्क्रिप्ट होकर साफ हो जाती है और कोई भी पुराना डेटा कभी वापस नहीं लाया जा सकता।',
    safePracticalActivity: 'अपने फोन की Settings खोलें → "System" या "General Management" में जाएं → केवल देखें कि "Reset" विकल्प कहां है (गलती से भी रीसेट न दबाएं, केवल रास्ता समझें)।',
    keyTakeaway: 'पुराना फोन कभी भी बिना फैक्ट्री रीसेट किए किसी को न सौंपें। सिम कार्ड और मेमोरी कार्ड निकालना कभी न भूलें।',
    infographicImages: [
      '/tutorials/digital-banking/assets/68-old-phone-sale-checklist.png'
    ],
    relatedLearningComponents: {
      habitIds: ['habit-07', 'habit-10'],
      emergencyGuideIds: ['emergency-02']
    }
  }
];

export const DIGITAL_BANKING_POSTERS: DigitalBankingPoster[] = [
  {
    id: 'poster-01',
    sequenceNumber: 7,
    title: 'डिजिटल भुगतान के विभिन्न तरीके एक नज़र में',
    englishTitle: 'Methods of Digital Payments at a Glance',
    categoryBadge: 'भुगतान लैंडस्केप (Poster 01)',
    description: 'डेबिट कार्ड, क्रेडिट कार्ड, प्रीपेड वॉलेट, UPI, नेट बैंकिंग और QR कोड का एक संपूर्ण दृश्य तुलनात्मक नक्शा।',
    imagePath: '/tutorials/digital-banking/assets/07-methods-of-payments.png',
    keyHighlights: [
      'दैनिक छोटे खर्चों के लिए: वॉलेट और UPI QR कोड',
      'घरेलू बिल और बड़ी खरीदारी के लिए: नेट बैंकिंग और कार्ड्स',
      'सुरक्षा स्तर: वॉलेट में सीमित जोखिम, मुख्य बचत पूरी तरह सुरक्षित'
    ],
    relatedLessonId: 'lesson-01'
  },
  {
    id: 'poster-02',
    sequenceNumber: 20,
    title: 'चेक (Cheque) के प्रकार और सुरक्षित चेक भरने का पोस्टर',
    englishTitle: 'Types of Cheques: Writing Safe Cheques Guide',
    categoryBadge: 'पारंपरिक सुरक्षा (Poster 02)',
    description: 'Bearer, Order, Crossed और Account Payee चेक के अंतर; चेक पर दो समानांतर रेखाएं खींचकर A/C Payee लिखने का सुरक्षित तरीका।',
    imagePath: '/tutorials/digital-banking/assets/20-types-of-cheques.png',
    keyHighlights: [
      'हमेशा ऊपरी बाएं कोने पर दोहरी क्रॉस रेखाएं खींचकर "A/C Payee Only" लिखें',
      'नाम और राशि के आगे खाली जगह न छोड़ें; अंत में रेखा खींचें',
      'चेक पर कभी ओवरराइटिंग न करें; नीचे के MICR बैंड को साफ रखें'
    ],
    relatedLessonId: 'lesson-06'
  },
  {
    id: 'poster-03',
    sequenceNumber: 22,
    title: 'RTGS, NEFT और IMPS — विस्तृत तुलना चार्ट',
    englishTitle: 'Difference Between RTGS, NEFT & IMPS Comparison Chart',
    categoryBadge: 'इंटरबैंक ट्रांसफर (Poster 03)',
    description: 'तीन प्रमुख इंटरबैंक ट्रांसफर माध्यमों की गति, न्यूनतम सीमा (RTGS के लिए ₹2 लाख), उपलब्धता (24×7) और उपयोग की स्थिति का त्वरित तुलनात्मक चार्ट।',
    imagePath: '/tutorials/digital-banking/assets/22-difference-between-rtgs-neft-imps.png',
    keyHighlights: [
      'RTGS (Real Time Gross Settlement): ₹2 लाख से ऊपर के बड़े लेनदेन हेतु तुरंत',
      'NEFT (National Electronic Funds Transfer): किसी भी छोटी या बड़ी राशि हेतु बैच में',
      'IMPS (Immediate Payment Service): मोबाइल और नेट बैंकिंग से तुरंत 24×7 ट्रांसफर'
    ],
    relatedLessonId: 'lesson-08'
  },
  {
    id: 'poster-04',
    sequenceNumber: 23,
    title: 'डिजिटल पेमेंट में पूरी समझ - 16 जरूरी पाठ',
    englishTitle: 'Complete Understanding of Digital Payments: 16 Core Rules',
    categoryBadge: 'मास्टर गाइड (Poster 04)',
    description: 'डिजिटल दुनिया में सुरक्षित रहने के 16 अचूक व्यावहारिक नियम — UTR नंबर, SMS अलर्ट, ऐप परमिशन, बैकअप और हेल्पलाइन नंबर का संक्षिप्त सार।',
    imagePath: '/tutorials/digital-banking/assets/23-16-lessons.png',
    keyHighlights: [
      'हर भुगतान का UTR और मैसेज हमेशा जांचें',
      'पिन और ओटीपी केवल पैसे भेजने के लिए होते हैं',
      'अनावश्यक ऐप परमिशन तुरंत बंद करें',
      'आपात स्थिति में हेल्पलाइन 1930 पर तुरंत कॉल करें'
    ],
    relatedLessonId: 'lesson-01'
  },
  {
    id: 'poster-05',
    sequenceNumber: 25,
    title: 'डिजिटल दुनिया के सामान्य उपयोगी संकेत और सिंबल',
    englishTitle: 'Common Useful Digital Symbols & Visual Icons',
    categoryBadge: 'विजुअल साक्षरता (Poster 05)',
    description: 'स्मार्टफोन और बैंकिंग ऐप में दिखने वाले सुरक्षा पैडलॉक, रिफ्रेश, शेयर, बायोमेट्रिक, वाई-फाई और क्यूआर कोड सिंबल्स की सचित्र व्याख्या।',
    imagePath: '/tutorials/digital-banking/assets/25-common-useful-infographics.png',
    keyHighlights: [
      'पैडलॉक (ताला): वेबसाइट पर सुरक्षित एन्क्रिप्टेड कनेक्शन का संकेत',
      'घूमता तीर (Refresh): पेज या बैलेंस को ताजा करना',
      'फिंगरप्रिंट आइकन: सुरक्षित बायोमेट्रिक प्रमाणीकरण'
    ],
    relatedLessonId: 'lesson-01'
  },
  {
    id: 'poster-06',
    sequenceNumber: 71,
    title: 'क्रेडिट कार्ड vs डेबिट कार्ड मास्टर तुलना तालिका',
    englishTitle: 'Credit Card vs Debit Card Master Comparison Table',
    categoryBadge: 'कार्ड तुलना (Poster 06)',
    description: '"अपना पैसा" (डेबिट कार्ड) बनाम "बैंक का उधार" (क्रेडिट कार्ड), ATM से नकदी निकासी शुल्क, रिवॉर्ड पॉइंट्स और धोखाधड़ी सुरक्षा की विस्तृत तालिका।',
    imagePath: '/tutorials/digital-banking/assets/71-difference-between-credit-card-and-debit-card.png',
    keyHighlights: [
      'डेबिट कार्ड: खाते में मौजूद राशि से ही खर्च, ATM से नकदी निकालने के लिए सर्वोत्तम',
      'क्रेडिट कार्ड: 45 दिन का उधार, लेकिन ATM से कैश निकालने पर भारी ब्याज लगता है',
      'दैनिक सुरक्षा: दोनों कार्डों पर दैनिक खर्च सीमा (Daily Limit) हमेशा कम रखें'
    ],
    relatedLessonId: 'lesson-11'
  }
];
