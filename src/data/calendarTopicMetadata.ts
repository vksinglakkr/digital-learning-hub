export interface CalendarTopicMetadata {
  day: string
  section: string
  infographics: number
  whatYouWillLearn: string[]
  practiceTask: string
}

export const CALENDAR_TOPIC_METADATA: Record<string, CalendarTopicMetadata> = {
  "calendar-create-event": {
    "day": "Day 01",
    "section": "खंड 1: शुरुआत (Getting Started)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Google Calendar App या Web में + (Create) बटन से नया Event बनाना",
      "मीटिंग, डॉक्टर अपॉइंटमेंट या जन्मदिन के लिए सही Date और Time Slot चुनना",
      "सही समय पर Reminder सेट करना ताकि कोई भी जरूरी काम कभी न छूटे"
    ],
    "practiceTask": "आज ही Google Calendar खोलकर अपने लिए एक वास्तविक Event (जैसे डॉक्टर अपॉइंटमेंट, मीटिंग या जन्मदिन) जोड़ें और 10 मिनट पहले का रिमाइंडर सेट करके Save करें।"
  },
  "calendar-recurring-events": {
    "day": "Day 02",
    "section": "खंड 1: शुरुआत (Getting Started)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Does not repeat मेनू से Daily, Weekly on Tuesday, Monthly विकल्प चुनना",
      "Custom Repeat में खास दिन (जैसे Mon, Wed, Fri) और समाप्ति तारीख (Ends after / On) तय करना",
      "This event या This and following events में अंतर समझकर सही बदलाव करना"
    ],
    "practiceTask": "आज ही अपने कैलेंडर में कोई दोहराया जाने वाला काम (जैसे हर सोमवार की क्लास या हर 1 तारीख का बिल) जोड़ें और Does not repeat को Weekly या Monthly में बदलकर Save करें।"
  },
  "calendar-edit-delete-events": {
    "day": "Day 03",
    "section": "खंड 1: शुरुआत (Getting Started)",
    "infographics": 2,
    "whatYouWillLearn": [
      "इवेंट पर क्लिक करके पेंसिल (✎) आइकन से विवरण या समय बदलना",
      "डेस्कटॉप पर इवेंट बॉक्स को सीधे ड्रैग-एंड-ड्रॉप (Drag & Drop) करके नए टाइम स्लॉट में खिसकाना",
      "इवेंट डिलीट करना और रीकरिंग इवेंट में सिर्फ एक तारीख या पूरी सीरीज हटाने का विकल्प समझना"
    ],
    "practiceTask": "अपने कैलेंडर में बने किसी भी पुराने इवेंट को खोलकर उसका समय 1 घंटा आगे बढ़ाएँ या ड्रैग करके नए समय पर ले जाकर Save करें।"
  },
  "calendar-notifications-reminders": {
    "day": "Day 04",
    "section": "खंड 2: समय पर याद रखें (Smarter Events)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Add notification पर क्लिक करके 5 मिनट, 15 मिनट, 1 घंटा या 1 दिन पहले का अलर्ट सेट करना",
      "एक ही इवेंट में दो अलग-अलग रिमाइंडर्स (Pop-up नोटिफिकेशन और Email अलर्ट) जोड़ना",
      "फोन की ऐप सेटिंग्स में कैलेंडर नोटिफिकेशन की परमिशन जांचना"
    ],
    "practiceTask": "अपने किसी जरूरी इवेंट में 2 अलग-अलग रिमाइंडर्स (पहला 1 दिन पहले, दूसरा 30 मिनट पहले) जोड़कर Save करें।"
  },
  "calendar-event-location": {
    "day": "Day 05",
    "section": "खंड 2: समय पर याद रखें (Smarter Events)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Add location फ़ील्ड में दुकान, अस्पताल, ऑफिस या एड्रेस टाइप करके Google Maps से जोड़ना",
      "इवेंट पर क्लिक करके सीधे \"Directions\" बटन से मैप नेविगेशन शुरू करना",
      "लोकेशन जोड़ने से मिलने वाले टाइम-टू-लीव (Time to Leave) अलर्ट का लाभ समझना"
    ],
    "practiceTask": "अपने कैलेंडर के किसी इवेंट में अपने पसंदीदा कैफे, डॉक्टर के क्लिनिक या ऑफिस का पता जोड़ें और Directions पर टैप करके Google Maps का लिंक जाँचें।"
  },
  "calendar-share-calendar": {
    "day": "Day 06",
    "section": "खंड 3: मिलकर काम करें (Collaboration)",
    "infographics": 3,
    "whatYouWillLearn": [
      "Desktop Web Calendar में Settings and sharing से किसी का ईमेल जोड़ना",
      "4 तरह की परमिशन (See only free/busy, See all event details, Make changes, Make changes and manage sharing) का अंतर समझना",
      "शेयर किए गए कैलेंडर को ज़रूरत खत्म होने पर अनशेयर (Remove access) करना"
    ],
    "practiceTask": "कंप्यूटर पर Calendar खोलकर किसी एक कैलेंडर की Settings में जाएँ और \"Share with specific people\" में परमिशन विकल्प देखें।"
  },
  "calendar-alarm-vs-calendar": {
    "day": "Day 07",
    "section": "खंड 4: व्यवस्थित रहें (Organization)",
    "infographics": 2,
    "whatYouWillLearn": [
      "तत्काल कार्यों (Short-term wake up / cooking) और भविष्य की योजना (Long-term appointments) में अंतर समझना",
      "फोन में दर्जनों बेनाम अलार्मों के शोर और तनाव से बचना",
      "कैलेंडर में विवरण, नोट्स और अटैचमेंट्स के साथ शांत रिमाइंडर्स पाना"
    ],
    "practiceTask": "अपने फोन के 3 ऐसे अलार्म पहचानें जो किसी भविष्य की मीटिंग या बिल से जुड़े थे, उन्हें बंद करके Google Calendar में सही समय पर दर्ज करें।"
  },
  "calendar-departure-time": {
    "day": "Day 08",
    "section": "खंड 2: समय पर याद रखें (Smarter Events)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Add location में सटीक गंतव्य पता जोड़ना",
      "Google Assistant और Maps के Time to Leave फीचर को सक्रिय रखना",
      "ट्रैफिक में फंसने से पहले सही समय पर अलर्ट पाने की आदत बनाना"
    ],
    "practiceTask": "आगामी किसी मीटिंग के लिए लोकेशन जोड़ें और टाइम-टू-लीव नोटिफिकेशन के लिए 10-15 मिनट का बफर सेट करें।"
  },
  "calendar-all-day-events": {
    "day": "Day 09",
    "section": "खंड 2: समय पर याद रखें (Smarter Events)",
    "infographics": 2,
    "whatYouWillLearn": [
      "इवेंट बनाते समय \"All-day\" चेकबॉक्स को चालू करना",
      "All-day इवेंट्स के लिए सुबह 9 बजे या 1 दिन पहले का रिमाइंडर सेट करना",
      "सालाना दोहराए जाने वाले (Annual Recurring) जन्मदिन और त्योहार जोड़ना"
    ],
    "practiceTask": "परिवार के किसी सदस्य का जन्मदिन या कोई महत्वपूर्ण वर्षगांठ All-day चेकबॉक्स चालू करके जोड़ें और Yearly रिपीट सेट करें।"
  },
  "calendar-color-coding": {
    "day": "Day 10",
    "section": "खंड 4: व्यवस्थित रहें (Organization)",
    "infographics": 2,
    "whatYouWillLearn": [
      "इवेंट एडिट विंडो में रंग पैलेट (Color Picker) से पसंदीदा रंग चुनना",
      "कैलेंडर के लिए अपना व्यक्तिगत कलर कोड नियम (Personal Color System) बनाना",
      "High Priority या Urgent कामों के लिए लाल (Tomato / Flamingo) रंग का उपयोग करना"
    ],
    "practiceTask": "अपने कैलेंडर के 3 अलग-अलग इवेंट्स को खोलें और एक को नीला (काम), एक को हरा (स्वास्थ्य) और एक को लाल (जरूरी) रंग में बदलें।"
  },
  "calendar-multiple-calendars": {
    "day": "Day 11",
    "section": "खंड 4: व्यवस्थित रहें (Organization)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Other calendars के पास + बटन से \"Create new calendar\" चुनना",
      "कैलेंडर को नाम, विवरण और टाइमज़ोन देकर तैयार करना",
      "बाईं ओर चेकबॉक्स से किसी भी कैलेंडर को ऑन या ऑफ करके स्क्रीन को साफ रखना"
    ],
    "practiceTask": "कंप्यूटर ब्राउज़र में Calendar खोलकर \"Personal\" या \"Fitness\" नाम से एक नया सेकेंडरी कैलेंडर बनाएँ।"
  },
  "calendar-search-events": {
    "day": "Day 12",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Search बार में कीवर्ड, व्यक्ति का नाम या स्थान टाइप करके खोजना",
      "सर्च फ़िल्टर्स (Who, Where, What, Date Range) से सटीक परिणाम पाना",
      "कैलेंडर को अपनी पर्सनल डायरी और इतिहास रिकॉर्ड की तरह इस्तेमाल करना"
    ],
    "practiceTask": "अपने कैलेंडर के सर्च बार में \"Doctor\" या \"Meeting\" टाइप करें और देखें कि पिछले सारे इवेंट्स की पूरी लिस्ट स्क्रीन पर आ जाती है।"
  },
  "calendar-invite-guests": {
    "day": "Day 13",
    "section": "खंड 3: मिलकर काम करें (Collaboration)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Add guests में व्यक्ति या ग्रुप का ईमेल जोड़ना",
      "Guest permissions (Modify event, Invite others, See guest list) को सही तरीके से सेट करना",
      "इवेंट कार्ड में Yes/No/Maybe का लाइव स्टेटस देखना"
    ],
    "practiceTask": "अपने किसी दोस्त या सहकर्मी के ईमेल के साथ एक टेस्ट मीटिंग बनाएँ और गेस्ट परमिशन में \"Modify event\" अनचेक रखकर इनवाइट भेजें।"
  },
  "calendar-google-meet": {
    "day": "Day 14",
    "section": "खंड 3: मिलकर काम करें (Collaboration)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Add Google Meet video conferencing बटन से ऑटोमैटिक लिंक बनाना",
      "लिंक कॉपी करना या सीधे \"Join with Google Meet\" पर क्लिक करके जुड़ना",
      "फोन और कंप्यूटर दोनों पर बिना किसी अतिरिक्त सॉफ्टवेयर के वीडियो कॉल शुरू करना"
    ],
    "practiceTask": "एक नया इवेंट बनाकर \"Add Google Meet video conferencing\" पर क्लिक करें और देखें कि कैसे ऑटोमैटिक वीडियो कॉल लिंक जनरेट होता है।"
  },
  "calendar-working-hours": {
    "day": "Day 15",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 2,
    "whatYouWillLearn": [
      "Settings में जाकर Working Hours (दिन और समय) कॉन्फ़िगर करना",
      "वर्क फ्रॉम होम (Home) या ऑफिस (Office) लोकेशन चुनना",
      "पर्सनल लाइफ और प्रोफेशनल टाइम के बीच स्वस्थ संतुलन बनाना"
    ],
    "practiceTask": "Settings में Working Hours सेक्शन खोलकर सोमवार से शुक्रवार सुबह 9:30 AM से 6:30 PM के घंटे सेट करें।"
  },
  "calendar-appointment-schedule": {
    "day": "Day 16",
    "section": "खंड 3: मिलकर काम करें (Collaboration)",
    "infographics": 2,
    "whatYouWillLearn": [
      "+ (Create) मेनू से \"Appointment schedule\" चुनना",
      "बुकिंग अवधि (30 मिनट, 1 घंटा), बफर टाइम और अधिकतम बुकिंग सीमा तय करना",
      "अपने बुकिंग पेज का वेब लिंक कॉपी करके ईमेल, बायो या व्हाट्सएप पर शेयर करना"
    ],
    "practiceTask": "कैलेंडर में + Create दबाकर \"Appointment schedule\" खोलें और 30 मिनट का एक कंसल्टेशन स्लॉट बनाकर बुकिंग पेज का प्रीव्यू देखें।"
  },
  "calendar-tasks-in-calendar": {
    "day": "Day 17",
    "section": "खंड 4: व्यवस्थित रहें (Organization)",
    "infographics": 2,
    "whatYouWillLearn": [
      "+ (Create) मेनू से \"Task\" चुनना और चेकलिस्ट बनाना",
      "टास्क पूरा होने पर \"Mark completed\" पर टैप करना",
      "अधूरे टास्क का अगले दिन अपने आप कैरी-फॉरवर्ड (Carry forward) होना"
    ],
    "practiceTask": "आज के लिए 2 जरूरी काम (+ Create → Task) बनाएँ और एक काम पूरा करके टिक (Mark completed) करके देखें।"
  },
  "calendar-public-holidays": {
    "day": "Day 18",
    "section": "खंड 4: व्यवस्थित रहें (Organization)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Other calendars में जाकर \"Holidays in India\" चेकबॉक्स ऑन करना",
      "सार्वजनिक अवकाश (Public holidays) और अन्य उत्सवों (Other observances) में अंतर",
      "छुट्टी वाले दिन कोई महत्वपूर्ण मीटिंग शेड्यूल करने की गलती से बचना"
    ],
    "practiceTask": "अपने कैलेंडर में Other calendars खोलकर \"Holidays in India\" को ऑन करें और आगामी राष्ट्रीय छुट्टियों की तारीखें देखें।"
  },
  "calendar-common-mistakes": {
    "day": "Day 19",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "अस्पष्ट शीर्षक (जैसे केवल \"Meeting\") की जगह स्पष्ट नाम (जैसे \"Client Review Meeting\") लिखना",
      "AM और PM के भ्रम से बचने के लिए 24-घंटे या स्पष्ट क्लॉक का ध्यान रखना",
      "इवेंट बनाते ही कम से कम 1 रिमाइंडर सुनिश्चित करना"
    ],
    "practiceTask": "अपने पिछले 5 इवेंट्स की जांच करें और देखें कि क्या उनमें से किसी में अधूरा टाइटल या गायब नोटिफिकेशन था, उसे सुधारें।"
  },
  "calendar-views-navigation": {
    "day": "Day 20",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "ऊपर दाईं ओर ड्रॉपडाउन से Day, Week, Month, Year, Schedule चुनना",
      "सुपरफ़ास्ट कीबोर्ड शॉर्टकट्स: D (Day), W (Week), M (Month), A (Schedule/Agenda)",
      "मोबाइल ऐप में 3-लाइन मेनू से Schedule View में लिस्ट रूप में इवेंट्स पढ़ना"
    ],
    "practiceTask": "कंप्यूटर पर कैलेंडर खोलकर कीबोर्ड पर D दबाकर Day View, W से Week View और M से Month View में बदल कर देखें।"
  },
  "calendar-import-export": {
    "day": "Day 21",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings → Import & export में जाकर Export दबाना और ZIP फाइल पाना",
      ".ics (iCalendar) फ़ाइल फ़ॉर्मेट की कार्यप्रणाली समझना",
      "आउटलुक, ऐप्पल कैलेंडर या दूसरे जीमेल से इवेंट्स को सुरक्षित इंपोर्ट करना"
    ],
    "practiceTask": "Settings में जाकर Export विकल्प पर क्लिक करें और अपने कैलेंडर की .ics बैकअप फ़ाइल डाउनलोड करके सुरक्षित रखें।"
  },
  "calendar-print-calendar": {
    "day": "Day 22",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "गियर मेनू (⚙️) से Print विकल्प चुनना",
      "Print Range (तारीख सीमा), Font size और Orientation (Landscape/Portrait) सेट करना",
      "Black and white चेकबॉक्स से इंक की बचत करना और Save as PDF करना"
    ],
    "practiceTask": "कंप्यूटर पर Calendar में Settings गियर से Print पर क्लिक करें और इस महीने के कैलेंडर का PDF प्रीव्यू देखें।"
  },
  "calendar-settings-preferences": {
    "day": "Day 23",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Start week on में Sunday या Monday चुनना",
      "Default event duration (15, 30, 60 मिनट) सेट करना ताकि हर बार समय न बदलना पड़े",
      "Past events को हल्का (Dim past events) करना ताकि वर्तमान दिन साफ दिखे"
    ],
    "practiceTask": "Settings → General में जाकर \"Start of the week\" को Monday और \"Default duration\" को 30 मिनट पर सेट करें।"
  },
  "calendar-time-zones": {
    "day": "Day 24",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings में Primary time zone (IST) और Secondary time zone (EST/PST/GMT) जोड़ना",
      "ट्रैवल करते समय कैलेंडर के ऑटोमैटिक लोकल टाइमज़ोन में अपडेट होने की सुविधा",
      "अंतरराष्ट्रीय मीटिंग इनवाइट्स का खुद-ब-खुद सही लोकल समय पर दिखना"
    ],
    "practiceTask": "Settings में जाकर \"Display secondary time zone\" को चेक करें और US Eastern Time (ET) जोड़कर कैलेंडर ग्रिड में दोनों घड़ियाँ देखें।"
  },
  "calendar-trash-restore": {
    "day": "Day 25",
    "section": "खंड 5: एडवांस सेटिंग्स (Advanced Control)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings (⚙️) मेनू से Trash खोलना",
      "डिलीट किए गए इवेंट्स की लिस्ट देखना और रीस्टोर (↺ Restore) आइकन दबाना",
      "30 दिन की स्वतः समाप्ति (Auto-delete) नीति को समझना"
    ],
    "practiceTask": "एक टेस्ट इवेंट डिलीट करें, फिर Settings → Trash में जाकर उसे ढूँढें और Restore बटन दबाकर वापस लाएँ।"
  },
  "calendar-events-from-gmail": {
    "day": "Day 26",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings में \"Events from Gmail\" को चालू या बंद करना",
      "प्राइवेसी सेटिंग्स (Only me vs Calendar default) तय करना",
      "ईमेल में समय या टिकट बदलने पर कैलेंडर में स्वतः अपडेट पाना"
    ],
    "practiceTask": "Settings → Events from Gmail में जाएँ और सुनिश्चित करें कि \"Show events automatically created by Gmail in my calendar\" चालू है।"
  },
  "calendar-notification-settings": {
    "day": "Day 27",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings → Notification settings में Desktop notifications (Alerts / Browser popups) चुनना",
      "Android फोन में Calendar ऐप के लिए \"Unrestricted battery usage\" सेट करना ताकि अलर्ट कभी मिस न हो",
      "Daily Digest (सुबह 5 बजे दिन भर के शेड्यूल का ईमेल) सक्रिय करना"
    ],
    "practiceTask": "Settings में जाकर \"Daily agenda\" (डेली एजेंडा) ईमेल चालू करें ताकि रोज़ सुबह 5 बजे दिन भर के सारे इवेंट्स आपके इनबॉक्स में आ जाएँ।"
  },
  "calendar-offline-sync": {
    "day": "Day 28",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "Settings → Offline में जाकर \"Turn on offline calendar\" सक्षम करना",
      "बिना इंटरनेट के कंप्यूटर पर calendar.google.com खोलने की क्षमता",
      "इंटरनेट पुनः कनेक्ट होने पर परिवर्तनों का सुरक्षित क्लाउड सिंक समझना"
    ],
    "practiceTask": "कंप्यूटर पर Chrome में Calendar खोलकर Settings → Offline में जाएँ और \"Turn on offline calendar\" को चालू करके देखें।"
  },
  "calendar-smart-habits": {
    "day": "Day 29",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "गोल्डन रूल 1: अगर कैलेंडर में नहीं है, तो वह काम कभी नहीं होगा",
      "बफर टाइम का नियम: लगातार 2 मीटिंग्स के बीच 10-15 मिनट का आराम रखना",
      "वीकली रिव्यू: हर रविवार शाम 10 मिनट में पूरे हफ्ते की प्लानिंग करना"
    ],
    "practiceTask": "इन 20 नियमों में से कम से कम 3 नियम (1. तुरंत दर्ज करना, 2. बफर टाइम, 3. रविवार रिव्यू) चुनकर आज से अपनी आदत बनाएँ।"
  },
  "calendar-mobile-vs-desktop": {
    "day": "Day 30",
    "section": "खंड 6: स्मार्ट आदतें (Smart Habits)",
    "infographics": 1,
    "whatYouWillLearn": [
      "फोन की खासियत: होम स्क्रीन विजेट (Widget) और तत्काल रिमाइंडर्स",
      "कंप्यूटर की खासियत: कीबोर्ड शॉर्टकट्स (D, W, M), ड्रैग-एंड-ड्रॉप और सेटिंग्स",
      "दोनों प्लेटफॉर्म्स के बीच रियल-टाइम क्लाउड सिंक का पूरा लाभ उठाना"
    ],
    "practiceTask": "अपने मोबाइल की होम स्क्रीन पर Google Calendar का 1 विजेट (Month View या Agenda Schedule) जोड़ें और कंप्यूटर पर शॉर्टकट्स चलाकर देखें।"
  }
};
