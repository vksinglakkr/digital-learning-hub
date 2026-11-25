// 36 Gmail Topics mapped to 6 Everyday Needs
// Each topic has exactly 1 Primary Need.
// Everyday problems map to 1-3 best recommendations with short 1-sentence explanations.

export interface TopicRecommendation {
  topicId: string
  reason: string
}

export interface EverydayProblem {
  id: string
  problemText: string // e.g. "Inbox बहुत भर गई है, पुरानी Emails कैसे हटाएँ?"
  shortHint?: string
  recommendations: TopicRecommendation[]
}

export interface NeedCategory {
  id: string
  title: string
  iconName: string // 'Inbox' | 'Search' | 'Send' | 'Clock' | 'ShieldCheck' | 'Sliders'
  subtitle: string
  primaryTopicIds: string[]
  problems: EverydayProblem[]
}

export const GMAIL_NEEDS: NeedCategory[] = [
  {
    id: 'manage-inbox',
    title: 'Inbox सँभालें',
    iconName: 'Inbox',
    subtitle: 'Inbox को साफ, व्यवस्थित और हल्का रखें',
    primaryTopicIds: [
      'gmail-archive-email',
      'gmail-inbox-categories',
      'gmail-inbox-type',
      'gmail-multiple-inboxes',
      'gmail-filters',
      'gmail-storage',
      'gmail-mute-conversation',
      'gmail-swipe-actions'
    ],
    problems: [
      {
        id: 'inbox-clutter',
        problemText: 'Inbox बहुत भर गई है, समझ नहीं आ रहा क्या रखें और क्या हटाएँ?',
        recommendations: [
          {
            topicId: 'gmail-archive-email',
            reason: 'काम हो चुके Email को बिना Delete किए Archive करके Inbox एकदम साफ रखें।'
          },
          {
            topicId: 'gmail-swipe-actions',
            reason: 'मोबाइल पर केवल बाएँ या दाएँ स्वाइप करके Email को तुरंत Archive या Delete करें।'
          },
          {
            topicId: 'gmail-inbox-categories',
            reason: 'Primary, Social और Promotions के अलग-अलग टैब में Email बाँटें।'
          }
        ]
      },
      {
        id: 'storage-full',
        problemText: 'Storage Full का मैसेज आ रहा है, Space कैसे खाली करें?',
        recommendations: [
          {
            topicId: 'gmail-storage',
            reason: 'बड़ी फाइल्स और पुरानी Emails ढूँढकर 15 GB स्टोरेज सुरक्षित खाली करें।'
          },
          {
            topicId: 'gmail-archive-email',
            reason: 'समझें कि Archive और Delete में क्या अंतर है ताकि जरूरी ईमेल न मिटें।'
          }
        ]
      },
      {
        id: 'group-email-noise',
        problemText: 'ग्रुप ईमेल में बार-बार Reply All के फालतू मैसेज आ रहे हैं?',
        recommendations: [
          {
            topicId: 'gmail-mute-conversation',
            reason: 'उस ईमेल बातचीत को Mute कर दें ताकि नए रिप्लाई आपके इनबॉक्स में न आएँ।'
          },
          {
            topicId: 'gmail-filters',
            reason: 'फिल्टर बनाकर अनचाहे ग्रुप मैसेज को सीधे खास लेबल में भेजें।'
          }
        ]
      },
      {
        id: 'important-emails-top',
        problemText: 'जरूरी Emails खो जाती हैं, उन्हें हमेशा सबसे ऊपर कैसे रखें?',
        recommendations: [
          {
            topicId: 'gmail-inbox-type',
            reason: 'Important first या Starred first चुनकर जरूरी ईमेल को सबसे ऊपर रखें।'
          },
          {
            topicId: 'gmail-multiple-inboxes',
            reason: 'एक ही स्क्रीन पर कई अलग-अलग इनबॉक्स बनाकर जरूरी काम सामने रखें।'
          }
        ]
      }
    ]
  },
  {
    id: 'find-emails',
    title: 'Email ढूँढ़ें',
    iconName: 'Search',
    subtitle: 'पुरानी या खोई हुई Emails तुरंत खोजें',
    primaryTopicIds: [
      'gmail-search-operators',
      'gmail-email-summarize',
      'gmail-preview-pane',
      'gmail-conversation-view',
      'gmail-multiple-stars',
      'gmail-offline'
    ],
    problems: [
      {
        id: 'cant-find-old',
        problemText: 'पुरानी Email नहीं मिल रही, ढूँढ़ने में बहुत समय लगता है?',
        recommendations: [
          {
            topicId: 'gmail-search-operators',
            reason: 'from:, has:attachment, larger: जैसे जादुई शब्दों से 2 सेकंड में Email खोजें।'
          },
          {
            topicId: 'gmail-conversation-view',
            reason: 'एक ही विषय की पूरी बातचीत (Thread) को एक साथ एक जगह देखें।'
          }
        ]
      },
      {
        id: 'search-without-internet',
        problemText: 'इंटरनेट नहीं है, फिर भी पुरानी Emails देखनी और खोजनी हैं?',
        recommendations: [
          {
            topicId: 'gmail-offline',
            reason: 'कंप्यूटर पर Offline Gmail चालू करें और बिना इंटरनेट भी ईमेल पढ़ें व खोजें।'
          }
        ]
      },
      {
        id: 'color-flag',
        problemText: 'Email पर सिर्फ एक पीला स्टार काफी नहीं है, अलग रंग कैसे लगाएँ?',
        recommendations: [
          {
            topicId: 'gmail-multiple-stars',
            reason: 'लाल, हरा, नीला स्टार लगाकर अर्जेंट और पेन्डिंग काम अलग-अलग पहचानें।'
          }
        ]
      },
      {
        id: 'long-email-summary',
        problemText: 'लंबी Email पढ़ने का समय नहीं है, मुख्य बात कैसे समझें?',
        recommendations: [
          {
            topicId: 'gmail-email-summarize',
            reason: 'लंबे ईमेल का मुख्य सार (Summary) कुछ ही पलों में समझें।'
          },
          {
            topicId: 'gmail-preview-pane',
            reason: 'Split View से बिना बार-बार Back किए साइड में ईमेल तुरंत पढ़ें।'
          }
        ]
      }
    ]
  },
  {
    id: 'send-emails',
    title: 'Email भेजें',
    iconName: 'Send',
    subtitle: 'सही व्यक्ति को, सही समय पर और बड़ी फाइल्स भेजें',
    primaryTopicIds: [
      'gmail-schedule-send',
      'gmail-undo-send',
      'gmail-large-files-drive',
      'gmail-contact-labels',
      'gmail-forward-as-attachment',
      'gmail-alias'
    ],
    problems: [
      {
        id: 'sent-by-mistake',
        problemText: 'गलती से गलत Email या अधूरी Email Send हो गई, वापस कैसे लें?',
        recommendations: [
          {
            topicId: 'gmail-undo-send',
            reason: 'Send दबाने के बाद 30 सेकंड के अंदर ईमेल को तुरंत रोककर वापस लाएँ।'
          },
          {
            topicId: 'gmail-confidential-mode',
            reason: 'गोपनीय ईमेल का एक्सेस बाद में भी कभी भी बंद करें।'
          }
        ]
      },
      {
        id: 'send-later-time',
        problemText: 'रात को Email लिख रहा हूँ, लेकिन सुबह 9 बजे पहुँचना चाहिए?',
        recommendations: [
          {
            topicId: 'gmail-schedule-send',
            reason: 'तय तारीख और समय सेट करें, Gmail अपने-आप उस वक्त ईमेल भेज देगा।'
          }
        ]
      },
      {
        id: 'file-too-large',
        problemText: '25 MB से बड़ी Photo, Video या PDF फाइल नहीं जा रही?',
        recommendations: [
          {
            topicId: 'gmail-large-files-drive',
            reason: 'Google Drive लिंक के माध्यम से बड़ी से बड़ी फाइल आसानी से भेजें।'
          }
        ]
      },
      {
        id: 'group-message',
        problemText: '20-50 लोगों को एक साथ Email भेजना है, हर बार नाम टाइप न करना पड़े?',
        recommendations: [
          {
            topicId: 'gmail-contact-labels',
            reason: 'Contacts में Group Label बनाकर 1-क्लिक में पूरी टीम को ईमेल भेजें।'
          },
          {
            topicId: 'gmail-forward-as-attachment',
            reason: 'कई पुरानी Emails को एक साथ .eml फाइल अटैचमेंट बनाकर भेजें।'
          }
        ]
      }
    ]
  },
  {
    id: 'save-time',
    title: 'समय बचाएँ',
    iconName: 'Clock',
    subtitle: 'रोज़ाना ईमेल का काम आधे समय में पूरा करें',
    primaryTopicIds: [
      'gmail-templates',
      'gmail-smart-reply-smart-compose',
      'gmail-send-and-archive',
      'gmail-keyboard-shortcuts',
      'gmail-snooze-email',
      'gmail-nudges'
    ],
    problems: [
      {
        id: 'repeated-typing',
        problemText: 'एक ही जैसा उत्तर बार-बार टाइप करना पड़ता है?',
        recommendations: [
          {
            topicId: 'gmail-templates',
            reason: 'तैयार उत्तर को Template बनाकर सेव करें और 1-क्लिक में Insert करें।'
          },
          {
            topicId: 'gmail-smart-reply-smart-compose',
            reason: 'Smart Reply और Tab बटन से वाक्य अपने-आप पूरे करके तेज टाइप करें।'
          }
        ]
      },
      {
        id: 'reply-and-clear',
        problemText: 'रिप्लाई देने के बाद Email को अलग से हटाने का समय नहीं है?',
        recommendations: [
          {
            topicId: 'gmail-send-and-archive',
            reason: '1-क्लिक में उत्तर भी भेजें और बातचीत को इनबॉक्स से आर्काइव भी करें।'
          }
        ]
      },
      {
        id: 'forget-reply',
        problemText: 'काम के चक्कर में जरूरी Email का जवाब देना भूल जाते हैं?',
        recommendations: [
          {
            topicId: 'gmail-nudges',
            reason: 'Gmail AI आपको पुरानी बिना जवाब वाली ईमेल याद दिलाएगा।'
          },
          {
            topicId: 'gmail-snooze-email',
            reason: 'ईमेल को Snooze करें ताकि वह सही समय पर दोबारा इनबॉक्स में सामने आए।'
          }
        ]
      },
      {
        id: 'mouse-slow',
        problemText: 'माउस चलाए बिना कीबोर्ड से बहुत तेजी से Gmail चलाना चाहते हैं?',
        recommendations: [
          {
            topicId: 'gmail-keyboard-shortcuts',
            reason: 'C, R, E, # जैसे शॉर्टकट्स से बिना माउस छुए रॉकेट स्पीड से काम करें।'
          }
        ]
      }
    ]
  },
  {
    id: 'stay-safe',
    title: 'सुरक्षित रहें',
    iconName: 'ShieldCheck',
    subtitle: 'स्पैम, फ्रॉड और पासवर्ड लीक से सुरक्षा',
    primaryTopicIds: [
      'gmail-confidential-mode',
      'gmail-block-spam-phishing',
      'gmail-delegation',
      'gmail-email-suggestions-contacts'
    ],
    problems: [
      {
        id: 'confidential-passcode',
        problemText: 'कोई गोपनीय दस्तावेज भेजना है, कोई दूसरा व्यक्ति न पढ़ सके?',
        recommendations: [
          {
            topicId: 'gmail-confidential-mode',
            reason: 'SMS Passcode और Expiry Date लगाएँ; सामने वाला न कॉपी कर सकेगा न फॉरवर्ड।'
          }
        ]
      },
      {
        id: 'spam-phishing',
        problemText: 'फर्जी लॉटरी, बैंक फ्रॉड या अनचाहे स्पैम ईमेल से परेशान हैं?',
        recommendations: [
          {
            topicId: 'gmail-block-spam-phishing',
            reason: 'Block, Report Spam और Report Phishing का सही इस्तेमाल करके सुरक्षित रहें।'
          },
          {
            topicId: 'gmail-alias',
            reason: 'अलग साइट्स पर +tag वाला ईमेल दें ताकि पता चले किसने डेटा लीक किया।'
          }
        ]
      },
      {
        id: 'give-access-no-password',
        problemText: 'सहायक को ईमेल काम देना है, लेकिन पासवर्ड नहीं बताना चाहते?',
        recommendations: [
          {
            topicId: 'gmail-delegation',
            reason: 'पासवर्ड बताए बिना किसी अन्य व्यक्ति को सुरक्षित ईमेल एक्सेस दें।'
          }
        ]
      },
      {
        id: 'wrong-recipient-suggestion',
        problemText: 'गलत व्यक्ति को ईमेल जाने का डर है क्योंकि पुराने नाम सजेस्ट होते हैं?',
        recommendations: [
          {
            topicId: 'gmail-email-suggestions-contacts',
            reason: 'Contacts में पुराने गलत सुझाव हटाएँ और सही पते सुरक्षित रखें।'
          }
        ]
      }
    ]
  },
  {
    id: 'customize-settings',
    title: 'अपनी पसंद से सेट करें',
    iconName: 'Sliders',
    subtitle: 'Gmail को अपनी सुविधा और भाषा के अनुसार बदलें',
    primaryTopicIds: [
      'gmail-translate',
      'gmail-inbox-density',
      'gmail-signature',
      'gmail-vacation-responder',
      'gmail-add-to-tasks',
      'gmail-mobile-vs-desktop'
    ],
    problems: [
      {
        id: 'english-language-barrier',
        problemText: 'अंग्रेजी में आई Email समझ नहीं आ रही, हिंदी में कैसे पढ़ें?',
        recommendations: [
          {
            topicId: 'gmail-translate',
            reason: '1-क्लिक में किसी भी भाषा की Email का हिंदी अनुवाद पढ़ें।'
          }
        ]
      },
      {
        id: 'email-to-task',
        problemText: 'Email में कोई जरूरी काम आया है, उसकी लिस्ट और तारीख कैसे बनाएँ?',
        recommendations: [
          {
            topicId: 'gmail-add-to-tasks',
            reason: 'ईमेल से सीधे Google Task बनाएँ, Due Date सेट करें और समय पर पूरा करें।'
          }
        ]
      },
      {
        id: 'professional-signature',
        problemText: 'हर Email में अपना नाम, पद और फोन नंबर बार-बार लिखना पड़ता है?',
        recommendations: [
          {
            topicId: 'gmail-signature',
            reason: 'एक बार Signature सेट करें, हर नई ईमेल में अपने-आप जुड़ जाएगा।'
          }
        ]
      },
      {
        id: 'out-of-office',
        problemText: 'छुट्टी पर जा रहे हैं, पीछे से आने वाली Emails का अपने-आप जवाब कैसे जाए?',
        recommendations: [
          {
            topicId: 'gmail-vacation-responder',
            reason: 'Vacation Responder से गैर-हाजिरी का ऑटोमैटिक रिप्लाई सेट करें।'
          }
        ]
      },
      {
        id: 'screen-look-and-app',
        problemText: 'स्क्रीन पर ईमेल बहुत घनी या फैली दिखती हैं, या मोबाइल व कंप्यूटर का फर्क समझना है?',
        recommendations: [
          {
            topicId: 'gmail-inbox-density',
            reason: 'Default, Comfortable या Compact चुनकर इनबॉक्स का लेआउट बदलें।'
          },
          {
            topicId: 'gmail-mobile-vs-desktop',
            reason: 'जानें कौन से फीचर्स मोबाइल में मिलते हैं और किनके लिए कंप्यूटर जरूरी है।'
          }
        ]
      }
    ]
  }
]
