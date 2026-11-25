/**
 * Digital Learning Hub — Gmail Mastery Series
 * Topic: Undo Send (Internal: Day 14)
 * Data File for Shared Engine
 */

window.TUTORIAL_DATA = {
  topicPath: "category/gmail/topic/undo-send",
  dayPill: "DAY 14",
  title: "Undo Send — भेजी हुई Email को कुछ सेकंड में वापस लें",
  subtitle: "गलत Attachment या गलत Recipient पर Send दब जाने पर कुछ सेकंड के भीतर Email को वापस Draft में लाना और समय-सीमा सेट करना सीखें।",
  learningOutcomes: [
    "Send दबाने के तुरंत बाद नीचे दिखने वाले 'Undo' बटन से Email को वापस Draft में लाना",
    "Desktop (Web) Gmail में Settings → See all settings → General → Undo Send से 5 से 30 सेकंड का समय चुनना",
    "यह समझना कि Undo Send केवल तय सेकंड की रोक (Delay) है — समय बीतने के बाद पहले से डिलीवर हुई Email को Recall नहीं किया जा सकता"
  ],
  brandTitle: "Digital Learning Hub",
  sections: {
    problem: {
      stepNum: "Section 1",
      heading: "पहले समस्या समझें",
      badge: "📖 Status 1/2",
      image: "assets/day-14-status-1.png",
      alt: "जल्दी में गलत Attachment के साथ Email Send हो जाने पर Undo Send से वापस लेने की कहानी",
      lightboxTitle: "Status 1/2: पहले समस्या समझें"
    },
    solution: {
      stepNum: "Section 2",
      heading: "अब करना सीखें",
      cards: [
        {
          badge: "🚀 Status 2/2",
          image: "assets/day-14-status-2.png",
          alt: "Desktop Gmail में Undo Send समय सीमा (5 से 30 सेकंड) सेट करने की विधि",
          lightboxTitle: "Status 2/2: अब करना सीखें"
        }
      ],
      summaryBox: {
        type: "steps",
        title: "Undo Send सेट करने और उपयोग करने के नियम:",
        items: [
          {
            title: "1. समय-सीमा (Desktop Settings)",
            text: "कंप्यूटर पर ⚙️ Settings → See all settings → General → 'Undo Send' में 5, 10 (सुझावित), 20 या 30 seconds चुनकर Save Changes करें।"
          },
          {
            title: "2. तुरंत Undo दबाएँ",
            text: "Send करने के तुरंत बाद नीचे 'Message sent — Undo' दिखता है। Undo दबाते ही Email वापस Draft में खुल जाती है।"
          },
          {
            title: "3. Recall नहीं, Delay है",
            text: "Gmail आपके चुने हुए सेकंड तक Email को रोककर रखता है। समय-सीमा समाप्त होने के बाद Email जा चुकी होती है और वापस नहीं बुलाई जा सकती।"
          }
        ]
      }
    },
    practice: {
      stepNum: "Section 3",
      heading: "खुद करके देखें",
      icon: "🎯",
      title: "हाथों-हाथ Practice (स्वयं को Test Email)",
      subtitle: "यह अभ्यास स्वयं को एक Test Email भेजकर सुरक्षित तरीके से करें:",
      mission: "👉 Desktop Gmail की General Settings में Undo Send का समय (जैसे 10 या 20 seconds) जाँचें, फिर अपने ही Email पते पर Test Email भेजकर तुरंत Undo बटन दबाकर देखें।",
      steps: [
        "<strong>चरण 1:</strong> Desktop (Web) Gmail में <strong>⚙️ Settings → See all settings → General</strong> खोलें और <strong>Undo Send</strong> में <strong>10 seconds</strong> (या 20s/30s) चुनकर नीचे <strong>Save Changes</strong> करें।",
        "<strong>चरण 2:</strong> <strong>Compose</strong> खोलें, <strong>To</strong> में अपना ही Email पता लिखें और Subject में <em>Test Undo</em> लिखकर <strong>Send</strong> दबाएँ।",
        "<strong>चरण 3:</strong> नीचे बाईं ओर दिखने वाले <strong>'Message sent — Undo'</strong> में तुरंत <strong>Undo</strong> पर क्लिक करें।",
        "<strong>चरण 4:</strong> देखें कि आपकी Email बिना भेजे वापस <strong>Draft</strong> विंडो में खुल जाती है।"
      ],
      toastSuccess: "🎉 बहुत बढ़िया! आपने Undo Send का अभ्यास पूरा कर लिया!"
    }
  },
  footer: {
    series: "Digital Learning Hub • Gmail Mastery Series",
    topic: "Undo Send — भेजी हुई Email को कुछ सेकंड में वापस लें"
  }
};
