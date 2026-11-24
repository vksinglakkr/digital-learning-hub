/**
 * Digital Learning Hub — Gmail Mastery Series
 * Topic: Day 8 — Advanced Search Operators
 * Data File for Shared Engine
 */

window.TUTORIAL_DATA = {
  dayPill: "DAY 08",
  title: "Advanced Search — Search Operators से तेज़ी से Email ढूँढें",
  subtitle: "Gmail के पावर सर्च कमांड्स का उपयोग करके जरूरी फाइल्स, बैंक अलर्ट और महीनों पुराने ईमेल 10 सेकंड में खोजें।",
  meta: [
    "📸 3 Visual Cards",
    "🎯 1 Hands-on Practice",
    "⏱️ ~4 मिनट में सीखें"
  ],
  brandBadge: "Explanation Type",
  brandTitle: "Digital Learning Hub",
  sections: {
    problem: {
      stepNum: "Section 1",
      heading: "पहले समस्या समझें",
      badge: "📖 Day 08 • Status 1/3 (समस्या)",
      hint: "चित्र पर क्लिक करके बड़ा देखें",
      image: "assets/day-8-status-1.png",
      alt: "Gmail Day 08 Status 1: ऑफिस मीटिंग में 6 महीने पुराना ईमेल न मिलने की कहानी",
      lightboxTitle: "Day 8 Status 1: महत्वपूर्ण ईमेल खोजने की समस्या"
    },
    solution: {
      stepNum: "Section 2",
      heading: "अब करना सीखें",
      hideHeaderZoomBtn: true,
      cards: [
        {
          badge: "🔍 Day 08 • Status 2/3 (5 स्मार्ट सर्च कमांड्स)",
          zoomBtn: true,
          image: "assets/day-8-status-2.png",
          alt: "Gmail Day 08 Status 2: 5 Smart Gmail Searches जो हर व्यक्ति के काम आएं",
          lightboxTitle: "Day 8 Status 2: 5 Smart Gmail Searches"
        },
        {
          badge: "🚀 Day 08 • Status 3/3 (स्मार्ट कॉम्बिनेशन)",
          zoomBtn: true,
          image: "assets/day-8-status-3.png",
          alt: "Gmail Day 08 Status 3: एक से अधिक Search Operators को साथ मिलाकर खोजना",
          lightboxTitle: "Day 8 Status 3: Search Operators को साथ मिलाकर खोजें"
        }
      ],
      summaryBox: {
        type: "cheat",
        title: "सबसे उपयोगी 4 Search Operators का अर्थ:",
        items: [
          {
            cmd: "has:attachment",
            desc: "केवल वही Emails दिखाएगा जिनमें कोई फ़ाइल, PDF, फोटो या बिल अटैच है।"
          },
          {
            cmd: "from:example@gmail.com",
            desc: "केवल उसी खास प्रेषक (Sender या Bank) से आए सभी Emails को फ़िल्टर करेगा।"
          },
          {
            cmd: "older_than:3m",
            desc: "3 महीने (3m) से ज्यादा पुराने सभी Emails दिखाएगा (d=दिन, m=महीने, y=साल)।"
          },
          {
            cmd: "has:attachment older_than:3m",
            desc: "दोनों को मिलाकर: केवल 3 महीने से पुराने ऐसे Emails जिनमें Attachment मौजूद हो।"
          }
        ]
      }
    },
    practice: {
      stepNum: "Section 3",
      heading: "खुद करके देखें",
      icon: "🎯",
      title: "हाथों-हाथ Practice",
      subtitle: "सीखने को पक्का करने के लिए अपने Gmail सर्च बार में यह 4 सर्च चलाकर देखें:",
      mission: "👉 Gmail के सर्च बॉक्स में नीचे दिए गए 4 Search Operators को बारी-बारी से टाइप करें और 'Enter' दबाकर देखें कि परिणाम कितनी जल्दी मिलते हैं:",
      steps: [
        "<strong>चरण 1 (has:attachment):</strong> सर्च बॉक्स में <code>has:attachment</code> लिखें और Enter दबाएँ — देखें कि केवल फाइलों और PDF वाले Emails ही सामने आते हैं।",
        "<strong>चरण 2 (from:):</strong> किसी भी परिचित का ईमेल या संस्था का नाम लिखकर खोजें, जैसे <code>from:google</code> या <code>from:bank</code> — केवल उसी Sender के ईमेल दिखेंगे।",
        "<strong>चरण 3 (older_than:3m):</strong> सर्च बॉक्स में <code>older_than:3m</code> लिखकर खोजें — 3 महीने से पुराने सभी Emails तुरंत फिल्टर हो जाएँगे।",
        "<strong>चरण 4 (Combined Search):</strong> दोनों को मिलाकर <code>has:attachment older_than:3m</code> सर्च करें — जादू की तरह केवल पुराने अटैचमेंट्स वाले जरूरी ईमेल मिल जाएँगे!"
      ],
      toastSuccess: "🎉 बधाई! आपने Advanced Search Operators का अभ्यास पूरा कर लिया!"
    }
  },
  footer: {
    series: "Digital Learning Hub • Gmail Mastery Series",
    topic: "Day 08: Advanced Search Operators • Local Preview Only"
  }
};
