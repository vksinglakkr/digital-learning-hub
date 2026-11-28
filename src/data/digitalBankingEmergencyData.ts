export interface EmergencyHelplineInfo {
  name: string
  contactNumber: string
  operatingHours: string
  portalUrl?: string
  description: string
}

export interface DigitalBankingEmergencyGuide {
  id: string
  sequenceNumber: number
  situationTitle: string
  englishTitle: string
  priorityBadge: 'तत्काल कार्रवाई (Immediate)' | 'अति संवेदनशील (Critical)' | 'उच्च प्राथमिकता (High)';
  timeSensitivity: string
  situationDescription: string
  immediateAction: string[]
  officialHelp: EmergencyHelplineInfo[]
  nextSteps: string[]
  prevention: string[]
  sourceInfographics: string[]
  sourceCoverage: 'COMPLETE_SOURCE' | 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD';
  proceduralCardNote: string
}

export const DIGITAL_BANKING_EMERGENCY_GUIDES: DigitalBankingEmergencyGuide[] = [
  {
    id: 'emergency-01',
    sequenceNumber: 1,
    situationTitle: 'स्थिति 1: अनधिकृत बैंक/UPI ट्रांजैक्शन (खाते से अचानक पैसे कटना)',
    englishTitle: 'Situation 1: Fraudulent Account Debit or Unauthorized UPI Transfer',
    priorityBadge: 'तत्काल कार्रवाई (Immediate)',
    timeSensitivity: 'पहला 1 घंटा (Golden Hour) अत्यंत महत्वपूर्ण है',
    situationDescription: 'आपके फोन पर अचानक SMS आता है कि आपके बैंक खाते या क्रेडिट कार्ड से बिना आपकी अनुमति के पैसे कट गए हैं, जबकि आपने कोई लेनदेन नहीं किया था।',
    immediateAction: [
      'कदम 1 (तुरंत 1930 पर कॉल): राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर कॉल करें। ऑपरेटर को अपना नाम, फोन नंबर, बैंक का नाम, खाता संख्या, कटने का समय और 12-अंकों का UTR नंबर बताएं।',
      'कदम 2 (बैंक कार्ड/खाता ब्लॉक): अपनी बैंक पासबुक या कार्ड के पीछे लिखे टोल-फ्री नंबर पर कॉल करें और संबंधित डेबिट कार्ड या नेट बैंकिंग को तुरंत "Freeze / Hotlist" कराएं।',
      'कदम 3 (लिखित शिकायत): अपने बैंक को 3 कार्यदिवसों के भीतर ईमेल या शाखा में जाकर लिखित शिकायत दें ताकि RBI के "Zero Customer Liability" नियम का संरक्षण मिल सके।'
    ],
    officialHelp: [
      {
        name: 'राष्ट्रीय वित्तीय साइबर धोखाधड़ी रिपोर्टिंग प्रणाली (I4C / गृह मंत्रालय)',
        contactNumber: '1930',
        operatingHours: '24 घंटे, 365 दिन (टोल-फ्री)',
        portalUrl: 'https://cybercrime.gov.in',
        description: 'यह हेल्पलाइन तुरंत संबंधित बैंक के नोडल अधिकारी से संपर्क करके धोखेबाज के खाते में पैसे को फ्रीज कराने की प्रक्रिया शुरू करती है। (नोट: पूरी राशि की वापसी इस बात पर निर्भर करती है कि ठगी कितनी जल्दी रिपोर्ट की गई और क्या पैसा अगले खातों में नहीं निकला है; 1930 फ्रीज कराने में मदद करती है किंतु 100% रिकवरी की कानूनी गारंटी नहीं देती)।'
      },
      {
        name: 'संबंधित बैंक का आपातकालीन हॉटलिस्टिंग नंबर',
        contactNumber: '1800-xxx-xxxx (अपनी पासबुक देखें)',
        operatingHours: '24×7',
        description: 'कार्ड और नेट बैंकिंग को तत्काल ब्लॉक करने हेतु।'
      }
    ],
    nextSteps: [
      'लेनदेन से जुड़े सभी SMS और बैंक स्टेटमेंट का प्रिंट निकालें',
      'cybercrime.gov.in पर जाकर विस्तृत पावती (Acknowledgement Receipt) डाउनलोड करें',
      'अपने सभी अन्य वित्तीय खातों और ईमेल का पासवर्ड तुरंत बदलें'
    ],
    prevention: [
      'दैनिक UPI के लिए हमेशा ₹2,000–₹5,000 बैलेंस वाला एक अलग बैंक खाता रखें',
      'मोबाइल ऐप में डेबिट कार्ड की दैनिक सीमा (Daily Limit) कम सेट करके रखें',
      'कभी भी किसी कॉलर या लिंक के साथ OTP या पिन साझा न करें'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/04-apprehension-in-using-digital-banking.png',
      '/tutorials/digital-banking/assets/18-upi.png',
      '/tutorials/digital-banking/assets/35-habit-03-never-share-otp.png',
      '/tutorials/digital-banking/assets/45-scam-02-bank-verification-kyc.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल रिपॉजिटरी में 1930 और कार्ड ब्लॉकिंग का उल्लेख विभिन्न पाठों में बिखरा हुआ था; यह आपातकालीन कार्ड इसे 1-घंटे की संरचित चेकलिस्ट में एकीकृत करता है।'
  },
  {
    id: 'emergency-02',
    sequenceNumber: 2,
    situationTitle: 'स्थिति 2: मोबाइल फोन खो जाना या चोरी होना',
    englishTitle: 'Situation 2: Lost or Stolen Mobile Phone Lockdown Protocol',
    priorityBadge: 'तत्काल कार्रवाई (Immediate)',
    timeSensitivity: 'पहले 15 मिनट में सिम ब्लॉक और रिमोट लॉक जरूरी',
    situationDescription: 'आपका स्मार्टफोन बाजार, ट्रेन, बस या सड़क पर कहीं गिर गया है या चोरी हो गया है, जिसमें आपके सभी बैंकिंग ऐप्स और सिम कार्ड मौजूद हैं।',
    immediateAction: [
      'कदम 1 (सिम कार्ड ब्लॉक कराएं): किसी भी परिचित के फोन से अपने टेलीकॉम ऑपरेटर (Jio/Airtel/Vi/BSNL) के कस्टमर केयर को कॉल करें और अपनी SIM तुरंत ब्लॉक कराएं ताकि चोर के पास OTP न पहुंच सके।',
      'कदम 2 (फोन रिमोट लॉक करें): कंप्यूटर पर `android.com/find` (Google Find My Device) या `icloud.com/find` खोलें और अपने फोन को "Secure Device" (रिमोट लॉक) करें या "Erase Device" (डेटा मिटाएं) चुनें।',
      'कदम 3 (IMEI ब्लॉक करें): भारत सरकार के Sanchar Saathi पोर्टल (`ceir.sancharsaathi.gov.in`) पर जाकर चोरी हुए फोन का 15-अंकों का IMEI ब्लॉक करें ताकि फोन में कोई दूसरी सिम न चल सके।',
      'कदम 4 (बैंक सेवाएं रोकें): अपने बैंक के टोल-फ्री नंबर पर कॉल करके UPI और नेट बैंकिंग को अस्थायी रूप से होल्ड पर रखें।'
    ],
    officialHelp: [
      {
        name: 'संचार साथी (Sanchar Saathi - CEIR पोर्टल)',
        contactNumber: 'दूरसंचार विभाग (DoT)',
        operatingHours: 'ऑनलाइन पोर्टल 24×7',
        portalUrl: 'https://ceir.sancharsaathi.gov.in',
        description: 'चोरी हुए मोबाइल फोन के IMEI नंबर को पूरे भारत में ब्लॉक करने का आधिकारिक सरकारी पोर्टल।'
      },
      {
        name: 'गूगल फाइंड माय डिवाइस',
        contactNumber: 'वेबसाइट',
        operatingHours: '24×7',
        portalUrl: 'https://android.com/find',
        description: 'घर बैठे अपने चोरी हुए फोन की लोकेशन देखने, स्क्रीन लॉक करने या डेटा डिलीट करने का टूल।'
      }
    ],
    nextSteps: [
      'निकटतम पुलिस स्टेशन में जाकर फोन गुमशुदगी की शिकायत (Loss Report / e-FIR) दर्ज कराएं',
      'टेलीकॉम स्टोर में जाकर अपनी पुरानी आईडी दिखाकर उसी नंबर का नया डुप्लीकेट सिम कार्ड जारी करवाएं',
      'नया फोन मिलने के बाद ही बैंक जाकर मोबाइल बैंकिंग पुनः सक्रिय कराएं'
    ],
    prevention: [
      'अपने फोन के सिम कार्ड पर हमेशा 4-अंकों का SIM PIN लॉक लगाकर रखें',
      'फोन का स्क्रीन टाइमआउट 15 से 30 सेकंड रखें और फिंगरप्रिंट लॉक लगाएं',
      'यदि आपका फोन सपोर्ट करता है, तो फिजिकल सिम के बजाय डिजिटल eSIM अपनाएं'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/04-apprehension-in-using-digital-banking.png',
      '/tutorials/digital-banking/assets/56-scam-12a-lost-phone-sim-transferred.png',
      '/tutorials/digital-banking/assets/57-scam-12b-phone-lost-sim-clone.png',
      '/tutorials/digital-banking/assets/61-scam-16-phone-misplace.png',
      '/tutorials/digital-banking/assets/68-old-phone-sale-checklist.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल सामग्री में फोन चोरी और सिम निष्कासन के जोखिम को दर्शाया गया था; यह गाइड CEIR और Google Find My Device की आपातकालीन एसओपी प्रदान करती है। नोट: वास्तविक संकट में सिम ब्लॉकिंग और बैंक सुरक्षा समानांतर रूप से तुरंत की जानी चाहिए।'
  },
  {
    id: 'emergency-03',
    sequenceNumber: 3,
    situationTitle: 'स्थिति 3: व्हाट्सएप अकाउंट हैक होना (अकाउंट हाइजैक)',
    englishTitle: 'Situation 3: WhatsApp Account Hijacked & Impersonation Crisis',
    priorityBadge: 'अति संवेदनशील (Critical)',
    timeSensitivity: 'तत्काल (30 मिनट के भीतर पुनः लॉगिन करें)',
    situationDescription: 'आपके फोन से व्हाट्सएप अचानक बंद हो जाता है और आपके दोस्तों/रिश्तेदारों को आपके नाम से आपात स्थिति बताकर पैसे मांगने वाले संदेश जाने लगते हैं।',
    immediateAction: [
      'कदम 1 (तुरंत री-रजिस्टर करें): अपने फोन में WhatsApp खोलें, अपना मोबाइल नंबर डालें और 6-अंकों का नया SMS OTP मंगाकर दोबारा लॉगिन करें। जैसे ही आप सही OTP डालेंगे, हैकर का कंप्यूटर/फोन सत्र अपने आप लॉग आउट हो जाएगा।',
      'कदम 2 (लिंक्ड डिवाइसेज साफ करें): WhatsApp खोलें → Settings → "Linked Devices" में जाएं → सभी अज्ञात कंप्यूटर या वेब ब्राउज़र सत्रों पर टैप करके तुरंत "Log Out" करें।',
      'कदम 3 (2-Step Verification PIN लगाएं): WhatsApp Settings → Account → Two-Step Verification में जाकर 6-अंकों का अपना गुप्त पिन सेट करें।',
      'कदम 4 (मित्रों को सावधान करें): अपने परिवार और प्रमुख मित्रों को सामान्य फोन कॉल या SMS करके बताएं कि आपका व्हाट्सएप हैक हुआ था और कोई पैसे मांगे तो न भेजें।'
    ],
    officialHelp: [
      {
        name: 'व्हाट्सएप आधिकारिक सुरक्षा सहायता',
        contactNumber: 'support@whatsapp.com',
        operatingHours: 'ईमेल सपोर्ट',
        description: 'अकाउंट चोरी होने पर विषय में "Lost/Stolen: Please deactivate my account" लिखकर भेजें।'
      },
      {
        name: 'राष्ट्रीय साइबर अपराध हेल्पलाइन',
        contactNumber: '1930',
        operatingHours: '24×7',
        portalUrl: 'https://cybercrime.gov.in',
        description: 'व्हाट्सएप हैकिंग द्वारा पैसे की ठगी होने पर शिकायत दर्ज कराने हेतु।'
      }
    ],
    nextSteps: [
      'यदि हैकर ने 2FA लगा दिया था, तो WhatsApp के 7-दिन के रीसेट टाइमर की प्रतीक्षा करें',
      'अपने फोन के SMS इनबॉक्स की जांच करें कि क्या कोई अज्ञात ऐप आपके SMS पढ़ रहा है',
      'परिवार के व्हाट्सएप समूहों में वॉइस नोट भेजकर स्पष्ट करें कि स्थिति नियंत्रण में है'
    ],
    prevention: [
      'किसी भी व्यक्ति के कहने पर अपने व्हाट्सएप का लिंक्ड डिवाइसेज स्कैनर कभी न खोलें',
      'व्हाट्सएप में हमेशा 2-Step Verification PIN सक्रिय रखें',
      'SMS में आए 6-अंकों के WhatsApp रजिस्ट्रेशन कोड को कभी किसी के साथ साझा न करें'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/54-scam-11a-whatsapp-hack-sending-number.png',
      '/tutorials/digital-banking/assets/55-scam-11b-whatsapp-hack-sending-scanner.png',
      '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल इन्फोग्राफिक्स ने हैकिंग के तरीकों को समझाया था; यह गाइड री-रजिस्ट्रेशन द्वारा हैकर को बाहर निकालने की चरणबद्ध प्रक्रिया प्रदान करती है।'
  },
  {
    id: 'emergency-04',
    sequenceNumber: 4,
    situationTitle: 'स्थिति 4: गूगल / जीमेल खाता संदिग्ध स्थिति (खाता सुरक्षा संकट)',
    englishTitle: 'Situation 4: Google / Gmail Account Compromised or Suspicious Login',
    priorityBadge: 'अति संवेदनशील (Critical)',
    timeSensitivity: 'तुरंत (सभी सक्रिय डिवाइसेज से साइन आउट करें)',
    situationDescription: 'आपके फोन पर सूचना आती है कि आपके Google खाते में किसी अज्ञात शहर, देश या अनजान डिवाइस (जैसे Windows PC) से लॉगिन किया गया है, या पासवर्ड बदल दिया गया है।',
    immediateAction: [
      'कदम 1 (सुरक्षा जांच खोलें): कंप्यूटर या फोन के ब्राउज़र में तुरंत `myaccount.google.com/security` खोलें।',
      'कदम 2 (सभी डिवाइस से साइन आउट करें): "Your devices" (आपके उपकरण) सेक्शन में जाएं → "Manage all devices" पर टैप करें → किसी भी अज्ञात कंप्यूटर पर टैप करके "Sign out" (लॉग आउट) करें।',
      'कदम 3 (पासवर्ड बदलें): "Password" विकल्प पर जाएं और कम से कम 12 अक्षरों का नया मजबूत पासवर्ड बनाएं जिसमें बड़े-छोटे अक्षर, संख्या और सिंबल हों।',
      'कदम 4 (2-Step Verification जांचें): सुनिश्चित करें कि 2FA में केवल आपका सही मोबाइल नंबर और Google Authenticator / Passkey ही जुड़ी है।'
    ],
    officialHelp: [
      {
        name: 'गूगल आधिकारिक खाता पुनर्प्राप्ति पोर्टल (Account Recovery)',
        contactNumber: 'ऑनलाइन पोर्टल',
        operatingHours: '24×7',
        portalUrl: 'https://g.co/recover',
        description: 'पासवर्ड बदल जाने या हैक हो जाने पर अपने गूगल खाते को पुनः प्राप्त करने का एकमात्र आधिकारिक जरिया।'
      }
    ],
    nextSteps: [
      'Gmail की सेटिंग्स खोलें → "Filters and Blocked Addresses" और "Forwarding" में जांचें कि हैकर ने कोई ऑटो-फॉरवर्डिंग नियम तो नहीं बना रखा',
      'Google Drive में जांचें कि कोई महत्वपूर्ण दस्तावेज किसी बाहरी ईमेल के साथ साझा तो नहीं हुआ',
      'Google Pay से जुड़े कार्ड्स और UPI की सुरक्षा सेटिंग्स की जांच करें'
    ],
    prevention: [
      'गूगल खाते पर कभी भी आसान या पुराना पासवर्ड न रखें',
      'हमेशा बायोमेट्रिक पासकी (Passkey) या Google Authenticator ऐप का उपयोग करें',
      'किसी भी अनजान ईमेल में आए "Verify Account" लिंक पर कभी क्लिक न करें'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/66-four-in-one-security-audit.png',
      '/tutorials/digital-banking/assets/67-two-factor-passkey-password-manager.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल इन्फोग्राफिक 66 और 67 में 2FA और ऑडिट समझाया गया था; यह गाइड खाते में आपातकालीन घुसपैठ के समय 1-क्लिक रिमोट साइन-आउट वर्कफ़्लो प्रदान करती है।'
  },
  {
    id: 'emergency-05',
    sequenceNumber: 5,
    situationTitle: 'स्थिति 5: अचानक सिम का नेटवर्क गायब (No Service / SIM Swap अलर्ट)',
    englishTitle: 'Situation 5: Sudden SIM Network Deactivation & SIM Swap Attack',
    priorityBadge: 'तत्काल कार्रवाई (Immediate)',
    timeSensitivity: 'अत्यंत आपातकाल (पहले 10 मिनट में ऑपरेटर से बात करें)',
    situationDescription: 'आपके फोन में अचानक सिग्नल गायब हो जाते हैं और स्क्रीन पर "No Service", "Emergency Calls Only" या "SIM Inactive" दिखने लगता है, जबकि आसपास सभी फोन का नेटवर्क चल रहा हो।',
    immediateAction: [
      'कदम 1 (सिम स्वैप का खतरा पहचानें): यदि फोन रीस्टार्ट करने पर भी नेटवर्क न आए, तो इसे साधारण खराबी न समझें — साइबर ठगों ने आपकी पहचान चुराकर आपके नंबर का डुप्लीकेट सिम जारी करवा लिया हो सकता है!',
      'कदम 2 (ऑपरेटर को तुरंत कॉल करें): तुरंत किसी अन्य व्यक्ति के फोन से अपने टेलीकॉम ऑपरेटर के कस्टमर केयर (Jio: 198, Airtel: 121, Vi: 199, BSNL: 1503) पर कॉल करें।',
      'कदम 3 (स्थिति की पुष्टि और रोक): ऑपरेटर से पूछें: "क्या मेरे नंबर पर कोई नई सिम या डुप्लीकेट सिम का अनुरोध आया है?" यदि हाँ, तो कहें कि वह फर्जी है और तुरंत नंबर पर "Outgoing SMS & Banking Freeze" लगाएं।',
      'कदम 4 (बैंक को सूचना दें): तुरंत अपने बैंक को सूचित करें कि आपका मोबाइल नंबर खतरे में है, इसलिए नेट बैंकिंग पर अस्थायी रोक लगा दी जाए।'
    ],
    officialHelp: [
      {
        name: 'टेलीकॉम उपभोक्ता सेवा केंद्र',
        contactNumber: '198 (अपने ऑपरेटर का हेल्पलाइन)',
        operatingHours: '24×7',
        description: 'अवैध सिम स्वैप को तत्काल रोकने और नंबर को ब्लॉक कराने हेतु।'
      },
      {
        name: 'राष्ट्रीय साइबर अपराध हेल्पलाइन',
        contactNumber: '1930',
        operatingHours: '24×7',
        description: 'सिम स्वैप द्वारा बैंक खाते से लेनदेन होने की स्थिति में।'
      }
    ],
    nextSteps: [
      'नजदीकी अधिकृत टेलीकॉम स्टोर (Jio Store, Airtel Store आदि) में स्वयं मूल आधार कार्ड लेकर जाएं',
      'स्टोर मैनेजर से शिकायत दर्ज कराएं कि बिना आपकी उपस्थिति के डुप्लीकेट सिम कैसे जारी हुई',
      'नया सिम कार्ड जारी करवाएं और फोन में डालकर तुरंत सारे पासवर्ड बदलें'
    ],
    prevention: [
      'अपने सिम कार्ड पर हमेशा 4-अंकों का SIM PIN लॉक लगाकर रखें',
      'अपने आधार और पैन कार्ड की प्रतियों को कभी भी अनजान जगहों पर बिना पर्पस लिखे न छोड़ें',
      'यदि संभव हो तो फिजिकल प्लास्टिक सिम से डिजिटल eSIM पर अपग्रेड करें'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/23-16-lessons.png',
      '/tutorials/digital-banking/assets/56-scam-12a-lost-phone-sim-transferred.png',
      '/tutorials/digital-banking/assets/57-scam-12b-phone-lost-sim-clone.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल इन्फोग्राफिक 23 (नियम 8) और केस 12 में सिम सुरक्षा का उल्लेख था; यह गाइड नेटवर्क गायब होने पर वरिष्ठ नागरिकों के लिए तुरंत कदम उठाने की प्रक्रिया बताती है।'
  },
  {
    id: 'emergency-06',
    sequenceNumber: 6,
    situationTitle: 'स्थिति 6: ATM से नकदी नहीं निकली लेकिन खाते से पैसे कट गए',
    englishTitle: 'Situation 6: ATM Cash Not Dispensed but Amount Debited (T+5 Auto-Reversal)',
    priorityBadge: 'उच्च प्राथमिकता (High)',
    timeSensitivity: 'तुरंत पर्ची व ATM ID संभालें; 5 कार्यदिवसों का RBI नियम',
    situationDescription: 'आपने ATM मशीन में कार्ड लगाकर पिन डाला, मशीन में नोट गिनने की आवाज आई लेकिन पैसे बाहर नहीं निकले। कुछ सेकंड बाद आपके फोन पर पैसे कटने का SMS आ गया।',
    immediateAction: [
      'कदम 1 (2 मिनट ATM पर प्रतीक्षा करें): तुरंत केबिन से बाहर न जाएं; स्क्रीन पर देखें कि क्या "Transaction Timeout" या "Cash Dispense Failed" का संदेश आता है। कभी-कभी मशीन कुछ देर में पैसे लौटा देती है।',
      'कदम 2 (ATM ID और पर्ची संभालें): यदि पर्ची निकली है तो उसे संभालकर रखें। यदि पर्ची नहीं निकली है, तो ATM मशीन के ऊपर लगे स्टिकर से ATM ID (मशीन नंबर), बैंक का नाम, दिनांक और समय नोट करें।',
      'कदम 3 (बैंक हेल्पलाइन पर शिकायत दर्ज करें): अपने बैंक के टोल-फ्री हेल्पलाइन नंबर पर कॉल करके विफल लेनदेन की शिकायत दर्ज कराएं और "Complaint Ticket Number" अवश्य लें।',
      'कदम 4 (T+5 दिन का RBI नियम समझें): RBI के परिपत्र के अनुसार, बैंक को लेनदेन विफल होने के 5 कार्यदिवसों (T+5) के भीतर पैसे स्वतः खाते में वापस करने होते हैं।'
    ],
    officialHelp: [
      {
        name: 'कार्ड जारीकर्ता बैंक का कस्टमर केयर',
        contactNumber: 'कार्ड के पीछे छपा टोल-फ्री नंबर',
        operatingHours: '24×7',
        description: 'ATM फेलियर ट्रांजैक्शन की शिकायत दर्ज कराने और कंप्लेंट नंबर लेने हेतु।'
      },
      {
        name: 'RBI बैंकिंग लोकपाल (Banking Ombudsman CMS Portal)',
        contactNumber: '14448 (टोल-फ्री)',
        operatingHours: 'कार्यदिवसों में 9:30 AM से 5:15 PM',
        portalUrl: 'https://cms.rbi.org.in',
        description: 'यदि बैंक 30 दिनों में समाधान न करे या T+5 के बाद ₹100/दिन का हर्जाना न दे, तो RBI लोकपाल को शिकायत करें।'
      }
    ],
    nextSteps: [
      '5 कार्यदिवस (T+5 दिन) तक अपने बैंक खाते के स्टेटमेंट की नियमित जांच करें',
      'यदि 5 कार्यदिवस के बाद भी पैसे वापस न आएं, तो RBI के नियम (DPSS.PD.No.262/02.10.002/2019-20) के तहत बैंक को ₹100 प्रतिदिन के हर्जाने का दावा करें',
      'शाखा प्रबंधक को लिखित में आवेदन देकर कंप्लेंट नंबर और ATM ID का उल्लेख करें'
    ],
    prevention: [
      'हमेशा बैंक परिसर से जुड़े ऑन-साइट ATM का ही उपयोग करने को प्राथमिकता दें',
      'सड़क किनारे बने पुराने या सुनसान ATM में जाने से बचें',
      'ATM से बाहर निकलने से पहले हमेशा लाल रंग का Cancel बटन दो बार दबाएं'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/30-atm-money-not-received.png'
    ],
    sourceCoverage: 'COMPLETE_SOURCE',
    proceduralCardNote: 'मूल इन्फोग्राफिक 30 में इस स्थिति का पूरा विवरण मौजूद है। इस गाइड में RBI के T+5 ऑटो-रिवर्सल और ₹100/दिन हर्जाने के नियम को और अधिक स्पष्ट किया गया है।'
  },
  {
    id: 'emergency-07',
    sequenceNumber: 7,
    situationTitle: 'स्थिति 7: गलत बैंक खाते या गलत UPI ID में पैसे ट्रांसफर हो जाना',
    englishTitle: 'Situation 7: Money Transferred to Wrong Bank Account or Wrong UPI ID',
    priorityBadge: 'उच्च प्राथमिकता (High)',
    timeSensitivity: 'तुरंत UTR नंबर नोट करें और विवाद दर्ज कराएं',
    situationDescription: 'फोन नंबर या खाता संख्या टाइप करने में 1 अंक गलत हो गया, और पैसे आपके परिचित के बजाय किसी अज्ञात व्यक्ति के बैंक खाते में चले गए।',
    immediateAction: [
      'कदम 1 (12-अंकों का UTR नंबर नोट करें): अपने UPI ऐप (Google Pay, PhonePe, Paytm) की भुगतान रसीद खोलें और 12-अंकों का UPI Transaction ID (UTR Number) कहीं लिखकर रखें।',
      'कदम 2 (UPI ऐप में विवाद दर्ज करें): भुगतान विवरण में नीचे जाएं → "Have an issue with this transaction?" या "Report Problem" चुनें → "Transferred to incorrect recipient / wrong account" विकल्प दर्ज करें।',
      'कदम 3 (NPCI पोर्टल पर शिकायत करें): NPCI की आधिकारिक वेबसाइट `npci.org.in` पर जाएं → "Get in touch" → "UPI Complaint" → "Transaction" टैब में जाकर गलत ट्रांसफर की शिकायत दर्ज करें।',
      'कदम 4 (मूल बैंक शाखा में जाएं): अपनी बैंक शाखा में जाकर लिखित आवेदन दें। आपका बैंक प्राप्तकर्ता के बैंक को संपर्क करके राशि को रिवर्स (Reversal) करने का औपचारिक अनुरोध भेजेगा।'
    ],
    officialHelp: [
      {
        name: 'NPCI UPI विवाद निवारण पोर्टल (UPI Dispute Redressal Mechanism)',
        contactNumber: 'वेबसाइट पोर्टल',
        operatingHours: '24×7 ऑनलाइन',
        portalUrl: 'https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism',
        description: 'गलत खाते में गए UPI लेनदेन को नेशनल पेमेंट्स कॉरपोरेशन ऑफ इंडिया के समक्ष दर्ज कराने का अधिकृत मंच।'
      },
      {
        name: 'आपकी मूल बैंक शाखा (Home Branch Manager)',
        contactNumber: 'शाखा फोन नंबर / व्यक्तिगत उपस्थिति',
        operatingHours: 'बैंक कार्य समय',
        description: 'प्राप्तकर्ता बैंक को इंटरबैंक रिकवरी का आधिकारिक नोटिस भेजने हेतु।'
      }
    ],
    nextSteps: [
      'बैंक को दी गई लिखित शिकायत की हस्ताक्षरित पावती (Receiving / ACK Copy) अवश्य लें',
      'यदि प्राप्तकर्ता पैसा लौटाने से मना करे, तो बैंक की मदद से उसके शाखा प्रबंधक से संपर्क साधें',
      'यदि बैंक 30 दिनों में कोई कार्रवाई न करे, तो RBI बैंकिंग लोकपाल में शिकायत दर्ज करें'
    ],
    prevention: [
      'किसी नए व्यक्ति को पहली बार पैसे भेजते समय पहले हमेशा केवल ₹1 का सांकेतिक ट्रांसफर करके पुष्टि करें',
      'UPI में नाम और खाता संख्या डालते समय स्क्रीन पर आने वाले वास्तविक नाम को 2 बार ध्यान से पढ़ें',
      'बार-बार भुगतान किए जाने वाले परिचितों के खातों को ऐप में "Beneficiary / Favorite" बनाकर सहेजें'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/04-apprehension-in-using-digital-banking.png',
      '/tutorials/digital-banking/assets/18-upi.png',
      '/tutorials/digital-banking/assets/23-16-lessons.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल पाठ 18 और 23 में UPI नियमों का उल्लेख था; यह गाइड NPCI Dispute Portal और बैंक शाखा रिकवरी की व्यावहारिक प्रक्रिया जोड़ती है।'
  },
  {
    id: 'emergency-08',
    sequenceNumber: 8,
    situationTitle: 'स्थिति 8: साइबर ब्लैकमेलिंग / "डिजिटल अरेस्ट" की धमकी भरी कॉल',
    englishTitle: 'Situation 8: Cyber Blackmail, Fake Police Extortion & Digital Arrest Threats',
    priorityBadge: 'तत्काल कार्रवाई (Immediate)',
    timeSensitivity: 'तुरंत कॉल काटें; डरकर 1 रुपया भी कभी न भेजें',
    situationDescription: 'कोई अज्ञात कॉलर पुलिस, CBI, कस्टम्स या कोर्ट का अधिकारी बनकर आपको वीडियो कॉल पर धमका रहा है, फर्जी वारंट दिखा रहा है और कह रहा है कि आप कमरे में बंद रहें अन्यथा आपको जेल भेज दिया जाएगा।',
    immediateAction: [
      'कदम 1 (फोन तुरंत काटें): किसी भी प्रकार की बहस किए बिना वीडियो कॉल या ऑडियो कॉल को तुरंत काटें। नंबर को अपने फोन में तुरंत ब्लॉक करें।',
      'कदम 2 (पैसे कभी न भेजें): किसी भी परिस्थिति में डरकर या दबाव में आकर "सुरक्षा खाते", "सत्यापन शुल्क" या "जमानत" के नाम पर पैसे कभी न भेजें।',
      'कदम 3 (परिजनों को तुरंत बताएं): कमरे में अकेले बंद न रहें; तुरंत कमरे से बाहर निकलें और अपने परिवार के सदस्यों, बच्चों या पड़ोसियों को पूरी बात बताएं।',
      'कदम 4 (1930 पर तुरंत सूचना दें): राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें और बताएं कि आपको इस नंबर से डिजिटल अरेस्ट की फर्जी धमकी आई है।'
    ],
    officialHelp: [
      {
        name: 'राष्ट्रीय साइबर अपराध हेल्पलाइन (गृह मंत्रालय)',
        contactNumber: '1930',
        operatingHours: '24×7 टोल-फ्री',
        portalUrl: 'https://cybercrime.gov.in',
        description: 'ब्लैकमेलिंग, जबरन वसूली और फर्जी पुलिस अधिकारियों की रिपोर्टिंग के लिए।'
      },
      {
        name: 'दूरसंचार विभाग का चक्षु पोर्टल (Chakshu - DoT Fraud Reporting)',
        contactNumber: 'वेबसाइट पोर्टल',
        operatingHours: '24×7',
        portalUrl: 'https://sancharsaathi.gov.in/sfc/',
        description: 'धमकी और धोखाधड़ी वाले फोन नंबरों को पूरे देश में ब्लॉक कराने के लिए नागरिक सुविधा।'
      }
    ],
    nextSteps: [
      'यदि संभव हो तो उस कॉलर के नंबर, प्रोफाइल और WhatsApp चैट का स्क्रीनशॉट लेकर रखें',
      'स्थानीय पुलिस स्टेशन में जाकर अपनी सुरक्षा हेतु एक लिखित सूचना (Diary Entry / Complaint) दर्ज कराएं',
      'शांत रहें और समझें कि भारत में किसी भी नागरिक को फोन पर अरेस्ट करने का कोई कानून नहीं है'
    ],
    prevention: [
      'अज्ञात नंबरों से आने वाली वीडियो कॉल को कभी भी न उठाएं',
      'सरकारी विभागों (पुलिस, CBI, कस्टम्स, टैक्स) के नाम से आने वाले किसी भी पत्र या नोटिस की पुष्टि केवल उनके भौतिक कार्यालय में जाकर ही करें',
      'परिवार में सभी बुजुर्गों को "डिजिटल अरेस्ट" की वास्तविकता से पहले ही अवगत कराएं'
    ],
    sourceInfographics: [
      '/tutorials/digital-banking/assets/44-scam-01-online-loan.png',
      '/tutorials/digital-banking/assets/46-scam-03-digital-arrest.png',
      '/tutorials/digital-banking/assets/49-scam-06-screen-sharing.png'
    ],
    sourceCoverage: 'PARTIAL_SOURCE_WITH_PROCEDURAL_CARD',
    proceduralCardNote: 'मूल इन्फोग्राफिक 46 में डिजिटल अरेस्ट का किस्सा था; यह गाइड पीड़ितों को मानसिक राहत और चक्षु पोर्टल व 1930 की त्वरित सुरक्षा कार्यविधि प्रदान करती है।'
  }
];
