/**
 * Digital Saathi: Adaptive Conversation Pilot Data (Phase 5.8)
 *
 * Core Teaching Philosophy:
 * ANSWER → IMMEDIATE ADVICE → RELEVANT FAQs → OPTIONAL PRACTICAL → NEXT QUESTION → PERSONAL LEARNING PLAN
 *
 * Phase 5.8 Features:
 * 1. Fully adaptive Question 2 with four distinct learner paths:
 *    - Path A: Independent (`yes_self`)
 *    - Path B: Assisted (`with_help`)
 *    - Path C: Cannot Pay (`cannot_pay`) + Conditional UPI Check
 *    - Path D: Unfamiliar with QR (`unknown`)
 * 2. Exactly three relevant FAQs per path (no repetition)
 * 3. Exactly two optional practical activities per path with unique topic IDs
 * 4. Micro-lessons for Payment History, Safe QR Practice, Visual QR Intro, and Lost Phone
 * 5. Full backwards compatibility and bulletproof localStorage deduplication
 */

export interface SaathiOption {
  id: string
  textHindi: string
  subtextHindi?: string
}

export interface HelperGuidance {
  title: string
  helperRole: string
  stepsForHelper: string[]
  strictSecurityRule: string
}

export type SaathiMicroLessonKey =
  | 'lost_phone'
  | 'qr_history'
  | 'qr_safe_practice'
  | 'qr_visual_intro'
  | 'upi_app_recognition'
  | 'transfer_comparison'
  | 'balance_methods_overview'
  | 'missed_call_balance'
  | 'netbanking_discovery'
  | 'cdm_cardless_discovery'
  | 'atm_step_by_step'
  | 'atm_simulated_practice'
  | 'branch_withdrawal_basics'

export interface SaathiAdviceCard {
  titleHindi: string
  explanationHindi: string
  practicalSuggestionHindi?: string
  targetTab:
    | 'overview'
    | 'fear-removal'
    | 'banking-savings'
    | 'upi-payments'
    | 'habits'
    | 'scams'
    | 'phone-identity'
    | 'emergency'
    | 'projects'
    | 'posters'
  targetId?: string
  targetIndex?: number
  infographicPreview?: string
  infographicTitle?: string
  helperGuidance?: HelperGuidance
  isMicroLesson?: boolean
  microLessonKey?: SaathiMicroLessonKey
}

export interface SaathiFaqItem {
  id: string
  questionHindi: string
  answerHindi: string
  keyTakeawayHindi: string
}

export interface SaathiActivityItem {
  id: string
  letterBadge: 'A' | 'B'
  titleHindi: string
  subtitleHindi: string
  descriptionHindi: string
  actionLabelHindi: string
  targetTab:
    | 'overview'
    | 'fear-removal'
    | 'banking-savings'
    | 'upi-payments'
    | 'habits'
    | 'scams'
    | 'phone-identity'
    | 'emergency'
    | 'projects'
    | 'posters'
  targetId?: string
  targetIndex?: number
  isMicroLesson?: boolean
  microLessonKey?: SaathiMicroLessonKey
}

export interface SaathiQuestion {
  id: 'q1_mobile' | 'q2_qr' | 'q3_balance' | 'q4_atm'
  order: number
  titleHindi: string
  englishSubtext: string
  options: SaathiOption[]
  adviceByOption: Record<string, SaathiAdviceCard>
}

export interface SaathiLearningTopic {
  id: string
  titleHindi: string
  englishTitle: string
  reasonHindi: string
  practicalBenefitHindi: string
  badgeText: string
  badgeColor: 'emerald' | 'amber' | 'rose' | 'teal' | 'indigo'
  targetTab:
    | 'overview'
    | 'fear-removal'
    | 'banking-savings'
    | 'upi-payments'
    | 'habits'
    | 'scams'
    | 'phone-identity'
    | 'emergency'
    | 'projects'
    | 'posters'
  targetId?: string
  targetIndex?: number
  infographicPreview: string
  infographicTitle: string
  isSelfReportedKnown?: boolean
  isMicroLesson?: boolean
  microLessonKey?: SaathiMicroLessonKey
}

export interface SaathiSavedTopic {
  id: string
  titleHindi: string
  englishTitle?: string
  descriptionHindi: string
  practicalBenefitHindi?: string
  targetTab:
    | 'overview'
    | 'fear-removal'
    | 'banking-savings'
    | 'upi-payments'
    | 'habits'
    | 'scams'
    | 'phone-identity'
    | 'emergency'
    | 'projects'
    | 'posters'
  targetId?: string
  targetIndex?: number
  infographicPreview?: string
  infographicTitle?: string
  savedAt: number
  isMicroLesson?: boolean
  microLessonKey?: SaathiMicroLessonKey
}

// -------------------------------------------------------------
// 1. MOBILE SECURITY FAQS (QUESTION 1)
// -------------------------------------------------------------

export const SAATHI_MOBILE_FAQS: SaathiFaqItem[] = [
  {
    id: 'faq_1_why_lock',
    questionHindi: 'मैं अपना Phone किसी को देता ही नहीं, फिर Lock क्यों लगाऊँ?',
    answerHindi:
      'कई वरिष्ठ नागरिक सोचते हैं कि "मेरा फोन केवल मेरी जेब या घर की मेज़ पर रहता है, तो लॉक की क्या ज़रूरत?" लेकिन फोन कभी भी कहीं छूट सकता है—जैसे ऑटो-रिक्शा में, बाज़ार में खरीदारी करते समय, डॉक्टर के क्लीनिक में या शादी-समारोह में।\n\nयदि बिना लॉक का फोन किसी अनजान व्यक्ति के हाथ लग जाए, तो वह सीधे आपके बैंक SMS, WhatsApp संदेश, परिवार की निजी तस्वीरें और ईमेल खोल सकता है। स्क्रीन लॉक आपके फोन का सबसे पहला और मजबूत ताला है, जो फोन खो जाने पर भी आपके डेटा को पूरी तरह सुरक्षित रखता है।',
    keyTakeawayHindi: 'स्क्रीन लॉक फोन खोने या छूट जाने की स्थिति में आपकी सबसे बड़ी सुरक्षा है।'
  },
  {
    id: 'faq_2_pattern_vs_fingerprint',
    questionHindi: 'Pattern Lock अच्छा है। Fingerprint क्यों लगाऊँ?',
    answerHindi:
      'PIN और Pattern दोनों ही बहुत अच्छे और सुरक्षित तरीके हैं। बस इसमें एक व्यावहारिक बात का ध्यान रखना होता है कि जब आप बस, मेट्रो या भीड़भाड़ वाली जगह पर फोन खोलते हैं, तो पास खड़ा कोई व्यक्ति उंगली की चाल (Shoulder Surfing) देखकर आसानी से आपका पैटर्न याद कर सकता है।\n\nफिंगरप्रिंट केवल सुविधा और गति के लिए है—इससे बार-बार स्क्रीन पर कोड बनाने या टाइप करने की ज़रूरत नहीं पड़ती। लेकिन फिंगरप्रिंट हर किसी के लिए अनिवार्य नहीं है। यदि आप पैटर्न या पिन के साथ सहज हैं, तो वह भी पूरी तरह सुरक्षित है। बस फोन में एक सुरक्षित 4-6 अंकों का बैकअप PIN या Pattern होना हमेशा जरूरी है।',
    keyTakeawayHindi: 'पैटर्न और पिन दोनों सुरक्षित हैं; फिंगरप्रिंट केवल सुविधा के लिए है और अनिवार्य नहीं है।'
  },
  {
    id: 'faq_3_worn_fingerprints',
    questionHindi: 'मेरी उंगलियों के निशान ठीक से काम नहीं करते।',
    answerHindi:
      'उम्र बढ़ने के साथ त्वचा का सूखापन (Dry Skin), घरेलू काम करने या उंगलियों की बारीक रेखाएं हल्की हो जाने के कारण कई बार फोन का फिंगरप्रिंट सेंसर उंगली को नहीं पहचान पाता।\n\nयह बहुत सामान्य बात है और इसमें चिंता की कोई आवश्यकता नहीं है। ऐसी स्थिति में आपको फिंगरप्रिंट का उपयोग करने की बिल्कुल ज़रूरत नहीं है। आप एक साधारण 4 या 6 अंकों का PIN या आसान Pattern लॉक लगा सकते हैं, जो हर मौसम और हर स्थिति में 100% काम करता है।',
    keyTakeawayHindi: 'बायोमेट्रिक अनिवार्य नहीं है; साधारण 4-अंकों का PIN सबसे भरोसेमंद और आसान विकल्प है।'
  },
  {
    id: 'faq_4_spouse_sharing',
    questionHindi: 'मेरी पत्नी या जीवनसाथी भी मेरा Phone इस्तेमाल करते हैं।',
    answerHindi:
      'यदि परिवार या जीवनसाथी के साथ फोन साझा होता है, तो आधुनिक फोन में आप एक से अधिक फिंगरप्रिंट (जैसे 2 अपनी उंगलियां और 2 अपने जीवनसाथी की) जोड़ सकते हैं। इससे दोनों सदस्य बिना पासवर्ड पूछे आसानी से फोन खोल सकेंगे।\n\nलेकिन एक बात का ध्यान रखना जरूरी है: फोन में पंजीकृत कोई भी फिंगरप्रिंट पूरा फोन खोल सकता है। इसका मतलब है कि बैंक से आने वाले SMS, ओटीपी या निजी फोटो भी दोनों देख सकेंगे। हमेशा यह नियम याद रखें कि फोन अनलॉक करने की अनुमति भले साझा हो, लेकिन अपना बैंक UPI PIN, ATM PIN या नेट बैंकिंग पासवर्ड कभी किसी को न बताएं।',
    keyTakeawayHindi: 'फोन साझा हो सकता है, लेकिन बैंक UPI PIN और ATM PIN कभी साझा नहीं करना चाहिए।'
  },
  {
    id: 'faq_5_lost_phone_prep',
    questionHindi: 'अगर मेरा Phone खो जाए तो?',
    answerHindi:
      'फोन खो जाने के बाद घबराने से कहीं बेहतर है खोने से पहले की तैयारी! यदि आपने अपने फोन में Google का "Find My Device" (या iPhone में "Find My") चालू रखा है और अपना रिकवरी ईमेल व फोन नंबर सही सेट किया है, तो आप किसी अन्य कंप्यूटर या फोन से अपने खोए फोन की घंटी बजा सकते हैं, उस पर संदेश लिखकर स्क्रीन लॉक कर सकते हैं या डेटा सुरक्षित रख सकते हैं।\n\nकृपया ध्यान रखें: रिमोट लोकेशन और लॉक करने के लिए फोन ऑन होना और इंटरनेट से जुड़ा होना आवश्यक होता है। इसलिए यह फोन वापस मिलने की 100% गारंटी नहीं है, लेकिन आपकी मेहनत की कमाई और डेटा की रक्षा करने में यह सबसे बड़ा मददगार है।',
    keyTakeawayHindi: 'फोन खोने से पहले Find My Device और रिकवरी ईमेल जांचना सबसे समझदारी भरा कदम है।'
  }
]

// -------------------------------------------------------------
// 2. QUESTION 2: ADAPTIVE FAQS BY PATH (EXACTLY 3 PER PATH)
// -------------------------------------------------------------

export const SAATHI_QR_FAQS_BY_PATH: Record<string, SaathiFaqItem[]> = {
  // Path A: Learner Can Pay Independently
  yes_self: [
    {
      id: 'faq_qr_wrong_transfer',
      questionHindi: 'गलत व्यक्ति को Payment हो जाए तो क्या करें?',
      answerHindi:
        'यदि गलती से किसी गलत नंबर या गलत व्यक्ति को पैसे ट्रांसफर हो जाएं, तो तुरंत ये कदम उठाएं:\n1. अपने UPI ऐप में उस लेन-देन को खोलकर "Report a problem" या "Help" पर टैप करें।\n2. तुरंत अपने बैंक के कस्टमर केयर पर कॉल करके 12-अंकों का UTR / UPI Reference नंबर बताएं और शिकायत दर्ज कराएं।\n3. यदि यह किसी साइबर फ्रॉड (धोखाधड़ी) का मामला है, तो तुरंत राष्ट्रीय हेल्पलाइन 1930 या cybercrime.gov.in पर रिपोर्ट करें।\n\nमहत्वपूर्ण स्पष्टीकरण: गलत भुगतान का पैसा वापस मिलने की कोई पक्की कानूनी गारंटी नहीं होती। आपका बैंक केवल प्राप्तकर्ता के बैंक से संपर्क कर राशि लौटाने का औपचारिक अनुरोध कर सकता है। इसलिए PIN डालने से पहले नाम और राशि की दोबारा पुष्टि करना ही सबसे बड़ा बचाव है।',
      keyTakeawayHindi: 'गलत ट्रांसफर पर 12-अंकों के UTR के साथ तुरंत बैंक व ऐप में रिपोर्ट करें; रिफंड की कोई पक्की कानूनी गारंटी नहीं होती।'
    },
    {
      id: 'faq_qr_pending',
      questionHindi: 'Payment Pending हो तो क्या करें?',
      answerHindi:
        'कई बार बैंक सर्वर या नेटवर्क धीमा होने पर स्क्रीन पर "Payment Pending" लिखा आता है।\n\nमहत्वपूर्ण नियम: कभी भी घबराकर तुरंत दोबारा पेमेंट न करें! अन्यथा आपके खाते से दो बार पैसे कट सकते हैं।\n2 से 3 मिनट प्रतीक्षा करें और ऐप की "History" में स्टेटस देखें। यदि पैसा कट गया है और दुकानदार को नहीं मिला, तो यह राशि आमतौर पर कुछ समय में या अधिकतम 48 घंटों में आपके बैंक खाते में स्वतः वापस आ जाती है।',
      keyTakeawayHindi: 'Pending दिखने पर तुरंत दोबारा पैसे न भेजें; 2-3 मिनट रुककर History चेक करें।'
    },
    {
      id: 'faq_qr_history',
      questionHindi: 'पुरानी Payment History कैसे देखें?',
      answerHindi:
        'अपने Google Pay, PhonePe, Paytm या BHIM ऐप की मुख्य स्क्रीन पर नीचे "Transaction History" या "History" का विकल्प होता है।\nउस पर टैप करने पर आपके द्वारा किए गए सभी भुगतानों की पूरी सूची दिखती है। किसी भी लेनदेन पर टैप करके आप तारीख, दुकानदार का नाम, राशि और बैंक का 12-अंकों का UTR नंबर देख सकते हैं। किसी भी विवाद में यही स्क्रीनशॉट सबसे पक्का प्रमाण होता है।',
      keyTakeawayHindi: 'ऐप की History में हर लेनदेन का 12-अंकों का UTR नंबर सबसे पक्का प्रमाण होता है।'
    }
  ],

  // Path B: Learner Pays With Help
  with_help: [
    {
      id: 'faq_qr_verify_recipient',
      questionHindi: 'QR Scan करने के बाद क्या जाँचना चाहिए?',
      answerHindi:
        'QR कोड स्कैन करते ही आपके फोन की स्क्रीन पर दुकानदार का पंजीकृत नाम और बैंक खाता नाम दिखाई देता है।\nहमेशा दो चीजें उंगली रखकर जांचें:\n1. दुकानदार का नाम: क्या यह वही नाम है जो दुकान के बोर्ड या बिल पर लिखा है?\n2. राशि (Amount): क्या आपने जितनी राशि सोची थी, उतनी ही लिखी है?\nयदि कोई अनजान व्यक्ति आपको अचानक कोई पेमेंट लिंक भेजे या स्क्रीन पर अधिक राशि दिखे, तो कभी PIN न डालें और तुरंत Cancel बटन दबाएं।',
      keyTakeawayHindi: 'पिन डालने से पहले हमेशा स्क्रीन पर दुकानदार का नाम और भरी गई राशि की पुष्टि करें।'
    },
    {
      id: 'faq_qr_when_pin',
      questionHindi: 'UPI PIN कब डालना होता है?',
      answerHindi:
        'दुकान पर या किसी व्यक्ति को सामान्य पैसे भेजते समय हर बार 4 या 6 अंकों का गुप्त UPI PIN डालना अनिवार्य होता है।\n\nदो महत्वपूर्ण बातें:\n1. पैसे प्राप्त (Receive) करने के लिए कभी PIN नहीं डालना पड़ता। यदि कोई व्यक्ति कहे कि "पैसे आपके खाते में भेजने के लिए PIN डालें या QR स्कैन करें", तो वह 100% धोखेबाज है।\n2. पूर्व-अधिकृत AutoPay अपवाद: यदि आपने पहले किसी बिजली बिल, बीमा या मासिक सेवा के लिए "AutoPay/मैंडेट" अधिकृत कर रखा है, तो तय तारीख पर वह राशि बिना दोबारा PIN डाले स्वतः कट सकती है। अनचाहे AutoPay को ऐप में जाकर कभी भी बंद किया जा सकता है।',
      keyTakeawayHindi: 'पैसे भेजते समय ही PIN डालना होता है, पैसे पाने के लिए कभी नहीं; पूर्व-अधिकृत AutoPay स्वतः कट सकता है।'
    },
    {
      id: 'faq_qr_safe_practice',
      questionHindi: 'बिना पैसे भेजे अभ्यास कैसे करें?',
      answerHindi:
        'आप बिना एक भी रुपया खर्च किए QR स्कैन का पूरा अभ्यास कर सकते हैं:\n1. अपने फोन में UPI ऐप खोलकर "Scan QR" पर टैप करें।\n2. दुकान या घर पर किसी भी QR कोड पर कैमरा केंद्रित करें।\n3. स्क्रीन पर दुकानदार का नाम और राशि भरने वाली स्क्रीन देखें।\n4. इसके बाद PIN डालने से पहले सीधे Cancel या Back बटन दबा दें।\nजब तक आप 4-6 अंकों का गोपनीय UPI PIN नहीं डालते, आपके खाते से एक रुपया भी नहीं कट सकता।',
      keyTakeawayHindi: 'PIN डालने से पहले कभी भी Cancel दबाकर बिना पैसे भेजे सुरक्षित अभ्यास किया जा सकता है।'
    }
  ],

  // Path C: Learner Cannot Pay Independently
  cannot_pay: [
    {
      id: 'faq_qr_identify_app',
      questionHindi: 'मेरे Phone में UPI App कैसे पहचानें?',
      answerHindi:
        'अपनी फोन स्क्रीन पर रंग-बिरंगे आइकॉन देखें। प्रमुख अधिकृत UPI ऐप्स की पहचान इस प्रकार है:\n• Google Pay: सफेद डिब्बे में रंग-बिरंगा "G" अक्षर।\n• PhonePe: बैंगनी रंग का चौकोर डिब्बा जिसमें सफेद रंग में "पे" लिखा हो।\n• Paytm: हल्के नीले और सफेद रंग में "Paytm" लिखा हो।\n• BHIM: हरे और नारंगी रंग का भारतीय त्रिभुजाकार लोगो।\nयदि इनमें से कोई भी ऐप दिखे, तो आपके फोन में UPI की सुविधा पहले से मौजूद है।',
      keyTakeawayHindi: 'Google Pay, PhonePe, Paytm या BHIM के अधिकृत लोगो से फोन में ऐप पहचानें।'
    },
    {
      id: 'faq_qr_prerequisites',
      questionHindi: 'UPI शुरू करने के लिए क्या जरूरी है?',
      answerHindi:
        'UPI शुरू करने के लिए केवल 3 बुनियादी चीजें चाहिए:\n1. आपका बैंक खाता।\n2. बैंक खाते से लिंक मोबाइल नंबर वाला सिम इसी स्मार्टफोन में चालू होना।\n3. उस खाते का ATM/डेबिट कार्ड (या कुछ बैंकों में आधार कार्ड), जिससे आप अपना 4 या 6 अंकों का गुप्त UPI PIN बना सकें।\nइसके लिए बैंक जाने की भी आवश्यकता नहीं होती; यह घर बैठे परिवार के किसी समझदार सदस्य की मदद से 5 मिनट में हो जाता है।',
      keyTakeawayHindi: 'बैंक से जुड़ा मोबाइल नंबर और ATM कार्ड होने पर घर बैठे UPI चालू हो जाता है।'
    },
    {
      id: 'faq_qr_how_works',
      questionHindi: 'QR Payment कैसे काम करता है?',
      answerHindi:
        'QR कोड दुकानदार के बैंक खाते का एक आधुनिक डिजिटल पता होता है।\nजैसे डाक भेजने के लिए घर का पता चाहिए, वैसे ही बैंक से पैसे भेजने के लिए यह कोड काम करता है। जब आप कैमरे से इसे स्कैन करते हैं, तो आपका फोन अपने आप दुकानदार का बैंक खाता पहचान लेता है। आपको 16-अंकों का खाता नंबर या IFSC कोड टाइप करने की बिल्कुल ज़रूरत नहीं पड़ती।',
      keyTakeawayHindi: 'QR कोड दुकानदार का आसान डिजिटल बैंक पता है, जिससे खाता नंबर टाइप नहीं करना पड़ता।'
    }
  ],

  // Path D: Learner Does Not Know QR Payment
  unknown: [
    {
      id: 'faq_qr_what_is',
      questionHindi: 'QR Code क्या होता है?',
      answerHindi:
        'QR का पूरा नाम "Quick Response" कोड है। यह सफेद पृष्ठभूमि पर काले चौकोर बिंदुओं का एक पैटर्न होता है, जो आजकल दुकानों, दूध बूथ, चाय की थड़ी और मेडिकल स्टोर के काउंटर पर प्लास्टिक स्टैंड में लगा दिखता है।\nइसमें दुकानदार का बैंक खाता सुरक्षित रूप से दर्ज होता है, जिसे केवल स्मार्टफोन का कैमरा पढ़ सकता है।',
      keyTakeawayHindi: 'QR कोड दुकानों पर लगा चौकोर डिजिटल कोड है जिसमें दुकानदार का बैंक पता होता है।'
    },
    {
      id: 'faq_qr_does_scan_deduct',
      questionHindi: 'क्या QR Scan करने से पैसे कट जाते हैं?',
      answerHindi:
        'सामान्यतः केवल QR कोड को कैमरे से स्कैन करने पर खाते से पैसे कभी नहीं कटते!\nस्कैन करने के बाद पहले स्क्रीन पर नाम दिखता है। फिर आप खुद तय करते हैं कि कितने रुपये देने हैं। अंत में जब आप अपना गुप्त 4 या 6 अंकों का UPI PIN डालते हैं, तभी पैसा कटता है।\n(सावधानी: व्हाट्सएप या अनजान मैसेज पर किसी अज्ञात व्यक्ति द्वारा भेजे गए क्यूआर कोड को कभी स्कैन न करें)।',
      keyTakeawayHindi: 'केवल स्कैन करने से पैसे नहीं कटते; जब तक आप PIN नहीं डालते, भुगतान नहीं होता।'
    },
    {
      id: 'faq_qr_is_compulsory',
      questionHindi: 'क्या UPI इस्तेमाल करना जरूरी है?',
      answerHindi:
        'बिल्कुल नहीं! UPI का उपयोग करना पूरी तरह आपकी अपनी इच्छा पर निर्भर है।\nयदि आप नकद (कैश) या चेक से लेनदेन करना पसंद करते हैं, तो वह पूरी तरह मान्य और सुरक्षित है। UPI केवल एक अतिरिक्त सुविधा है ताकि छुट्टे पैसों की झंझट न हो और जेब में ज्यादा नकदी न रखनी पड़े। कोई भी आपको UPI इस्तेमाल करने के लिए बाध्य नहीं कर सकता।',
      keyTakeawayHindi: 'UPI अनिवार्य नहीं है; नकद और चेक हमेशा मान्य और सुरक्षित विकल्प हैं।'
    }
  ]
}

// -------------------------------------------------------------
// 3. QUESTION 2: ADAPTIVE PRACTICAL ACTIVITIES BY PATH (2 PER PATH)
// -------------------------------------------------------------

export const SAATHI_QR_ACTIVITIES_BY_PATH: Record<string, SaathiActivityItem[]> = {
  yes_self: [
    {
      id: 'topic_qr_history',
      letterBadge: 'A',
      titleHindi: 'Payment History व UTR नंबर देखना',
      subtitleHindi: 'पुराने भुगतानों का ब्यौरा व रसीद जांचना',
      descriptionHindi: 'UPI ऐप में तारीख, दुकानदार का नाम और 12-अंकों का आधिकारिक UTR नंबर देखने की सरल गाइड।',
      actionLabelHindi: 'History गाइड खोलें',
      targetTab: 'projects',
      targetId: 'project-safe-upi-setup',
      isMicroLesson: true,
      microLessonKey: 'qr_history'
    },
    {
      id: 'topic_autopay_audit',
      letterBadge: 'B',
      titleHindi: 'सुरक्षित UPI आदतें व AutoPay रिव्यू',
      subtitleHindi: 'अनचाही मासिक कटौतियों की जांच',
      descriptionHindi: 'PhonePe व Google Pay में एक्टिव मैंडेट की सूची देखना और अनावश्यक कटौती एक टैप में रोकना।',
      actionLabelHindi: 'AutoPay प्रोजेक्ट खोलें',
      targetTab: 'projects',
      targetId: 'project-02'
    }
  ],
  with_help: [
    {
      id: 'topic_qr_payment',
      letterBadge: 'A',
      titleHindi: 'QR Payment सचित्र अभ्यास (स्टेप-बाय-स्टेप)',
      subtitleHindi: 'फिक्स QR कोड व डायनामिक QR की समझ',
      descriptionHindi: 'दुकानदार का QR कोड स्कैन करना, नाम की पुष्टि और राशि दर्ज करने का सचित्र पाठ।',
      actionLabelHindi: 'सचित्र पाठ खोलें (पाठ 09)',
      targetTab: 'upi-payments',
      targetIndex: 8
    },
    {
      id: 'topic_qr_safe_practice',
      letterBadge: 'B',
      titleHindi: 'बिना पैसे भेजे QR स्कैन का सुरक्षित अभ्यास',
      subtitleHindi: 'पिन डाले बिना सुरक्षित रूप से वापस लौटना',
      descriptionHindi: 'कैमरा फोकस करना, नाम पढ़ना और PIN स्क्रीन से पहले Cancel बटन दबाकर आत्मविश्वास पाना।',
      actionLabelHindi: 'अभ्यास गाइड खोलें',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'qr_safe_practice'
    }
  ],
  cannot_pay: [
    {
      id: 'topic_qr_payment',
      letterBadge: 'A',
      titleHindi: 'QR Payment की चरण-दर-चरण प्रक्रिया',
      subtitleHindi: 'दुकान पर QR स्कैन करके सुरक्षित पेमेंट का तरीका',
      descriptionHindi: 'दुकानदार का QR स्कैन करना, राशि जांचना और सुरक्षित प्रक्रिया को बिना किसी डर के समझना।',
      actionLabelHindi: 'सचित्र पाठ खोलें (पाठ 09)',
      targetTab: 'upi-payments',
      targetIndex: 8
    },
    {
      id: 'topic_upi_app_recognition',
      letterBadge: 'B',
      titleHindi: 'फोन में असली UPI App पहचानना',
      subtitleHindi: 'Google Pay, PhonePe, Paytm व BHIM के लोगो',
      descriptionHindi: 'स्क्रीन पर रंग-बिरंगे अधिकृत ऐप आइकॉन को पहचानना। बिना गुप्त पिन डाले कभी पैसे नहीं कटते।',
      actionLabelHindi: 'पहचान गाइड खोलें',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'upi_app_recognition'
    }
  ],
  unknown: [
    {
      id: 'topic_qr_visual_intro',
      letterBadge: 'A',
      titleHindi: 'दुकानों पर QR Code की पहचान व समझ',
      subtitleHindi: 'काउंटर पर लगे कोड और साउंडबॉक्स की सरल समझ',
      descriptionHindi: 'QR कोड कैसा दिखता है, साउंडबॉक्स कैसे बोलता है, और केवल देखने से कोई पैसा नहीं कटता।',
      actionLabelHindi: 'QR परिचय गाइड खोलें',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'qr_visual_intro'
    },
    {
      id: 'topic_upi_basics',
      letterBadge: 'B',
      titleHindi: 'UPI क्या है? शुरुआती सचित्र पाठ',
      subtitleHindi: 'वस्तु विनिमय से डिजिटल बैंकिंग तक का सफर',
      descriptionHindi: 'बिना बैंक जाए घर बैठे या बाज़ार में सुरक्षित लेनदेन की बुनियादी समझ।',
      actionLabelHindi: 'सचित्र पाठ खोलें (पाठ 09)',
      targetTab: 'upi-payments',
      targetIndex: 8
    }
  ]
}

// -------------------------------------------------------------
// 3B. QUESTION 3: ADAPTIVE FAQS BY PATH (EXACTLY 3 PER PATH) (PHASE 5.9)
// -------------------------------------------------------------

export const SAATHI_BALANCE_FAQS_BY_PATH: Record<string, SaathiFaqItem[]> = {
  // Path A: Learner Already Checks Balance
  yes_self: [
    {
      id: 'faq_balance_statement_vs_minis',
      questionHindi: 'मिनी स्टेटमेंट और पूरे बैंक स्टेटमेंट (Passbook) में क्या अंतर है?',
      answerHindi:
        'मिनी स्टेटमेंट में केवल पिछले 3 से 5 लेनदेन का संक्षिप्त विवरण दिखता है (जैसे ATM पर्ची या SMS में)।\nपूरा बैंक स्टेटमेंट (PDF या पासबुक) पूरे महीने या साल के सभी भुगतानों, ब्याज़ और पेंशन का पूरा कानूनी ब्यौरा होता है, जिसे आप इंटरनेट बैंकिंग या बैंक ऐप से डाउनलोड करके सुरक्षित रख सकते हैं।',
      keyTakeawayHindi: 'मिनी स्टेटमेंट तुरंत जांच के लिए है; टैक्स या पक्के हिसाब के लिए पूरा PDF स्टेटमेंट उपयोगी है।'
    },
    {
      id: 'faq_balance_netbanking_safety',
      questionHindi: 'क्या इंटरनेट बैंकिंग सुरक्षित है और असली वेबसाइट कैसे पहचानें?',
      answerHindi:
        'इंटरनेट बैंकिंग सुरक्षित है, बशर्ते आप हमेशा बैंक की सही आधिकारिक वेबसाइट पर जाएं।\n\nअति-महत्वपूर्ण सुरक्षा नियम: केवल ब्राउज़र में ताले का निशान (🔒) या "https" होना असली वेबसाइट का पक्का सबूत नहीं है—धोखेबाज भी फर्जी फिशिंग वेबसाइटों पर SSL व ताले का निशान लगा लेते हैं!\nअसली पहचान के 3 नियम:\n1. बैंक का सही आधिकारिक डोमेन नाम देखें (जैसे SBI के लिए केवल onlinesbi.sbi, HDFC के लिए hdfcbank.com, PNB के लिए netpnb.com)।\n2. गूगल सर्च में सबसे ऊपर आने वाले "Sponsored" या "Ad" (विज्ञापन) लिंक पर कभी क्लिक न करें।\n3. SMS या व्हाट्सएप पर आए किसी भी अनजान लिंक से नेटबैंकिंग कभी न खोलें; हमेशा खुद ब्राउज़र में बैंक का आधिकारिक पता टाइप करें।',
      keyTakeawayHindi: 'केवल ताले के निशान पर भरोसा न करें; हमेशा बैंक के आधिकारिक डोमेन नाम (जैसे onlinesbi.sbi) की पुष्टि करें।'
    },
    {
      id: 'faq_balance_check_charges',
      questionHindi: 'क्या बैलेंस चेक करने पर कोई बैंक शुल्क कटता है?',
      answerHindi:
        'बैंक के आधिकारिक मिस्ड कॉल नंबर पर कॉल करने या UPI ऐप पर बैलेंस देखने का कोई अतिरिक्त सेवा शुल्क नहीं होता।\n\nशुल्क व नियम:\n• मिस्ड कॉल व UPI बैलेंस चेक आमतौर पर पूरी तरह निःशुल्क हैं।\n• SMS अलर्ट्स: कुछ बैंक हर तीन महीने (त्रैमासिक) में ₹15 से ₹25 तक का SMS शुल्क लेते हैं, जो प्रत्येक बैंक और खाते की श्रेणी (जैसे वरिष्ठ नागरिक खाता, पेंशन खाता) के नियमानुसार भिन्न हो सकता है।\n• ATM बैलेंस पर्ची: अन्य बैंक के ATM पर महीने की निःशुल्क सीमा (3 से 5 बार) समाप्त होने पर बैंक नियमानुसार मामूली शुल्क लागू हो सकता है।',
      keyTakeawayHindi: 'मिस्ड कॉल व UPI चेक निःशुल्क हैं; SMS व अन्य बैंकों के ATM पर बैंक नियमानुसार मामूली शुल्क हो सकता है।'
    }
  ],

  // Path B: Learner Checks Balance With Help
  with_help: [
    {
      id: 'faq_balance_helper_safety',
      questionHindi: 'किसी से बैलेंस चेक करवाते समय क्या सावधानी रखें?',
      answerHindi:
        'बैलेंस चेक करवाते समय कभी भी अपना 4 या 6 अंकों का गुप्त UPI PIN, ATM PIN या पासवर्ड बोलकर न बताएं।\nस्क्रीन पर खुद अपनी उंगली से PIN डालें। परिवार के सदस्य या विश्वसनीय व्यक्ति को केवल स्क्रीन पर दिख रहा बैलेंस पढ़ने दें, नियंत्रण अपने हाथ में रखें।',
      keyTakeawayHindi: 'दूसरों से सहायता लेते समय भी अपना गुप्त PIN कभी किसी को न बताएं।'
    },
    {
      id: 'faq_balance_without_internet',
      questionHindi: 'क्या बिना इंटरनेट या साधारण फोन से बैलेंस देखा जा सकता है?',
      answerHindi:
        'हाँ, बिल्कुल! यदि आपके पास साधारण कीपैड फोन (फीचर फोन) भी है, तो आप अपने बैंक के आधिकारिक मिस्ड कॉल नंबर पर कॉल दे सकते हैं।\nकॉल 1-2 घंटी के बाद अपने आप कट जाती है और कुछ ही पलों में बैंक से साधारण SMS आ जाता है। इसके लिए इंटरनेट की कोई आवश्यकता नहीं होती।',
      keyTakeawayHindi: 'साधारण कीपैड फोन से भी बैंक के मिस्ड कॉल नंबर द्वारा बिना इंटरनेट बैलेंस मिल जाता है।'
    },
    {
      id: 'faq_balance_missed_call_number',
      questionHindi: 'बैंक का सही मिस्ड कॉल नंबर कैसे पता करें?',
      answerHindi:
        'हमेशा अपनी बैंक पासबुक के मुख्य पृष्ठ, चेकबुक, या बैंक शाखा के नोटिस बोर्ड पर लिखा नंबर ही नोट करें।\nअति-महत्वपूर्ण: कभी भी गूगल सर्च पर अनजान नंबर न खोजें, क्योंकि साइबर ठग फर्जी नंबर डालकर बुजुर्गों से फोन पर ठगी करते हैं।',
      keyTakeawayHindi: 'मिस्ड कॉल नंबर केवल अपनी पासबुक, चेकबुक या बैंक शाखा से ही नोट करें।'
    }
  ],

  // Path C: Learner Cannot Check Balance
  no: [
    {
      id: 'faq_balance_easiest_method',
      questionHindi: 'घर बैठे बैलेंस जानने का सबसे आसान तरीका क्या है?',
      answerHindi:
        'सबसे आसान और सुरक्षित तरीका बैंक की "मिस्ड कॉल बैंकिंग" (Missed Call Banking) है।\nआपको केवल बैंक के टोल-फ्री नंबर पर कॉल मिलाना होता है। बिना कोई ऐप डाउनलोड किए और बिना कोई पासवर्ड याद रखे आपके फोन पर बैलेंस का मैसेज आ जाता है।',
      keyTakeawayHindi: 'मिस्ड कॉल सबसे सरल तरीका है जिसमें न इंटरनेट चाहिए, न कोई ऐप।'
    },
    {
      id: 'faq_balance_mobile_link_required',
      questionHindi: 'क्या बैलेंस चेक करने के लिए बैंक में मोबाइल नंबर दर्ज होना जरूरी है?',
      answerHindi:
        'हाँ, सुरक्षा कारणों से बैंक केवल उसी सिम कार्ड पर मिस्ड कॉल स्वीकार करता है और SMS भेजता है जो आपके बैंक खाते में "रजिस्टर्ड" (पंजीकृत) है।\nयदि आपका नंबर बैंक में दर्ज नहीं है, तो एक बार शाखा जाकर फॉर्म देकर नंबर जुड़वाना होता है।',
      keyTakeawayHindi: 'मिस्ड कॉल और SMS सुविधा के लिए बैंक खाते में मोबाइल नंबर जुड़ा होना अनिवार्य है।'
    },
    {
      id: 'faq_balance_sms_delay',
      questionHindi: 'अगर मिस्ड कॉल के बाद तुरंत SMS न आए तो क्या करें?',
      answerHindi:
        'कभी-कभी मोबाइल नेटवर्क या बैंक सर्वर में लोड होने पर SMS आने में 2 से 5 मिनट का समय लग सकता है।\nतुरंत बार-बार कॉल न करें। यदि 10-15 मिनट में भी SMS न आए, तो फोन में नेटवर्क सिग्नल जांचें या थोड़ी देर बाद प्रयास करें।',
      keyTakeawayHindi: 'SMS आने में कभी-कभी 2-5 मिनट लग सकते हैं; तुरंत बार-बार कॉल करने की ज़रूरत नहीं।'
    }
  ],

  // Path D: Learner Unfamiliar With Available Methods
  unknown: [
    {
      id: 'faq_balance_available_methods',
      questionHindi: 'बिना बैंक जाए बैलेंस जानने के कौन-कौन से तरीके हैं?',
      answerHindi:
        'मुख्यतः 4 तरीके उपलब्ध हैं:\n1. मिस्ड कॉल बैंकिंग (पंजीकृत नंबर से फ्री मिस्ड कॉल)\n2. ATM मशीन (बैलेंस इन्क्वायरी)\n3. UPI ऐप (Google Pay, PhonePe, आदि)\n4. बैंक की ऑफिशियल मोबाइल ऐप या नेटबैंकिंग।\nआप अपनी सुविधा अनुसार कोई भी आसान तरीका चुन सकते हैं।',
      keyTakeawayHindi: 'मिस्ड कॉल, ATM और UPI—तीनों में से जो आपको आसान लगे, वही तरीका अपनाएं।'
    },
    {
      id: 'faq_balance_any_form_needed',
      questionHindi: 'क्या बैलेंस जानने के लिए कोई फॉर्म भरना होता है?',
      answerHindi:
        'नहीं! यदि आपका मोबाइल नंबर पहले से बैंक खाते से जुड़ा है, तो कोई फॉर्म नहीं भरना होता। मिस्ड कॉल देना तुरंत शुरू किया जा सकता है।\nकेवल यदि मोबाइल नंबर बैंक में दर्ज नहीं है, तभी शाखा में एक बार नंबर दर्ज करवाना पड़ता है।',
      keyTakeawayHindi: 'यदि मोबाइल नंबर बैंक में दर्ज है तो बिना किसी फॉर्म के तुरंत बैलेंस देखा जा सकता है।'
    },
    {
      id: 'faq_balance_call_fraud_warning',
      questionHindi: 'क्या बैंक कर्मचारी फोन करके बैलेंस या OTP पूछते हैं?',
      answerHindi:
        'कभी नहीं! असली बैंक कर्मचारी कभी भी फोन पर आपसे आपका बैंक बैलेंस, खाता संख्या, ATM PIN या OTP नहीं पूछते।\nयदि कोई कॉल करके कहे कि "आपका खाता बंद हो रहा है, बैलेंस या OTP बताएं", तो वह 100% साइबर अपराधी है।',
      keyTakeawayHindi: 'बैंक कभी फोन पर बैलेंस या OTP नहीं पूछता; अनजान कॉलर को कोई जानकारी न दें।'
    }
  ]
}

// -------------------------------------------------------------
// 3C. QUESTION 3: ADAPTIVE PRACTICAL ACTIVITIES BY PATH (2 PER PATH) (PHASE 5.9)
// -------------------------------------------------------------

export const SAATHI_BALANCE_ACTIVITIES_BY_PATH: Record<string, SaathiActivityItem[]> = {
  yes_self: [
    {
      id: 'topic_bank_statement_download',
      letterBadge: 'A',
      titleHindi: 'Bank Statement (PDF) डाउनलोड करना',
      subtitleHindi: 'पूरे महीने या साल का लेन-देन रिकॉर्ड पाना',
      descriptionHindi: 'नेटबैंकिंग या बैंक ऐप से पासवर्ड-प्रोटेक्टेड PDF स्टेटमेंट डाउनलोड करना और सुरक्षित रखना।',
      actionLabelHindi: 'सचित्र पाठ खोलें (पाठ 08)',
      targetTab: 'banking-savings',
      targetIndex: 7
    },
    {
      id: 'topic_transfer_methods_comparison',
      letterBadge: 'B',
      titleHindi: 'NEFT, RTGS, IMPS व UPI में अंतर',
      subtitleHindi: 'पैसे भेजने के 4 तरीकों की तुलना',
      descriptionHindi: 'रकम, गति और उपयोग के अनुसार सही विकल्प चुनना: कब UPI करें, कब IMPS, और कब RTGS।',
      actionLabelHindi: 'तुलना गाइड खोलें',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'transfer_comparison'
    }
  ],
  with_help: [
    {
      id: 'topic_missed_call_balance',
      letterBadge: 'A',
      titleHindi: 'मिस्ड कॉल से स्वतंत्र बैलेंस देखना',
      subtitleHindi: 'बिना इंटरनेट केवल 1 मिस्ड कॉल',
      descriptionHindi: 'अपने बैंक का अधिकृत नंबर फोन में सेव करना और बिना किसी की मदद लिए SMS पाना।',
      actionLabelHindi: 'मिस्ड कॉल गाइड खोलें',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance'
    },
    {
      id: 'topic_atm_balance_practice',
      letterBadge: 'B',
      titleHindi: 'ATM पर सुरक्षित Balance Enquiry',
      subtitleHindi: 'मशीन पर बैलेंस देखना व पर्ची लेना',
      descriptionHindi: 'ATM में कार्ड डालना, कीपैड ढंककर पिन डालना और स्क्रीन पर बैलेंस देखकर Cancel करना।',
      actionLabelHindi: 'ATM बैलेंस अभ्यास खोलें',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'atm_simulated_practice'
    }
  ],
  no: [
    {
      id: 'topic_missed_call_balance',
      letterBadge: 'A',
      titleHindi: 'घर बैठे मिस्ड कॉल सेवा चालू करना',
      subtitleHindi: 'SBI, PNB, BoB, HDFC के अधिकृत नंबर',
      descriptionHindi: 'पंजीकृत मोबाइल नंबर से एक मुफ्त घंटी देकर 10 सेकंड में बैलेंस SMS पाने की सीधी विधि।',
      actionLabelHindi: 'मिस्ड कॉल गाइड खोलें',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance'
    },
    {
      id: 'topic_balance_checking',
      letterBadge: 'B',
      titleHindi: 'बैलेंस खत्म होने का डर व SMS अलर्ट',
      subtitleHindi: 'बैंक जाने की परेशानी से मुक्ति',
      descriptionHindi: 'बैलेंस जानने के आसान विकल्प और बैंक से आने वाले आधिकारिक SMS की पहचान।',
      actionLabelHindi: 'बैलेंस गाइड खोलें',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance'
    }
  ],
  unknown: [
    {
      id: 'topic_balance_methods_overview',
      letterBadge: 'A',
      titleHindi: 'बैलेंस जानने के 4 सरल तरीके',
      subtitleHindi: 'मिस्ड कॉल, ATM, पासबुक व UPI',
      descriptionHindi: 'वरिष्ठ नागरिकों के लिए बिना लाइन में लगे पेंशन और जमा पूंजी की जानकारी रखने की बुनियादी समझ।',
      actionLabelHindi: '4 तरीके गाइड खोलें',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'balance_methods_overview'
    },
    {
      id: 'topic_missed_call_balance',
      letterBadge: 'B',
      titleHindi: 'मिस्ड कॉल बैंकिंग का पहला परिचय',
      subtitleHindi: 'सबसे आसान और बिना किसी ऐप का साधन',
      descriptionHindi: 'केवल एक घंटी देकर बैलेंस जानने की विधि। न स्मार्टफोन चाहिए, न पासवर्ड याद रखना।',
      actionLabelHindi: 'मिस्ड कॉल गाइड खोलें',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance'
    }
  ]
}

// -------------------------------------------------------------
// 3C. QUESTION 4: ADAPTIVE FAQS BY PATH (EXACTLY 3 PER PATH) (PHASE 5.10)
// -------------------------------------------------------------

export const SAATHI_ATM_FAQS_BY_PATH: Record<string, SaathiFaqItem[]> = {
  // Path A: Independent ATM User
  yes_self: [
    {
      id: 'faq_atm_pin_change',
      questionHindi: 'ATM PIN कैसे बदलें?',
      answerHindi:
        'ATM मशीन में अपना कार्ड डालकर पुराना पिन डालें। स्क्रीन पर "PIN Change" या "Banking Services" का विकल्प चुनें। इसके बाद नया 4-अंकों का गुप्त पिन दो बार दर्ज करें। स्क्रीन पर "PIN Changed Successfully" आने पर रसीद लें।\n(सावधानी: नया पिन कभी अपनी जन्मतिथि या मोबाइल नंबर न रखें और कीपैड को हमेशा हाथ से ढंकें)।',
      keyTakeawayHindi: 'मशीन पर "PIN Change" चुनकर कीपैड ढंकते हुए सुरक्षित रूप से नया पिन सेट करें।'
    },
    {
      id: 'faq_atm_cash_deposit',
      questionHindi: 'क्या ATM में पैसे जमा भी कर सकते हैं?',
      answerHindi:
        'हाँ! कई बैंकों के ATM अब "Cash Deposit Machine (CDM / CRM)" होते हैं।\nइनमें आप बिना बैंक शाखा की लाइन में लगे अपना डेबिट कार्ड डालकर या सीधे 11-अंकों का खाता नंबर दर्ज करके ₹100, ₹200 और ₹500 के असली नोट सीधे खाते में जमा कर सकते हैं। मशीन नोट गिनकर तुरंत खाते में जमा कर रसीद देती है।',
      keyTakeawayHindi: 'CDM मशीन से सीधे 24 घंटे बिना बैंक लाइन में लगे असली नोट खाते में जमा हो जाते हैं।'
    },
    {
      id: 'faq_atm_cardless_cash',
      questionHindi: 'बिना Debit Card के Cash कैसे निकालें?',
      answerHindi:
        'आजकल कई बैंक "UPI-ATM" या "Cardless Cash" की सुविधा देते हैं।\nATM स्क्रीन पर "UPI Cash Withdrawal" चुनें और राशि (जैसे ₹1,000) दर्ज करें। स्क्रीन पर आए QR कोड को अपने Google Pay/PhonePe से स्कैन कर UPI PIN डालें—कैश तुरंत निकल आता है। इसमें कार्ड खोने या क्लोनिंग का कोई खतरा नहीं रहता।',
      keyTakeawayHindi: 'UPI-ATM से बिना डेबिट कार्ड के केवल QR स्कैन करके सुरक्षित कैश निकाला जा सकता है।'
    }
  ],

  // Path B: Learner Uses ATM With Assistance
  with_help: [
    {
      id: 'faq_atm_card_usage',
      questionHindi: 'ATM में Card कैसे इस्तेमाल करें?',
      answerHindi:
        'मशीन के कार्ड स्लॉट पर जब हरी बत्ती जल रही हो, तब कार्ड की सुनहरी चिप को ऊपर और आगे की ओर रखकर कार्ड धीरे से डालें।\nआधुनिक मशीनों में जब तक पूरा लेनदेन न हो, कार्ड स्लॉट के अंदर लॉक रहता है। जबरदस्ती खींचने की कोशिश न करें। काम पूरा होने पर जब बीप की आवाज़ आए, तभी कार्ड निकालें।',
      keyTakeawayHindi: 'चिप आगे रखकर कार्ड डालें और पूरा लेनदेन समाप्त होने पर बीप बजने पर ही कार्ड निकालें।'
    },
    {
      id: 'faq_atm_pin_privacy',
      questionHindi: 'PIN डालते समय क्या सावधानी रखें?',
      answerHindi:
        'पिन टाइप करते समय हमेशा अपने दूसरे हाथ या पर्स से कीपैड को ऊपर से छाते की तरह ढंकें, ताकि पीछे खड़ा व्यक्ति या ऊपर लगा सीसीटीवी कैमरा आपका पिन न देख सके।\nकिसी भी अजनबी, गार्ड या सहायक को अपना 4-अंकों का पिन बोलकर न बताएं। मशीन के पास केवल आप ही खड़े रहें।',
      keyTakeawayHindi: 'कीपैड को हमेशा दूसरे हाथ से ढंककर ही 4-अंकों का गुप्त पिन डालें; कभी किसी को न बोलें।'
    },
    {
      id: 'faq_atm_failed_cash_debited',
      questionHindi: 'Cash न निकले लेकिन Account से पैसे कट जाएँ तो?',
      answerHindi:
        'घबराएं नहीं! यदि ATM मशीन से नकदी न निकले लेकिन खाते से पैसे कटने का SMS आ जाए, तो तुरंत अपने बैंक को सूचित करें:\n1. मशीन से निकली पर्ची संभालें या स्क्रीन/मशीन पर लिखा ATM ID व समय नोट करें।\n2. तुरंत बैंक के टोल-फ्री कस्टमर केयर पर कॉल करके ट्रांजैक्शन की तारीख, समय व राशि नोट करवाकर कंप्लेंट टिकट नंबर लें।\n\nमहत्वपूर्ण RBI नियम (T+5 दिन व मुआवजा): RBI के आधिकारिक नियमों के अनुसार लेन-देन की तारीख से अगले 5 कैलेंडर दिनों (T+5) के भीतर बैंक को यह राशि स्वतः ग्राहक के खाते में लौटानी होती है। यदि 5 दिनों के बाद भी राशि न लौटे, तो बैंक को ग्राहक को ₹100 प्रतिदिन के हिसाब से हर्जाना (compensation) देना अनिवार्य है।\n(सावधानी: सामान्य ATM खराबी की शिकायत अपने बैंक से करें; राष्ट्रीय हेल्पलाइन 1930 केवल संदिग्ध साइबर वित्तीय धोखाधड़ी व ठगी के लिए है)।',
      keyTakeawayHindi: 'पैसे कटने पर तुरंत बैंक में शिकायत करें; RBI नियमानुसार T+5 दिनों में रिफंड न मिलने पर ₹100/दिन हर्जाना मिलता है।'
    }
  ],

  // Path C: Learner Cannot Use ATM
  no: [
    {
      id: 'faq_atm_what_is_card_pin',
      questionHindi: 'ATM Card और PIN क्या होते हैं?',
      answerHindi:
        'ATM कार्ड (या डेबिट कार्ड) प्लास्टिक का एक कार्ड होता है जो आपके बैंक खाते से जुड़ा होता है। इस पर 16 अंकों का नंबर और एक सुरक्षित इलेक्ट्रॉनिक चिप होती है।\nPIN (पर्सनल आइडेंटिफिकेशन नंबर) 4-अंकों का एक गुप्त कोड होता है जो आपके डिजिटल हस्ताक्षर की तरह काम करता है। बिना पिन डाले कोई भी आपके कार्ड से पैसे नहीं निकाल सकता।',
      keyTakeawayHindi: 'ATM कार्ड आपके खाते की चाबी है और 4-अंकों का PIN उसका बेहद गोपनीय ताला है।'
    },
    {
      id: 'faq_atm_withdrawal_steps',
      questionHindi: 'ATM से पैसे निकालने के Steps क्या हैं?',
      answerHindi:
        'यह केवल 4 सरल चरणों में होता है:\n1. कार्ड स्लॉट में कार्ड डालें (चिप आगे की ओर)।\n2. स्क्रीन पर अपनी भाषा (हिंदी/अंग्रेजी) और "Cash Withdrawal" चुनें।\n3. दूसरे हाथ से कीपैड ढंककर 4 अंकों का गुप्त PIN डालें।\n4. जितनी नकदी चाहिए (उदा. ₹1,000) टाइप करें। पहले कैश लें, फिर अपना कार्ड लें और अंत में लाल Cancel बटन दबाएं।',
      keyTakeawayHindi: 'कार्ड डालें → भाषा व Cash चुनें → PIN डालें → कैश व कार्ड लेकर Cancel दबाएं।'
    },
    {
      id: 'faq_atm_practice_without_money',
      questionHindi: 'क्या बिना वास्तविक पैसे निकाले प्रक्रिया समझ सकते हैं?',
      answerHindi:
        'हाँ, बिल्कुल! आप बिना एक भी रुपया निकाले ATM का सुरक्षित अभ्यास कर सकते हैं।\nमशीन में कार्ड डालकर कैश निकालने के बजाय "Balance Enquiry" (बैलेंस देखना) या "Mini Statement" चुनें। स्क्रीन पर बैलेंस देखें और सीधे लाल Cancel बटन दबाकर कार्ड वापस ले लें। इससे बिना जोखिम के पूरा अभ्यास हो जाता है।',
      keyTakeawayHindi: 'Balance Enquiry चुनकर बिना पैसे निकाले पूरी प्रक्रिया का सुरक्षित अभ्यास किया जा सकता है।'
    }
  ],

  // Path D: Learner Does Not Want ATM
  decline: [
    {
      id: 'faq_atm_branch_withdrawal',
      questionHindi: 'क्या Bank Branch से Cash निकाल सकते हैं?',
      answerHindi:
        'हाँ, बिल्कुल! आप अपनी बैंक शाखा में जाकर "Cash Withdrawal Slip" (निकासी फॉर्म) भरकर और अपनी पासबुक दिखाकर काउंटर से नकद पैसे निकाल सकते हैं।\nइसके अलावा आप अपने हस्ताक्षरित चेक पर "Self" लिखकर भी सीधे कैश काउंटर से सुरक्षित नकदी ले सकते हैं। यह 100% वैध और आधिकारिक तरीका है।',
      keyTakeawayHindi: 'बैंक शाखा से विड्रॉल फॉर्म या चेक द्वारा नकद निकालना पूरी तरह सुरक्षित और आधिकारिक तरीका है।'
    },
    {
      id: 'faq_atm_withdrawal_without_card',
      questionHindi: 'क्या बिना ATM Card के पैसे निकाल सकते हैं?',
      answerHindi:
        'हाँ! बैंक शाखा में चेक या विड्रॉल स्लिप से पैसे निकालने के लिए ATM कार्ड की कोई आवश्यकता नहीं होती।\nइसके अलावा कई बैंक अब आधार-आधारित AEPS या अधिकृत बैंक मित्र (ग्राहक सेवा केंद्र) पर अंगूठा लगाकर भी बिना कार्ड के सुरक्षित नकद निकासी की सुविधा देते हैं।',
      keyTakeawayHindi: 'बैंक शाखा में चेक/विड्रॉल फॉर्म से बिना ATM कार्ड के आसानी से पैसे मिल जाते हैं।'
    },
    {
      id: 'faq_atm_card_safety_unwanted',
      questionHindi: 'Debit Card को सुरक्षित कैसे रखें?',
      answerHindi:
        'यदि बैंक ने आपको डेबिट कार्ड भेजा है और आप उसका उपयोग नहीं करना चाहते, तो उसे घर की सुरक्षित अलमारी में रखें।\nकभी भी कार्ड के ऊपर स्केच पेन से पिन न लिखें। आप चाहें तो बैंक शाखा जाकर लिखित आवेदन देकर कार्ड को बंद (Deactivate) भी करवा सकते हैं ताकि कोई वार्षिक शुल्क न कटे।',
      keyTakeawayHindi: 'उपयोग न होने वाले कार्ड को सुरक्षित रखें, उस पर कभी पिन न लिखें या शाखा से बंद करवाएं।'
    }
  ]
}

// Alias for backwards compatibility
SAATHI_ATM_FAQS_BY_PATH['not_interested'] = SAATHI_ATM_FAQS_BY_PATH['decline']

// -------------------------------------------------------------
// 3D. QUESTION 4: ADAPTIVE ACTIVITIES BY PATH (PHASE 5.10)
// -------------------------------------------------------------

export const SAATHI_ATM_ACTIVITIES_BY_PATH: Record<string, SaathiActivityItem[]> = {
  yes_self: [
    {
      id: 'topic_atm_pin_change_safety',
      letterBadge: 'A',
      titleHindi: 'ATM PIN बदलना व कार्ड सुरक्षा',
      subtitleHindi: 'समय-समय पर पिन अपडेट करना व सुरक्षा आदतें',
      descriptionHindi: 'ATM मशीन या नेटबैंकिंग से नया 4-अंकों का गुप्त पिन बनाना और कीपैड ढंकने की आदत।',
      actionLabelHindi: 'सुरक्षा आदतें खोलें (आदत 08)',
      targetTab: 'habits',
      targetIndex: 7
    },
    {
      id: 'topic_cdm_cardless_discovery',
      letterBadge: 'B',
      titleHindi: 'Cash Deposit व Cardless कैश निकासी',
      subtitleHindi: 'CDM मशीन और UPI-ATM की समझ',
      descriptionHindi: 'बिना बैंक लाइन में लगे CDM में पैसे जमा करना और बिना डेबिट कार्ड केवल UPI से कैश निकालना।',
      actionLabelHindi: 'डिस्कवरी गाइड खोलें',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'cdm_cardless_discovery'
    }
  ],
  with_help: [
    {
      id: 'topic_atm_step_by_step',
      letterBadge: 'A',
      titleHindi: 'ATM से कैश निकासी के 4 चरण',
      subtitleHindi: 'कार्ड डालना, पिन और कैश लेना',
      descriptionHindi: 'हरी बत्ती जलने पर कार्ड डालना, भाषा चुनना, पिन दर्ज करना और कैश व कार्ड सुरक्षित वापस लेने का क्रम।',
      actionLabelHindi: 'स्टेप-बाय-स्टेप गाइड खोलें',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'atm_step_by_step'
    },
    {
      id: 'topic_atm_safety',
      letterBadge: 'B',
      titleHindi: 'ATM PIN गोपनीयता व सुरक्षित आदतें',
      subtitleHindi: 'शोल्डर सर्फिंग और गार्ड से बचाव',
      descriptionHindi: 'किसी अनजान को कार्ड न सौंपना, कीपैड छाते की तरह ढंकना और जाने से पहले Cancel बटन दबाना।',
      actionLabelHindi: 'स्कैम अलर्ट खोलें (स्कैम 13)',
      targetTab: 'scams',
      targetId: 'scam-13'
    }
  ],
  no: [
    {
      id: 'topic_atm_machine_intro',
      letterBadge: 'A',
      titleHindi: 'ATM कार्ड और मशीन का सरल परिचय',
      subtitleHindi: 'कार्ड की चिप, स्लॉट व स्क्रीन',
      descriptionHindi: 'डेबिट कार्ड के आगे-पीछे क्या होता है, कार्ड स्लॉट की हरी बत्ती और कीपैड के लाल Cancel बटन की पहचान।',
      actionLabelHindi: 'ATM मशीन गाइड खोलें',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'atm_step_by_step'
    },
    {
      id: 'topic_atm_simulated_practice',
      letterBadge: 'B',
      titleHindi: 'बिना पैसे निकाले ATM का सुरक्षित अभ्यास',
      subtitleHindi: 'बैलेंस इन्क्वायरी से सुरक्षित समझ',
      descriptionHindi: '4 चरणों में स्क्रीन-दर-स्क्रीन देखना: कार्ड डालना, भाषा चयन, पिन एंट्री और Cancel दबाकर बाहर आना।',
      actionLabelHindi: 'सिमुलेशन गाइड खोलें',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'atm_simulated_practice'
    }
  ],
  decline: [
    {
      id: 'topic_branch_withdrawal_basics',
      letterBadge: 'A',
      titleHindi: 'बैंक शाखा से चेक व फॉर्म द्वारा नकद निकासी',
      subtitleHindi: 'विड्रॉल स्लिप व सेल्फ चेक का सही तरीका',
      descriptionHindi: 'काउंटर पर पासबुक के साथ विड्रॉल फॉर्म भरना और चेक पर Self लिखकर सुरक्षित नकद प्राप्त करना।',
      actionLabelHindi: 'शाखा गाइड खोलें',
      targetTab: 'posters',
      targetIndex: 1,
      isMicroLesson: true,
      microLessonKey: 'branch_withdrawal_basics'
    },
    {
      id: 'topic_debit_card_safety_alternatives',
      letterBadge: 'B',
      titleHindi: 'अनचाहे डेबिट कार्ड की सुरक्षा व सीमाएं',
      subtitleHindi: 'कार्ड लॉक करना व वार्षिक शुल्क से बचाव',
      descriptionHindi: 'यदि ATM कार्ड इस्तेमाल नहीं करना है तो उसे सुरक्षित रखना, लिमिट शून्य करना या शाखा से बंद करवाना।',
      actionLabelHindi: 'सुरक्षा आदतें खोलें (आदत 09)',
      targetTab: 'habits',
      targetId: 'habit-09',
      targetIndex: 8
    }
  ]
}

// Alias for backwards compatibility
SAATHI_ATM_ACTIVITIES_BY_PATH['not_interested'] = SAATHI_ATM_ACTIVITIES_BY_PATH['decline']

// -------------------------------------------------------------
// 4. MICRO-LESSONS CONTENT (PHASE 5.8 & 5.9)
// -------------------------------------------------------------

export interface MicroLessonStep {
  titleHindi: string
  descriptionHindi: string
  detailActionKey?: SaathiMicroLessonKey
  detailActionLabel?: string
}

export interface MicroLessonItem {
  titleHindi: string
  englishTitle: string
  subtitleHindi: string
  steps: MicroLessonStep[]
  safetyTipHindi: string
}

export const BALANCE_METHODS_OVERVIEW_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'बैंक बैलेंस जानने के 4 सरल तरीके',
  englishTitle: 'Four Simple Ways to Check Your Bank Balance',
  subtitleHindi: 'वरिष्ठ नागरिक बिना बैंक शाखा की लाइन में लगे अपनी सुविधा अनुसार इन 4 सुरक्षित तरीकों में से कोई भी चुन सकते हैं:',
  steps: [
    {
      titleHindi: '1. मिस्ड कॉल बैंकिंग (Missed Call Banking) — बिना इंटरनेट व साधारण फोन',
      descriptionHindi:
        '• कैसे काम करता है: अपने बैंक खाते से जुड़े पंजीकृत (Registered) मोबाइल नंबर से बैंक के अधिकृत नंबर पर केवल 1 घंटी दें। 1-2 घंटी बाद कॉल अपने आप कट जाती है।\n• परिणाम: कुछ ही सेकंड में बैंक की ओर से आपके Messages इनबॉक्स में बैलेंस का आधिकारिक SMS आ जाता है।\n• सबसे बड़ा लाभ: इसके लिए न स्मार्टफोन चाहिए, न इंटरनेट, और न ही कोई पासवर्ड याद रखना। साधारण कीपैड फोन से भी 100% संभव।\n• ध्यान दें: मोबाइल नंबर पहले से बैंक खाते में लिंक होना आवश्यक है। नंबर हमेशा अपनी बैंक पासबुक या चेकबुक से सत्यापित करें।',
      detailActionKey: 'missed_call_balance',
      detailActionLabel: 'मिस्ड कॉल नंबर व विस्तृत गाइड देखें →'
    },
    {
      titleHindi: '2. एसएमएस बैंकिंग (SMS Banking) — आसान टेक्स्ट संदेश',
      descriptionHindi:
        '• कैसे काम करता है: अपने पंजीकृत मोबाइल से बैंक के निर्धारित नंबर पर एक तय कोड (जैसे "BAL") लिखकर सामान्य SMS भेजें। बैंक उत्तर में शेष राशि का SMS भेजता है।\n• सबसे बड़ा लाभ: कमजोर नेटवर्क वाले इलाकों में भी बिना किसी ऐप या इंटरनेट के बैलेंस और मिनी स्टेटमेंट मंगाया जा सकता है।\n• ध्यान दें: विभिन्न बैंकों के SMS कोड व नंबर भिन्न होते हैं। आपके दूरसंचार ऑपरेटर के प्लान अनुसार सामान्य SMS चार्ज लागू हो सकता है।',
    },
    {
      titleHindi: '3. एटीएम बैलेंस इन्क्वायरी (ATM Balance Enquiry) — सीधे मशीन पर जांच',
      descriptionHindi:
        '• कैसे काम करता है: पास के किसी भी ATM में अपना डेबिट कार्ड डालें, भाषा चुनें, कीपैड को हाथ से ढंककर 4-अंकों का गुप्त PIN डालें और "Balance Enquiry" चुनें।\n• सबसे बड़ा लाभ: नकद निकालने से पहले स्क्रीन पर या कागजी पर्ची (Slip) पर सटीक बैलेंस की पक्की जांच।\n• सुरक्षा नियम: PIN डालते समय कीपैड को हमेशा दूसरे हाथ से ढंकें। किसी अजनबी को कार्ड न दें और निकलने से पहले लाल Cancel बटन अवश्य दबाएं।',
      detailActionKey: 'atm_step_by_step',
      detailActionLabel: 'ATM से बैलेंस जांचने के चरण देखें →'
    },
    {
      titleHindi: '4. यूपीआई व मोबाइल बैंकिंग (UPI / Mobile Banking App) — 24 घंटे तत्काल ब्यौरा',
      descriptionHindi:
        '• कैसे काम करता है: स्मार्टफोन में अधिकृत UPI ऐप (Google Pay, PhonePe, Paytm, BHIM) या बैंक ऐप खोलें, "Check Balance" पर टैप करके अपना गुप्त UPI PIN दर्ज करें।\n• परिणाम: 2 सेकंड में स्क्रीन पर आपका वर्तमान खाता बैलेंस और बैंक खाता संख्या का ब्यौरा दिख जाता है।\n• सबसे बड़ा लाभ: घर बैठे किसी भी समय (दिन या रात) पेंशन, ब्याज और पिछले सभी भुगतानों का पूरा ब्यौरा (Passbook History) देखा जा सकता है।\n• ध्यान दें: इसके लिए स्मार्टफोन और इंटरनेट जरूरी है। याद रखें: अपना UPI PIN केवल बैलेंस देखने या पैसे भेजने के लिए ही डाला जाता है; किसी अन्य के कहने पर कभी PIN न डालें।',
      detailActionKey: 'netbanking_discovery',
      detailActionLabel: 'नेट बैंकिंग व ऐप सुविधाएं देखें →'
    }
  ],
  safetyTipHindi:
    'सुरक्षा नियम: बैंक कभी भी फोन, SMS या व्हाट्सएप पर आपका OTP, गुप्त PIN या पासवर्ड नहीं पूछता। मिस्ड कॉल या SMS नंबर हमेशा अपनी बैंक पासबुक, चेकबुक या बैंक शाखा के आधिकारिक बोर्ड से सत्यापित करें; इंटरनेट पर अनजान सर्च परिणामों में दिखे फोन नंबरों पर कभी कॉल न करें।'
}

export const TRANSFER_COMPARISON_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'पैसे भेजने के 4 तरीके: UPI, IMPS, NEFT और RTGS',
  englishTitle: 'Choosing the Right Money Transfer Method: UPI, IMPS, NEFT & RTGS',
  subtitleHindi: 'अपनी आवश्यकता और राशि के अनुसार सही विकल्प चुनें (अभ्यास में कोई वास्तविक पैसा भेजने की जरूरत नहीं):',
  steps: [
    {
      titleHindi: '1. UPI (दैनिक छोटे व मध्यम भुगतान)',
      descriptionHindi: '• मुख्य उपयोग: सब्जी, राशन, दवा, बिल व परिवार को त्वरित भुगतान\n• गति: तुरंत (2 से 3 सेकंड)\n• महत्वपूर्ण सीमा: सामान्यतः ₹1 लाख से ₹2 लाख तक (बैंक/ऐप नियमानुसार)\n• उपलब्धता: 24×7×365। केवल मोबाइल नंबर या QR कोड से भुगतान संभव।'
    },
    {
      titleHindi: '2. IMPS (तुरंत बैंक खाता ट्रांसफर)',
      descriptionHindi: '• मुख्य उपयोग: किसी भी बैंक खाते में सीधे तुरंत पैसे भेजना\n• गति: तुरंत (Real-Time)\n• महत्वपूर्ण सीमा: सामान्यतः ₹5 लाख तक (बैंक नियमानुसार)\n• उपलब्धता: 24×7×365। इसके लिए बैंक खाता संख्या और IFSC कोड आवश्यक होता है।'
    },
    {
      titleHindi: '3. NEFT (सामान्य ट्रांसफर व बिल/फीस)',
      descriptionHindi: '• मुख्य उपयोग: सामान्य बैंक ट्रांसफर, कॉलेज/स्कूल फीस या वेंडर भुगतान\n• गति: 30 मिनट से 2 घंटे के भीतर (आधे-आधे घंटे के बैच में निपटान)\n• महत्वपूर्ण सीमा: कोई आधिकारिक न्यूनतम सीमा नहीं (RBI द्वारा कोई ऊपरी सीमा नहीं, बैंक नियमानुसार लागू)\n• उपलब्धता: 24×7×365।'
    },
    {
      titleHindi: '4. RTGS (बड़ी धनराशि का ट्रांसफर — न्यूनतम ₹2 लाख)',
      descriptionHindi: '• मुख्य उपयोग: बड़ी धनराशि का सुरक्षित ट्रांसफर (प्रॉपर्टी, वाहन या बड़ा व्यापारिक भुगतान)\n• गति: तुरंत और व्यक्तिगत निपटान (Real-Time Gross Settlement)\n• अति-महत्वपूर्ण नियम: न्यूनतम राशि ₹2,00,000 (दो लाख रुपये)! ₹2 लाख से कम के लिए RTGS नहीं हो सकता।\n• उपलब्धता: 24×7×365।'
    }
  ],
  safetyTipHindi: 'सुरक्षा नियम: सीमाएं और शुल्क प्रत्येक बैंक के नियमानुसार भिन्न हो सकते हैं। बड़ी राशि (NEFT/RTGS) भेजने से पहले हमेशा खाता संख्या और नाम दोबारा जांचें; पहले ₹100 भेजकर पुष्टि करना सबसे समझदारी भरा तरीका है।'
}

export const MISSED_CALL_BALANCE_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'बिना इंटरनेट मिस्ड कॉल से बैलेंस जानना',
  englishTitle: 'Checking Balance via Official Missed Call Banking',
  subtitleHindi: '2 मिनट में अपने बैंक का अधिकृत नंबर अपने फोन में सेव करें:',
  steps: [
    {
      titleHindi: 'चरण 1: बैंक से जुड़े सिम की पुष्टि',
      descriptionHindi: 'मिस्ड कॉल केवल उसी सिम कार्ड से काम करती है जो आपके बैंक खाते में पंजीकृत (Registered) है। यदि पहली बार सेवा शुरू कर रहे हैं, तो कुछ बैंकों में रजिस्ट्रेशन SMS भेजना पड़ सकता है।'
    },
    {
      titleHindi: 'चरण 2: अधिकृत मिस्ड कॉल नंबर डायल करें',
      descriptionHindi: 'प्रमुख बैंकों के अधिकृत नंबर (समय-समय पर अपडेट हो सकते हैं):\n• State Bank of India (SBI): 9223766666\n• Punjab National Bank (PNB): 1800 180 2223 या 0120-2303090\n• Bank of Baroda (BOB): 8468001111\n• HDFC Bank: 1800 270 3333\n• ICICI Bank: 9594612612\n(महत्वपूर्ण: नंबर डायल करने से पहले हमेशा अपनी बैंक पासबुक, चेकबुक या बैंक शाखा के नोटिस से पुष्टि अवश्य करें।)'
    },
    {
      titleHindi: 'चरण 3: एक घंटी बजने दें',
      descriptionHindi: 'नंबर डायल करने पर 1 या 2 घंटी बजने के बाद कॉल स्वतः कट जाती है। इसके लिए सामान्यतः कोई अतिरिक्त कॉल शुल्क नहीं कटता, परंतु दूरसंचार ऑपरेटर के कॉलिंग प्लान अनुसार नियम लागू हो सकते हैं।'
    },
    {
      titleHindi: 'चरण 4: SMS संदेश देखें',
      descriptionHindi: 'कुछ ही समय (नेटवर्क स्थिति अनुसार 10 सेकंड से लेकर कभी-कभी 2-5 मिनट) में बैंक से आपके Messages इनबॉक्स में बैलेंस का आधिकारिक SMS आ जाएगा।'
    }
  ],
  safetyTipHindi: 'सावधानी: बैंक कभी भी फोन करके आपसे बैलेंस, पासवर्ड, PIN या OTP नहीं पूछता। यदि कोई अनजान व्यक्ति बैंक अधिकारी बनकर कॉल करे, तो कभी कोई जानकारी न दें।'
}

export const NETBANKING_DISCOVERY_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'Internet Banking से आप क्या-क्या कर सकते हैं?',
  englishTitle: 'Discovering Internet Banking Safely',
  subtitleHindi: 'बैंक शाखा जाए बिना घर बैठे मिलने वाली 5 बड़ी डिजिटल सुविधाएं:',
  steps: [
    {
      titleHindi: '1. बैलेंस व PDF स्टेटमेंट डाउनलोड',
      descriptionHindi: '24 घंटे कभी भी खाते का बैलेंस देखें और पिछले 1 से 5 वर्षों का विस्तृत बैंक स्टेटमेंट (PDF) सीधे डाउनलोड करें।'
    },
    {
      titleHindi: '2. फिक्स्ड डिपॉजिट (FD/RD) घर बैठे खोलना',
      descriptionHindi: 'बिना बैंक शाखा के चक्कर लगाए नई FD या RD बनाना, ब्याज दरें जांचना और परिपक्वता (Maturity) पर नवीनीकरण करना।'
    },
    {
      titleHindi: '3. सुरक्षित मनी ट्रांसफर (NEFT / RTGS / IMPS)',
      descriptionHindi: 'परिवार, बच्चों की कॉलेज फीस या किसी भी खाते में बिना बैंक काउंटर की लाइन में लगे सुरक्षित ट्रांसफर।'
    },
    {
      titleHindi: '4. बिल, टैक्स व पेंशन लाइफ सर्टिफिकेट',
      descriptionHindi: 'बिजली, पानी का बिल भुगतान और वरिष्ठ नागरिकों हेतु डिजिटल जीवन प्रमाण पत्र की ट्रैकिंग।'
    },
    {
      titleHindi: '5. चेकबुक व डेबिट कार्ड प्रबंधन',
      descriptionHindi: 'नई चेकबुक मंगाना, खोए हुए ATM कार्ड को एक सेकंड में ब्लॉक करना या कार्ड की ऑनलाइन लिमिट सेट करना।'
    }
  ],
  safetyTipHindi: 'सुरक्षा नियम: केवल ताले के निशान (https) पर निर्भर न रहें; बैंक का असली आधिकारिक वेब पता टाइप करें, वर्चुअल कीबोर्ड का उपयोग करें और काम पूरा होने पर हमेशा Logout करें।'
}

export const QR_HISTORY_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'Payment History व 12-अंकों का UTR नंबर देखना',
  englishTitle: 'How to View Payment History & Transaction UTR Number',
  subtitleHindi: 'दुकानदार या बिल भुगतान का पक्का प्रमाण 1 मिनट में अपने फोन पर निकालें:',
  steps: [
    {
      titleHindi: '1. ऐप की History खोलें',
      descriptionHindi: 'Google Pay, PhonePe या Paytm खोलकर मुख्य स्क्रीन पर नीचे "History" या "Transaction History" पर टैप करें।'
    },
    {
      titleHindi: '2. संबंधित लेनदेन चुनें',
      descriptionHindi: 'जिस लेनदेन की रसीद देखनी है, उस पर टैप करें। स्क्रीन पर दुकानदार का नाम, भुगतान का समय और राशि दिख जाएगी।'
    },
    {
      titleHindi: '3. 12-अंकों का UTR / UPI Ref No. नोट करें',
      descriptionHindi: 'स्क्रीन पर नीचे "UPI Transaction ID" या "UTR" लिखा होगा (उदा. 4123XXXXXXXX)। किसी भी शिकायत या पूछताछ में बैंक केवल यही नंबर मांगता है।'
    },
    {
      titleHindi: '4. शिकायत दर्ज करना (यदि आवश्यक हो)',
      descriptionHindi: 'यदि पैसे कट गए पर सामान नहीं मिला, तो उसी स्क्रीन पर नीचे "Have an issue?" या "Help" पर टैप करके शिकायत दर्ज करें।'
    }
  ],
  safetyTipHindi: 'सावधानी: गलत लेनदेन की सूचना तुरंत बैंक और ऐप में दें; देरी करने से पैसा फ्रीज कराना कठिन हो जाता है।'
}

export const QR_SAFE_PRACTICE_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'बिना पैसे भेजे QR स्कैन का सुरक्षित अभ्यास',
  englishTitle: 'Safe QR Code Observation Practice Without Sending Money',
  subtitleHindi: 'आत्मविश्वास पाने के लिए बिना एक भी रुपया खर्च किए 4 आसान चरणों में अभ्यास करें:',
  steps: [
    {
      titleHindi: 'चरण 1: स्कैनर खोलें',
      descriptionHindi: 'PhonePe, Google Pay या Paytm खोलकर सबसे ऊपर बने "Scan QR" (कैमरा) आइकॉन पर टैप करें।'
    },
    {
      titleHindi: 'चरण 2: कैमरे को कोड पर केंद्रित करें',
      descriptionHindi: 'फोन के कैमरे को किसी भी दुकान या घर के पैकेट पर बने QR कोड के सामने 6 इंच की दूरी पर सीधा रखें।'
    },
    {
      titleHindi: 'चरण 3: स्क्रीन पर नाम देखें',
      descriptionHindi: 'फोन तुरंत बीप करेगा और स्क्रीन पर दुकानदार का नाम और राशि भरने की जगह दिखाएगा। इसे ध्यान से पढ़ें।'
    },
    {
      titleHindi: 'चरण 4: सुरक्षित रूप से Cancel दबाएं',
      descriptionHindi: 'स्क्रीन के ऊपर बाएं कोने में बने "X" या फोन के Back बटन को दबा दें। जब तक आप PIN नहीं डालते, पैसे कभी नहीं कटते!'
    }
  ],
  safetyTipHindi: 'सुरक्षा नियम: PIN स्क्रीन आने से पहले कभी भी Back या Cancel दबाकर बाहर निकला जा सकता है।'
}

export const QR_VISUAL_INTRO_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'दुकानों पर QR Code की पहचान व साउंडबॉक्स',
  englishTitle: 'Visual Introduction to Merchant QR Codes & Voice Soundboxes',
  subtitleHindi: 'बाज़ार में हर दुकान पर दिखने वाले चौकोर कोड और नीले/पीले डिब्बे की आसान समझ:',
  steps: [
    {
      titleHindi: '1. QR कोड का प्लास्टिक स्टैंड',
      descriptionHindi: 'दुकानदार के गल्ले पर लगा सफेद प्लास्टिक स्टैंड, जिस पर काला चौकोर कोड और दुकानदार का नाम लिखा होता है।'
    },
    {
      titleHindi: '2. साउंडबॉक्स (Voice Box)',
      descriptionHindi: 'दुकान पर रखा छोटा स्पीकर जो पैसे मिलने पर बोलता है (जैसे: "Paytm पर ₹50 प्राप्त हुए")। इससे दुकानदार को तुरंत पुष्टि हो जाती है।'
    },
    {
      titleHindi: '3. फिक्स QR बनाम डायनामिक QR',
      descriptionHindi: 'दुकानदार के स्टैंड पर लगा कोड "फिक्स" होता है जिसमें राशि आपको भरनी होती है। सुपरमार्केट के कंप्यूटर स्क्रीन पर दिखने वाले कोड में राशि पहले से भरी होती है।'
    }
  ],
  safetyTipHindi: 'नियम: हमेशा स्क्रीन पर नाम और राशि जांचें। यदि साउंडबॉक्स से आवाज न भी आए, तो आपकी ऐप स्क्रीन की हरी टिक रसीद पक्का प्रमाण है।'
}

export const UPI_APP_RECOGNITION_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'फोन में असली UPI App पहचानना',
  englishTitle: 'How to Recognize Official UPI Apps & Avoid Imposter Apps',
  subtitleHindi: 'अपनी स्क्रीन पर अधिकृत और सुरक्षित बैंकिंग ऐप्स की पहचान करें:',
  steps: [
    {
      titleHindi: '1. Google Pay',
      descriptionHindi: 'सफेद गोल पृष्ठभूमि पर लाल, पीले, हरे और नीले रंग का "G" अक्षर।'
    },
    {
      titleHindi: '2. PhonePe',
      descriptionHindi: 'गहरे बैंगनी रंग का चौकोर डिब्बा जिसमें सफेद देवनागरी में "पे" लिखा होता है।'
    },
    {
      titleHindi: '3. Paytm',
      descriptionHindi: 'सफेद और हल्के नीले रंग में स्पष्ट रूप से "Paytm" लिखा लोगो।'
    },
    {
      titleHindi: '4. BHIM (भारत सरकार / NPCI)',
      descriptionHindi: 'हरे और नारंगी रंग के तिरंगे जैसा त्रिभुजाकार लोगो।'
    }
  ],
  safetyTipHindi: 'सावधानी: व्हाट्सएप या अनजान कॉल पर किसी के कहने पर AnyDesk, TeamViewer या QuickShare जैसा ऐप कभी न डालें।'
}

export const CDM_CARDLESS_DISCOVERY_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'Cash Deposit (CDM) व Cardless Cash निकासी',
  englishTitle: 'Cash Deposit Machines (CDM/CRM) & Cardless Cash Withdrawal',
  subtitleHindi: 'बिना बैंक लाइन में लगे नकद जमा करने और बिना डेबिट कार्ड कैश निकालने की आधुनिक तकनीक:',
  steps: [
    {
      titleHindi: '1. CDM मशीन से 24x7 नकद जमा',
      descriptionHindi: 'कार्ड डालकर या सीधे 11-अंकों का खाता नंबर दर्ज करके ₹100, ₹200 और ₹500 के नोट स्लॉट में रखें। मशीन नोट गिनकर स्क्रीन पर कुल राशि दिखाती है और तुरंत रसीद देती है।'
    },
    {
      titleHindi: '2. UPI-ATM से बिना कार्ड कैश निकासी',
      descriptionHindi: 'ATM स्क्रीन पर "UPI Cash" चुनें और राशि (जैसे ₹1,000) दर्ज करें। स्क्रीन पर आए डायनामिक QR कोड को अपने Google Pay/PhonePe से स्कैन कर UPI PIN डालें—कैश तुरंत निकल आता है!'
    },
    {
      titleHindi: '3. बैंक-सपोर्टेड कार्डलेस विड्रॉल (YONO / iMobile)',
      descriptionHindi: 'बैंक ऐप में "Cardless Cash" विकल्प चुनकर 6-अंकों का OTP प्राप्त करें। ATM में जाकर मोबाइल नंबर और OTP दर्ज करके बिना कार्ड के नकदी निकालें।'
    },
    {
      titleHindi: '4. सीमाएं और उपलब्धता',
      descriptionHindi: 'सभी ATM मशीनों में CDM या UPI-ATM की सुविधा नहीं होती। अलग-अलग बैंकों में इसकी दैनिक सीमाएं (सामान्यतः ₹10,000 से ₹25,000 प्रति दिन) भिन्न हो सकती हैं।'
    }
  ],
  safetyTipHindi: 'सावधानी: CDM में मुड़े, कटे-फटे या टेप लगे नोट न डालें। UPI-ATM से पैसे निकालते समय भी मोबाइल स्क्रीन पर राशि की जांच करें।'
}

export const ATM_STEP_BY_STEP_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'ATM से कैश निकासी के 4 सुरक्षित चरण',
  englishTitle: 'Step-by-Step Guide to Safe ATM Cash Withdrawal',
  subtitleHindi: 'बिना किसी की सहायता लिए अपने हाथों से स्वतंत्र रूप से कैश निकालने का क्रम:',
  steps: [
    {
      titleHindi: 'चरण 1: स्लॉट पर हरी बत्ती व कार्ड डालना',
      descriptionHindi: 'कार्ड स्लॉट पर हरी बत्ती जलने पर चिप वाले हिस्से को ऊपर और आगे की ओर रखकर कार्ड धीरे से डालें। मशीन कार्ड को लॉक रखे तो खींचने की कोशिश न करें।'
    },
    {
      titleHindi: 'चरण 2: भाषा व कैश विड्रॉल चयन',
      descriptionHindi: 'स्क्रीन पर अपनी पसंदीदा भाषा (हिंदी/English) चुनें। इसके बाद "Banking" → "Cash Withdrawal" (नकद निकासी) और खाता प्रकार (Savings/बचत खाता) चुनें।'
    },
    {
      titleHindi: 'चरण 3: कीपैड को छाते की तरह ढंककर PIN डालना',
      descriptionHindi: 'अपने दूसरे हाथ या पर्स से कीपैड को ऊपर से पूरा ढंकें। किसी को न दिखने दें और 4-अंकों का गुप्त PIN दर्ज करें।'
    },
    {
      titleHindi: 'चरण 4: कैश, कार्ड व रसीद लेना और Cancel दबाना',
      descriptionHindi: 'पहले कैश स्लॉट से नोट गिनकर निकालें, फिर बीप की आवाज़ आने पर अपना कार्ड लें। अंत में कीपैड का लाल "Cancel" बटन दबाएं जब तक हरी बत्ती न जल जाए।'
    }
  ],
  safetyTipHindi: 'सुरक्षा नियम: कभी भी किसी अजनबी या गार्ड को अपना कार्ड और पिन न सौंपें। जाने से पहले हमेशा लाल Cancel बटन दबाएं।'
}

export const ATM_SIMULATED_PRACTICE_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'बिना पैसे निकाले ATM का सुरक्षित अभ्यास',
  englishTitle: 'Safe ATM Process Practice Without Withdrawing Money',
  subtitleHindi: 'बिना एक भी रुपया निकाले या रिस्क लिए ATM की पूरी कार्यप्रणाली समझें:',
  steps: [
    {
      titleHindi: 'चरण 1: कार्ड का निरीक्षण',
      descriptionHindi: 'अपने डेबिट कार्ड पर आगे लगी सुनहरी चिप, 16-अंकों का नंबर और पीछे काली चुंबकीय पट्टी व 3-अंकों का CVV देखें। कभी किसी को CVV न बताएं।'
    },
    {
      titleHindi: 'चरण 2: मशीन के कीपैड और स्लॉट की जांच',
      descriptionHindi: 'जांचें कि कार्ड लगाने वाली जगह पर कोई ढीला प्लास्टिक (स्किमर) तो नहीं लगा है। कीपैड ठोस और सामान्य दिखना चाहिए।'
    },
    {
      titleHindi: 'चरण 3: बैलेंस इन्क्वायरी का सुरक्षित अभ्यास',
      descriptionHindi: 'कैश निकालने के बजाय केवल "Balance Enquiry" (बैलेंस देखना) चुनें। अपना पिन डालें, स्क्रीन पर बैलेंस देखें और पर्ची लें।'
    },
    {
      titleHindi: 'चरण 4: लाल Cancel बटन दबाकर बाहर आना',
      descriptionHindi: 'बिना पैसे निकाले भी आपको कार्ड डालना, भाषा चुनना और पिन टाइप करने का पूरा वास्तविक अनुभव मिल जाता है। लाल Cancel बटन दबाकर कार्ड वापस ले लें।'
    }
  ],
  safetyTipHindi: 'महत्वपूर्ण: अभ्यास के दौरान किसी भी डमी स्क्रीन या ऐप में अपना असली 4-अंकों का बैंक PIN कभी टाइप न करें।'
}

export const BRANCH_WITHDRAWAL_BASICS_MICRO_LESSON: MicroLessonItem = {
  titleHindi: 'बैंक शाखा से चेक व विड्रॉल फॉर्म द्वारा नकद निकासी',
  englishTitle: 'Safe Cash Withdrawal via Bank Branch & Cheque',
  subtitleHindi: 'बिना ATM कार्ड के बैंक काउंटर से सम्मानित और सुरक्षित तरीके से पैसे निकालने के 4 नियम:',
  steps: [
    {
      titleHindi: 'चरण 1: विड्रॉल फॉर्म (निकासी पर्ची) भरना',
      descriptionHindi: 'शाखा में काउंटर से "विड्रॉल फॉर्म" लें। तारीख, खाता संख्या, नाम और शब्दों व अंकों में राशि (जैसे ₹10,000) लिखें और अपने हस्ताक्षर करें।'
    },
    {
      titleHindi: 'चरण 2: मूल पासबुक साथ रखना अनिवार्य',
      descriptionHindi: 'विड्रॉल फॉर्म से पैसे निकालने के लिए बैंक खाते की मूल पासबुक साथ ले जाना अनिवार्य होता है। केवल खाताधारक स्वयं ही इससे पैसे निकाल सकता है।'
    },
    {
      titleHindi: 'चरण 3: "Self" चेक का सुरक्षित उपयोग',
      descriptionHindi: 'अपनी चेकबुक में Pay की जगह "Self" या "खुद" लिखें। तारीख और राशि लिखकर दो हस्ताक्षर करें (एक आगे, एक पीछे)। चेक से कोई भी व्यक्ति आपकी अनुमति से पैसे ले सकता है।'
    },
    {
      titleHindi: 'चरण 4: कैशियर से नोट गिनना व रसीद',
      descriptionHindi: 'कैश काउंटर पर नोटों की गड्डी लेते ही काउंटर पर ही नोट गिनें। यदि कोई नोट फटा या गंदा हो तो तुरंत कैशियर से बदलवा लें।'
    }
  ],
  safetyTipHindi: 'सावधानी: विड्रॉल फॉर्म केवल बैंक शाखा के अंदर ही भरें और खाली हस्ताक्षरित चेक कभी किसी के हाथ में न छोड़ें।'
}

export const LOST_PHONE_MICRO_LESSON = {
  titleHindi: 'फोन खो जाए तो क्या करें? पहले से तैयारी रखें',
  englishTitle: 'Essential Phone Settings to Verify Before a Phone is Ever Misplaced',
  subtitleHindi: '2 मिनट की यह छोटी सी तैयारी फोन खोने की स्थिति में आपकी सबसे बड़ी सुरक्षा बनती है:',
  platforms: [
    {
      platformNameHindi: 'Android फोन के लिए (Samsung, Redmi, Realme, Vivo, आदि)',
      platformBadge: 'Android',
      steps: [
        'फोन की Settings खोलें → "Google" (या All Services) पर टैप करें।',
        '"Find My Device" (मेरा डिवाइस ढूंढें) पर टैप करें और सुनिश्चित करें कि यह "On" है।',
        'पीछे लौटकर "Manage your Google Account" → "Security" (सुरक्षा) टैब पर जाएं।',
        'नीचे स्क्रॉल करके "Recovery phone" और "Recovery email" देखें—जांचें कि यहाँ आपका या परिवार के किसी सदस्य का सही नंबर दर्ज है।'
      ],
      tipHindi: 'घर के कंप्यूटर पर android.com/find लिंक को बुकमार्क कर लें ताकि जरूरत पड़ने पर तुरंत खोला जा सके।'
    },
    {
      platformNameHindi: 'Apple iPhone के लिए',
      platformBadge: 'iPhone',
      steps: [
        'फोन की Settings खोलें → सबसे ऊपर अपने नाम (Apple ID) पर टैप करें।',
        '"Find My" पर टैप करें और "Find My iPhone" व "Send Last Location" को "On" रखें।',
        '"Sign-In & Security" में जाकर अपना रिकवरी ईमेल और विश्वसनीय फोन नंबर जांचें।'
      ],
      tipHindi: 'किसी भी कंप्यूटर से icloud.com/find पर जाकर फोन की स्थिति देखी जा सकती है।'
    },
    {
      platformNameHindi: 'सभी वरिष्ठ नागरिकों के लिए यूनिवर्सल सुरक्षा नियम (Universal Rule)',
      platformBadge: 'सार्वभौमिक नियम',
      steps: [
        'अपने फोन के डायलर पर *#06# डायल करें—स्क्रीन पर 15-अंकों का IMEI नंबर दिखेगा।',
        'इस 15-अंकों के IMEI नंबर को अपनी घर की डायरी में पेन से लिख लें।',
        'यदि फोन कभी खो जाए, तो तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें और CEIR पोर्टल (ceir.gov.in) पर इसी IMEI नंबर से फोन ब्लॉक करवाएं।'
      ],
      tipHindi: '15-अंकों का IMEI नंबर और आपातकालीन हेल्पलाइन 1930 घर की डायरी में लिखकर रखें।'
    }
  ]
}

// -------------------------------------------------------------
// 5. THE FOUR CORE QUESTIONS (ADAPTIVE QUESTION 2)
// -------------------------------------------------------------

export const SAATHI_CORE_QUESTIONS: SaathiQuestion[] = [
  // QUESTION 1: MOBILE SECURITY
  {
    id: 'q1_mobile',
    order: 1,
    titleHindi: 'आपका Mobile कैसे खुलता है?',
    englishSubtext: 'How do you unlock your mobile phone?',
    options: [
      {
        id: 'swipe',
        textHindi: 'केवल Swipe करने से',
        subtextHindi: 'स्क्रीन पर कोई पासवर्ड, पिन या लॉक नहीं है'
      },
      {
        id: 'pin_pattern',
        textHindi: 'PIN या Pattern से',
        subtextHindi: '4-6 अंकों का कोड या पैटर्न बनाकर खोलते हैं'
      },
      {
        id: 'biometric',
        textHindi: 'Fingerprint या Face से',
        subtextHindi: 'उंगली रखकर या चेहरा दिखाकर तुरंत खुल जाता है'
      },
      {
        id: 'unknown',
        textHindi: 'मुझे पता नहीं',
        subtextHindi: 'फोन कैसे लॉक या अनलॉक होता है, समझ नहीं आता'
      }
    ],
    adviceByOption: {
      swipe: {
        titleHindi: 'सलाह: फोन पर स्क्रीन लॉक लगाना क्यों ज़रूरी है?',
        explanationHindi:
          'बिना लॉक का फोन घर के खुले दरवाज़े जैसा है। यदि फोन कभी बाज़ार, ऑटो या किसी दुकान पर छूट जाए, तो कोई भी अनजान व्यक्ति आपके बैंक SMS, WhatsApp और निजी जानकारी देख सकता है।',
        practicalSuggestionHindi:
          'अपने फोन की Settings में जाकर 4-अंकों का आसान PIN या Fingerprint लॉक लगाएं और स्क्रीन टाइमआउट को 30 सेकंड या 1 मिनट पर सेट करें।',
        targetTab: 'habits',
        targetId: 'habit-07',
        infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
        infographicTitle: 'आदत 07: फोन को हमेशा लॉक रखें व स्क्रीन टाइमआउट सेट करें'
      },
      pin_pattern: {
        titleHindi: 'शानदार! आपका फोन लॉक से सुरक्षित है',
        explanationHindi:
          'पिन या पैटर्न लॉक रखने से आपका फोन और बैंक SMS सुरक्षित रहते हैं। किसी भी अनजान व्यक्ति के हाथ फोन लगने पर वह इसे नहीं खोल पाएगा।',
        practicalSuggestionHindi:
          'सुविधा के लिए: यदि आपका फोन फिंगरप्रिंट सपोर्ट करता है, तो आप फिंगरप्रिंट भी जोड़ सकते हैं। इससे बार-बार पिन टाइप करने की ज़रूरत नहीं पड़ती और समय बचता है।',
        targetTab: 'habits',
        targetId: 'habit-07',
        infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
        infographicTitle: 'आदत 07: फोन स्क्रीन लॉक व गोपनीयता'
      },
      biometric: {
        titleHindi: 'बहुत बढ़िया! आधुनिक और सबसे सुरक्षित तरीका',
        explanationHindi:
          'फिंगरप्रिंट या फेस लॉक सबसे सुविधाजनक और सुरक्षित है। इसे कोई दूसरा व्यक्ति कॉपी या चोरी नहीं कर सकता।',
        practicalSuggestionHindi:
          'एक जरूरी बात: अपना बैकअप पिन (जो फोन चालू करते समय मांगता है) हमेशा याद रखें या अपनी घर की डायरी में लिखकर रखें ताकि भूलने पर परेशानी न हो।',
        targetTab: 'habits',
        targetId: 'habit-07',
        infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
        infographicTitle: 'आदत 07: फोन सुरक्षा व बैकअप पिन'
      },
      unknown: {
        titleHindi: 'आइए मिलकर देखें कि आपके फोन में कौन सा लॉक है',
        explanationHindi:
          'यह जानना बहुत आसान है: अपने फोन का पावर बटन दबाकर स्क्रीन बंद करें, फिर दोबारा दबाकर स्क्रीन चालू करें। यदि केवल उंगली से स्क्रीन सरकाने (Swipe) पर फोन खुल जाता है, तो कोई लॉक नहीं है। यदि नंबर या पैटर्न मांगता है, तो लॉक लगा हुआ है।',
        practicalSuggestionHindi:
          'यदि कोई लॉक नहीं है, तो परिवार के किसी सदस्य की मदद से 4-अंकों का आसान पिन लगाना सीख सकते हैं।',
        targetTab: 'habits',
        targetId: 'habit-07',
        infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
        infographicTitle: 'आदत 07: स्क्रीन लॉक की पहचान'
      }
    }
  },

  // QUESTION 2: ADAPTIVE QR CODE PAYMENT (PHASE 5.8)
  {
    id: 'q2_qr',
    order: 2,
    titleHindi: 'क्या आप दुकान पर QR Code Scan करके स्वयं Payment कर सकते हैं?',
    englishSubtext: 'Can you independently scan a QR code at a shop and make a payment?',
    options: [
      {
        id: 'yes_self',
        textHindi: 'हाँ, स्वयं करता हूँ',
        subtextHindi: 'दुकान पर कैमरे से QR स्कैन करके खुद राशि व पिन डालकर भुगतान कर लेता हूँ'
      },
      {
        id: 'with_help',
        textHindi: 'किसी की सहायता से करता हूँ',
        subtextHindi: 'दुकानदार या परिवार के सदस्य से करवाता हूँ'
      },
      {
        id: 'cannot_pay',
        textHindi: 'QR Code पहचानता हूँ, लेकिन Payment करना नहीं आता।',
        subtextHindi: 'QR Code का मतलब पता है, लेकिन Scan करके पैसे भेजना नहीं आता।'
      },
      {
        id: 'unknown',
        textHindi: 'QR Code क्या होता है, यह भी नहीं जानता।',
        subtextHindi: 'पहले QR Code पहचानना और उसका उपयोग समझना चाहता हूँ।'
      }
    ],
    adviceByOption: {
      yes_self: {
        titleHindi: 'सलाह: स्वतंत्र QR Payment व उन्नत सुरक्षा',
        explanationHindi:
          'बहुत अच्छा! आप QR Payment करना जानते हैं। अब कुछ ऐसी सुविधाएँ सीख सकते हैं जो आपके Payments को और सुरक्षित तथा सुविधाजनक बना सकती हैं।',
        practicalSuggestionHindi:
          'पेमेंट हिस्ट्री देखना और अनचाहे ऑटो-पे (AutoPay) को रिव्यू करना आपके खाते को 100% सुरक्षित रखता है।',
        targetTab: 'projects',
        targetId: 'project-autopay-management',
        infographicPreview: '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
        infographicTitle: 'प्रोजेक्ट 02: अनचाहा ऑटो-पे (AutoPay) ढूंढना व बंद करना'
      },
      with_help: {
        titleHindi: 'सलाह: थोड़े से अभ्यास से आत्मनिर्भर बनें',
        explanationHindi:
          'आप QR Payment से परिचित हैं। अब थोड़े अभ्यास से इसे स्वयं करना सीख सकते हैं।',
        practicalSuggestionHindi:
          'दुकान पर किसी अन्य को अपना फोन सौंपने के बजाय, खुद स्कैन करने का अभ्यास करें। पिन डालने से पहले हमेशा दुकानदार का नाम और राशि की पुष्टि करें।',
        targetTab: 'upi-payments',
        targetIndex: 8,
        infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
        infographicTitle: 'पाठ 09: फिक्स QR कोड व डायनामिक QR कोड की समझ'
      },
      cannot_pay: {
        titleHindi: 'सलाह: QR Payment सीखने की आसान शुरुआत',
        explanationHindi:
          'कोई बात नहीं! आप QR Code पहचानते हैं, अब सुरक्षित तरीके से Scan करके Payment करने की प्रक्रिया सीखना बहुत आसान है।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: बिना कोई वास्तविक पैसा भेजे, केवल कैमरे से QR कोड स्कैन करने और राशि देखने का सुरक्षित अभ्यास करें। बिना PIN डाले कभी कोई पैसा नहीं कटता।',
        targetTab: 'upi-payments',
        targetIndex: 8,
        infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
        infographicTitle: 'पाठ 09: UPI सीखें — शुरुआत से सुरक्षित भुगतान तक'
      },
      unknown: {
        titleHindi: 'सलाह: QR कोड की पहचान व सरल समझ',
        explanationHindi:
          'QR Code दुकान पर दिखाई देने वाला एक विशेष चौकोर कोड होता है। सबसे पहले इसे पहचानना और इसका उपयोग समझना सबसे आसान और सुरक्षित सीढ़ी है।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: दुकान पर लगा चौकोर कोड केवल बैंक पता होता है। इसे देखने या समझने में कोई जोखिम नहीं है और न ही कोई वास्तविक भुगतान करना पड़ता है।',
        targetTab: 'upi-payments',
        targetIndex: 8,
        infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
        infographicTitle: 'पाठ 09: QR कोड की पहचान व समझ'
      }
    }
  },

  // QUESTION 3: BANK BALANCE
  {
    id: 'q3_balance',
    order: 3,
    titleHindi: 'क्या आप बिना Bank जाए अपने Account का Balance स्वयं देख सकते हैं?',
    englishSubtext: 'Can you check your bank balance independently without visiting the bank?',
    options: [
      {
        id: 'yes_self',
        textHindi: 'हाँ, स्वयं',
        subtextHindi: 'SMS, मिस्ड कॉल, UPI या मोबाइल ऐप से खुद देख लेता हूँ'
      },
      {
        id: 'with_help',
        textHindi: 'किसी की सहायता से',
        subtextHindi: 'परिवार या किसी परिचित से पूछकर पता चलता है'
      },
      {
        id: 'no',
        textHindi: 'नहीं',
        subtextHindi: 'बैंक जाकर पासबुक प्रिंट करवाने पर ही पता चलता है'
      },
      {
        id: 'unknown',
        textHindi: 'उपलब्ध तरीकों की जानकारी नहीं',
        subtextHindi: 'मुझे नहीं पता कि बिना बैंक जाए बैलेंस कैसे देखा जाता है'
      }
    ],
    adviceByOption: {
      yes_self: {
        titleHindi: 'बहुत अच्छा! आप बैलेंस स्वयं देखना जानते हैं',
        explanationHindi:
          'घर बैठे पेंशन या जमा राशि चेक करना बहुत समय बचाता है। अब आप मिनी स्टेटमेंट, PDF स्टेटमेंट डाउनलोड करना या इंटरनेट बैंकिंग की अन्य सुरक्षित सुविधाएं जान सकते हैं।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: अपनी मासिक पेंशन या बचत खाते का ई-स्टेटमेंट (PDF) डाउनलोड करना और सुरक्षित रखना सीखें।',
        targetTab: 'banking-savings',
        targetIndex: 7,
        infographicPreview: '/tutorials/digital-banking/assets/16-net-banking.png',
        infographicTitle: 'पाठ 08: नेट बैंकिंग — ई-स्टेटमेंट व सुरक्षित उपयोग'
      },
      with_help: {
        titleHindi: 'सलाह: थोड़े से अभ्यास से आप खुद बैलेंस देख सकते हैं',
        explanationHindi:
          'दूसरों से बैलेंस पूछने के बजाय आप अपने ही फोन से 1 मिस्ड कॉल देकर या ATM पर बिना किसी की मदद लिए बैलेंस जान सकते हैं। इससे आपका PIN और खाता पूरी तरह गोपनीय रहता है।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: अपने बैंक का अधिकृत मिस्ड कॉल नंबर फोन में सेव करें—एक घंटी बजते ही 10-30 सेकंड में SMS आ जाएगा।',
        targetTab: 'banking-savings',
        targetIndex: 7,
        isMicroLesson: true,
        microLessonKey: 'missed_call_balance',
        infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
        infographicTitle: 'मिस्ड कॉल बैंकिंग: बिना इंटरनेट बैलेंस जांचें'
      },
      no: {
        titleHindi: 'सलाह: बैंक शाखा की लाइन में लगे बिना बैलेंस देखने के 3 आसान तरीके',
        explanationHindi:
          'पेंशन आई या नहीं—यह जानने के लिए बैंक की लंबी लाइन में खड़े होने की ज़रूरत नहीं है। 1. मिस्ड कॉल बैंकिंग, 2. ATM बैलेंस इन्क्वायरी, 3. UPI ऐप।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: सबसे आसान तरीका मिस्ड कॉल है जिसमें न इंटरनेट चाहिए, न कोई ऐप। बस एक मुफ्त कॉल और SMS आपके फोन पर।',
        targetTab: 'banking-savings',
        targetIndex: 7,
        isMicroLesson: true,
        microLessonKey: 'missed_call_balance',
        infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
        infographicTitle: 'मिस्ड कॉल बैंकिंग: घर बैठे बैलेंस पाना'
      },
      unknown: {
        titleHindi: 'सलाह: बिना बैंक जाए बैलेंस जानने के 4 सुरक्षित तरीके',
        explanationHindi:
          'बैंक आपके खाते की जानकारी देने के कई सुरक्षित विकल्प देता है। आप मिस्ड कॉल, बैंक SMS, ATM या UPI में से अपनी पसंद का कोई भी सरल तरीका चुन सकते हैं।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: बैंक खाते से अपना मोबाइल नंबर हमेशा जुड़ा रखें ताकि हर लेनदेन पर बैंक से सीधा और सुरक्षित SMS मिले।',
        targetTab: 'banking-savings',
        targetIndex: 7,
        isMicroLesson: true,
        microLessonKey: 'balance_methods_overview',
        infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
        infographicTitle: 'बैलेंस जानने के 4 सरल तरीके'
      }
    }
  },

  // QUESTION 4: ATM USAGE
  {
    id: 'q4_atm',
    order: 4,
    titleHindi: 'क्या आप ATM से स्वयं पैसे निकाल सकते हैं?',
    englishSubtext: 'Can you withdraw cash from an ATM machine independently?',
    options: [
      {
        id: 'yes_self',
        textHindi: 'हाँ, स्वयं निकालता हूँ',
        subtextHindi: 'मशीन में कार्ड डालकर खुद पिन टाइप करके पैसे निकाल लेता हूँ'
      },
      {
        id: 'with_help',
        textHindi: 'किसी की सहायता से निकालता हूँ',
        subtextHindi: 'साथ में किसी परिवारजन या परिचित को ले जाना पड़ता है'
      },
      {
        id: 'no',
        textHindi: 'नहीं, मुझे नहीं आता',
        subtextHindi: 'मुझे ATM मशीन और कार्ड के इस्तेमाल का तरीका नहीं पता'
      },
      {
        id: 'decline',
        textHindi: 'मैं ATM इस्तेमाल नहीं करना चाहता',
        subtextHindi: 'मुझे बैंक शाखा या पासबुक से ही काम करना ठीक लगता है'
      }
    ],
    adviceByOption: {
      yes_self: {
        titleHindi: 'बहुत अच्छा! आप ATM से Cash निकालना जानते हैं। अब चाहें तो ATM की कुछ और सुविधाएँ जान सकते हैं।',
        explanationHindi:
          'ATM केवल पैसे निकालने तक सीमित नहीं है। अब आप Cash Deposit Machine (CDM) से 24 घंटे सीधे खाते में नकदी जमा करना, बिना कार्ड UPI-ATM से पैसे निकालना और समय-समय पर PIN बदलना सीख सकते हैं।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: अपनी सुरक्षा के लिए समय-समय पर ATM PIN बदलें और CDM मशीन से 24 घंटे बिना बैंक लाइन में लगे नकद जमा करने का तरीका जानें।',
        targetTab: 'scams',
        targetId: 'scam-13',
        infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
        infographicTitle: 'स्कैम 13: ATM फ्रॉड — शोल्डर सर्फिंग व आधुनिक सुविधाएं'
      },
      with_help: {
        titleHindi: 'आप ATM की प्रक्रिया से परिचित हैं। अब थोड़ा अभ्यास करके स्वयं Cash निकालना सीख सकते हैं।',
        explanationHindi:
          'दूसरों को कार्ड और पिन सौंपने के बजाय साथ में खड़े रहकर खुद कार्ड डालने और पिन टाइप करने से आपके पैसे और खाते की गोपनीयता सुरक्षित रहती है। कभी भी किसी अजनबी या गार्ड को कार्ड न दें।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: अगली बार किसी भरोसेमंद परिजन को साथ ले जाएं, लेकिन कार्ड मशीन में खुद डालें और पिन कीपैड को हाथ से ढंककर खुद टाइप करें।',
        targetTab: 'scams',
        targetId: 'scam-13',
        infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
        infographicTitle: 'स्कैम 13: ATM पिन गोपनीयता व सुरक्षित आदतें'
      },
      no: {
        titleHindi: 'कोई बात नहीं। पहले ATM Card, PIN और Cash Withdrawal की प्रक्रिया समझेंगे।',
        explanationHindi:
          'ATM से पैसे निकालना उतना ही सरल है जितना टीवी का रिमोट चलाना। 4 आसान चरणों को समझ लेने के बाद बैंक की लंबी लाइन में खड़े होने की ज़रूरत नहीं रहेगी।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: बिना कोई वास्तविक पैसा निकाले केवल "Balance Enquiry" चुनकर ATM मशीन के कीपैड और स्क्रीन का सुरक्षित अभ्यास करें।',
        targetTab: 'scams',
        targetId: 'scam-13',
        isMicroLesson: true,
        microLessonKey: 'atm_step_by_step',
        infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
        infographicTitle: 'ATM से कैश निकासी के 4 चरण'
      },
      decline: {
        titleHindi: 'बिल्कुल ठीक। ATM का इस्तेमाल करना अनिवार्य नहीं है। आप Bank Branch या अपनी सुविधा के अनुसार उपलब्ध दूसरे तरीकों का उपयोग कर सकते हैं।',
        explanationHindi:
          'बैंक शाखा जाकर चेक या विड्रॉल स्लिप से पैसे निकालना 100% वैध, सुरक्षित और सम्मानित तरीका है। डिजिटल साधन केवल आपकी सुविधा के लिए हैं, कोई बाध्यता नहीं है।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: यदि आपके पास डेबिट कार्ड है जिसे आप उपयोग नहीं करना चाहते, तो उसे सुरक्षित घर में रखें या बैंक से कार्ड की लिमिट बंद करवा दें।',
        targetTab: 'posters',
        targetIndex: 1,
        isMicroLesson: true,
        microLessonKey: 'branch_withdrawal_basics',
        infographicPreview: '/tutorials/digital-banking/assets/20-types-of-cheques.png',
        infographicTitle: 'पोस्टर 02: चेक के प्रकार व शाखा से नकद निकासी'
      },
      not_interested: {
        titleHindi: 'बिल्कुल ठीक। ATM का इस्तेमाल करना अनिवार्य नहीं है। आप Bank Branch या अपनी सुविधा के अनुसार उपलब्ध दूसरे तरीकों का उपयोग कर सकते हैं।',
        explanationHindi:
          'बैंक शाखा जाकर चेक या विड्रॉल स्लिप से पैसे निकालना 100% वैध, सुरक्षित और सम्मानित तरीका है। डिजिटल साधन केवल आपकी सुविधा के लिए हैं, कोई बाध्यता नहीं है।',
        practicalSuggestionHindi:
          'व्यावहारिक सुझाव: यदि आपके पास डेबिट कार्ड है जिसे आप उपयोग नहीं करना चाहते, तो उसे सुरक्षित घर में रखें या बैंक से कार्ड की लिमिट बंद करवा दें।',
        targetTab: 'posters',
        targetIndex: 1,
        isMicroLesson: true,
        microLessonKey: 'branch_withdrawal_basics',
        infographicPreview: '/tutorials/digital-banking/assets/20-types-of-cheques.png',
        infographicTitle: 'पोस्टर 02: चेक के प्रकार व शाखा से नकद निकासी'
      }
    }
  }
]

// -------------------------------------------------------------
// 6. CONDITIONAL UPI APP RECOGNITION (QUESTION 2 PATH C FOLLOW-UP)
// -------------------------------------------------------------

export interface UpiAppCheckData {
  questionHindi: string
  subtextHindi: string
  options: {
    id: 'app_exists' | 'app_unknown' | 'no_app'
    textHindi: string
    subtextHindi: string
  }[]
  guidanceByOption: Record<
    string,
    {
      titleHindi: string
      messageHindi: string
      actionSuggestionHindi: string
    }
  >
}

export const UPI_APP_FOLLOW_UP: UpiAppCheckData = {
  questionHindi: 'क्या आपके Phone में Google Pay, PhonePe, Paytm, BHIM या Bank का UPI App है?',
  subtextHindi: 'Do you have Google Pay, PhonePe, Paytm, BHIM or a bank UPI app on your phone?',
  options: [
    {
      id: 'app_exists',
      textHindi: 'हाँ',
      subtextHindi: 'मेरे फोन में पहले से UPI ऐप मौजूद है'
    },
    {
      id: 'no_app',
      textHindi: 'नहीं',
      subtextHindi: 'मेरे फोन में ऐसा कोई ऐप डाउनलोड नहीं है'
    },
    {
      id: 'app_unknown',
      textHindi: 'पता नहीं',
      subtextHindi: 'मुझे ठीक से नहीं पता कि कोई ऐप है या नहीं'
    }
  ],
  guidanceByOption: {
    app_exists: {
      titleHindi: 'ऐप मौजूद है: अगला कदम केवल सुरक्षित अभ्यास है',
      messageHindi:
        'जब ऐप पहले से मौजूद है, तो आपको नया खाता बनाने की आवश्यकता नहीं है। बस यह समझना है कि दुकान पर स्कैन कैसे करें।',
      actionSuggestionHindi: 'अभ्यास के लिए पैसे ट्रांसफर करने की कोई ज़रूरत नहीं है। केवल QR कोड स्कैन करके नाम देखना काफी है।'
    },
    app_unknown: {
      titleHindi: 'UPI ऐप की आसान पहचान',
      messageHindi:
        'अपनी फोन स्क्रीन पर ये मुख्य आइकॉन देखें:\n• Google Pay: रंग-बिरंगा "G" अक्षर या नीला घेरा\n• PhonePe: बैंगनी रंग का चौकोर डिब्बा जिसमें सफेद "पे" लिखा हो\n• Paytm: हल्के नीले और गहरे नीले रंग में "Paytm" लिखा हो\n• BHIM: हरा और नारंगी त्रिकोण लोगो',
      actionSuggestionHindi: 'यदि इनमें से कोई ऐप दिखे तो केवल उसे खोलकर देखें। बिना PIN डाले कोई पैसा कभी नहीं कटता।'
    },
    no_app: {
      titleHindi: 'बिना ऐप के भी कोई जल्दबाज़ी नहीं',
      messageHindi:
        'यदि आपके फोन में कोई ऐप नहीं है, तो भी घबराने की बात नहीं है। आप जब चाहें किसी विश्वसनीय परिजन के साथ बैंक जाकर या घर पर ऐप चालू करवा सकते हैं।',
      actionSuggestionHindi: 'याद रखें: रोज़मर्रा के छोटे भुगतानों के लिए हमेशा एक अलग छोटा बैंक खाता जोड़ना सबसे सुरक्षित रहता है।'
    }
  }
}

// -------------------------------------------------------------
// 7. MASTER CATALOG FOR SAVED TOPICS LOOKUP (ALL TOPIC IDS)
// -------------------------------------------------------------

export const SAATHI_TOPIC_CATALOG: Record<string, SaathiSavedTopic> = {
  topic_mobile_security: {
    id: 'topic_mobile_security',
    titleHindi: 'Mobile Lock लगाना सीखें (PIN, Pattern, Fingerprint)',
    englishTitle: 'Mobile Screen Lock & Security',
    descriptionHindi: 'फोन पर 4-अंकों का आसान पिन, पैटर्न या फिंगरप्रिंट लॉक लगाना और 30-सेकंड ऑटो लॉक चालू करना।',
    practicalBenefitHindi: 'फोन खो जाने पर भी आपके बैंक SMS, WhatsApp और निजी तस्वीरें पूरी तरह सुरक्षित रहती हैं।',
    targetTab: 'habits',
    targetId: 'habit-07',
    infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
    infographicTitle: 'आदत 07: फोन को हमेशा लॉक रखें व स्क्रीन टाइमआउट सेट करें',
    savedAt: 0
  },
  topic_mobile_lock_identify: {
    id: 'topic_mobile_lock_identify',
    titleHindi: 'फोन लॉक है या नहीं, ऐसे जांचें',
    englishTitle: 'How to Check and Identify Your Phone Lock',
    descriptionHindi: 'स्क्रीन बंद करके दोबारा चालू करें और देखें कि फोन सीधे खुलता है या कोई कोड/पैटर्न मांगता है।',
    practicalBenefitHindi: 'अपने फोन की सुरक्षा स्थिति को स्वयं पहचानना और आवश्यकता पड़ने पर लॉक लगाना।',
    targetTab: 'habits',
    targetId: 'habit-07',
    infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
    infographicTitle: 'आदत 07: फोन लॉक की पहचान',
    savedAt: 0
  },
  topic_lost_phone_readiness: {
    id: 'topic_lost_phone_readiness',
    titleHindi: 'फोन खो जाए तो क्या करें? पहले से तैयारी रखें',
    englishTitle: 'Lost Phone Preparedness & Settings Verification',
    descriptionHindi: 'Find My Device, रिकवरी ईमेल व फोन नंबर और 15-अंकों का IMEI नंबर नोट करने की सरल गाइड।',
    practicalBenefitHindi: 'फोन खोने पर किसी अन्य फोन या कंप्यूटर से तुरंत स्क्रीन लॉक करने और सिम सुरक्षित रखने की तैयारी।',
    targetTab: 'projects',
    targetId: 'project-lost-phone-lockdown',
    isMicroLesson: true,
    microLessonKey: 'lost_phone',
    infographicPreview: '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
    infographicTitle: 'प्रोजेक्ट 03: खोए हुए फोन की सुरक्षा का 5-चरणीय वर्कफ़्लो',
    savedAt: 0
  },
  topic_qr_history: {
    id: 'topic_qr_history',
    titleHindi: 'Payment History व 12-अंकों का UTR नंबर देखना',
    englishTitle: 'How to View Payment History & Transaction UTR Number',
    descriptionHindi: 'UPI ऐप में तारीख, दुकानदार का नाम और 12-अंकों का आधिकारिक UTR नंबर देखने की सरल गाइड।',
    practicalBenefitHindi: 'दुकानदार या बिल भुगतान का पक्का प्रमाण और किसी भी विवाद में त्वरित समाधान।',
    targetTab: 'projects',
    targetId: 'project-safe-upi-setup',
    isMicroLesson: true,
    microLessonKey: 'qr_history',
    infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
    infographicTitle: 'प्रोजेक्ट 01: सुरक्षित UPI व पेमेंट हिस्ट्री',
    savedAt: 0
  },
  topic_qr_safe_practice: {
    id: 'topic_qr_safe_practice',
    titleHindi: 'बिना पैसे भेजे QR स्कैन का सुरक्षित अभ्यास',
    englishTitle: 'Safe QR Code Observation Practice Without Sending Money',
    descriptionHindi: 'कैमरा फोकस करना, नाम पढ़ना और PIN स्क्रीन से पहले Cancel बटन दबाकर आत्मविश्वास पाना।',
    practicalBenefitHindi: 'बिना कोई पैसा ट्रांसफर किए सुरक्षित रूप से दुकान पर QR स्कैन सीखने का आत्मविश्वास।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    isMicroLesson: true,
    microLessonKey: 'qr_safe_practice',
    infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
    infographicTitle: 'पाठ 09: फिक्स QR कोड व डायनामिक QR कोड',
    savedAt: 0
  },
  topic_qr_visual_intro: {
    id: 'topic_qr_visual_intro',
    titleHindi: 'दुकानों पर QR Code की पहचान व साउंडबॉक्स',
    englishTitle: 'Visual Introduction to Merchant QR Codes & Voice Soundboxes',
    descriptionHindi: 'QR कोड कैसा दिखता है, साउंडबॉक्स कैसे बोलता है, और इसका नकद से क्या अंतर है।',
    practicalBenefitHindi: 'बाज़ार में दुकान पर लगे कोड और साउंडबॉक्स को देखकर सरलता से पहचानना।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    isMicroLesson: true,
    microLessonKey: 'qr_visual_intro',
    infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
    infographicTitle: 'पाठ 09: QR कोड की पहचान',
    savedAt: 0
  },
  topic_upi_basics: {
    id: 'topic_upi_basics',
    titleHindi: 'UPI क्या है? शुरुआती सचिप्ट पाठ',
    englishTitle: 'What is UPI? Beginner Infographic Lesson',
    descriptionHindi: 'वस्तु विनिमय से डिजिटल बैंकिंग तक का सफर और बिना बैंक जाए सुरक्षित लेनदेन की समझ।',
    practicalBenefitHindi: 'छुट्टे पैसों की समस्या से मुक्ति और दैनिक जीवन में डिजिटल भुगतान की सरल समझ।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    infographicPreview: '/tutorials/digital-banking/assets/18-upi.png',
    infographicTitle: 'पाठ 09: UPI सीखें — शुरुआत से सुरक्षित भुगतान तक',
    savedAt: 0
  },
  topic_qr_payment: {
    id: 'topic_qr_payment',
    titleHindi: 'QR Payment सचित्र अभ्यास (स्टेप-बाय-स्टेप)',
    englishTitle: 'Scanning QR Codes & Safe Payment Practice',
    descriptionHindi: 'दुकान या मेडिकल स्टोर पर स्वयं कैमरे से QR स्कैन करके दुकानदार का नाम और सही राशि जांचना।',
    practicalBenefitHindi: 'गलत बटन दबने के डर से मुक्ति और स्वतंत्र रूप से ₹10-₹20 के छोटे भुगतान करने का आत्मविश्वास।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    infographicPreview: '/tutorials/digital-banking/assets/28-fix-amount-qr-code.png',
    infographicTitle: 'पाठ 09: QR कोड व सुरक्षित भुगतान',
    savedAt: 0
  },
  topic_upi_app_recognition: {
    id: 'topic_upi_app_recognition',
    titleHindi: 'फोन में असली UPI App पहचानना',
    englishTitle: 'Recognizing UPI Apps & Safe Getting Started',
    descriptionHindi: 'फोन स्क्रीन पर Google Pay, PhonePe व Paytm के आइकॉन को पहचानना और सुरक्षित उपयोग।',
    practicalBenefitHindi: 'स्क्रीन पर सही ऐप पहचानना और समझना कि बिना गुप्त पिन डाले कभी पैसे नहीं कटते।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    isMicroLesson: true,
    microLessonKey: 'upi_app_recognition',
    infographicPreview: '/tutorials/digital-banking/assets/18-upi.png',
    infographicTitle: 'पाठ 09: UPI क्या है और ऐप पहचानना',
    savedAt: 0
  },
  topic_balance_checking: {
    id: 'topic_balance_checking',
    titleHindi: 'बिना बैंक जाए बैलेंस देखना (मिस्ड कॉल व SMS)',
    englishTitle: 'Checking Balance via Missed Call & Official SMS',
    descriptionHindi: 'बैंक के अधिकृत टोल-फ्री नंबर पर मुफ्त मिस्ड कॉल देकर 5 सेकंड में बैलेंस का SMS पाना।',
    practicalBenefitHindi: 'बैंक शाखा की लाइन में खड़े हुए बिना पेंशन और जमा राशि की घर बैठे नियमित जानकारी।',
    targetTab: 'banking-savings',
    targetIndex: 7,
    isMicroLesson: true,
    microLessonKey: 'missed_call_balance',
    infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
    infographicTitle: 'मिस्ड कॉल बैंकिंग: बिना इंटरनेट बैलेंस जांचें',
    savedAt: 0
  },
  topic_bank_statement_download: {
    id: 'topic_bank_statement_download',
    titleHindi: 'Bank Statement (PDF) डाउनलोड करना',
    englishTitle: 'How to Download and Protect Bank Statement PDF',
    descriptionHindi: 'नेटबैंकिंग या मोबाइल ऐप से 6 महीने या 1 साल का विस्तृत खाता ब्यौरा डाउनलोड करना।',
    practicalBenefitHindi: 'पेंशन और ब्याज का पक्का हिसाब रखना और पासवर्ड-सुरक्षित PDF फाइल सुरक्षित रखना।',
    targetTab: 'banking-savings',
    targetIndex: 7,
    infographicPreview: '/tutorials/digital-banking/assets/16-net-banking.png',
    infographicTitle: 'पाठ 08: नेट बैंकिंग — ई-स्टेटमेंट व सुरक्षित उपयोग',
    savedAt: 0
  },
  topic_transfer_methods_comparison: {
    id: 'topic_transfer_methods_comparison',
    titleHindi: 'NEFT, RTGS, IMPS व UPI में अंतर',
    englishTitle: 'Money Transfer Comparison: UPI, IMPS, NEFT & RTGS',
    descriptionHindi: 'रकम, गति और उपयोग के अनुसार सही विकल्प चुनना: कब UPI करें, कब IMPS, और कब RTGS।',
    practicalBenefitHindi: 'अपनी ज़रूरत अनुसार सही माध्यम चुनना और RTGS के ₹2 लाख न्यूनतम नियम की समझ।',
    targetTab: 'posters',
    targetIndex: 2,
    isMicroLesson: true,
    microLessonKey: 'transfer_comparison',
    infographicPreview: '/tutorials/digital-banking/assets/22-difference-between-rtgs-neft-imps.png',
    infographicTitle: 'पोस्टर 03: RTGS, NEFT, IMPS व UPI तुलना',
    savedAt: 0
  },
  topic_missed_call_balance: {
    id: 'topic_missed_call_balance',
    titleHindi: 'मिस्ड कॉल से स्वतंत्र बैलेंस देखना',
    englishTitle: 'Checking Balance via Official Missed Call Banking',
    descriptionHindi: 'पंजीकृत मोबाइल नंबर से एक मुफ्त घंटी देकर 10 सेकंड में बैलेंस SMS पाने की सीधी विधि।',
    practicalBenefitHindi: 'बिना बैंक जाए और बिना किसी ऐप या पासवर्ड के साधारण फोन से बैलेंस जानना।',
    targetTab: 'banking-savings',
    targetIndex: 7,
    isMicroLesson: true,
    microLessonKey: 'missed_call_balance',
    infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
    infographicTitle: 'मिस्ड कॉल बैंकिंग: बिना इंटरनेट बैलेंस जांचें',
    savedAt: 0
  },
  topic_atm_balance_practice: {
    id: 'topic_atm_balance_practice',
    titleHindi: 'ATM पर सुरक्षित Balance Enquiry',
    englishTitle: 'Safe ATM Balance Enquiry & Slip Verification',
    descriptionHindi: 'ATM में कार्ड डालना, कीपैड ढंककर पिन डालना और स्क्रीन पर बैलेंस देखकर Cancel करना।',
    practicalBenefitHindi: 'बिना किसी अनजान व्यक्ति को कार्ड या पिन दिए स्वतंत्र रूप से बैलेंस देखना।',
    targetTab: 'scams',
    targetId: 'scam-13',
    isMicroLesson: true,
    microLessonKey: 'atm_simulated_practice',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'स्कैम 13: ATM बैलेंस इन्क्वायरी व अभ्यास',
    savedAt: 0
  },
  topic_balance_methods_overview: {
    id: 'topic_balance_methods_overview',
    titleHindi: 'बैलेंस जानने के 4 सरल तरीके',
    englishTitle: 'Four Simple Ways to Check Bank Balance',
    descriptionHindi: 'वरिष्ठ नागरिकों के लिए बिना लाइन में लगे पेंशन और जमा पूंजी की जानकारी रखने की बुनियादी समझ।',
    practicalBenefitHindi: 'मिस्ड कॉल, ATM, पासबुक और UPI में से अपनी पसंद का सबसे आसान तरीका चुनना।',
    targetTab: 'banking-savings',
    targetIndex: 7,
    isMicroLesson: true,
    microLessonKey: 'balance_methods_overview',
    infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
    infographicTitle: 'बैलेंस जानने के 4 सरल तरीके',
    savedAt: 0
  },
  topic_internet_banking_discovery: {
    id: 'topic_internet_banking_discovery',
    titleHindi: 'Internet Banking से क्या-क्या कर सकते हैं?',
    englishTitle: 'Discovering Internet Banking Features Safely',
    descriptionHindi: 'घर बैठे बैलेंस देखना, FD/RD खोलना, फंड ट्रांसफर और सरकारी टैक्स जमा करने की समझ।',
    practicalBenefitHindi: 'बैंक शाखा जाए बिना जरूरी काम घर बैठे करना और सुरक्षित लॉगिन की आदतें अपनाना।',
    targetTab: 'banking-savings',
    targetIndex: 7,
    isMicroLesson: true,
    microLessonKey: 'netbanking_discovery',
    infographicPreview: '/tutorials/digital-banking/assets/16-net-banking.png',
    infographicTitle: 'पाठ 08: नेट बैंकिंग — घर बैठे सुरक्षित उपयोग',
    savedAt: 0
  },
  topic_atm_safety: {
    id: 'topic_atm_safety',
    titleHindi: 'ATM मशीन पर कार्ड व PIN की गोपनीयता',
    englishTitle: 'ATM Card Usage & PIN Privacy Protection',
    descriptionHindi: 'ATM से पैसे निकालते समय अपना 4-अंकों का पिन हाथ से ढंकना और किसी अनजान को कार्ड न सौंपना।',
    practicalBenefitHindi: 'शोल्डर सर्फिंग और कार्ड क्लोनिंग से पूरी तरह सुरक्षित रहकर नकदी निकालना।',
    targetTab: 'scams',
    targetId: 'scam-13',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'स्कैम 13: ATM फ्रॉड से बचाव',
    savedAt: 0
  },
  topic_autopay_audit: {
    id: 'topic_autopay_audit',
    titleHindi: 'अनचाहा AutoPay व सब्सक्रिप्शन ढूंढना व बंद करना',
    englishTitle: 'Review & Cancel Unwanted AutoPay Mandates',
    descriptionHindi: 'PhonePe व Google Pay में एक्टिव मैंडेट की सूची देखना और अनावश्यक कटौती एक टैप में रोकना।',
    practicalBenefitHindi: 'हर महीने खाते से बिना जानकारी कटने वाले पैसों पर पूरा नियंत्रण।',
    targetTab: 'projects',
    targetId: 'project-autopay-management',
    infographicPreview: '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
    infographicTitle: 'प्रोजेक्ट 02: अनचाहा ऑटो-पे (AutoPay) रोकना',
    savedAt: 0
  },
  topic_lost_phone: {
    id: 'topic_lost_phone',
    titleHindi: 'फोन गुम होने पर 15-मिनट सुरक्षा व रिकवरी वर्कफ़्लो',
    englishTitle: 'Lost Phone 15-Minute Safety & Golden Hour Protocol',
    descriptionHindi: '5 सरल चरण: खोजना → सिम ब्लॉक → बैंक UPI फ्रीज → CEIR पर IMEI ब्लॉक → WhatsApp रीसेट।',
    practicalBenefitHindi: 'फोन चोरी होने पर पहले 60 मिनट में त्वरित कार्रवाई करके बैंक खाते को फ्रीज करवाना।',
    targetTab: 'projects',
    targetId: 'project-lost-phone-lockdown',
    infographicPreview: '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
    infographicTitle: 'प्रोजेक्ट 03: खोए हुए फोन की सुरक्षा का 5-चरणीय वर्कफ़्लो',
    savedAt: 0
  },
  topic_atm_pin_change_safety: {
    id: 'topic_atm_pin_change_safety',
    titleHindi: 'ATM PIN बदलना व कार्ड सुरक्षा',
    englishTitle: 'ATM PIN Change & Card Security Habits',
    descriptionHindi: 'समय-समय पर पिन बदलना, कीपैड को हाथ से ढंकना और कार्ड के पीछे CVV को सुरक्षित रखना।',
    practicalBenefitHindi: 'ATM मशीन से स्वयं 2 मिनट में नया गुप्त पिन सेट करना और फ्रॉड से सुरक्षित रहना।',
    targetTab: 'habits',
    targetId: 'habit-08',
    targetIndex: 7,
    infographicPreview: '/tutorials/digital-banking/assets/40-habit-08-shield-atm-keypad.png',
    infographicTitle: 'आदत 08: ATM कीपैड हमेशा ढंकें',
    savedAt: 0
  },
  topic_cdm_cardless_discovery: {
    id: 'topic_cdm_cardless_discovery',
    titleHindi: 'Cash Deposit (CDM) व Cardless कैश निकासी',
    englishTitle: 'Cash Deposit Machines (CDM/CRM) & Cardless Cash Withdrawal',
    descriptionHindi: 'बिना बैंक लाइन में लगे CDM में पैसे जमा करना और बिना डेबिट कार्ड केवल UPI से कैश निकालना।',
    practicalBenefitHindi: '24 घंटे किसी भी समय नकदी जमा करना और बिना कार्ड क्लोनिंग के जोखिम के कैश पाना।',
    targetTab: 'scams',
    targetId: 'scam-13',
    isMicroLesson: true,
    microLessonKey: 'cdm_cardless_discovery',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'स्कैम 13: ATM फ्रॉड व आधुनिक सुविधाएं',
    savedAt: 0
  },
  topic_atm_step_by_step: {
    id: 'topic_atm_step_by_step',
    titleHindi: 'ATM से कैश निकासी के 4 चरण',
    englishTitle: 'Step-by-Step Guide to Safe ATM Cash Withdrawal',
    descriptionHindi: 'हरी बत्ती जलने पर कार्ड डालना, भाषा चुनना, पिन दर्ज करना और कैश व कार्ड सुरक्षित वापस लेने का क्रम।',
    practicalBenefitHindi: 'बिना किसी अजनबी को कार्ड सौंपे अपने हाथों से सुरक्षित कैश निकालना।',
    targetTab: 'scams',
    targetId: 'scam-13',
    isMicroLesson: true,
    microLessonKey: 'atm_step_by_step',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'ATM से कैश निकासी के 4 चरण',
    savedAt: 0
  },
  topic_atm_machine_intro: {
    id: 'topic_atm_machine_intro',
    titleHindi: 'ATM कार्ड और मशीन का सरल परिचय',
    englishTitle: 'Introduction to ATM Card & Machine Interface',
    descriptionHindi: 'डेबिट कार्ड के आगे-पीछे क्या होता है, कार्ड स्लॉट की हरी बत्ती और कीपैड के लाल Cancel बटन की पहचान।',
    practicalBenefitHindi: 'मशीन के बटनों और स्लॉट की बुनियादी समझ जिससे गलत बटन दबने का डर खत्म हो।',
    targetTab: 'scams',
    targetId: 'scam-13',
    isMicroLesson: true,
    microLessonKey: 'atm_step_by_step',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'ATM कार्ड और मशीन का सरल परिचय',
    savedAt: 0
  },
  topic_atm_simulated_practice: {
    id: 'topic_atm_simulated_practice',
    titleHindi: 'बिना पैसे निकाले ATM का सुरक्षित अभ्यास',
    englishTitle: 'Safe ATM Process Practice Without Withdrawing Money',
    descriptionHindi: '4 चरणों में स्क्रीन-दर-स्क्रीन देखना: कार्ड डालना, भाषा चयन, पिन एंट्री और Cancel दबाकर बाहर आना।',
    practicalBenefitHindi: 'बिना जोखिम के बैलेंस इन्क्वायरी चुनकर पूरी प्रक्रिया का आत्मविश्वास हासिल करना।',
    targetTab: 'scams',
    targetId: 'scam-13',
    isMicroLesson: true,
    microLessonKey: 'atm_simulated_practice',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'ATM का सुरक्षित अभ्यास',
    savedAt: 0
  },
  topic_branch_withdrawal_basics: {
    id: 'topic_branch_withdrawal_basics',
    titleHindi: 'बैंक शाखा से चेक व फॉर्म द्वारा नकद निकासी',
    englishTitle: 'Safe Cash Withdrawal via Bank Branch & Cheque',
    descriptionHindi: 'काउंटर पर पासबुक के साथ विड्रॉल फॉर्म भरना और चेक पर Self लिखकर सुरक्षित नकद प्राप्त करना।',
    practicalBenefitHindi: 'बिना ATM कार्ड के बैंक काउंटर से सम्मानित और सुरक्षित तरीके से पैसे निकालना।',
    targetTab: 'posters',
    targetIndex: 1,
    isMicroLesson: true,
    microLessonKey: 'branch_withdrawal_basics',
    infographicPreview: '/tutorials/digital-banking/assets/20-types-of-cheques.png',
    infographicTitle: 'पोस्टर 02: चेक के प्रकार व शाखा से नकद निकासी',
    savedAt: 0
  },
  topic_debit_card_safety_alternatives: {
    id: 'topic_debit_card_safety_alternatives',
    titleHindi: 'अनचाहे डेबिट कार्ड की सुरक्षा व सीमाएं',
    englishTitle: 'Protecting Unused Debit Cards & Offline Banking Limits',
    descriptionHindi: 'यदि ATM कार्ड इस्तेमाल नहीं करना है तो उसे सुरक्षित रखना, लिमिट शून्य करना या शाखा से बंद करवाना।',
    practicalBenefitHindi: 'अनावश्यक बैंक शुल्क से बचना और अनचाहे कार्ड के दुरुपयोग को 100% रोकना।',
    targetTab: 'habits',
    targetId: 'habit-09',
    targetIndex: 8,
    infographicPreview: '/tutorials/digital-banking/assets/41-habit-09-never-share-otp-pin.png',
    infographicTitle: 'आदत 09: कार्ड व पिन की गोपनीयता',
    savedAt: 0
  }
}

// Fallback resolver for any topic ID
export function getSaathiTopicById(rawId: string): SaathiSavedTopic {
  if (SAATHI_TOPIC_CATALOG[rawId]) {
    return { ...SAATHI_TOPIC_CATALOG[rawId], savedAt: Date.now() }
  }

  // Map legacy question IDs to appropriate topics
  if (rawId === 'q1_mobile') {
    return { ...SAATHI_TOPIC_CATALOG['topic_mobile_security'], savedAt: Date.now() }
  }
  if (rawId === 'q2_qr') {
    return { ...SAATHI_TOPIC_CATALOG['topic_qr_payment'], savedAt: Date.now() }
  }
  if (rawId === 'q3_balance') {
    return { ...SAATHI_TOPIC_CATALOG['topic_balance_checking'], savedAt: Date.now() }
  }
  if (rawId === 'q4_atm') {
    return { ...SAATHI_TOPIC_CATALOG['topic_atm_safety'], savedAt: Date.now() }
  }

  // Generic fallback if unknown
  return {
    id: rawId,
    titleHindi: 'सहेजा गया डिजिटल बैंकिंग पाठ',
    descriptionHindi: 'डिजिटल साथी द्वारा सहेजी गई महत्वपूर्ण जानकारी।',
    practicalBenefitHindi: 'सुरक्षित डिजिटल बैंकिंग अभ्यास।',
    targetTab: 'overview',
    savedAt: Date.now()
  }
}

// -------------------------------------------------------------
// 8. PERSONAL LEARNING PLAN GENERATION ENGINE (ADAPTIVE QR)
// -------------------------------------------------------------

export function generatePersonalLearningPlan(
  answers: Record<string, string>,
  upiAppAnswer?: string
): SaathiLearningTopic[] {
  const topics: SaathiLearningTopic[] = []

  // Topic 1: Mobile Security
  if (answers['q1_mobile'] === 'swipe') {
    topics.push({
      id: 'topic_mobile_security',
      titleHindi: 'फोन स्क्रीन लॉक व फिंगरप्रिंट लगाना',
      englishTitle: 'Mobile Screen Lock & Fingerprint Setup',
      reasonHindi: 'आपने बताया कि आपके फोन पर कोई लॉक नहीं है। स्क्रीन लॉक फोन का सबसे पहला और मजबूत ताला है।',
      practicalBenefitHindi: '4-अंकों का आसान पिन या फिंगरप्रिंट लॉक सेट करना और 30-सेकंड ऑटो लॉक चालू करना।',
      badgeText: 'बुनियादी सुरक्षा',
      badgeColor: 'rose',
      targetTab: 'habits',
      targetId: 'habit-07',
      infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
      infographicTitle: 'आदत 07: फोन को हमेशा लॉक रखें'
    })
  } else if (answers['q1_mobile'] === 'unknown') {
    topics.push({
      id: 'topic_mobile_lock_identify',
      titleHindi: 'फोन लॉक है या नहीं, ऐसे जांचें',
      englishTitle: 'How to Check and Identify Your Phone Lock',
      reasonHindi: 'स्क्रीन बंद करके दोबारा चालू करें और देखें कि फोन सीधे खुलता है या कोई कोड/पैटर्न मांगता है।',
      practicalBenefitHindi: 'अपने फोन की सुरक्षा स्थिति को स्वयं पहचानना और आवश्यकता पड़ने पर लॉक लगाना।',
      badgeText: 'सरल पहचान',
      badgeColor: 'teal',
      targetTab: 'habits',
      targetId: 'habit-07',
      infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
      infographicTitle: 'आदत 07: फोन लॉक की पहचान'
    })
  }

  // Topic 2: Adaptive QR Learning based on Path
  const qrAnswer = answers['q2_qr']

  if (qrAnswer === 'yes_self') {
    // Independent learner: Payment History & AutoPay Review
    topics.push({
      id: 'topic_qr_history',
      titleHindi: 'Payment History व UTR नंबर देखना',
      englishTitle: 'How to View Payment History & Transaction UTR Number',
      reasonHindi: 'आप QR पेमेंट करना जानते हैं! पुराने भुगतानों का 12-अंकों का UTR नंबर देखना व रसीद संभालना उपयोगी है।',
      practicalBenefitHindi: 'UPI ऐप में तारीख, दुकानदार का नाम और आधिकारिक UTR नंबर देखने की सीधी समझ।',
      badgeText: 'उन्नत कौशल',
      badgeColor: 'teal',
      targetTab: 'projects',
      targetId: 'project-safe-upi-setup',
      isMicroLesson: true,
      microLessonKey: 'qr_history',
      infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
      infographicTitle: 'प्रोजेक्ट: सुरक्षित UPI व पेमेंट हिस्ट्री'
    })
  } else if (qrAnswer === 'with_help') {
    // Assisted learner: Independent QR Practice & Safe Observation
    topics.push({
      id: 'topic_qr_safe_practice',
      titleHindi: 'बिना पैसे भेजे QR स्कैन का सुरक्षित अभ्यास',
      englishTitle: 'Safe QR Code Observation Practice Without Sending Money',
      reasonHindi: 'आप QR पेमेंट जानते हैं; अब बिना किसी की मदद लिए स्वतंत्र रूप से स्कैन करने का आत्मविश्वास पाएं।',
      practicalBenefitHindi: 'कैमरा फोकस करना, नाम पढ़ना और PIN डाले बिना सुरक्षित Cancel करने का अभ्यास।',
      badgeText: 'आत्मनिर्भरता',
      badgeColor: 'emerald',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'qr_safe_practice',
      infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
      infographicTitle: 'पाठ 09: फिक्स QR कोड व डायनामिक QR कोड'
    })
  } else if (qrAnswer === 'cannot_pay') {
    // Cannot pay: App Recognition & Basics
    if (upiAppAnswer === 'app_unknown' || upiAppAnswer === 'no_app') {
      topics.push({
        id: 'topic_upi_app_recognition',
        titleHindi: 'फोन में असली UPI App पहचानना',
        englishTitle: 'Recognizing UPI Apps & Safe Getting Started',
        reasonHindi: 'पेमेंट करने से पहले फोन पर Google Pay, PhonePe या Paytm के लोगो को पहचानना आवश्यक है।',
        practicalBenefitHindi: 'स्क्रीन पर सही ऐप पहचानना और समझना कि बिना गुप्त पिन डाले कभी पैसे नहीं कटते।',
        badgeText: 'दैनिक सुविधा',
        badgeColor: 'teal',
        targetTab: 'upi-payments',
        targetIndex: 8,
        isMicroLesson: true,
        microLessonKey: 'upi_app_recognition',
        infographicPreview: '/tutorials/digital-banking/assets/18-upi.png',
        infographicTitle: 'पाठ 09: UPI सीखें — शुरुआत से सुरक्षित भुगतान तक'
      })
    } else {
      topics.push({
        id: 'topic_qr_payment',
        titleHindi: 'दुकान पर सुरक्षित QR कोड पेमेंट का पहला अभ्यास',
        englishTitle: 'Scanning QR Codes & Safe Payment Practice',
        reasonHindi: 'दुकान या मेडिकल स्टोर पर स्वयं कैमरे से QR स्कैन करके दुकानदार का नाम और सही राशि जांचना।',
        practicalBenefitHindi: 'गलत बटन दबने के डर से मुक्ति और स्वतंत्र रूप से छोटे भुगतान करने का आत्मविश्वास।',
        badgeText: 'शुरुआती अभ्यास',
        badgeColor: 'emerald',
        targetTab: 'upi-payments',
        targetIndex: 8,
        infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
        infographicTitle: 'पाठ 09: फिक्स QR कोड व डायनामिक QR कोड'
      })
    }
  } else if (qrAnswer === 'unknown') {
    // Unfamiliar: QR Intro & UPI Basics
    topics.push({
      id: 'topic_qr_visual_intro',
      titleHindi: 'दुकानों पर QR Code की पहचान व साउंडबॉक्स',
      englishTitle: 'Visual Introduction to Merchant QR Codes & Voice Soundboxes',
      reasonHindi: 'QR कोड दुकान पर दिखाई देने वाला डिजिटल पता है। इसे समझना बहुत आसान और उपयोगी है।',
      practicalBenefitHindi: 'बाज़ार में दुकानों पर लगे प्लास्टिक कोड और साउंडबॉक्स को सरलता से पहचानना।',
      badgeText: 'सरल परिचय',
      badgeColor: 'teal',
      targetTab: 'upi-payments',
      targetIndex: 8,
      isMicroLesson: true,
      microLessonKey: 'qr_visual_intro',
      infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
      infographicTitle: 'पाठ 09: QR कोड की पहचान'
    })
  }

  // Topic 3: Lost Phone Preparation
  topics.push({
    id: 'topic_lost_phone_readiness',
    titleHindi: 'फोन खो जाए तो क्या करें? पहले से तैयारी रखें',
    englishTitle: 'Lost Phone Preparedness & Settings Verification',
    reasonHindi: 'फोन खोने से पहले Find My Device, रिकवरी ईमेल और 15-अंकों का IMEI नंबर नोट करना।',
    practicalBenefitHindi: 'फोन छूटने पर किसी अन्य डिवाइस से तुरंत लॉक करने की तैयारी।',
    badgeText: 'आपातकालीन तैयारी',
    badgeColor: 'amber',
    targetTab: 'projects',
    targetId: 'project-lost-phone-lockdown',
    isMicroLesson: true,
    microLessonKey: 'lost_phone',
    infographicPreview: '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
    infographicTitle: 'प्रोजेक्ट: खोए हुए फोन की सुरक्षा का 5-चरणीय वर्कफ़्लो'
  })

  // Topic 4: Bank Balance Checking (Adaptive based on Question 3)
  const balanceAnswer = answers['q3_balance']
  if (balanceAnswer === 'yes_self') {
    // Already checks balance -> suggest Statement Download
    topics.push({
      id: 'topic_bank_statement_download',
      titleHindi: 'Bank Statement (PDF) डाउनलोड करना',
      englishTitle: 'How to Download and Protect Bank Statement PDF',
      reasonHindi: 'आप बैलेंस देखना जानते हैं! अब पूरे महीने या साल का ई-स्टेटमेंट डाउनलोड करके रिकॉर्ड रखना सीखें।',
      practicalBenefitHindi: 'पेंशन, ब्याज़ और खर्चों का पक्का हिसाब और सुरक्षित पासवर्ड वाली फाइल संभालना।',
      badgeText: 'उन्नत कौशल',
      badgeColor: 'teal',
      targetTab: 'banking-savings',
      targetIndex: 7,
      infographicPreview: '/tutorials/digital-banking/assets/16-net-banking.png',
      infographicTitle: 'पाठ 08: नेट बैंकिंग — ई-स्टेटमेंट व सुरक्षित उपयोग'
    })
  } else if (balanceAnswer === 'with_help') {
    // Checks with help -> suggest Missed Call for Independence
    topics.push({
      id: 'topic_missed_call_balance',
      titleHindi: 'मिस्ड कॉल से स्वतंत्र बैलेंस देखना',
      englishTitle: 'Checking Balance via Official Missed Call Banking',
      reasonHindi: 'दूसरों से पूछने के बजाय अपने ही फोन से 1 मिस्ड कॉल देकर बिना इंटरनेट बैलेंस जानना सीखें।',
      practicalBenefitHindi: 'बिना किसी की सहायता लिए अपने खाते और पिन की पूरी गोपनीयता बनाए रखना।',
      badgeText: 'आत्मनिर्भरता',
      badgeColor: 'emerald',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance',
      infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
      infographicTitle: 'मिस्ड कॉल बैंकिंग: बिना इंटरनेट बैलेंस जानना'
    })
  } else if (balanceAnswer === 'no') {
    // Cannot check -> suggest Missed call & SMS alerts
    topics.push({
      id: 'topic_balance_checking',
      titleHindi: 'बिना बैंक जाए बैलेंस देखना (मिस्ड कॉल व SMS)',
      englishTitle: 'Checking Balance via Missed Call & Official SMS',
      reasonHindi: 'आपने बताया कि बैलेंस जानने के लिए बैंक जाना पड़ता है। मिस्ड कॉल से यह काम 10 सेकंड में हो जाता है।',
      practicalBenefitHindi: 'बैंक की लाइन में खड़े हुए बिना घर बैठे पेंशन और जमा राशि का सीधा SMS पाना।',
      badgeText: 'समय की बचत',
      badgeColor: 'teal',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'missed_call_balance',
      infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
      infographicTitle: 'मिस्ड कॉल बैंकिंग: घर बैठे बैलेंस पाना'
    })
  } else if (balanceAnswer === 'unknown') {
    // Unfamiliar -> suggest 4 basic balance methods
    topics.push({
      id: 'topic_balance_methods_overview',
      titleHindi: 'बैलेंस जानने के 4 सरल तरीके',
      englishTitle: 'Four Simple Ways to Check Bank Balance',
      reasonHindi: 'पेंशन आई या नहीं—यह जानने के लिए उपलब्ध सुरक्षित विकल्पों (मिस्ड कॉल, ATM, UPI) की सरल समझ।',
      practicalBenefitHindi: 'अपनी पसंद का सबसे आसान तरीका चुनना और अनचाहे फ्रॉड कॉल्स से सावधान रहना।',
      badgeText: 'सरल परिचय',
      badgeColor: 'teal',
      targetTab: 'banking-savings',
      targetIndex: 7,
      isMicroLesson: true,
      microLessonKey: 'balance_methods_overview',
      infographicPreview: '/tutorials/digital-banking/assets/06-savings-account-guide.png',
      infographicTitle: 'बैलेंस जानने के 4 सरल तरीके'
    })
  }

  // Topic 5: ATM / Cash Banking (Adaptive based on Question 4 choice)
  const atmAnswer = answers['q4_atm']
  if (atmAnswer === 'yes_self') {
    // Independent ATM user -> CDM / Cardless Discovery & Advanced Features
    topics.push({
      id: 'topic_cdm_cardless_discovery',
      titleHindi: 'Cash Deposit (CDM) व Cardless कैश निकासी',
      englishTitle: 'Cash Deposit Machines (CDM/CRM) & Cardless Cash Withdrawal',
      reasonHindi: 'आप ATM से कैश निकालना जानते हैं! अब CDM में पैसे जमा करना और बिना कार्ड UPI-ATM से सुरक्षित निकासी सीखें।',
      practicalBenefitHindi: 'बिना बैंक लाइन में लगे नकदी जमा करना और बिना डेबिट कार्ड के केवल QR से सुरक्षित कैश निकालना।',
      badgeText: 'उन्नत सुविधा',
      badgeColor: 'teal',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'cdm_cardless_discovery',
      infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
      infographicTitle: 'स्कैम 13: ATM फ्रॉड व आधुनिक सुविधाएं'
    })
  } else if (atmAnswer === 'with_help') {
    // Assisted learner -> ATM Card & PIN Privacy
    topics.push({
      id: 'topic_atm_safety',
      titleHindi: 'ATM मशीन पर कार्ड व PIN की गोपनीयता',
      englishTitle: 'ATM Card Usage & PIN Privacy Protection',
      reasonHindi: 'दूसरों को कार्ड सौंपने के बजाय खुद मशीन में कार्ड डालना और कीपैड को हाथ से ढंककर स्वतंत्र रूप से पिन डालना।',
      practicalBenefitHindi: 'मशीन में कार्ड डालना, कीपैड ढंकना और Cancel बटन दबाकर हरी बत्ती जलने तक रुकना।',
      badgeText: 'कार्ड सुरक्षा',
      badgeColor: 'indigo',
      targetTab: 'scams',
      targetId: 'scam-13',
      infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
      infographicTitle: 'स्कैम 13: ATM फ्रॉड से बचाव'
    })
  } else if (atmAnswer === 'no') {
    // Cannot use ATM -> Simulated practice & 4 steps
    topics.push({
      id: 'topic_atm_simulated_practice',
      titleHindi: 'बिना पैसे निकाले ATM का सुरक्षित अभ्यास',
      englishTitle: 'Safe ATM Process Practice Without Withdrawing Money',
      reasonHindi: 'ATM से पैसे निकालने के 4 बुनियादी चरण समझना ताकि बिना किसी डर के आप जरूरत पड़ने पर नकदी निकाल सकें।',
      practicalBenefitHindi: 'बिना कोई वास्तविक पैसा निकाले बैलेंस इन्क्वायरी चुनकर मशीन और स्क्रीन का सुरक्षित अभ्यास।',
      badgeText: 'शुरुआती अभ्यास',
      badgeColor: 'emerald',
      targetTab: 'scams',
      targetId: 'scam-13',
      isMicroLesson: true,
      microLessonKey: 'atm_simulated_practice',
      infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
      infographicTitle: 'ATM का सुरक्षित अभ्यास'
    })
  } else if (atmAnswer === 'decline' || atmAnswer === 'not_interested') {
    // Learner does not want ATM -> Branch cash withdrawal basics & Card protection (NO ATM lessons!)
    topics.push({
      id: 'topic_branch_withdrawal_basics',
      titleHindi: 'बैंक शाखा से चेक व फॉर्म द्वारा नकद निकासी',
      englishTitle: 'Safe Cash Withdrawal via Bank Branch & Cheque',
      reasonHindi: 'आपने बताया कि आप बैंक शाखा से काम करना पसंद करते हैं। विड्रॉल स्लिप व सेल्फ चेक से सुरक्षित नकदी प्राप्त करने की समझ।',
      practicalBenefitHindi: 'शाखा में विड्रॉल फॉर्म सही से भरना और चेक से बिना ATM कार्ड के सुरक्षित नकदी प्राप्त करना।',
      badgeText: 'शाखा सुविधा',
      badgeColor: 'teal',
      targetTab: 'posters',
      targetIndex: 1,
      isMicroLesson: true,
      microLessonKey: 'branch_withdrawal_basics',
      infographicPreview: '/tutorials/digital-banking/assets/20-types-of-cheques.png',
      infographicTitle: 'पोस्टर 02: चेक के प्रकार व शाखा से नकद निकासी'
    })
  }

  return topics.slice(0, 5)
}

// -------------------------------------------------------------
// 9. ROBUST STORAGE HELPERS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  ANSWERS: 'dlh_saathi_answers',
  CURRENT_QUESTION: 'dlh_saathi_current_question',
  COMPLETED: 'dlh_saathi_completed',
  UPI_CHECK: 'dlh_saathi_upi_check',
  SAVED_TOPICS: 'dlh_saathi_saved_topics',
  KNOWN_TOPICS: 'dlh_saathi_known_topics',
  SKIPPED_TOPICS: 'dlh_saathi_skipped_topics'
}

export function loadStoredSaathiAnswers(): Record<string, string> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Error loading answers from localStorage', e)
    return {}
  }
}

export function saveStoredSaathiAnswers(answers: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers))
  } catch (e) {
    console.error('Error saving answers to localStorage', e)
  }
}

export function loadStoredSaathiCurrentQuestion(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CURRENT_QUESTION)
    if (val !== null) {
      const parsed = parseInt(val, 10)
      if (!isNaN(parsed) && parsed >= 0 && parsed < SAATHI_CORE_QUESTIONS.length) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error loading current question from localStorage', e)
  }
  return 0
}

export function saveStoredSaathiCurrentQuestion(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, index.toString())
  } catch (e) {
    console.error('Error saving current question to localStorage', e)
  }
}

export function loadStoredSaathiCompleted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true'
  } catch (e) {
    console.error('Error loading completed state from localStorage', e)
  }
  return false
}

export function saveStoredSaathiCompleted(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, completed ? 'true' : 'false')
  } catch (e) {
    console.error('Error saving completed state to localStorage', e)
  }
}

export function loadStoredSaathiUpiCheck(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.UPI_CHECK) || ''
  } catch {
    return ''
  }
}

export function saveStoredSaathiUpiCheck(val: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.UPI_CHECK, val)
  } catch {
    // Ignore
  }
}

export function clearStoredSaathiData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_QUESTION)
    localStorage.removeItem(STORAGE_KEYS.COMPLETED)
    localStorage.removeItem(STORAGE_KEYS.UPI_CHECK)
    localStorage.removeItem(STORAGE_KEYS.SAVED_TOPICS)
    localStorage.removeItem(STORAGE_KEYS.KNOWN_TOPICS)
    localStorage.removeItem(STORAGE_KEYS.SKIPPED_TOPICS)
    sessionStorage.removeItem('dlh_saathi_scroll_y')
    sessionStorage.removeItem('dlh_saathi_last_q')
  } catch {
    // Ignore
  }
}

export function loadStoredSaathiSavedTopics(): SaathiSavedTopic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_TOPICS)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const validList: SaathiSavedTopic[] = []
    for (const item of parsed) {
      if (typeof item === 'string') {
        const fallback = getSaathiTopicById(item)
        if (!validList.some(v => v.id === fallback.id)) {
          validList.push(fallback)
        }
      } else if (item && typeof item === 'object' && item.id) {
        if (!validList.some(v => v.id === item.id)) {
          validList.push(item)
        }
      }
    }
    return validList
  } catch (e) {
    console.error('Error loading saved topics from localStorage', e)
    return []
  }
}

export function saveStoredSaathiSavedTopic(topic: SaathiSavedTopic): boolean {
  try {
    const current = loadStoredSaathiSavedTopics()
    const existingIndex = current.findIndex(t => t.id === topic.id)
    if (existingIndex >= 0) {
      current[existingIndex] = { ...topic, savedAt: Date.now() }
    } else {
      current.push({ ...topic, savedAt: Date.now() })
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_TOPICS, JSON.stringify(current))
    return true
  } catch (e) {
    console.error('Error saving topic to localStorage', e)
    return false
  }
}

export function removeStoredSaathiSavedTopic(topicId: string): boolean {
  try {
    const current = loadStoredSaathiSavedTopics()
    const updated = current.filter(t => t.id !== topicId)
    localStorage.setItem(STORAGE_KEYS.SAVED_TOPICS, JSON.stringify(updated))
    return true
  } catch (e) {
    console.error('Error removing topic from localStorage', e)
    return false
  }
}

export function clearAllStoredSaathiSavedTopics(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_TOPICS)
  } catch {
    // Ignore
  }
}

export function loadStoredSaathiKnownTopics(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KNOWN_TOPICS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStoredSaathiKnownTopic(topicId: string): void {
  try {
    const current = loadStoredSaathiKnownTopics()
    if (!current.includes(topicId)) {
      current.push(topicId)
      localStorage.setItem(STORAGE_KEYS.KNOWN_TOPICS, JSON.stringify(current))
    }
  } catch {
    // Ignore
  }
}

export function loadStoredSaathiSkippedTopics(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SKIPPED_TOPICS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStoredSaathiSkippedTopic(topicId: string): void {
  try {
    const current = loadStoredSaathiSkippedTopics()
    if (!current.includes(topicId)) {
      current.push(topicId)
      localStorage.setItem(STORAGE_KEYS.SKIPPED_TOPICS, JSON.stringify(current))
    }
  } catch {
    // Ignore
  }
}
