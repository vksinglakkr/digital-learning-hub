export interface InteractiveOption {
  id: string
  text: string
  isCorrect: boolean
  feedback: string
}

export interface InteractiveCheck {
  question: string
  options: InteractiveOption[]
}

export interface GuidedProjectStep {
  stepNumber: number
  title: string
  objective: string
  instruction: string
  expectedResult: string
  safetyRule: string
  relatedInfographic?: {
    path: string
    title: string
    caption: string
  }
  // Phase 5.1 Interactive Pilot Fields
  thinkQuestion?: string
  thinkInteraction?: InteractiveCheck
  selfCheck?: InteractiveCheck
}

export interface DigitalBankingProject {
  id: string
  title: string
  subtitle: string
  stepsCount: string
  badgeColor: string
  description: string
  thumbnail: string
  originalStory: string
  originalInfographicRefs: string[]
  handsOnSteps: GuidedProjectStep[]
  realLifeOutcome: string
  keyLearnings: string[]
  relatedLessons: string[]
  relatedHabits: string[]
  isInteractivePilot?: boolean
}

export const DIGITAL_BANKING_PROJECTS: DigitalBankingProject[] = [
  {
    id: 'project-safe-upi-setup',
    title: 'प्रोजेक्ट 1: अपना सुरक्षित UPI सिस्टम बनाएं (छोटा खाता व दैनिक सीमा)',
    subtitle: 'Safe UPI Architecture: Secondary Account & Daily Transfer Limit',
    stepsCount: '5 इंटरैक्टिव चरण',
    badgeColor: 'bg-emerald-600 text-white',
    isInteractivePilot: true,
    description: 'पेंशन और जीवनभर की जमा-पूंजी को दैनिक UPI से पूरी तरह अलग रखने, कम बैलेंस वाला द्वितीयक खाता लिंक करने और दैनिक ट्रांसफर लिमिट सेट करने का संपूर्ण गाइडेड प्रोजेक्ट।',
    thumbnail: '/tutorials/digital-banking/assets/40-habit-08-keep-low-balance-separate-account.png',
    originalStory: 'शर्मा जी सेवानिवृत्त हुए और अपनी ग्रेच्युटी के ₹15 लाख मुख्य बैंक बचत खाते में रखे। उन्होंने उसी खाते को सीधे Google Pay से जोड़ लिया। जब भी वे बाजार में ₹50 की सब्जी खरीदते, तो उनके मन में धड़कन बढ़ जाती कि कहीं गलत बटन दबाने से पूरा ₹15 लाख न चला जाए। यह प्रोजेक्ट उन्हें "सुरक्षा दीवार (Air-Gap Protection)" बनाना सिखाता है।',
    originalInfographicRefs: [
      '/tutorials/digital-banking/assets/40-habit-08-keep-low-balance-separate-account.png',
      '/tutorials/digital-banking/assets/18-upi.png',
      '/tutorials/digital-banking/assets/23-16-lessons.png',
      '/tutorials/digital-banking/assets/35-habit-03-never-share-otp.png',
      '/tutorials/digital-banking/assets/28-fix-amount-qr-code.png'
    ],
    handsOnSteps: [
      {
        stepNumber: 1,
        title: 'बैंक खातों का रणनीतिक विभाजन समझना',
        objective: 'मुख्य बचत खाते और दैनिक खर्च खाते के अंतर को समझना।',
        thinkQuestion: 'आपके Pension Account में ₹15 लाख हैं। रोजमर्रा के छोटे UPI Payments के लिए क्या करना बेहतर होगा?',
        thinkInteraction: {
          question: 'अपने अनुभव के आधार पर सोचकर सही विकल्प चुनें:',
          options: [
            {
              id: 'opt-1a',
              text: 'मुख्य Pension Account को ही UPI से जोड़ना जरूरी है।',
              isCorrect: false,
              feedback: 'मुख्य पेंशन खाते को सीधे UPI से जोड़ना जोखिम भरा हो सकता है, क्योंकि किसी भी चूक या धोखेबाजी की स्थिति में जीवनभर की बचत प्रभावित हो सकती है।'
            },
            {
              id: 'opt-1b',
              text: 'एक अलग, कम बैलेंस वाला Account UPI के लिए इस्तेमाल करना बेहतर हो सकता है।',
              isCorrect: true,
              feedback: 'एक अलग कम बैलेंस वाला खाता रखने से रोजमर्रा के UPI उपयोग में जोखिम वाली राशि सीमित हो सकती है, हालांकि यह धोखाधड़ी से 100% सुरक्षा की गारंटी नहीं है; सावधानी हमेशा आवश्यक है।'
            },
            {
              id: 'opt-1c',
              text: 'UPI का इस्तेमाल ही नहीं करना चाहिए।',
              isCorrect: false,
              feedback: 'UPI का उपयोग पूरी तरह बंद करने की आवश्यकता नहीं है; सही सुरक्षा सावधानियों और अलग छोटे खाते के साथ डिजिटल भुगतान सुविधाजनक और सुरक्षित है।'
            }
          ]
        },
        instruction: 'अपने बैंक पासबुक को देखें। अपने मुख्य पेंशन खाते को "तिजोरी" समझें और दैनिक खर्च के लिए बैंक में एक शून्य-बैलेंस बचत खाता (या अलग बैंक का छोटा खाता) चुनें जिसमें केवल ₹2,000 से ₹5,000 रखें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/40-habit-08-keep-low-balance-separate-account.png',
          title: 'आठवीं आदत: UPI के लिए अलग बैंक खाता रखें',
          caption: 'मुख्य बचत खाते और दैनिक UPI खाते के बीच एयर-गैप सुरक्षा दीवार का आधिकारिक सचित्र नियम।'
        },
        expectedResult: 'शिक्षार्थी समझ जाता है कि मुख्य खाता कभी सीधे UPI से नहीं जुड़ा होना चाहिए।',
        safetyRule: 'मुख्य पेंशन खाते का डेबिट कार्ड कभी बाजार लेकर न जाएं।',
        selfCheck: {
          question: 'दैनिक UPI के लिए अलग छोटा बैंक खाता रखने का मुख्य लाभ क्या है?',
          options: [
            {
              id: 'sc-1a',
              text: 'अनधिकृत लेन-देन या गलती की स्थिति में केवल छोटी राशि ही जोखिम में रहती है',
              isCorrect: true,
              feedback: 'शाबाश! यही सही उत्तर है। इसे "Air-Gap Protection" कहते हैं।'
            },
            {
              id: 'sc-1b',
              text: 'मुख्य पेंशन खाते को ही हर जगह जोड़ना अनिवार्य होता है',
              isCorrect: false,
              feedback: 'गलत! इससे आपकी पूरी जमा-पूंजी पर अनावश्यक जोखिम बना रहता है।'
            }
          ]
        }
      },
      {
        stepNumber: 2,
        title: 'UPI ऐप में केवल द्वितीयक छोटा खाता लिंक करना',
        objective: 'Google Pay या PhonePe में केवल छोटे खाते को प्राथमिक (Primary) बनाना।',
        thinkQuestion: 'जब आप किसी दुकान पर QR कोड स्कैन करते हैं, तो पैसा किस खाते से कटेगा — यह कौन तय करता है?',
        thinkInteraction: {
          question: 'क्या आप जानते हैं कि भुगतान के समय कौन सा खाता चुना जाता है?',
          options: [
            {
              id: 'opt-2a',
              text: 'जो खाता ऐप में "Primary / Default" सेट किया गया हो।',
              isCorrect: true,
              feedback: 'एकदम सही! इसलिए ऐप में हमेशा छोटे खाते को ही "Primary" बनाकर रखें।'
            },
            {
              id: 'opt-2b',
              text: 'दुकानदार तय करता है कि पैसा कहाँ से कटेगा।',
              isCorrect: false,
              feedback: 'गलत! दुकानदार कभी आपका खाता नहीं चुन सकता। नियंत्रण केवल आपके फोन की ऐप सेटिंग्स में होता है।'
            }
          ]
        },
        instruction: 'UPI ऐप खोलें → प्रोफाइल पर जाएं → Bank Accounts में जाकर द्वितीयक छोटे खाते को जोड़ें और उसे "Set as primary / default" सेट करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/18-upi.png',
          title: 'UPI क्या है और कैसे काम करता है?',
          caption: 'UPI की कार्यप्रणाली और वर्चुअल पेमेंट एड्रेस (VPA) का सचित्र विवरण।'
        },
        expectedResult: 'हर QR कोड स्कैन पर भुगतान केवल छोटे खाते से ही कटेगा।',
        safetyRule: 'यदि मुख्य खाता पहले से जुड़ा है, तो उसे UPI ऐप से हटा (Remove Account) दें।',
        selfCheck: {
          question: 'यदि आपके मुख्य और छोटे दोनों खाते जुड़े हैं, तो सुरक्षित रहने के लिए क्या करना चाहिए?',
          options: [
            {
              id: 'sc-2a',
              text: 'मुख्य खाते को ऐप से हटा दें या छोटे खाते को Primary बनाएं',
              isCorrect: true,
              feedback: 'बहुत बढ़िया! इससे मुख्य खाते से गलती से भी पैसे कटने की गुंजाइश खत्म हो जाती है।'
            },
            {
              id: 'sc-2b',
              text: 'दोनों में समान राशि रखें',
              isCorrect: false,
              feedback: 'नहीं, मुख्य खाते में बड़ी रकम सुरक्षित रहनी चाहिए।'
            }
          ]
        }
      },
      {
        stepNumber: 3,
        title: 'दैनिक लेनदेन सीमा (Daily Transfer Limit) निर्धारित करना',
        objective: 'खाते से प्रतिदिन अधिकतम खर्च की सीमा सीमित करना।',
        thinkQuestion: 'मान लीजिए किसी दिन आपका फोन अनलॉक स्थिति में खो जाता है, तो क्या चोर आपके खाते से लाखों रुपये निकाल सकता है?',
        thinkInteraction: {
          question: 'दैनिक सीमा लगाने से क्या फायदा होता है?',
          options: [
            {
              id: 'opt-3a',
              text: 'यदि सीमा ₹2,000 है, तो कोई चाहकर भी उस दिन ₹2,001 नहीं निकाल सकता।',
              isCorrect: true,
              feedback: 'अति उत्तम! दैनिक सीमा आपकी अनुमति के बिना बड़ा नुकसान होने ही नहीं देती।'
            },
            {
              id: 'opt-3b',
              text: 'दैनिक सीमा लगाने से बैंक पैसे काट लेता है।',
              isCorrect: false,
              feedback: 'बिल्कुल नहीं! दैनिक सीमा एक मुफ्त सुरक्षा सुविधा है जो हर बैंक प्रदान करता है।'
            }
          ]
        },
        instruction: 'अपने मोबाइल बैंकिंग ऐप में जाएं → "Manage UPI / Account Limits" खोलें → दैनिक UPI खर्च की सीमा ₹2,000 या ₹5,000 सेट करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/23-16-lessons.png',
          title: 'डिजिटल पेमेंट में 16 जरूरी बातें व नियम',
          caption: 'दैनिक लेनदेन सीमा व डिजिटल पेमेंट के 16 महत्वपूर्ण सुरक्षा नियमों का मास्टर पोस्टर।'
        },
        expectedResult: 'यदि कोई फोन छीनकर भी पैसे ट्रांसफर करने की कोशिश करेगा, तो सीमा से अधिक पैसे नहीं निकल सकेंगे।',
        safetyRule: 'जरूरत पड़ने पर ही सीमा बढ़ाएं, दैनिक रूप से इसे न्यूनतम रखें।',
        selfCheck: {
          question: 'वरिष्ठ नागरिक के दैनिक खर्च के लिए सुझाई गई सुरक्षित UPI दैनिक सीमा क्या है?',
          options: [
            {
              id: 'sc-3a',
              text: '₹1,00,000 प्रतिदिन',
              isCorrect: false,
              feedback: 'इतनी बड़ी सीमा अनावश्यक जोखिम पैदा करती है।'
            },
            {
              id: 'sc-3b',
              text: '₹2,000 से ₹5,000 प्रतिदिन',
              isCorrect: true,
              feedback: 'सटीक! दैनिक सब्जी, दवा और दूध के लिए यह सीमा सबसे सुरक्षित और पर्याप्त है।'
            }
          ]
        }
      },
      {
        stepNumber: 4,
        title: 'मजबूत 4 या 6-अंकों का गुप्त UPI PIN बनाना (बैंक के अनुसार)',
        objective: 'अनुमान न लगाए जा सकने वाले गोपनीय पिन का निर्माण।',
        thinkQuestion: 'क्या 1234, 1122 या अपनी जन्मतिथि (जैसे 1958) को UPI पिन रखना सुरक्षित है?',
        thinkInteraction: {
          question: 'सरल पिन रखने का क्या सबसे बड़ा खतरा है?',
          options: [
            {
              id: 'opt-4a',
              text: 'कोई भी परिचित या चोर आसानी से पहला अनुमान लगाकर खाता खाली कर सकता है।',
              isCorrect: true,
              feedback: 'बिल्कुल सही! चोर सबसे पहले जन्म का साल या 1234 ही आज़माते हैं।'
            },
            {
              id: 'opt-4b',
              text: 'सरल पिन से बैंक का सर्वर धीमा हो जाता है।',
              isCorrect: false,
              feedback: 'नहीं, यह सीधे-सीधे सुरक्षा में सेंध लगाने का निमंत्रण है।'
            }
          ]
        },
        instruction: 'UPI PIN बनाते समय अपनी जन्मतिथि, जन्मवर्ष (1960), शादी की सालगिरह या 1122/123456 जैसे सरल नंबर कभी न रखें। (नोट: आपके बैंक के आधार पर UPI PIN 4 अंकों या 6 अंकों का हो सकता है)।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/35-habit-03-never-share-otp.png',
          title: 'तीसरी आदत: OTP व गोपनीय पिन की सुरक्षा',
          caption: 'गुप्त पिन बनाने, याद रखने और किसी से साझा न करने के स्वर्णिम नियम।'
        },
        expectedResult: 'एक ऐसा पिन जिसे कोई पास खड़ा व्यक्ति भी आसानी से अनुमान न लगा सके।',
        safetyRule: 'पिन को कभी किसी कागज या डायरी पर लिखकर फोन कवर में न रखें।',
        selfCheck: {
          question: 'UPI PIN किसके साथ साझा किया जा सकता है?',
          options: [
            {
              id: 'sc-4a',
              text: 'बैंक मैनेजर या कस्टमर केयर अधिकारी के साथ',
              isCorrect: false,
              feedback: 'कदापि नहीं! कोई भी असली बैंक अधिकारी कभी पिन नहीं मांगता।'
            },
            {
              id: 'sc-4b',
              text: 'किसी के साथ भी नहीं — यह पूर्णतः गोपनीय है',
              isCorrect: true,
              feedback: 'शाबाश! पिन सिर्फ और सिर्फ आपके मस्तिष्क में सुरक्षित रहना चाहिए।'
            }
          ]
        }
      },
      {
        stepNumber: 5,
        title: 'फिक्स अमाउंट QR कोड का अभ्यास (पैसे मंगाने का सुरक्षित तरीका)',
        objective: 'बिना पिन डाले सही राशि प्राप्त करने का सुरक्षित तरीका सीखना।',
        thinkQuestion: 'यदि किसी रिश्तेदार या ग्राहक से आपको ₹500 लेने हैं, तो क्या आपको अपना UPI PIN दबाना पड़ेगा?',
        thinkInteraction: {
          question: 'पैसे प्राप्त (Receive) करते समय पिन की क्या भूमिका है?',
          options: [
            {
              id: 'opt-5a',
              text: 'पैसे प्राप्त करने के लिए कभी भी UPI PIN नहीं दबाना पड़ता — पिन सिर्फ पैसे भेजने के लिए होता है!',
              isCorrect: true,
              feedback: 'शत-प्रतिशत सही! यह डिजिटल बैंकिंग का सबसे बड़ा सुरक्षा नियम है: "PIN = पैसे कटना"।'
            },
            {
              id: 'opt-5b',
              text: 'पैसे खाते में आने के लिए पिन दबाना अनिवार्य होता है।',
              isCorrect: false,
              feedback: 'बड़ी भूल! इसी झांसे में आकर लोग ठगे जाते हैं। याद रखें: पैसे प्राप्त करने के लिए पिन कभी नहीं लगता।'
            }
          ]
        },
        instruction: 'Google Pay खोलें → प्रोफाइल → "QR Code" में जाएं → नीचे "Set fixed amount" पर टैप करें → ₹10 का सांकेतिक QR बनाएं और देखें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/28-fix-amount-qr-code.png',
          title: 'Google Pay में Fixed Amount का QR कोड बनाना',
          caption: 'सुरक्षित भुगतान प्राप्ति हेतु तय राशि का QR कोड जनरेट करने की विधि।'
        },
        expectedResult: 'पैसे भेजने वाले को सिर्फ स्कैन करना होगा, राशि पहले से भरी होगी और आपको पिन नहीं डालना पड़ेगा।',
        safetyRule: 'याद रखें: पैसे प्राप्त (Receive) करने के लिए कभी UPI PIN नहीं दबाना होता।',
        selfCheck: {
          question: 'यदि कोई अनजान व्यक्ति कहे कि "मैं आपको ₹5,000 भेज रहा हूँ, आप अपना पिन डालकर स्वीकार करें", तो क्या करें?',
          options: [
            {
              id: 'sc-5a',
              text: 'तुरंत फोन काट दें और ब्लॉक करें — यह 100% फ्रॉड है!',
              isCorrect: true,
              feedback: 'उत्कृष्ट! पिन डालते ही आपके खाते से ₹5,000 कट जाएंगे, आएंगे नहीं।'
            },
            {
              id: 'sc-5b',
              text: 'पिन डालकर चेक करें कि पैसा आया या नहीं',
              isCorrect: false,
              feedback: 'खतरा! ऐसा करते ही आपका खाता खाली हो जाएगा।'
            }
          ]
        }
      }
    ],
    realLifeOutcome: 'वरिष्ठ नागरिक बिना किसी डर के सब्जी, फल और दवाओं की खरीदारी के लिए UPI का स्वतंत्र और आत्मविश्वासी उपयोग कर सकते हैं, क्योंकि उनकी मुख्य बचत पूरी तरह सुरक्षित है।',
    keyLearnings: [
      'दो खातों का एयर-गैप सुरक्षा मॉडल',
      'UPI में दैनिक सीमा (Limit) लगाने का महत्व',
      'मजबूत और गोपनीय पिन प्रबंधन',
      'फिक्स अमाउंट QR कोड द्वारा सुरक्षित फंड प्राप्ति'
    ],
    relatedLessons: ['lesson-01', 'lesson-07', 'lesson-09'],
    relatedHabits: ['habit-01', 'habit-03', 'habit-08']
  },
  {
    id: 'project-autopay-management',
    title: 'प्रोजेक्ट 2: AutoPay और अनचाहे सब्सक्रिप्शन ढूंढें व बंद करें (GPay व Paytm)',
    subtitle: 'Auditing, Finding & Canceling Hidden Recurring Subscriptions',
    stepsCount: '5 गाइडेड चरण',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'हर महीने बैंक खाते से चुपचाप कटने वाले अनजाने सब्सक्रिप्शन, OTT प्लान और ऐप मैंडेट्स को Google Pay, PhonePe और Paytm में ढूंढकर सुरक्षित रूप से रद्द करने का व्यावहारिक प्रोजेक्ट।',
    thumbnail: '/tutorials/digital-banking/assets/70-auto-deduct-all-apps.png',
    originalStory: 'वर्मा जी के बैंक खाते से हर महीने की 5 तारीख को ₹499 कट जाते थे। वे बैंक शाखा गए तो मैनेजर ने कहा "बाबूजी, यह किसी ऐप का ऑटो-पे (AutoPay) चल रहा है, इसे ऐप से ही बंद करना होगा।" वर्मा जी परेशान हो गए कि कौन सा ऐप पैसे काट रहा है। यह प्रोजेक्ट सिखाता है कि सभी सक्रिय ऑटोपे को कैसे खोजें और बंद करें।',
    originalInfographicRefs: [
      '/tutorials/digital-banking/assets/70-auto-deduct-all-apps.png',
      '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
      '/tutorials/digital-banking/assets/34-habit-02-never-hurry-always-verify.png'
    ],
    handsOnSteps: [
      {
        stepNumber: 1,
        title: 'ऑटो-डेबिट और ई-मैंडेट (e-Mandate) की कार्यप्रणाली समझना',
        objective: 'समझना कि बिना पिन डाले हर महीने पैसे कैसे कटते हैं।',
        instruction: 'जब हम किसी ऐप में फ्री ट्रायल लेते हैं या पहली बार बिल भरते हैं, तो कभी-कभी अनजाने में "Recurring Payment" की सहमति मिल जाती है। बैंक इसे आपकी पूर्व-अनुमति मानकर हर महीने पैसे काटता रहता है।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/70-auto-deduct-all-apps.png',
          title: 'Auto Payment / Auto Deduct मास्टर पोस्टर',
          caption: 'विभिन्न ऐप्स में अपने आप कटने वाले पैसों (AutoPay) को प्रबंधित करने का व्यापक चार्ट।'
        },
        expectedResult: 'शिक्षार्थी समझ जाता है कि यह बैंक की गलती नहीं बल्कि ऐप को दी गई ऑटोपे अनुमति है।',
        safetyRule: 'फ्री ट्रायल लेते समय कभी भी अपना मुख्य डेबिट कार्ड न लगाएं।'
      },
      {
        stepNumber: 2,
        title: 'Google Pay में एक्टिव ऑटोपे (Autopay) की जांच',
        objective: 'Google Pay में चल रहे सभी सक्रिय मैंडेट्स की सूची निकालना।',
        instruction: 'Google Pay ऐप खोलें → ऊपर दाईं ओर अपनी प्रोफाइल फोटो पर टैप करें → नीचे स्क्रॉल करके "Autopay" विकल्प चुनें → "Live / Active" टैब देखें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/70-auto-deduct-all-apps.png',
          title: 'Auto Deduct All Apps Guide',
          caption: 'Google Pay, PhonePe और Paytm में ऑटोपे सेटिंग्स का तुलनात्मक स्क्रीन दृश्य।'
        },
        expectedResult: 'स्क्रीन पर उन सभी सेवाओं की सूची दिख जाएगी जो आपके खाते से स्वतः पैसे काट सकती हैं।',
        safetyRule: 'यदि सूची खाली (No active mandates) है, तो Google Pay में कोई स्वतः कटौती नहीं है।'
      },
      {
        stepNumber: 3,
        title: 'Paytm और PhonePe में ऑटो-पेमेंट सेक्शन की जांच',
        objective: 'Paytm और PhonePe में छिपे हुए ऑटो-डेबिट खोजना।',
        instruction: 'Paytm खोलें → सर्च बार में "Auto Pay" लिखें → "Automatic Payments" पर टैप करें। PhonePe में अपनी प्रोफाइल खोलें → "AutoPay Settings" पर टैप करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
          title: 'Paytm में अनजाने ऑटो-डेबिट को कैसे रोकें?',
          caption: 'Paytm वॉलेट व बैंक लिंकेज से स्वतः पैसे कटने की रोकथाम प्रक्रिया।'
        },
        expectedResult: 'दोनों प्रमुख ऐप्स में सक्रिय ऑटोपे की स्थिति स्पष्ट दिख जाती है।',
        safetyRule: 'किसी भी संदिग्ध ऐप या अवांछित सेवा का नाम तुरंत नोट करें।'
      },
      {
        stepNumber: 4,
        title: 'अनावश्यक मैंडेट को ऐप या नेटबैंकिंग से रद्द (Cancel) करना',
        objective: 'अवांछित ऑटोपे को सुरक्षित रूप से निरस्त करना।',
        instruction: 'जिस सेवा को आप बंद करना चाहते हैं, उस पर टैप करें → "Cancel Autopay / Pause Autopay" चुनें → अपना UPI PIN दर्ज करके रद्दीकरण की पुष्टि करें। (ध्यान दें: कुछ विशेष मर्चेंट या बैंक मैंडेट्स को संबंधित मर्चेंट ऐप या नेटबैंकिंग पोर्टल से रद्द करना पड़ सकता है)।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/69-auto-deduct-paytm.png',
          title: 'Paytm Auto-Deduct Cancellation',
          caption: 'सक्रिय मैंडेट को निरस्त (Cancel) करने का चरणबद्ध सचित्र दृश्य।'
        },
        expectedResult: 'स्क्रीन पर "Autopay Cancelled Successfully" का संदेश आ जाता है और बैंक से पुष्टि SMS मिलता है।',
        safetyRule: 'ऑटोपे रद्द करने के लिए पिन डालना सुरक्षित है क्योंकि यह केवल निरस्तीकरण के लिए बैंक सत्यापन है।'
      },
      {
        stepNumber: 5,
        title: 'मासिक वित्तीय स्टेटमेंट का 5-मिनट सुरक्षा ऑडिट',
        objective: 'महीने में एक बार अपने खाते से कटने वाले पैसों का मिलान करना।',
        instruction: 'हर महीने की पहली तारीख को अपने मोबाइल ऐप में जाकर पिछले 30 दिनों का "Mini Statement" या "Account History" देखें। किसी भी अनजान कटौती (जैसे ₹99, ₹199, ₹499) की पहचान करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/34-habit-02-never-hurry-always-verify.png',
          title: 'दूसरी आदत: जल्दबाज़ी न करें, हमेशा जांचें (Never Hurry Always Verify)',
          caption: 'हर छोटे-बड़े लेन-देन और स्टेटमेंट की नियमित जांच का स्वर्णिम नियम।'
        },
        expectedResult: 'खाते से होने वाले हर एक पैसे के लेन-देन पर पूर्ण नियंत्रण।',
        safetyRule: 'यदि कोई अज्ञात कटौती दिखे, तो तुरंत अपने बैंक को लिखित शिकायत दर्ज कराएं।'
      }
    ],
    realLifeOutcome: 'वरिष्ठ नागरिक अपने बैंक खाते से हर महीने चुपचाप कटने वाले अनचाहे पैसों को रोककर सालाना ₹3,000 से ₹6,000 तक की सीधी बचत सुरक्षित कर सकते हैं।',
    keyLearnings: [
      'UPI AutoPay और ई-मैंडेट की पहचान',
      'GPay, PhonePe और Paytm में ऑटोपे सेटिंग्स नेविगेशन',
      'अवांछित मैंडेट को सुरक्षित रूप से कैंसिल करना',
      'मासिक बैंक स्टेटमेंट की नियमित निगरानी'
    ],
    relatedLessons: ['lesson-10', 'lesson-13'],
    relatedHabits: ['habit-01', 'habit-02']
  },
  {
    id: 'project-lost-phone-lockdown',
    title: 'प्रोजेक्ट 3: फोन गुम या चोरी होने पर सुरक्षा व रिकवरी वर्कफ़्लो',
    subtitle: 'Step-by-Step Educational Workflow for Lost or Stolen Smartphone',
    stepsCount: '5 गाइडेड चरण',
    badgeColor: 'bg-rose-600 text-white',
    description: 'मोबाइल फोन गुम या चोरी होने पर फोन ढूंढने का प्रयास करने (Google Find Hub), सिम कार्ड ब्लॉक कराने, बैंक व UPI सुरक्षा सुनिश्चित करने, CEIR पर IMEI ब्लॉक करने और खातों की सुरक्षा समीक्षा का संपूर्ण शैक्षणिक वर्कफ़्लो।',
    thumbnail: '/tutorials/digital-banking/assets/56-scam-12a-lost-phone-sim-transferred.png',
    originalStory: 'गुप्ता जी का फोन रेलवे स्टेशन पर छूट गया। वे घबराकर 2 घंटे तक फोन ढूंढते रहे। इस दौरान चोर ने फोन से सिम निकालकर दूसरे फोन में डाला और बैंक से ₹50,000 ट्रांसफर कर लिए। यदि गुप्ता जी को पता होता कि सही शैक्षणिक क्रम क्या है और वास्तविक आपात स्थिति में सिम व बैंक कैसे तुरंत सुरक्षित करने हैं, तो एक रुपया भी नहीं कटता। यह प्रोजेक्ट सिखाता है कि संकट के समय घबराने के बजाय समझदारी से कदम कैसे उठाएं।',
    originalInfographicRefs: [
      '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
      '/tutorials/digital-banking/assets/56-scam-12a-lost-phone-sim-transferred.png',
      '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
      '/tutorials/digital-banking/assets/57-scam-12b-phone-lost-sim-clone.png',
      '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png'
    ],
    handsOnSteps: [
      {
        stepNumber: 1,
        title: 'फोन ढूंढने व सुरक्षित करने का प्रयास (Google Find My Device / Find Hub)',
        objective: 'दूसरे डिवाइस से Google Find My Device (android.com/find) का उपयोग करके फोन की स्थिति देखना या रिंग बजाना।',
        instruction: 'किसी साथी या परिवार के सदस्य के फोन/कंप्यूटर पर जाएं → ब्राउज़र में android.com/find खोलें → अपनी Gmail आईडी से लॉगिन करें → यदि फोन घर या दुकान के आसपास ही छूटा है, तो "Play Sound" चलाएं ताकि फोन साइलेंट होने पर भी 5 मिनट तक फुल वॉल्यूम में बजे। यदि फोन दूर दिख रहा है, तो "Secure Device" चुनकर स्क्रीन पर अपना वैकल्पिक नंबर और संदेश लिखकर लॉक करें। (महत्वपूर्ण: Find My Device तभी काम करता है जब फोन ऑन हो, इंटरनेट से जुड़ा हो और लोकेशन चालू हो; यह हमेशा फोन ढूंढने की गारंटी नहीं देता। तुरंत "Erase Device" न दबाएं क्योंकि इससे सारा डेटा मिट जाएगा और लोकेशन ट्रैकिंग भी स्थायी रूप से बंद हो जाएगी)।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
          title: 'Scam 16: फोन कहीं रखकर भूल गए? अनलॉक फोन व स्क्रीन लॉक सुरक्षा',
          caption: 'फोन मिसप्लेस होने और स्क्रीन सुरक्षा के महत्व का सचित्र उदाहरण।'
        },
        expectedResult: 'शिक्षार्थी समझता है कि फोन पास होने पर कैसे रिंग करें और दूर होने पर स्क्रीन पर सुरक्षा संदेश कैसे लगाएं।',
        safetyRule: 'महत्वपूर्ण शैक्षणिक नोट: यह सीखने का क्रम है, अनिवार्य प्रतीक्षा समय नहीं। यदि फोन चोरी होने या फ्रॉड का स्पष्ट संदेह हो, तो सिम और बैंक ब्लॉकिंग बिना देरी किए समानांतर (Parallel) रूप से तुरंत करें।'
      },
      {
        stepNumber: 2,
        title: 'टेलीकॉम ऑपरेटर से संपर्क कर सिम कार्ड तत्काल ब्लॉक कराना',
        objective: 'चोर तक जाने वाले बैंकिंग OTP और कॉल फॉरवर्डिंग को रोकना।',
        instruction: 'किसी भी फोन से अपने टेलीकॉम ऑपरेटर के कस्टमर केयर (Jio: 198, Airtel: 121, Vi: 199, BSNL: 1503) पर कॉल करें। अपनी पहचान विवरण देकर कहें: "मेरा मोबाइल फोन खो गया है, सिम कार्ड को तुरंत ब्लॉक करें।" सिम निष्क्रिय होते ही आपके नंबर पर कोई नया SMS, कॉल या बैंक OTP नहीं पहुंच सकेगा।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/56-scam-12a-lost-phone-sim-transferred.png',
          title: 'Scam 12A: फोन गुम हुआ? SIM निकालकर *99# द्वारा हमला',
          caption: 'सिम कार्ड ब्लॉक न कराने पर *99# USSD कोड के जरिए होने वाली ठगी का सचित्र प्रमाण।'
        },
        expectedResult: 'सिम निष्क्रिय होते ही चोर के पास आपके नंबर का कोई कॉल या SMS नहीं पहुंच सकेगा।',
        safetyRule: 'सिम ब्लॉक कराते समय ऑपरेटर से "Complaint Reference Number" अवश्य नोट करें।'
      },
      {
        stepNumber: 3,
        title: 'बैंक व डिजिटल भुगतान (UPI / कार्ड्स) को सुरक्षित करना',
        objective: 'बैंक खाते और भुगतान ऐप्स को अनधिकृत लेन-देन से बचाना।',
        instruction: 'अपनी बैंक शाखा या कार्ड जारीकर्ता के आपातकालीन हॉटलिस्टिंग नंबर पर कॉल करके सूचित करें कि फोन गुम हो गया है, अतः नेट बैंकिंग, मोबाइल बैंकिंग और UPI पर अस्थायी रोक (Freeze/Hold) लगा दी जाए। यदि खोए हुए फोन के कवर में ATM कार्ड भी था, तो कार्ड को भी तुरंत हॉटलिस्ट करवाएं।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
          title: 'सातवीं आदत: फोन व डिजिटल बैंकिंग को हमेशा सुरक्षित लॉक रखें',
          caption: 'बैंक स्तर पर डिजिटल सेवाओं और खोए हुए फोन को तत्काल सुरक्षित करने का नियम।'
        },
        expectedResult: 'बैंक खाते पर सुरक्षा फ्लैग लग जाता है और कोई भी डिजिटल निकासी संभव नहीं होती।',
        safetyRule: 'बैंक को कभी अपना गुप्त पिन या पासवर्ड न बताएं; केवल खाता संख्या और मोबाइल नंबर देकर ब्लॉक करने का अनुरोध करें।'
      },
      {
        stepNumber: 4,
        title: 'पुलिस रिपोर्ट व CEIR / संचार साथी पोर्टल पर IMEI नंबर ब्लॉक करना',
        objective: 'चोरी हुए हैंडसेट को पूरे भारत के सभी टेलीकॉम नेटवर्कों पर स्थायी रूप से अनुपयोगी बनाना।',
        instruction: 'नजदीकी पुलिस स्टेशन या राज्य के ऑनलाइन पुलिस पोर्टल पर फोन गुमशुदगी की शिकायत (Loss Report / e-FIR) दर्ज कराएं। इसके बाद भारत सरकार के आधिकारिक संचार साथी पोर्टल ceir.sancharsaathi.gov.in पर जाएं → "Block Stolen/Lost Mobile" फॉर्म भरें और फोन का 15-अंकों का IMEI नंबर दर्ज करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/57-scam-12b-phone-lost-sim-clone.png',
          title: 'Scam 12B: SIM क्लोनिंग और CEIR सुरक्षा कवच',
          caption: 'हैंडसेट और नेटवर्क स्तर पर सुरक्षा तंत्र।'
        },
        expectedResult: 'फोन का IMEI ब्लॉक होते ही चोर उस फोन में कोई भी अन्य सिम कार्ड नहीं चला सकेगा।',
        safetyRule: 'अपने फोन का 15-अंकों का IMEI नंबर हमेशा घर की डायरी में पहले से लिखकर रखें (*#06# डायल करके जांचा जा सकता है)।'
      },
      {
        stepNumber: 5,
        title: 'Google अकाउंट, WhatsApp सत्रों और महत्वपूर्ण खातों की सुरक्षा समीक्षा',
        objective: 'अन्य डिवाइसेज से खुले सत्रों (Sessions) को समाप्त करना और पासवर्ड अपडेट करना।',
        instruction: 'किसी सुरक्षित कंप्यूटर पर myaccount.google.com खोलें → "Security" में जाकर "Your devices" सूची से खोए हुए फोन को "Sign Out" करें। अपने Google और नेट बैंकिंग पासवर्ड बदलें। जब आप नया सिम कार्ड प्राप्त कर लें, तो नए फोन में WhatsApp लॉगिन करें जिससे पुराने फोन से सत्र स्वतः समाप्त हो जाएगा।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png',
          title: '4-इन-1 सुरक्षा ऑडिट: Google, WhatsApp, Aadhaar, SIM',
          caption: 'अपनी संपूर्ण डिजिटल पहचान के 4 मुख्य द्वारों का मास्टर चेकअप पोस्टर।'
        },
        expectedResult: 'आपकी डिजिटल पहचान और ईमेल पर किसी भी अनधिकृत रिमोट पहुंच का पूर्ण निवारण।',
        safetyRule: 'नए सिम कार्ड और नए फोन की व्यवस्था होने के बाद ही बैंक जाकर डिजिटल सेवाएं पुनः चालू कराएं।'
      }
    ],
    realLifeOutcome: 'वरिष्ठ नागरिक फोन गुम होने की स्थिति में बिना घबराए क्रमबद्ध तरीके से अपने डिवाइस को ढूंढने, और चोरी की स्थिति में सिम, बैंक और हैंडसेट को सुरक्षित रूप से लॉक करने में सक्षम होते हैं।',
    keyLearnings: [
      'Google Find My Device का सही और सतर्क उपयोग',
      'सिम ब्लॉकिंग और बैंक सुरक्षा की सर्वोच्च प्राथमिकता',
      'CEIR पोर्टल द्वारा 15-अंकों के IMEI का राष्ट्रव्यापी ब्लॉकिंग',
      'गूगल अकाउंट और व्हाट्सएप वेब से रिमोट लॉगआउट'
    ],
    relatedLessons: ['lesson-01', 'lesson-14', 'lesson-17'],
    relatedHabits: ['habit-07', 'habit-10']
  },
  {
    id: 'project-digital-identity-audit',
    title: 'प्रोजेक्ट 4: संपूर्ण डिजिटल पहचान व डिवाइस हेल्थ चेकअप (4-in-1 Audit)',
    subtitle: 'Comprehensive 4-in-1 Digital Identity & Device Security Health Checkup',
    stepsCount: '5 गाइडेड चरण',
    badgeColor: 'bg-amber-600 text-white',
    description: 'आधार बायोमेट्रिक्स को लॉक करने, Google खाते के सक्रिय डिवाइसेज की जांच, WhatsApp Linked Devices को साफ करने और कमजोर पासवर्ड्स की पहचान करने का संपूर्ण स्वास्थ्य चेकअप।',
    thumbnail: '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png',
    originalStory: 'मिश्रा जी को लगा कि उनका फोन और पहचान पूरी तरह सुरक्षित है। जब उनके पोते ने उनका फोन देखा तो पाया कि 6 महीने पहले किसी साइबर कैफे के कंप्यूटर पर उनका WhatsApp Web खुला छूटा हुआ था और उनके आधार से किसी अनजान व्यक्ति ने दूसरा सिम ले रखा था! यह प्रोजेक्ट सिखाता है कि अपनी डिजिटल पहचान की नियमित जांच कैसे करें।',
    originalInfographicRefs: [
      '/tutorials/digital-banking/assets/60-scam-15-identity-theft-aadhaar-pan.png',
      '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png',
      '/tutorials/digital-banking/assets/55-scam-11b-whatsapp-hack-sending-scanner.png',
      '/tutorials/digital-banking/assets/67-two-factor-passkey-password-manager.png',
      '/tutorials/digital-banking/assets/41-habit-09-keep-app-permission-limited.png'
    ],
    handsOnSteps: [
      {
        stepNumber: 1,
        title: 'UIDAI पोर्टल पर आधार बायोमेट्रिक्स को लॉक करना',
        objective: 'बिना आपकी जानकारी के फिंगरप्रिंट से पैसे कटने (AePS Fraud) को रोकना।',
        instruction: 'ब्राउज़र में myaadhaar.uidai.gov.in खोलें → आधार नंबर और OTP से लॉगिन करें → "Lock/Unlock Biometrics" पर टैप करें → "Lock Biometrics" चालू करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/60-scam-15-identity-theft-aadhaar-pan.png',
          title: 'Scam 15: पहचान चोरी (Identity Theft) — आधार, पैन व डेटा का दुरुपयोग',
          caption: 'आधार फोटोकॉपी और बायोमेट्रिक्स के संभावित दुरुपयोग से बचाव का सचित्र उदाहरण।'
        },
        expectedResult: 'आपके आधार के फिंगरप्रिंट और आईरिस डेटा पर डिजिटल ताला लग जाता है। जब तक आप इसे स्वयं अनलॉक नहीं करेंगे, कोई भी आपके अंगूठे से पैसे नहीं निकाल सकता।',
        safetyRule: 'जब भी बैंक या राशन के लिए अंगूठा लगाना हो, तभी 10 मिनट के लिए अस्थायी अनलॉक करें।'
      },
      {
        stepNumber: 2,
        title: 'Google Account में लॉगिन डिवाइसेज का ऑडिट करना',
        objective: 'जांचना कि आपका गूगल खाता किसी अज्ञात कंप्यूटर पर खुला तो नहीं है।',
        instruction: 'फोन की Settings → Google → "Manage your Google Account" → "Security" टैब में जाएं → "Your devices" पर टैप करें → सूची में देखें कि कौन-कौन से फोन या कंप्यूटर जुड़े हैं।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png',
          title: '4-इन-1 सुरक्षा ऑडिट: Google, WhatsApp, Aadhaar, SIM',
          caption: 'अपनी संपूर्ण डिजिटल पहचान के 4 मुख्य द्वारों का मास्टर चेकअप पोस्टर।'
        },
        expectedResult: 'यदि कोई पुराना, बेचा हुआ फोन या अनजान शहर का कंप्यूटर दिखे, तो उस पर टैप करके तुरंत "Sign Out" करें।',
        safetyRule: 'होटल या साइबर कैफे के कंप्यूटर पर कभी भी अपना गूगल खाता खुला न छोड़ें।'
      },
      {
        stepNumber: 3,
        title: 'WhatsApp Linked Devices की सफाई करना',
        objective: 'जांचना कि आपकी व्हाट्सएप चैट कोई दूसरा व्यक्ति तो नहीं पढ़ रहा।',
        instruction: 'WhatsApp खोलें → ऊपर दाईं ओर 3 डॉट्स पर टैप करें → "Linked Devices" चुनें → सक्रिय सत्रों की सूची देखें → किसी भी ब्राउज़र (जैसे Google Chrome Windows) पर टैप करके "Log Out" करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/55-scam-11b-whatsapp-hack-sending-scanner.png',
          title: 'Scam 11B: WhatsApp हैकिंग — फर्जी स्कैनर का खतरा',
          caption: 'WhatsApp Web के अनधिकृत कंप्यूटर सत्रों को लॉगआउट करने का सचित्र मार्गदर्शन।'
        },
        expectedResult: 'सभी रिमोट कंप्यूटरों से आपका व्हाट्सएप तुरंत बंद हो जाता है।',
        safetyRule: 'Settings → Account → Two-Step Verification में जाकर 6-अंकों का पिन अवश्य चालू रखें।'
      },
      {
        stepNumber: 4,
        title: 'गूगल पासवर्ड मैनेजर में पासवर्ड सुरक्षा जांच (Password Checkup)',
        objective: 'कमजोर, बार-बार दोहराए गए या इंटरनेट पर लीक हुए पासवर्ड्स को पकड़ना।',
        instruction: 'ब्राउज़र में passwords.google.com खोलें → "Go to Password Checkup" पर टैप करें → देखें कि क्या कोई पासवर्ड "Compromised" (लीक) दिखा रहा है।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/67-two-factor-passkey-password-manager.png',
          title: 'मजबूत सुरक्षा के 3 स्तंभ: 2-Factor, Passkey व Password Manager',
          caption: 'डिजिटल पासवर्ड को याद रखने और सुरक्षित रखने के आधुनिकतम तरीके।'
        },
        expectedResult: 'गूगल उन सभी खातों की सूची दे देता है जिनका पासवर्ड कमजोर या पुराना है।',
        safetyRule: 'बैंकिंग और ईमेल के लिए हमेशा अलग और कम से कम 12 अक्षरों का पासवर्ड रखें।'
      },
      {
        stepNumber: 5,
        title: 'फोन ऐप परमिशन का 5-मिनट सुरक्षा ऑडिट',
        objective: 'अनावश्यक ऐप्स से SMS और कैमरे की अनुमति वापस लेना।',
        instruction: 'फोन की Settings → "Privacy" → "Permission Manager" में जाएं → "SMS" पर टैप करें → देखें कि क्या किसी साधारण टॉर्च, कैलकुलेटर या गेम ऐप के पास SMS की अनुमति है। उसे "Don\'t allow" पर सेट करें।',
        relatedInfographic: {
          path: '/tutorials/digital-banking/assets/41-habit-09-keep-app-permission-limited.png',
          title: 'नौवीं आदत: ऐप परमिशन सीमित रखें',
          caption: 'अनावश्यक ऐप अनुमतियों (SMS/कैमरा/लोकेशन) को बंद रखने का आधिकारिक नियम।'
        },
        expectedResult: 'केवल अधिकृत बैंकिंग और मैसेजिंग ऐप्स ही आपके SMS पढ़ पाएंगे।',
        safetyRule: 'किसी भी गैर-बैंकिंग ऐप को कभी भी SMS पढ़ने की अनुमति न दें।'
      }
    ],
    realLifeOutcome: 'वरिष्ठ नागरिक अपनी पहचान (आधार), ईमेल (गूगल), संचार (व्हाट्सएप) और डिवाइस (ऐप परमिशन) के सभी 4 प्रमुख द्वारों को सुरक्षित कर एक अभेद्य सुरक्षा कवच तैयार कर लेते हैं।',
    keyLearnings: [
      'आधार बायोमेट्रिक लॉकिंग की शक्ति',
      'गूगल अकाउंट रिमोट सेशन प्रबंधन',
      'व्हाट्सएप वेब सुरक्षा और लॉगआउट',
      'पासवर्ड स्वास्थ्य जांच और ऐप परमिशन ऑडिट'
    ],
    relatedLessons: ['lesson-15', 'lesson-16'],
    relatedHabits: ['habit-07', 'habit-09', 'habit-10']
  }
]
