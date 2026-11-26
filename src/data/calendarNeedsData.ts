export interface CalendarRecommendation {
  topicId: string
  reason: string
}

export interface CalendarProblemItem {
  id: string
  problemText: string
  recommendations: CalendarRecommendation[]
}

export interface CalendarNeedItem {
  id: string
  title: string
  subtitle: string
  iconName: string
  tag: string
  color: string
  primaryTopicIds: string[]
  problems: CalendarProblemItem[]
}

export const CALENDAR_NEEDS: CalendarNeedItem[] = [
  {
    id: 'start',
    title: 'शुरुआत करें',
    subtitle: 'नया Event बनाना, दोहराना व समय बदलना',
    iconName: 'Calendar',
    tag: 'Getting Started',
    color: 'teal',
    primaryTopicIds: ['calendar-create-event', 'calendar-recurring-events', 'calendar-edit-delete-events'],
    problems: [
      {
        id: 'first-event',
        problemText: 'कैलेंडर में पहली बार मीटिंग या डॉक्टर अपॉइंटमेंट कैसे जोड़ें?',
        recommendations: [
          {
            topicId: 'calendar-create-event',
            reason: 'बस 1 मिनट में Event का नाम, तारीख, समय और रिमाइंडर सेट करके Save करना सीखें।'
          }
        ]
      },
      {
        id: 'recurring-need',
        problemText: 'रोज़ या हर महीने होने वाले काम बार-बार क्यों टाइप करें?',
        recommendations: [
          {
            topicId: 'calendar-recurring-events',
            reason: 'Does not repeat से Daily, Weekly या Monthly रिपीट सेट करें — एक बार बनाएँ और कैलेंडर याद रखेगा।'
          }
        ]
      },
      {
        id: 'edit-reschedule-need',
        problemText: 'मीटिंग का समय बदल गया या कैंसिल हो गई तो क्या करें?',
        recommendations: [
          {
            topicId: 'calendar-edit-delete-events',
            reason: 'पेंसिल आइकन से समय बदलें या ड्रैग करके नए स्लॉट में खिसकाएँ।'
          }
        ]
      }
    ]
  },
  {
    id: 'time-reminders',
    title: 'समय पर याद रखें',
    subtitle: 'अलर्ट, ट्रैफिक टाइम, लोकेशन व ऑल-डे काम',
    iconName: 'Clock',
    tag: 'Smarter Events',
    color: 'amber',
    primaryTopicIds: ['calendar-notifications-reminders', 'calendar-event-location', 'calendar-departure-time', 'calendar-all-day-events'],
    problems: [
      {
        id: 'missed-alerts',
        problemText: 'काम भूलने से कैसे बचें और सही समय पर सूचना कैसे पाएँ?',
        recommendations: [
          {
            topicId: 'calendar-notifications-reminders',
            reason: 'एक ही इवेंट में 10 मिनट पहले और 1 दिन पहले के 2 अलर्ट जोड़ना सीखें।'
          }
        ]
      },
      {
        id: 'location-alerts',
        problemText: 'मीटिंग या शादी का पता ढूँढने में देर न हो?',
        recommendations: [
          {
            topicId: 'calendar-event-location',
            reason: 'Add location से पता जोड़ें और 1 क्लिक में Google Maps से रास्ता पाएँ।'
          }
        ]
      },
      {
        id: 'traffic-departure-alerts',
        problemText: 'ट्रैफिक का अनुमान लगाकर घर से कब निकलना चाहिए?',
        recommendations: [
          {
            topicId: 'calendar-departure-time',
            reason: 'Google Maps और Calendar से निकलने का समय (Departure Time) अलर्ट पाएँ।'
          }
        ]
      },
      {
        id: 'all-day-need',
        problemText: 'जन्मदिन, सालगिरह और छुट्टियों को बिना समय स्लॉट कैसे दर्ज करें?',
        recommendations: [
          {
            topicId: 'calendar-all-day-events',
            reason: 'All-day चेकबॉक्स चालू करके कैलेंडर के टॉप बैनर में वार्षिक याद दिलाएँ।'
          }
        ]
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'मिलकर काम करें',
    subtitle: 'कैलेंडर शेयर करना, Google Meet व बुकिंग लिंक',
    iconName: 'Users',
    tag: 'Collaboration',
    color: 'indigo',
    primaryTopicIds: ['calendar-share-calendar', 'calendar-invite-guests', 'calendar-google-meet', 'calendar-appointment-schedule'],
    problems: [
      {
        id: 'share-schedules',
        problemText: 'दूसरों के साथ मिलकर काम या परिवार का शेड्यूल कैसे जोड़ें?',
        recommendations: [
          {
            topicId: 'calendar-share-calendar',
            reason: 'Settings and sharing से टीम या परिवार को अपना कैलेंडर शेयर करें और परमिशन तय करें।'
          }
        ]
      },
      {
        id: 'invite-guests-need',
        problemText: 'मीटिंग में कई लोगों को एक साथ कैसे बुलाएँ और कौन आ रहा है कैसे जानें?',
        recommendations: [
          {
            topicId: 'calendar-invite-guests',
            reason: 'Add guests में ईमेल जोड़कर इनविटेशन भेजें और Yes/No/Maybe RSVP ट्रैक करें।'
          }
        ]
      },
      {
        id: 'google-meet-need',
        problemText: 'वीडियो कॉन्फ्रेंसिंग का लिंक तुरंत कैसे बनाएँ?',
        recommendations: [
          {
            topicId: 'calendar-google-meet',
            reason: 'Add Google Meet पर 1 क्लिक करके सुरक्षित एचडी वीडियो कॉल लिंक जोड़ें।'
          }
        ]
      },
      {
        id: 'appointment-schedule-need',
        problemText: 'क्लाइंट्स को अपॉइंटमेंट बुक करने के लिए अपना समय कैसे दें?',
        recommendations: [
          {
            topicId: 'calendar-appointment-schedule',
            reason: 'Appointment Schedule से अपना प्रोफेशनल बुकिंग पेज लिंक शेयर करें।'
          }
        ]
      }
    ]
  },
  {
    id: 'organization',
    title: 'व्यवस्थित रहें',
    subtitle: 'अलार्म vs कैलेंडर, कलर कोडिंग, अलग लेयर्स, छुट्टियाँ व टू-डू लिस्ट',
    iconName: 'Sliders',
    tag: 'Organization',
    color: 'rose',
    primaryTopicIds: ['calendar-alarm-vs-calendar', 'calendar-color-coding', 'calendar-multiple-calendars', 'calendar-tasks-in-calendar', 'calendar-public-holidays'],
    problems: [
      {
        id: 'alarm-confusion',
        problemText: 'अलार्म की जगह कैलेंडर कब और क्यों इस्तेमाल करना चाहिए?',
        recommendations: [
          {
            topicId: 'calendar-alarm-vs-calendar',
            reason: 'अलार्म के शोर और तनाव से बचें — भविष्य के कामों को कैलेंडर में संदर्भ के साथ जोड़ें।'
          }
        ]
      },
      {
        id: 'color-coding-need',
        problemText: 'सारे इवेंट एक ही रंग के होने से भ्रम कैसे दूर करें?',
        recommendations: [
          {
            topicId: 'calendar-color-coding',
            reason: 'ऑफिस, पर्सनल और जरूरी कामों के लिए 11 अलग-अलग रंगों का विज़ुअल सिस्टम बनाएँ।'
          }
        ]
      },
      {
        id: 'multiple-cal-layers',
        problemText: 'एक ही कैलेंडर में काम, परिवार और शौक की खिचड़ी कैसे रोकें?',
        recommendations: [
          {
            topicId: 'calendar-multiple-calendars',
            reason: 'अलग-अलग सेकेंडरी कैलेंडर बनाएँ और जब चाहें लेयर को छिपाएँ।'
          }
        ]
      },
      {
        id: 'tasks-checklist-need',
        problemText: 'टिक (✓) करने वाले दैनिक कामों और टू-डू लिस्ट को कैसे संभालें?',
        recommendations: [
          {
            topicId: 'calendar-tasks-in-calendar',
            reason: 'Google Tasks से चेकलिस्ट बनाएँ और काम होते ही मार्क कंप्लीट करें।'
          }
        ]
      },
      {
        id: 'public-holidays-need',
        problemText: 'त्योहार और सरकारी छुट्टियों की जानकारी कैलेंडर में कैसे देखें?',
        recommendations: [
          {
            topicId: 'calendar-public-holidays',
            reason: 'Holidays in India चालू करके पूरे साल की राष्ट्रीय व ऐच्छिक छुट्टियाँ देखें।'
          }
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'एडवांस सेटिंग्स',
    subtitle: 'सर्च, व्यूज़, बैकअप, प्रिंट, सेटिंग्स, टाइमज़ोन व ट्रैश रीस्टोर',
    iconName: 'Sliders',
    tag: 'Advanced Control',
    color: 'blue',
    primaryTopicIds: ['calendar-search-events', 'calendar-views-navigation', 'calendar-import-export', 'calendar-print-calendar', 'calendar-settings-preferences', 'calendar-time-zones', 'calendar-trash-restore'],
    problems: [
      {
        id: 'search-history',
        problemText: 'पुरानी मीटिंग या डॉक्टर विजिट किस तारीख को हुई थी, कैसे ढूँढें?',
        recommendations: [
          {
            topicId: 'calendar-search-events',
            reason: 'सर्च बार में नाम या कीवर्ड लिखकर 5 सेकंड में सालों पुराना रिकॉर्ड पाएँ।'
          }
        ]
      },
      {
        id: 'views-shortcuts-need',
        problemText: 'पूरे महीने या हफ्ते का शेड्यूल एक साथ तेजी से कैसे देखें?',
        recommendations: [
          {
            topicId: 'calendar-views-navigation',
            reason: 'D, W, M और Schedule View शॉर्टकट्स से तुरंत नज़र बदलें।'
          }
        ]
      },
      {
        id: 'backup-export-need',
        problemText: 'अपने पूरे कैलेंडर का सुरक्षित बैकअप कैसे लें?',
        recommendations: [
          {
            topicId: 'calendar-import-export',
            reason: 'Settings से .ics फ़ाइल एक्सपोर्ट करें और डेटा को हमेशा सुरक्षित रखें।'
          }
        ]
      },
      {
        id: 'print-calendar-need',
        problemText: 'दीवार, फ्रिज या डेस्क के लिए कैलेंडर का प्रिंटआउट कैसे निकालें?',
        recommendations: [
          {
            topicId: 'calendar-print-calendar',
            reason: 'Print विकल्प से साफ-सुथरा रंगीन या ब्लैक-एंड-व्हाइट प्रिंट / PDF पाएँ।'
          }
        ]
      },
      {
        id: 'general-settings-need',
        problemText: 'हफ्ता सोमवार से शुरू करना या डिफ़ॉल्ट 30 मिनट सेट करना कैसे करें?',
        recommendations: [
          {
            topicId: 'calendar-settings-preferences',
            reason: 'Start of week, duration और view ऑप्शंस अपनी पसंद के अनुसार ढालें।'
          }
        ]
      },
      {
        id: 'time-zones-need',
        problemText: 'विदेश में बैठे क्लाइंट्स के साथ टाइमज़ोन के भ्रम से कैसे बचें?',
        recommendations: [
          {
            topicId: 'calendar-time-zones',
            reason: 'Secondary Time Zone जोड़कर ग्रिड पर दोनों देशों का समय एक साथ देखें।'
          }
        ]
      },
      {
        id: 'trash-restore-need',
        problemText: 'गलती से कोई जरूरी मीटिंग या जन्मदिन डिलीट हो जाए तो क्या करें?',
        recommendations: [
          {
            topicId: 'calendar-trash-restore',
            reason: 'Trash (कचरा पेटी) से 30 दिन के अंदर 1-क्लिक में इवेंट रीस्टोर करें।'
          }
        ]
      }
    ]
  },
  {
    id: 'smart-habits',
    title: 'स्मार्ट आदतें',
    subtitle: 'काम के घंटे, Gmail से इवेंट्स, नोटिफिकेशन, ऑफलाइन सिंक व 20 नियम',
    iconName: 'Sparkles',
    tag: 'Smart Habits',
    color: 'purple',
    primaryTopicIds: ['calendar-working-hours', 'calendar-common-mistakes', 'calendar-events-from-gmail', 'calendar-notification-settings', 'calendar-offline-sync', 'calendar-smart-habits', 'calendar-mobile-vs-desktop'],
    problems: [
      {
        id: 'working-hours-need',
        problemText: 'बेवक्त मीटिंग रिक्वेस्ट से बचने और काम के घंटे तय करने का तरीका क्या है?',
        recommendations: [
          {
            topicId: 'calendar-working-hours',
            reason: 'Working Hours और Work Location सेट करके पर्सनल और प्रोफेशनल लाइफ में संतुलन बनाएँ।'
          }
        ]
      },
      {
        id: 'common-mistakes-need',
        problemText: 'कैलेंडर इस्तेमाल करते समय किन 10 बड़ी गलतियों से बचना चाहिए?',
        recommendations: [
          {
            topicId: 'calendar-common-mistakes',
            reason: 'अस्पष्ट शीर्षक, गलत AM/PM और बिना नोटिफिकेशन वाली 10 गलतियों के समाधान जानें।'
          }
        ]
      },
      {
        id: 'events-from-gmail-need',
        problemText: 'यात्रा टिकट, फ्लाइट और होटल बुकिंग अपने आप कैलेंडर में कैसे जोड़ें?',
        recommendations: [
          {
            topicId: 'calendar-events-from-gmail',
            reason: 'Events from Gmail चालू रखें ताकि टिकट ईमेल आते ही स्वतः एंट्री बन जाए।'
          }
        ]
      },
      {
        id: 'notification-settings-need',
        problemText: 'फोन में कैलेंडर अलर्ट समय पर न आने या बैटरी सेवर की समस्या कैसे सुलझाएँ?',
        recommendations: [
          {
            topicId: 'calendar-notification-settings',
            reason: 'बैटरी ऑप्टिमाइज़ेशन से छूट दें और रोज़ सुबह Daily Agenda ईमेल पाएँ।'
          }
        ]
      },
      {
        id: 'offline-access-need',
        problemText: 'फ्लाइट में या बिना इंटरनेट के कैलेंडर कैसे देखें और चलाएँ?',
        recommendations: [
          {
            topicId: 'calendar-offline-sync',
            reason: 'Chrome में Offline access ऑन करें और नेट आते ही ऑटोमैटिक सिंक पाएँ।'
          }
        ]
      },
      {
        id: 'smart-habits-need',
        problemText: 'समय प्रबंधन के पक्के और तनावमुक्त बनने के 20 स्वर्णिम नियम क्या हैं?',
        recommendations: [
          {
            topicId: 'calendar-smart-habits',
            reason: 'तुरंत दर्ज करना, बफर टाइम रखना और संडे नाइट रिव्यू की 20 आदतें अपनाएँ।'
          }
        ]
      },
      {
        id: 'mobile-vs-desktop-need',
        problemText: 'मोबाइल ऐप और डेस्कटॉप वेब में कौन-सा काम कहाँ सबसे बेहतर होता है?',
        recommendations: [
          {
            topicId: 'calendar-mobile-vs-desktop',
            reason: 'मोबाइल पर विजेट और रास्ते का नेविगेशन, कंप्यूटर पर बड़ी प्लानिंग और सेटिंग्स का उपयोग करें।'
          }
        ]
      }
    ]
  }
]
