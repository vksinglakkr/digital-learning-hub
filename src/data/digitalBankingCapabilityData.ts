/**
 * Digital Banking & Security — Capability-Based Learning Data Module (Phase 5.5)
 * Based on approved Phase 5.4 Pedagogical & Architectural Specification
 *
 * Core Principles:
 * 1. Conversational, respectful, large readable text for senior citizens
 * 2. Zero examination, zero judgment, zero scoring or pass/fail
 * 3. 5-6 core questions + conditional questions (max 11)
 * 4. Transparent rule-based recommendations (max 3 practical skills prioritized by security)
 * 5. Four learner choices per recommendation
 * 6. Strictly local storage, zero sensitive financial detail collection
 */

export interface CapabilityOption {
  id: string
  textHindi: string
  subtextHindi?: string
}

export interface CapabilityQuestion {
  id: string
  topic: string
  conversationalHindi: string
  englishSubtext: string
  options: CapabilityOption[]
  isCore: boolean
  condition?: (answers: Record<string, string>) => boolean
}

export interface HelperGuidance {
  title: string
  helperRole: string
  stepsForHelper: string[]
  strictSecurityRule: string
}

export interface PracticalRecommendation {
  id: string
  priority: number
  badge: string
  badgeColor: 'rose' | 'amber' | 'emerald' | 'teal' | 'indigo'
  title: string
  englishTitle: string
  whyRecommended: string
  practicalBenefit: string
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
  helperGuidance: HelperGuidance
}

export interface LearnerChoiceState {
  skillId: string
  choice: 'self' | 'helper' | 'later' | 'known'
  timestamp: number
}

// -------------------------------------------------------------
// 1. CAPABILITY QUESTIONS (11 Touchpoints: Core + Conditional)
// -------------------------------------------------------------

export const CAPABILITY_QUESTIONS: CapabilityQuestion[] = [
  // Q1: Handset Screen Lock (Core)
  {
    id: 'q1',
    topic: 'फोन सुरक्षा (Phone Lock)',
    conversationalHindi: 'आप अपने मोबाइल को खोलने (Unlock करने) के लिए क्या इस्तेमाल करते हैं?',
    englishSubtext: 'Mobile screen lock method and handset physical security',
    isCore: true,
    options: [
      {
        id: 'fingerprint_or_pin',
        textHindi: 'फिंगरप्रिंट, फेस लॉक या 4-6 अंकों का पिन/पैटर्न लॉक इस्तेमाल करता हूँ',
        subtextHindi: 'सुरक्षित तरीका — कोई अन्य व्यक्ति सीधे फोन नहीं खोल सकता'
      },
      {
        id: 'swipe_only',
        textHindi: 'केवल स्वाइप करता हूँ (स्क्रीन पर कोई लॉक या पासवर्ड नहीं है)',
        subtextHindi: 'आसान तो है, पर फोन छूटने पर कोई भी खोल सकता है'
      },
      {
        id: 'no_lock_knowledge',
        textHindi: 'मुझे फोन पर लॉक या पिन लगाना नहीं आता',
        subtextHindi: 'स्क्रीन खुली रहती है'
      }
    ]
  },

  // Q2: ATM Cash Withdrawal (Core)
  {
    id: 'q2',
    topic: 'ATM का उपयोग (ATM Usage)',
    conversationalHindi: 'क्या आप पैसे निकालने के लिए बैंक शाखा जाते हैं या ATM का उपयोग करते हैं?',
    englishSubtext: 'Cash withdrawal habit and ATM autonomy',
    isCore: true,
    options: [
      {
        id: 'atm_self',
        textHindi: 'मैं स्वयं ATM मशीन पर जाकर पैसे निकाल लेता हूँ',
        subtextHindi: 'मशीन में कार्ड डालकर खुद पिन टाइप करता हूँ'
      },
      {
        id: 'atm_helper',
        textHindi: 'परिवार के सदस्य या किसी परिचित से ATM से पैसे निकलवाता हूँ',
        subtextHindi: 'कार्ड और पिन किसी अन्य को देकर पैसे मंगवाता हूँ'
      },
      {
        id: 'branch_only',
        textHindi: 'मैं केवल बैंक शाखा में जाकर चेक या विड्रॉल फॉर्म भरकर पैसे निकालता हूँ',
        subtextHindi: 'ATM मशीन का इस्तेमाल नहीं करता'
      }
    ]
  },

  // Q3: Bank Balance Checking (Core)
  {
    id: 'q3',
    topic: 'बैलेंस चेक (Balance Checking)',
    conversationalHindi: 'अपने बैंक खाते में पेंशन या जमा पैसे (बैलेंस) चेक करने के लिए आप क्या करते हैं?',
    englishSubtext: 'Account balance awareness and regular monitoring habit',
    isCore: true,
    options: [
      {
        id: 'sms_or_app',
        textHindi: 'फोन पर आने वाले SMS या बैंक ऐप में खुद देख लेता हूँ',
        subtextHindi: 'घर बैठे पता चल जाता है'
      },
      {
        id: 'branch_passbook',
        textHindi: 'बैंक शाखा जाकर पासबुक प्रिंट करवाकर ही पता चलता है',
        subtextHindi: 'महीने में या जरूरत पड़ने पर बैंक जाता हूँ'
      },
      {
        id: 'unsure_balance',
        textHindi: 'जब तक बैंक न जाऊं या बच्चे न बताएं, मुझे खाते का बैलेंस पता नहीं चलता',
        subtextHindi: 'अक्सर पता नहीं रहता कि खाते में कितना पैसा है'
      }
    ]
  },

  // Q4: UPI Apps (Core)
  {
    id: 'q4',
    topic: 'UPI ऐप्स (Google Pay, PhonePe, Paytm)',
    conversationalHindi: 'क्या आपके फोन में Google Pay, PhonePe, Paytm या BHIM जैसा कोई UPI ऐप मौजूद है?',
    englishSubtext: 'UPI app presence and psychological comfort',
    isCore: true,
    options: [
      {
        id: 'uses_upi_regularly',
        textHindi: 'हाँ, मेरे फोन में ऐप है और मैं नियमित उपयोग करता हूँ',
        subtextHindi: 'दुकान या बिल पेमेंट के लिए उपयोग करता हूँ'
      },
      {
        id: 'has_app_fear',
        textHindi: 'ऐप तो फोन में है, पर गलत बटन दबने या पैसे कटने के डर से इस्तेमाल करने में हिचकिचाता हूँ',
        subtextHindi: 'मन में संशय या डर बना रहता है'
      },
      {
        id: 'no_upi_app',
        textHindi: 'नहीं, मेरे फोन में ऐसा कोई UPI ऐप नहीं है',
        subtextHindi: 'मैंने कभी UPI चालू नहीं किया'
      }
    ]
  },

  // Q5: QR Code Payments (Core)
  {
    id: 'q5',
    topic: 'QR कोड पेमेंट (QR Payments)',
    conversationalHindi: 'बाज़ार में दुकान, दूध या मेडिकल स्टोर पर QR कोड स्कैन करके पेमेंट करने का आपका अनुभव कैसा है?',
    englishSubtext: 'Contactless QR payment confidence in everyday life',
    isCore: true,
    options: [
      {
        id: 'qr_self_confident',
        textHindi: 'मैं खुद आसानी से कैमरे से QR स्कैन करके पेमेंट कर लेता हूँ',
        subtextHindi: 'दुकानदार का नाम देखकर सही राशि भरता हूँ'
      },
      {
        id: 'qr_with_help',
        textHindi: 'कभी-कभार किसी की मदद से करता हूँ, अकेले करने में संकोच होता है',
        subtextHindi: 'दुकानदार या बच्चे से पुष्टि करवाता हूँ'
      },
      {
        id: 'qr_afraid_wrong_deduct',
        textHindi: 'मुझे डर लगता है कि कहीं ज्यादा पैसे न कट जाएं या गलत जगह न चले जाएं',
        subtextHindi: 'इसलिए नकद देना ही पसंद करता हूँ'
      }
    ]
  },

  // Q6: Bank Account Strategy (Core)
  {
    id: 'q6',
    topic: 'बैंक खाता सुरक्षा (Account Strategy)',
    conversationalHindi: 'जो बैंक खाता आपके फोन या UPI से जुड़ा है, क्या वही आपका मुख्य पेंशन या जीवन भर की बचत वाला खाता है?',
    englishSubtext: 'Financial exposure and air-gap protection between savings and UPI',
    isCore: true,
    options: [
      {
        id: 'single_main_account',
        textHindi: 'हाँ, मेरा सारा पैसा व पेंशन उसी एक मुख्य खाते में रहता है',
        subtextHindi: 'दैनिक खर्च और जीवन भर की बचत एक ही खाते में है'
      },
      {
        id: 'separate_low_balance_account',
        textHindi: 'नहीं, मैंने रोज़मर्रा के खर्च के लिए एक अलग छोटा (कम बैलेंस वाला) खाता रखा है',
        subtextHindi: 'मुख्य बचत खाता अलग व सुरक्षित है'
      },
      {
        id: 'unsure_linked_account',
        textHindi: 'मुझे ठीक से नहीं पता कि फोन से कौन सा बैंक खाता जुड़ा हुआ है',
        subtextHindi: 'किसी ने सेट कर दिया था, मुझे जानकारी नहीं'
      }
    ]
  },

  // Q7: Net Banking (Conditional: if has banking experience)
  {
    id: 'q7',
    topic: 'नेट बैंकिंग (Net Banking)',
    conversationalHindi: 'क्या आप कंप्यूटर या फोन पर बैंक की वेबसाइट (Net Banking) से बिजली बिल, टैक्स या फिक्स डिपॉजिट करते हैं?',
    englishSubtext: 'Web-based internet banking capability',
    isCore: false,
    condition: (answers) => answers['q2'] !== 'branch_only' || answers['q3'] === 'sms_or_app' || answers['q4'] === 'uses_upi_regularly',
    options: [
      {
        id: 'uses_net_banking',
        textHindi: 'हाँ, मैं कभी-कभार नेट बैंकिंग का उपयोग करता हूँ',
        subtextHindi: 'यूज़र आईडी व पासवर्ड याद रहता है'
      },
      {
        id: 'has_creds_hesitant',
        textHindi: 'बैंक से आईडी/पासवर्ड मिला हुआ है, पर डर की वजह से कभी इस्तेमाल नहीं किया',
        subtextHindi: 'पासवर्ड खो जाने या गलती का डर'
      },
      {
        id: 'never_net_banking',
        textHindi: 'मैंने नेट बैंकिंग कभी चालू नहीं करवाई और न ही इसकी ज़रूरत महसूस हुई',
        subtextHindi: 'इसकी प्रक्रिया नहीं जानता'
      }
    ]
  },

  // Q8: Online Debit/ATM Card Payments (Conditional: if uses ATM)
  {
    id: 'q8',
    topic: 'डेबिट कार्ड ऑनलाइन सुरक्षा (Online Cards)',
    conversationalHindi: 'क्या आप अपने ATM/डेबिट कार्ड से कभी ऑनलाइन खरीदारी, बिल पेमेंट या ट्रेन टिकट बुक करते हैं?',
    englishSubtext: 'Card-not-present online transaction security and OTP awareness',
    isCore: false,
    condition: (answers) => answers['q2'] === 'atm_self' || answers['q2'] === 'atm_helper',
    options: [
      {
        id: 'card_online_otp',
        textHindi: 'हाँ, कार्ड नंबर, CVV व OTP डालकर ऑनलाइन बुकिंग/शॉपिंग कर लेता हूँ',
        subtextHindi: 'फोन पर आने वाला OTP खुद भरता हूँ'
      },
      {
        id: 'card_atm_only',
        textHindi: 'केवल ATM मशीन पर पैसे निकालने के लिए कार्ड इस्तेमाल करता हूँ, ऑनलाइन कभी नहीं',
        subtextHindi: 'ऑनलाइन कार्ड डालना सुरक्षित नहीं लगता'
      },
      {
        id: 'card_fear',
        textHindi: 'ऑनलाइन कार्ड इस्तेमाल करने से डरता हूँ कि कहीं पूरा खाता खाली न हो जाए',
        subtextHindi: 'धोखाधड़ी की खबरें सुनकर संकोच होता है'
      }
    ]
  },

  // Q9: AutoPay / Auto-Debit (Conditional: if uses UPI or Net Banking)
  {
    id: 'q9',
    topic: 'ऑटो-पे व स्वतः कटौती (AutoPay Mandates)',
    conversationalHindi: 'क्या आपके बैंक खाते से हर महीने बिना पिन डाले कोई राशि (बिजली बिल, OTT, बीमा या ऐप) अपने आप कटती है?',
    englishSubtext: 'Recurring payments awareness and mandate audit',
    isCore: false,
    condition: (answers) => answers['q4'] === 'uses_upi_regularly' || answers['q4'] === 'has_app_fear' || answers['q7'] === 'uses_net_banking',
    options: [
      {
        id: 'knows_autopay',
        textHindi: 'हाँ, मैंने अपनी जानकारी से ऑटो-पे (AutoPay) सेट किया हुआ है',
        subtextHindi: 'मुझे पता है कि किस सेवा के पैसे कटते हैं'
      },
      {
        id: 'unexplained_deductions',
        textHindi: 'हाँ, कुछ पैसे कटते हैं पर मुझे ठीक से पता नहीं कि किस बात के कट रहे हैं',
        subtextHindi: 'मैसेज आता है पर समझ नहीं आता कि कैसे बंद करें'
      },
      {
        id: 'no_autopay',
        textHindi: 'नहीं, मेरे खाते से कोई स्वतः कटौती (Auto-Debit) नहीं होती',
        subtextHindi: 'हर भुगतान पिन डालकर ही होता है'
      }
    ]
  },

  // Q10: Fraud Awareness & Panic Defense (Conditional: Asked for everyone)
  {
    id: 'q10',
    topic: 'फर्जी कॉल व डिजिटल अरेस्ट (Fraud Resilience)',
    conversationalHindi: 'यदि फोन पर कोई कहे कि "आपका बिजली बिल नहीं भरा / लॉटरी निकली है / बैंक खाता बंद हो रहा है / पुलिस से वारंट है", तो आप क्या करेंगे?',
    englishSubtext: 'Resistance to social engineering and panic-inducing fake authority calls',
    isCore: false,
    condition: () => true,
    options: [
      {
        id: 'disconnect_verify',
        textHindi: 'तुरंत फोन काट दूँगा और किसी भी हाल में कोई पिन, OTP या पैसा नहीं भेजूंगा',
        subtextHindi: 'शांत रहकर आधिकारिक नंबर या बैंक जाकर पुष्टि करूँगा'
      },
      {
        id: 'panicked',
        textHindi: 'घबरा जाऊँगा और सामने वाले से पूछूँगा कि खाते या पुलिस से बचने के लिए क्या करना होगा',
        subtextHindi: 'डर के मारे जल्दबाजी में गलत कदम उठने की आशंका'
      },
      {
        id: 'confused',
        textHindi: 'कई बार समझ नहीं आता कि आने वाली कॉल या मैसेज सच है या फर्जी',
        subtextHindi: 'सरकारी विभाग या बैंक का नाम सुनकर भ्रमित हो जाता हूँ'
      }
    ]
  },

  // Q11: Lost Phone Readiness (Conditional: Asked for everyone)
  {
    id: 'q11',
    topic: 'खोया फोन व आपातकाल (Lost Phone Readiness)',
    conversationalHindi: 'यदि आपका फोन बाज़ार, ऑटो या यात्रा में कहीं छूट जाए या चोरी हो जाए, तो आपको क्या करना चाहिए?',
    englishSubtext: 'Golden Hour emergency protocol: SIM block, bank freeze, CEIR portal',
    isCore: false,
    condition: () => true,
    options: [
      {
        id: 'knows_recovery',
        textHindi: 'मुझे पता है कि सिम और बैंक खाते को तुरंत कैसे ब्लॉक कराना है',
        subtextHindi: 'Find My Device, 1930 और CEIR का क्रम जानता हूँ'
      },
      {
        id: 'unsure_delay',
        textHindi: 'मुझे ठीक से नहीं पता, घबराहट में परिवार या किसी परिचित की मदद ढूंढूँगा',
        subtextHindi: 'समय बीतने से खाते में जोखिम बढ़ सकता है'
      },
      {
        id: 'never_thought',
        textHindi: 'मैंने कभी इस बारे में नहीं सोचा कि फोन खोने पर क्या करना होगा',
        subtextHindi: 'कोई तैयारी या आपातकालीन नंबर नोट नहीं है'
      }
    ]
  }
]

// -------------------------------------------------------------
// 2. MASTER PRACTICAL RECOMMENDATIONS
// -------------------------------------------------------------

export const PRACTICAL_RECOMMENDATIONS_CATALOG: PracticalRecommendation[] = [
  // 1. Phone Lock & SIM PIN (Priority 1)
  {
    id: 'rec_phone_lock',
    priority: 1,
    badge: 'तत्काल हैंडसेट सुरक्षा (Urgent)',
    badgeColor: 'rose',
    title: 'फोन पर 30-सेकंड स्क्रीन लॉक व SIM PIN लगाना',
    englishTitle: 'Handset 30-Second Screen Lock & SIM PIN Security',
    whyRecommended: 'आपने बताया कि आपके फोन पर कोई लॉक नहीं है या लॉक लगाना नहीं आता। यदि फोन बाज़ार में छूट जाए तो कोई भी व्यक्ति आपके बैंक मैसेज और UPI ऐप खोल सकता है।',
    practicalBenefit: 'एक साधारण 4-अंकों का पिन या फिंगरप्रिंट लॉक आपके फोन को तिजोरी जैसा सुरक्षित बना देता है। 30 सेकंड का ऑटो-लॉक फोन छूटे रहने पर अपने आप स्क्रीन बंद कर देता है।',
    targetTab: 'habits',
    targetId: 'habit-07',
    infographicPreview: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
    infographicTitle: 'आदत 07: फोन को हमेशा लॉक रखें व स्क्रीन टाइमआउट सेट करें',
    helperGuidance: {
      title: 'सहयोगी (बेटे, बेटी या पोते-पोती) के साथ सीखने का तरीका',
      helperRole: 'घर के किसी समझदार सदस्य से कहें कि वे आपके फोन की Settings में जाकर Screen Lock और Fingerprint चालू करने का तरीका दिखाएं।',
      stepsForHelper: [
        'फोन की Settings > Security > Screen Lock पर जाएं।',
        'वरिष्ठ नागरिक के लिए आसान 4-अंकों का पिन या उनका फिंगरप्रिंट सेट करवाएं।',
        'स्क्रीन टाइमआउट को 30 सेकंड या 1 मिनट पर सेट करें ताकि फोन खुला न रहे।',
        'उन्हें 2-3 बार खुद फोन लॉक और अनलॉक करने का अभ्यास कराएं।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: सहायता करते समय केवल स्क्रीन सेटिंग्स दिखाएं। अपना स्क्रीन लॉक पिन, UPI PIN या पासवर्ड किसी के सामने न बोलें।'
    }
  },

  // 2. Two-Account Strategy (Priority 2)
  {
    id: 'rec_air_gap',
    priority: 2,
    badge: 'पूंजी सुरक्षा रणनीति (Air-Gap Protection)',
    badgeColor: 'rose',
    title: 'दो खातों की रणनीति — सुरक्षित UPI (छोटा खाता मॉडल)',
    englishTitle: 'Two-Account Air-Gap Strategy for Safe UPI Payments',
    whyRecommended: 'आपने बताया कि आपका मुख्य पेंशन या जीवन भर की बचत वाला खाता ही फोन या UPI से जुड़ा है। रोज़मर्रा के ₹50-₹100 के भुगतान के लिए ₹15 लाख के खाते को लिंक रखना जोखिम भरा हो सकता है।',
    practicalBenefit: 'दैनिक खर्च के लिए एक अलग बचत खाता (जिसमें केवल ₹2,000–₹5,000 रखे जाएं) UPI से जोड़ें। इससे मुख्य पेंशन खाता पूरी तरह अलग और सुरक्षित रहता है।',
    targetTab: 'projects',
    targetId: 'project-01',
    infographicPreview: '/tutorials/digital-banking/assets/40-habit-08-keep-low-balance.png',
    infographicTitle: 'आदत 08: UPI के लिए अलग छोटा बैंक खाता रखें',
    helperGuidance: {
      title: 'सहयोगी के साथ दूसरा खाता समझने का तरीका',
      helperRole: 'परिवार के सदस्य के साथ चर्चा करें कि बैंक में एक साधारण जीरो-बैलेंस या छोटा बचत खाता कैसे खोला जाए।',
      stepsForHelper: [
        'समझाएं कि मुख्य पेंशन खाते में से केवल ₹2,000–₹5,000 छोटे खाते में ट्रांसफर किए जाएंगे।',
        'Google Pay या PhonePe में उस छोटे खाते को मुख्य भुगतान खाता (Default Account) सेट करवाएं।',
        'वरिष्ठ नागरिक को आश्वस्त करें कि उनका बड़ा पेंशन खाता UPI से सुरक्षित दूरी पर है।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: बैंक खाता जोड़ते समय UPI PIN केवल वरिष्ठ नागरिक स्वयं टाइप करेंगे, किसी सहयोगी को PIN नहीं बताएंगे।'
    }
  },

  // 3. Lost Phone 15-Minute Recovery Workflow (Priority 3)
  {
    id: 'rec_lost_phone',
    priority: 3,
    badge: 'आपातकालीन तैयारी (Emergency Protocol)',
    badgeColor: 'amber',
    title: 'फोन गुम होने पर 15-मिनट सुरक्षा व रिकवरी वर्कफ़्लो',
    englishTitle: '15-Minute Lost Phone Safety & Golden Hour Recovery Workflow',
    whyRecommended: 'आपने बताया कि फोन खोने पर क्या करना है इसकी पूरी जानकारी नहीं है। फोन चोरी होने पर पहले 60 मिनट (Golden Hour) में सही कदम उठाने से बैंक खाता और डेटा सुरक्षित रहता है।',
    practicalBenefit: '5 सरल चरण: Find My Device से खोजना → तुरंत SIM ब्लॉक करना → बैंक हेल्पलाइन पर UPI रोकना → CEIR पर फोन का IMEI ब्लॉक करना → WhatsApp सत्र बंद करना।',
    targetTab: 'projects',
    targetId: 'project-03',
    infographicPreview: '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
    infographicTitle: 'प्रोजेक्ट 03: खोए हुए फोन की सुरक्षा का 5-चरणीय वर्कफ़्लो',
    helperGuidance: {
      title: 'सहयोगी के साथ आपातकालीन नंबर नोट करने का अभ्यास',
      helperRole: 'घर के कंप्यूटर या दूसरे फोन पर Find My Device और CEIR पोर्टल का तरीका दिखाएं और जरूरी नंबर डायरी में लिखवाएं।',
      stepsForHelper: [
        'वरिष्ठ नागरिक के फोन का 15-अंकों का IMEI नंबर (*#06# डायल करके) उनकी घर की डायरी में नोट करवाएं।',
        'टेलीकॉम कंपनी का सिम ब्लॉक हेल्पलाइन नंबर और बैंक का आपातकालीन हॉटलिस्टिंग नंबर फोन में सेव करवाएं।',
        'कंप्यूटर पर android.com/find खोलकर दिखाएं कि खोया फोन कैसे रिंग या लॉक किया जाता है।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: कभी भी Google पासवर्ड या सिम का PUK कोड असुरक्षित कागज पर लिखकर न छोड़ें।'
    }
  },

  // 4. Find & Stop Unexplained AutoPay (Priority 4)
  {
    id: 'rec_autopay',
    priority: 4,
    badge: 'खाता ऑडिट (AutoPay Control)',
    badgeColor: 'amber',
    title: 'अनजाने AutoPay व सब्सक्रिप्शन ढूंढना और बंद करना',
    englishTitle: 'Find and Cancel Unwanted AutoPay & Recurring Debits',
    whyRecommended: 'आपने बताया कि आपके खाते से बिना आपकी स्पष्ट जानकारी के कुछ पैसे कट रहे हैं। कई बार जाने-अनजाने ऐप्स में AutoPay चालू हो जाता है।',
    practicalBenefit: 'Google Pay, PhonePe या Paytm की सेटिंग्स में जाकर "Autopay" सूची देखना और जो सेवा काम की न हो उसे एक टैप में हमेशा के लिए रद्द करना।',
    targetTab: 'projects',
    targetId: 'project-02',
    infographicPreview: '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
    infographicTitle: 'प्रोजेक्ट 02: Paytm, PhonePe व Google Pay में AutoPay ढूंढना व बंद करना',
    helperGuidance: {
      title: 'सहयोगी के साथ AutoPay सूची की जांच',
      helperRole: 'वरिष्ठ नागरिक के फोन में उनके सामने UPI ऐप खोलकर सक्रिय मैंडेट (Active Mandates) की सूची दिखाएं।',
      stepsForHelper: [
        'PhonePe / GPay खोलकर Profile > AutoPay / Recurring Payments पर जाएं।',
        'दिखाएं कि कौन-कौन सी सेवाएं सूची में हैं और हर महीने कितने रुपये कट रहे हैं।',
        'यदि कोई अनावश्यक सेवा (जैसे गेम, पुरानी मेंबरशिप) दिखे, तो "Cancel AutoPay" पर टैप करवाएं।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: AutoPay बंद करते समय आने वाला पुष्टि स्क्रीन केवल वरिष्ठ नागरिक को दिखाएं और PIN उन्हीं से डलवाएं।'
    }
  },

  // 5. Fraud Resilience & Digital Arrest Protection (Priority 5)
  {
    id: 'rec_fraud_resilience',
    priority: 5,
    badge: 'धोखाधड़ी से बचाव (Scam Defense)',
    badgeColor: 'teal',
    title: '"Never Hurry Always Verify" — डिजिटल अरेस्ट व फर्जी कॉल से बचाव',
    englishTitle: 'Never Hurry Always Verify: Defense Against Digital Arrest & Panic Scams',
    whyRecommended: 'आपने बताया कि अनजान कॉल आने पर डर या भ्रम पैदा हो जाता है। साइबर अपराधी डर, जल्दबाजी और झूठे पुलिस वारंट की धमकियों का सहारा लेते हैं।',
    practicalBenefit: 'गोल्डन रूल: "कोई भी वास्तविक पुलिस या बैंक अधिकारी कभी फोन/व्हाट्सएप वीडियो पर गिरफ्तारी नहीं करता और न ही किसी खाते में पैसे ट्रांसफर करने को कहता है।"',
    targetTab: 'scams',
    targetId: 'scam-03',
    infographicPreview: '/tutorials/digital-banking/assets/46-scam-03-digital-arrest.png',
    infographicTitle: 'स्कैम 03: डिजिटल अरेस्ट — फर्जी पुलिस व सीबीआई का डर',
    helperGuidance: {
      title: 'सहयोगी के साथ फर्जी कॉल पहचानने की चर्चा',
      helperRole: 'घर के वरिष्ठ नागरिक को समझाएं कि यदि कोई भी फोन पर डराए तो घबराने की ज़रूरत नहीं है।',
      stepsForHelper: [
        'समझाएं कि "तुरंत पैसे भेजो वरना बिजली कटेगी या बेटा अरेस्ट होगा" 100% फर्जी कॉल होती है।',
        'वरिष्ठ नागरिक से कहें कि ऐसी कॉल आने पर बिना संकोच तुरंत कॉल काट दें और परिवार के किसी सदस्य को बताएं।',
        'फोन में राष्ट्रीय साइबर हेल्पलाइन 1930 को "आपातकालीन साइबर पुलिस 1930" नाम से सेव करवाएं।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: किसी भी अनजान व्यक्ति के कहने पर AnyDesk, TeamViewer या QuickShare जैसा स्क्रीन शेयर ऐप कभी फोन में न डालें।'
    }
  },

  // 6. Safe QR Code & UPI Payment Confidence (Priority 6)
  {
    id: 'rec_qr_safety',
    priority: 6,
    badge: 'दैनिक सुविधा (Everyday Practical)',
    badgeColor: 'teal',
    title: 'फिक्स अमाउंट QR कोड से सुरक्षित भुगतान व मन का डर दूर करना',
    englishTitle: 'Fixed-Amount QR Codes & Overpayment Prevention',
    whyRecommended: 'आपने बताया कि QR कोड स्कैन करके पेमेंट करने में डर लगता है कि कहीं ज्यादा पैसे न कट जाएं या गलत बटन न दब जाए।',
    practicalBenefit: 'समझिए कि QR कोड स्कैन करने पर स्क्रीन पर पहले दुकानदार का नाम और राशि दिखती है। जब तक आप 4-6 अंकों का गोपनीय UPI PIN नहीं डालते, आपके खाते से एक रुपया भी नहीं कट सकता।',
    targetTab: 'upi-payments',
    targetIndex: 8,
    infographicPreview: '/tutorials/digital-banking/assets/19-qr-code.png',
    infographicTitle: 'पाठ 09: फिक्स QR कोड व डायनामिक QR कोड की समझ',
    helperGuidance: {
      title: 'सहयोगी के साथ सुरक्षित QR स्कैन का लाइव अभ्यास',
      helperRole: 'घर में या पास की दुकान पर ₹10 या ₹20 का एक सुरक्षित अभ्यास करवाएं।',
      stepsForHelper: [
        'QR कोड पर कैमरा केंद्रित करने का सही कोण दिखाएं।',
        'स्क्रीन पर दुकानदार का नाम और भरी गई राशि को उंगली रखकर 2 सेकंड तक चेक करवाएं।',
        'समझाएं कि पैसे कटने से पहले हमेशा PIN स्क्रीन आती है, गलती से पेमेंट कभी नहीं होता।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: QR स्कैन करते समय PIN स्क्रीन पर सहयोगी अपनी नज़र दूसरी तरफ रखे ताकि वरिष्ठ नागरिक का पिन पूरी तरह गोपनीय रहे।'
    }
  },

  // 7. ATM PIN & Skimming Protection (Priority 7)
  {
    id: 'rec_atm_security',
    priority: 7,
    badge: 'ATM सुरक्षा (Card & Machine Safety)',
    badgeColor: 'indigo',
    title: 'ATM मशीन पर कार्ड व PIN की गोपनीयता (शोल्डर सर्फिंग से बचाव)',
    englishTitle: 'ATM Card & PIN Privacy: Shoulder Surfing & Skimmer Defense',
    whyRecommended: 'आपने बताया कि आप ATM से पैसे निकालते हैं या किसी परिचित से निकलवाते हैं। मशीन के पास खड़े अनजान लोगों या छुपे कैमरों से पिन चुराने की घटनाएं होती हैं।',
    practicalBenefit: 'ATM में पिन डालते समय दूसरे हाथ से कीपैड को ऊपर से ढंकें। अपना ATM कार्ड और 4-अंकों का पिन कभी किसी अनजान व्यक्ति या ऑटो ड्राइवर को न सौंपें।',
    targetTab: 'scams',
    targetId: 'scam-13',
    infographicPreview: '/tutorials/digital-banking/assets/58-scam-13-atm-frauds.png',
    infographicTitle: 'स्कैम 13: ATM फ्रॉड — क्लोनिंग, शोल्डर सर्फिंग व कार्ड स्वैपिंग',
    helperGuidance: {
      title: 'सहयोगी के साथ ATM सुरक्षा के नियम',
      helperRole: 'वरिष्ठ नागरिक को अगली बार ATM ले जाकर कीपैड ढंकने और मशीन का स्लॉट जांचने का अभ्यास कराएं।',
      stepsForHelper: [
        'दिखाएं कि कार्ड डालने वाले स्लॉट पर हाथ लगाकर देखें कि कोई अतिरिक्त प्लास्टिक या ढीला पुर्जा तो नहीं लगा।',
        'पिन टाइप करते समय एक हाथ से कीपैड को ऊपर से छाते की तरह ढंकने का अभ्यास कराएं।',
        'पैसे निकलने के बाद Cancel बटन दबाकर हरी बत्ती जलने तक रुकने की आदत डलवाएं।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: ATM कार्ड पर कभी भी स्केच पेन से पिन न लिखें। पिन केवल दिमाग में याद रखना चाहिए।'
    }
  },

  // 8. Bank Balance Checking & SMS Alerts (Priority 8)
  {
    id: 'rec_balance_sms',
    priority: 8,
    badge: 'बुनियादी बैंकिंग (Everyday Practical)',
    badgeColor: 'emerald',
    title: 'बैंक बैलेंस व आधिकारिक SMS अलर्ट की आसान समझ',
    englishTitle: 'Account Balance Checking & Understanding Official Bank SMS Alerts',
    whyRecommended: 'आपने बताया कि बैलेंस जानने के लिए बैंक जाना पड़ता है या पता नहीं चलता। आपके फोन पर आने वाले बैंक SMS को पढ़ना बहुत आसान है।',
    practicalBenefit: 'बैंक की हर जमा (Credit / Cr) और निकासी (Debit / Dr) का SMS कैसा दिखता है, यह पहचानना और बिना बैंक की लाइन में लगे बैलेंस जानना।',
    targetTab: 'fear-removal',
    targetIndex: 0,
    infographicPreview: '/tutorials/digital-banking/assets/04-two-fears-balance-wrong-click.png',
    infographicTitle: 'पाठ 01: बैंकिंग के दो बड़े डर — बैलेंस खत्म होना व गलत बटन दबना',
    helperGuidance: {
      title: 'सहयोगी के साथ बैंक SMS पढ़ने का अभ्यास',
      helperRole: 'वरिष्ठ नागरिक के मैसेज इनबॉक्स में जाकर बैंक से आए पिछले 2-3 SMS खोलकर दिखाएं।',
      stepsForHelper: [
        'समझाएं कि प्रेषक का नाम (जैसे SBIINB, HDFCBK, PUNBNK) कैसे अधिकृत बैंक को दर्शाता है।',
        'दिखाएं कि "Credited" का अर्थ पैसे आना (जैसे पेंशन) है और "Debited" का अर्थ पैसे कटना है।',
        'बैलेंस जानने के लिए बैंक का टोल-फ्री मिस्ड कॉल नंबर फोन में सेव करवाएं।'
      ],
      strictSecurityRule: 'सहयोगी के लिए सुरक्षा नियम: SMS में आए किसी भी अज्ञात लिंक (जैसे bit.ly या apk) पर कभी क्लिक न करने की हिदायत दें।'
    }
  }
]

// Default Fallback Recommendations for Savvy Learners
export const ADVANCED_SAFETY_RECOMMENDATIONS: PracticalRecommendation[] = [
  {
    id: 'rec_audit_4in1',
    priority: 1,
    badge: 'उन्नत सुरक्षा (Advanced Security)',
    badgeColor: 'indigo',
    title: '4-in-1 डिजिटल सुरक्षा ऑडिट (Aadhaar, Google, WhatsApp, SIM)',
    englishTitle: '4-in-1 Digital Security Audit for Complete Peace of Mind',
    whyRecommended: 'आपकी डिजिटल बैंकिंग समझ बहुत अच्छी है! अपनी संपूर्ण सुरक्षा को पुख्ता करने के लिए आधार बायोमेट्रिक लॉक और टू-स्टेप वेरिफिकेशन की जांच करें।',
    practicalBenefit: 'UIDAI पर आधार लॉक करना, Google अकाउंट सुरक्षा चेकअप, WhatsApp टू-स्टेप पिन और TAFCOP पर नाम से जारी सिम की जांच।',
    targetTab: 'projects',
    targetId: 'project-04',
    infographicPreview: '/tutorials/digital-banking/assets/66-sim-aadhaar-whatsapp-protection.png',
    infographicTitle: 'प्रोजेक्ट 04: 4-in-1 डिजिटल सुरक्षा ऑडिट',
    helperGuidance: {
      title: 'डिजिटल सुरक्षा ऑडिट के मुख्य चरण',
      helperRole: 'अपने कंप्यूटर या फोन पर चारों आधिकारिक पोर्टल्स की जांच करें।',
      stepsForHelper: [
        'm-Aadhaar या UIDAI पोर्टल पर जाकर Biometrics Lock फीचर ऑन करें।',
        'WhatsApp Settings > Account > Two-Step Verification में 6-अंकों का पिन सेट करें।',
        'tafcop.sancharsaathi.gov.in पर देखें कि आपके नाम से कितने सिम जारी हैं।'
      ],
      strictSecurityRule: 'सुरक्षा नियम: आधार लॉक या Google पासवर्ड कभी भी किसी तीसरे व्यक्ति के साथ साझा न करें।'
    }
  },
  {
    id: 'rec_golden_habits',
    priority: 2,
    badge: 'सुरक्षा आदतें (Best Practices)',
    badgeColor: 'amber',
    title: '11 सुनहरी सुरक्षा आदतें — कभी न भूलने वाले डिजिटल नियम',
    englishTitle: '11 Golden Habits of Digital Banking & Handset Hygiene',
    whyRecommended: 'दैनिक जीवन में छोटी-छोटी आदतें जैसे पब्लिक वाई-फाई से बचना और ऐप परमिशन की नियमित समीक्षा सबसे बड़ा कवच हैं।',
    practicalBenefit: 'श्री विनोद सिंगला द्वारा संकलित 11 व्यावहारिक नियम जो किसी भी प्रकार की वित्तीय धोखाधड़ी को पहले ही चरण में रोक देते हैं।',
    targetTab: 'habits',
    infographicPreview: '/tutorials/digital-banking/assets/33-habit-01-observe-before-click.png',
    infographicTitle: '11 सुनहरी आदतें: Observe Before Click',
    helperGuidance: {
      title: '11 सुनहरी आदतों की पारिवारिक समीक्षा',
      helperRole: 'घर के सभी सदस्यों के साथ मिलकर 11 आदतों को पढ़ें और अपने फोन की सेटिंग्स जांचें।',
      stepsForHelper: [
        'फोन सेटिंग्स में जाकर अनावश्यक लोकेशन व कैमरा परमिशन बंद करें।',
        'पब्लिक स्थानों पर फ्री वाई-फाई से बैंकिंग ऐप न खोलने का नियम बनाएं।',
        'परिवार में 1930 हेल्पलाइन का महत्व साझा करें।'
      ],
      strictSecurityRule: 'सुरक्षा नियम: सुरक्षित आदतें ही सबसे बड़ा सुरक्षा कवच हैं।'
    }
  },
  {
    id: 'rec_emergency_hub',
    priority: 3,
    badge: 'आपातकालीन सहायता (24x7 Help)',
    badgeColor: 'rose',
    title: 'राष्ट्रीय साइबर हेल्पलाइन 1930 व 8 आपातकालीन स्थितियां',
    englishTitle: 'National Cyber Helpline 1930 & 8 Specific Emergency Action Guides',
    whyRecommended: 'धोखाधड़ी होने पर पहले 60 मिनट में 1930 पर कॉल करने से पैसा अंतरित होने से रोका जा सकता है।',
    practicalBenefit: '1930, Chakshu, CEIR, Sanchar Saathi और बैंक फ्रॉड रिपोर्टिंग के स्पष्ट नियम।',
    targetTab: 'emergency',
    infographicPreview: '/tutorials/digital-banking/assets/57-scam-12b-sim-esim-security.png',
    infographicTitle: 'आपातकालीन सहायता केंद्र: 8 स्थितियां व हेल्पलाइन 1930',
    helperGuidance: {
      title: 'आपातकालीन सहायता की तैयारी',
      helperRole: 'अपने और परिवार के सभी फोनों में 1930 नंबर सेव रखें।',
      stepsForHelper: [
        'फोन में हेल्पलाइन 1930 को स्पीड डायल या फेवरिट्स में जोड़ें।',
        'बैंक का आपातकालीन टोल-फ्री कार्ड ब्लॉक नंबर फोन में रखें।',
        'साइबर क्राइम पोर्टल cybercrime.gov.in को ब्राउज़र में बुकमार्क करें।'
      ],
      strictSecurityRule: 'सुरक्षा नियम: हेल्पलाइन 1930 भारत सरकार की आधिकारिक निःशुल्क सेवा है।'
    }
  }
]

// -------------------------------------------------------------
// 3. TRANSPARENT RULE-BASED RECOMMENDATION ENGINE
// -------------------------------------------------------------

export function evaluateRecommendations(answers: Record<string, string>): PracticalRecommendation[] {
  const triggered: PracticalRecommendation[] = []

  // Rule 1: Phone screen lock
  if (answers['q1'] === 'swipe_only' || answers['q1'] === 'no_lock_knowledge') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_phone_lock')
    if (rec) triggered.push(rec)
  }

  // Rule 2: Account Strategy (Single main pension account)
  if (answers['q6'] === 'single_main_account' || answers['q6'] === 'unsure_linked_account') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_air_gap')
    if (rec) triggered.push(rec)
  }

  // Rule 3: Lost phone readiness
  if (answers['q11'] === 'unsure_delay' || answers['q11'] === 'never_thought') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_lost_phone')
    if (rec) triggered.push(rec)
  }

  // Rule 4: AutoPay unexplained deductions
  if (answers['q9'] === 'unexplained_deductions') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_autopay')
    if (rec) triggered.push(rec)
  }

  // Rule 5: Fraud resilience & panic calls
  if (answers['q10'] === 'panicked' || answers['q10'] === 'confused') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_fraud_resilience')
    if (rec) triggered.push(rec)
  }

  // Rule 6: QR Code & UPI hesitation
  if (
    answers['q4'] === 'has_app_fear' ||
    answers['q5'] === 'qr_afraid_wrong_deduct' ||
    answers['q5'] === 'qr_with_help'
  ) {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_qr_safety')
    if (rec) triggered.push(rec)
  }

  // Rule 7: ATM & Debit Card PIN safety
  if (
    (answers['q2'] === 'atm_self' || answers['q2'] === 'atm_helper') &&
    (answers['q8'] === 'card_fear' || answers['q2'] === 'atm_helper')
  ) {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_atm_security')
    if (rec) triggered.push(rec)
  }

  // Rule 8: Bank balance checking
  if (answers['q3'] === 'branch_passbook' || answers['q3'] === 'unsure_balance') {
    const rec = PRACTICAL_RECOMMENDATIONS_CATALOG.find(r => r.id === 'rec_balance_sms')
    if (rec) triggered.push(rec)
  }

  // Sort by priority (ascending, 1 is highest priority)
  triggered.sort((a, b) => a.priority - b.priority)

  // Max 3 recommendations
  if (triggered.length > 0) {
    return triggered.slice(0, 3)
  }

  // If learner answered all best practices safely, return top advanced security recommendations
  return ADVANCED_SAFETY_RECOMMENDATIONS.slice(0, 3)
}

// -------------------------------------------------------------
// 4. LOCAL STORAGE HELPERS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  ANSWERS: 'dlh_db_assessment_answers',
  SAVED_SKILLS: 'dlh_db_saved_skills',
  KNOWN_SKILLS: 'dlh_db_known_skills'
}

export function loadStoredAssessmentAnswers(): Record<string, string> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function saveStoredAssessmentAnswers(answers: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers))
  } catch {
    // Local storage unavailable or full
  }
}

export function clearStoredAssessmentAnswers(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS)
  } catch {
    // Ignore
  }
}

export function loadStoredSavedSkills(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_SKILLS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStoredSavedSkill(skillId: string): void {
  try {
    const current = loadStoredSavedSkills()
    if (!current.includes(skillId)) {
      current.push(skillId)
      localStorage.setItem(STORAGE_KEYS.SAVED_SKILLS, JSON.stringify(current))
    }
  } catch {
    // Ignore
  }
}

export function removeStoredSavedSkill(skillId: string): void {
  try {
    const current = loadStoredSavedSkills()
    const updated = current.filter(id => id !== skillId)
    localStorage.setItem(STORAGE_KEYS.SAVED_SKILLS, JSON.stringify(updated))
  } catch {
    // Ignore
  }
}

export function clearAllStoredSavedSkills(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_SKILLS)
  } catch {
    // Ignore
  }
}

export function loadStoredKnownSkills(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KNOWN_SKILLS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStoredKnownSkill(skillId: string): void {
  try {
    const current = loadStoredKnownSkills()
    if (!current.includes(skillId)) {
      current.push(skillId)
      localStorage.setItem(STORAGE_KEYS.KNOWN_SKILLS, JSON.stringify(current))
    }
  } catch {
    // Ignore
  }
}

export function clearAllStoredKnownSkills(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.KNOWN_SKILLS)
  } catch {
    // Ignore
  }
}
