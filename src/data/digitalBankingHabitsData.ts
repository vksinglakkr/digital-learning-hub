export interface DigitalBankingHabit {
  id: string
  sequenceNumber: number
  habitNumber: number
  title: string
  englishTitle: string
  wrongHabit: string
  rightHabit: string
  practicalAction: string
  imagePath: string
  relatedScamIds: string[]
  relatedLessonIds: string[]
  updatedSafetyNote: string
  category: string
}

export const DIGITAL_BANKING_HABITS: DigitalBankingHabit[] = [
  {
    id: 'habit-01',
    sequenceNumber: 33,
    habitNumber: 1,
    title: 'पहली आदत — देखें, समझें, फिर क्लिक करें',
    englishTitle: 'Habit 1: Observe Before Click',
    wrongHabit: 'मैसेज या ईमेल में आए किसी भी लिंक पर बिना सोचे-समझे तुरंत क्लिक कर देना।',
    rightHabit: 'लिंक पर क्लिक करने से पहले 1 मिनट ठहरें; भेजने वाले का नाम, डोमेन स्पेलिंग और URL ध्यान से पढ़ें।',
    practicalAction: 'अपने फोन में आए किसी विज्ञापन SMS को खोलें। उसमें दिए लिंक को बिना छुए (बिना क्लिक किए) ध्यान से पढ़ें कि क्या उसमें वेबसाइट का नाम सही लिखा है।',
    imagePath: '/tutorials/digital-banking/assets/33-habit-01-observe-before-click.png',
    relatedScamIds: ['scam-04', 'scam-05', 'scam-10', 'scam-11'],
    relatedLessonIds: ['lesson-08', 'lesson-09'],
    updatedSafetyNote: 'केवल "https://" लिखा होना वेबसाइट के असली होने का प्रमाण नहीं है। धोखेबाज भी मुफ्त SSL प्रमाणपत्र लेकर फर्जी साइट बना लेते हैं। हमेशा मुख्य डोमेन की स्पेलिंग (जैसे onlinesbi.sbi बनाम onlinesbi-login.cc) जांचें।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-02',
    sequenceNumber: 34,
    habitNumber: 2,
    title: 'दूसरी आदत — जल्दबाज़ी न करें, पहले जांचें',
    englishTitle: 'Habit 2: Never Hurry Always Verify',
    wrongHabit: '"24 घंटे में आपका खाता बंद हो जाएगा" या "बिजली कट जाएगी" जैसी धमकी सुनकर घबराकर तत्काल भुगतान कर देना।',
    rightHabit: 'समझें कि कोई भी असली सरकारी विभाग या बैंक अचानक खाता या बिजली बंद नहीं करता। मन शांत रखें और सीधे संबंधित कार्यालय से संपर्क करें।',
    practicalAction: 'किसी भी धमकी भरे या जरूरी कॉल आने पर तुरंत कोई बटन न दबाएं; गहरी सांस लें और मन में 1 से 10 तक गिनती गिनें। घबराहट में कभी कोई निर्णय न लें।',
    imagePath: '/tutorials/digital-banking/assets/34-habit-02-never-hurry-always-verify.png',
    relatedScamIds: ['scam-02', 'scam-03'],
    relatedLessonIds: ['lesson-01', 'lesson-08'],
    updatedSafetyNote: 'साइबर ठगों का सबसे बड़ा हथियार "कृत्रिम घबराहट (Panic Engineering)" है। असली संस्थाएं किसी भी कार्रवाई से पूर्व आधिकारिक डाक या शाखा द्वारा औपचारिक सूचना देती हैं।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-03',
    sequenceNumber: 35,
    habitNumber: 3,
    title: 'तीसरी आदत — OTP आपका है, कभी किसी को न बताएं',
    englishTitle: 'Habit 3: Never Share OTP',
    wrongHabit: 'फोन करने वाले को बैंक मैनेजर, कूरियर वाला या परिचित समझकर SMS में आया 6-अंकों का गुप्त OTP बोल देना।',
    rightHabit: 'गांठ बांध लें: बैंक या कोई भी असली कंपनी कभी फोन पर OTP नहीं मांगती। OTP साझा करना घर की तिजोरी की चाबी सौंपने जैसा है।',
    practicalAction: 'अपने फोन के SMS ऐप में जाएं और हाल ही में आए किसी बैंक OTP संदेश को खोलें। उसमें साफ अक्षरों में लिखी चेतावनी पढ़ें: "Do not share this OTP with anyone, including bank employees"।',
    imagePath: '/tutorials/digital-banking/assets/35-habit-03-never-share-otp.png',
    relatedScamIds: ['scam-02', 'scam-13', 'scam-18'],
    relatedLessonIds: ['lesson-08', 'lesson-09', 'lesson-11'],
    updatedSafetyNote: 'OTP केवल आपके द्वारा स्वयं किए जा रहे लेनदेन को प्रमाणित करने के लिए होता है। यदि आप कोई लेनदेन नहीं कर रहे हैं और फिर भी OTP आए, तो समझें कि कोई आपके खाते में सेंध लगाने की कोशिश कर रहा है।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-04',
    sequenceNumber: 36,
    habitNumber: 4,
    title: 'चौथी आदत — खुद नंबर मिलाकर पुष्टि करें',
    englishTitle: 'Habit 4: Call Back and Verify',
    wrongHabit: 'अनजान नंबर से आई कॉल पर भरोसा करना या SMS में दिए गए कस्टमर केयर नंबर पर फोन मिलाना।',
    rightHabit: 'संदिग्ध कॉल तुरंत काटें। अपनी बैंक पासबुक, डेबिट कार्ड के पीछे छपे या आधिकारिक वेबसाइट से लिए गए टोल-फ्री नंबर पर खुद कॉल करें।',
    practicalAction: 'अपनी बैंक पासबुक या ATM कार्ड निकालें। उसके पीछे छपा बैंक का आधिकारिक कस्टमर केयर नंबर (टोल-फ्री 1800-xxx) अपनी फोनबुक में "My Bank Official Care" नाम से सेव करें।',
    imagePath: '/tutorials/digital-banking/assets/36-habit-04-call-back-and-verify.png',
    relatedScamIds: ['scam-06', 'scam-11', 'scam-13'],
    relatedLessonIds: ['lesson-02', 'lesson-08'],
    updatedSafetyNote: 'गूगल पर सर्च करके मिले पहले 1-2 कस्टमर केयर नंबरों पर आंख मूंदकर भरोसा न करें; साइबर ठग गूगल ऐड्स (Sponsored Search) में अपने फर्जी नंबर डाल देते हैं।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-05',
    sequenceNumber: 37,
    habitNumber: 5,
    title: 'पांचवीं आदत — केवल आधिकारिक ऐप स्टोर का उपयोग करें',
    englishTitle: 'Habit 5: Use Official Apps Only',
    wrongHabit: 'WhatsApp, Telegram या किसी वेबसाइट लिंक से भेजी गई अनजान फाइल (.apk) डाउनलोड करके फोन में इंस्टॉल करना।',
    rightHabit: 'केवल Google Play Store या Apple App Store से ही प्रमाणित ऐप्स डाउनलोड करें और डेवलपर का नाम अवश्य जांचें।',
    practicalAction: 'अपने फोन की Settings खोलें → "Apps" या "Security" में जाएं → "Special app access" → देखें कि "Install unknown apps" सभी ऐप्स के लिए बंद (Not Allowed) है या नहीं।',
    imagePath: '/tutorials/digital-banking/assets/37-habit-05-use-official-apps-only.png',
    relatedScamIds: ['scam-01', 'scam-06', 'scam-14'],
    relatedLessonIds: ['lesson-05', 'lesson-10'],
    updatedSafetyNote: 'केवल 4+ स्टार रेटिंग या डाउनलोड संख्या देखकर ऐप को असली न मान लें; कई फर्जी ऐप्स नकली रेटिंग खरीद लेते हैं। हमेशा डेवलपर का नाम बैंक की आधिकारिक वेबसाइट से मिलाएं।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-06',
    sequenceNumber: 38,
    habitNumber: 6,
    title: 'छठी आदत — जांचे बिना कभी भरोसा न करें',
    englishTitle: 'Habit 6: Verify Before You Trust',
    wrongHabit: 'अनजान कॉलर की वर्दी वाली प्रोफाइल फोटो, मधुर भाषा या भारी मुनाफे/छूट के वादों पर विश्वास कर लेना।',
    rightHabit: 'डिजिटल दुनिया में पहचान की नकल बेहद आसान है। जब तक स्वतंत्र रूप से किसी व्यक्ति या प्रस्ताव की पुष्टि न हो जाए, एक रुपया भी न भेजें।',
    practicalAction: 'यदि कोई रिश्तेदार या परिचित किसी नए नंबर से व्हाट्सएप पर आपात स्थिति बताकर पैसे मांगे, तो उस नए नंबर पर पैसे भेजने के बजाय उसके पुराने नंबर पर सामान्य फोन कॉल करके पुष्टि करें।',
    imagePath: '/tutorials/digital-banking/assets/38-habit-06-verify-before-you-trust.png',
    relatedScamIds: ['scam-03', 'scam-07', 'scam-08', 'scam-09', 'scam-15'],
    relatedLessonIds: ['lesson-04', 'lesson-05'],
    updatedSafetyNote: 'आधुनिक समय में AI द्वारा आवाज की नकल (Voice Cloning) और फर्जी वीडियो कॉल संभव हैं। किसी भी वित्तीय मांग पर परिवार के अन्य सदस्यों से चर्चा अवश्य करें।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-07',
    sequenceNumber: 39,
    habitNumber: 7,
    title: 'सातवीं आदत — फोन हमेशा सुरक्षित लॉक रखें',
    englishTitle: 'Habit 7: Keep Your Phone Locked',
    wrongHabit: 'फोन में कोई स्क्रीन लॉक न लगाना, या स्क्रीन टाइमआउट को 5-10 मिनट रखना और फोन को टेबल पर खुला छोड़ देना।',
    rightHabit: 'मजबूत पिन या फिंगरप्रिंट लॉक लगाएं, स्क्रीन टाइमआउट 15-30 सेकंड रखें और बैंकिंग ऐप्स पर अलग सुरक्षा ताला (App Lock) लगाएं।',
    practicalAction: 'अपने फोन की Settings → Display → "Screen timeout" को 30 सेकंड पर सेट करें। इससे यदि आप फोन रखकर भूल भी जाएं, तो वह 30 सेकंड में स्वतः लॉक हो जाएगा।',
    imagePath: '/tutorials/digital-banking/assets/39-habit-07-keep-your-phone-locked.png',
    relatedScamIds: ['scam-12', 'scam-16', 'scam-17'],
    relatedLessonIds: ['lesson-01', 'lesson-14', 'lesson-16', 'lesson-17'],
    updatedSafetyNote: 'अनलॉक फोन सड़क पर खुले पड़े बैंक लॉकर के समान है। अपने फोन के सिम कार्ड पर भी 4-अंकों का SIM PIN लॉक जरूर लगाएं।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-08',
    sequenceNumber: 40,
    habitNumber: 8,
    title: 'आठवीं आदत — दैनिक UPI के लिए अलग छोटा बैंक खाता रखें',
    englishTitle: 'Habit 8: Keep Low Balance Separate Account for UPI',
    wrongHabit: 'अपने जीवनभर की जमा-पूंजी (PF, पेंशन, ग्रेच्युटी) वाले मुख्य बचत खाते को सीधे Google Pay या PhonePe से जोड़ना।',
    rightHabit: 'दैनिक खर्च के लिए ₹2,000–₹5,000 बैलेंस वाला एक अलग शून्य-बैलेंस बचत खाता रखें और UPI केवल उसी से लिंक करें। मुख्य बचत खाता पूरी तरह अलग रखें।',
    practicalAction: 'अपने मुख्य बैंक खाते से दैनिक UPI को अलग करने का विचार करें। अपने बैंक में एक साधारण सहायक खाता खोलें और महीने का केवल जरूरी खर्च उसमें ट्रांसफर करें।',
    imagePath: '/tutorials/digital-banking/assets/40-habit-08-keep-low-balance-separate-account.png',
    relatedScamIds: ['scam-04', 'scam-19'],
    relatedLessonIds: ['lesson-01', 'lesson-03', 'lesson-07', 'lesson-09'],
    updatedSafetyNote: 'यह वरिष्ठ नागरिकों की वित्तीय सुरक्षा का सबसे बड़ा व्यावहारिक रक्षा कवच (Air-Gap Protection) है। यदि कोई फोन चोरी भी कर ले या धोखा हो जाए, तो केवल छोटा बैलेंस ही प्रभावित होगा।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-09',
    sequenceNumber: 41,
    habitNumber: 9,
    title: 'नौवीं आदत — ऐप परमिशन को सीमित रखें',
    englishTitle: 'Habit 9: Keep App Permissions Limited',
    wrongHabit: 'किसी भी साधारण टॉर्च, गेम या अनजान उपयोगिता ऐप को कॉन्टैक्ट्स, कैमरा, माइक्रोफोन और SMS पढ़ने की अनुमति दे देना।',
    rightHabit: 'हर ऐप को केवल वही परमिशन दें जो उसके काम के लिए जरूरी हो। बैंकिंग ऐप्स को लोकेशन या कैमरा केवल जरूरत पड़ने पर ही दें।',
    practicalAction: 'अपने फोन की Settings खोलें → "Privacy" → "Permission manager" → "SMS" पर टैप करें। देखें कि किन-किन ऐप्स के पास आपके SMS पढ़ने की अनुमति है। अनावश्यक ऐप्स की अनुमति बंद (Don\'t allow) करें।',
    imagePath: '/tutorials/digital-banking/assets/41-habit-09-keep-app-permission-limited.png',
    relatedScamIds: ['scam-01', 'scam-06', 'scam-14'],
    relatedLessonIds: ['lesson-05', 'lesson-15'],
    updatedSafetyNote: 'SMS परमिशन के माध्यम से दुर्भावनापूर्ण ऐप्स आपके फोन में आने वाले बैंक OTP को आपकी जानकारी के बिना चुपचाप पढ़कर हैकर्स तक पहुंचा सकते हैं।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-10',
    sequenceNumber: 42,
    habitNumber: 10,
    title: 'दसवीं आदत — फोन सॉफ्टवेयर व ऐप्स हमेशा अपडेट रखें',
    englishTitle: 'Habit 10: Keep Software & Apps Updated',
    wrongHabit: 'सिस्टम अपडेट या ऐप अपडेट की सूचना आने पर उसे हफ्तों तक "Later" या "Ignore" करके टालते रहना।',
    rightHabit: 'हर महीने ऑपरेटिंग सिस्टम के सिक्योरिटी अपडेट इंस्टॉल करें और Google Play Store से बैंकिंग ऐप्स को हमेशा नवीनतम वर्जन पर रखें।',
    practicalAction: 'Google Play Store खोलें → ऊपर प्रोफाइल फोटो पर टैप करें → "Manage apps & device" → "Updates available" देखें और अपने बैंकिंग ऐप्स को अपडेट करें।',
    imagePath: '/tutorials/digital-banking/assets/42-habit-10-keep-software-app-updated.png',
    relatedScamIds: ['scam-14'],
    relatedLessonIds: ['lesson-14', 'lesson-16', 'lesson-17'],
    updatedSafetyNote: 'सॉफ्टवेयर अपडेट्स में हाल ही में खोजी गई सुरक्षा कमियों (Security Vulnerabilities) के पैच होते हैं। अपडेट न करने से फोन वायरस और मालवेयर के प्रति संवेदनशील हो जाता है।',
    category: '4. Good Digital Habits'
  },
  {
    id: 'habit-11',
    sequenceNumber: 43,
    habitNumber: 11,
    title: 'सार्वजनिक Wi-Fi का सुरक्षित उपयोग (Use of Wi-Fi with Care)',
    englishTitle: 'Habit 11: Public Wi-Fi Safety (Dedicated Public Wi-Fi Shield)',
    wrongHabit: 'रेलवे स्टेशन, बस स्टैंड, होटल या कैफे के खुले (बिना पासवर्ड वाले) फ्री पब्लिक वाई-फाई पर नेट बैंकिंग खोलना या पैसे ट्रांसफर करना।',
    rightHabit: 'संवेदनशील बैंकिंग, बिल भुगतान और UPI ट्रांजैक्शन हमेशा केवल अपने व्यक्तिगत मोबाइल डेटा (SIM Internet) पर ही करें।',
    practicalAction: 'अपने फोन की Settings खोलें → Wi-Fi पर जाएं → Wi-Fi Preferences या Advanced Settings में जाकर "Auto connect to open networks" को बंद (OFF) करें।',
    imagePath: '/tutorials/digital-banking/assets/43-habit-11-use-of-wifi-with-care.png',
    relatedScamIds: ['scam-06', 'scam-10', 'scam-14'],
    relatedLessonIds: ['lesson-08', 'lesson-09'],
    updatedSafetyNote: 'खुले पब्लिक वाई-फाई नेटवर्क पर कोई भी अन्य उपयोगकर्ता नेटवर्क ट्रैफिक को देख सकता है (Man-in-the-Middle Attack)। सार्वजनिक स्थानों पर कभी भी वित्तीय पासवर्ड या कार्ड विवरण दर्ज न करें।',
    category: '4. Good Digital Habits'
  }
];
