import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ResourceDemoModal } from '../components/ResourceDemoModal'
import { NoticeModal } from '../components/NoticeModal'
import { usePublicCurriculum } from '../context/PublicCurriculumContext'
import { CurriculumLoadingState } from '../components/common/CurriculumLoadingState'
import { CurriculumErrorState } from '../components/common/CurriculumErrorState'
import type { AdminResourceType, TopicResource, TopicPresentationStyle } from '../types'
import { 
  ArrowLeft, 
  ArrowRight,
  PlayCircle, 
  Video as VideoIcon,
  Image as ImageIcon, 
  FileText, 
  BookOpen, 
  Globe,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Milestone,
  User,
  Scissors,
  Gamepad2,
  CheckCircle2,
  Award,
  ListOrdered,
  Briefcase,
  LayoutGrid
} from 'lucide-react'
import { getTopicTutorial, buildTutorialUrl } from '../config/topicTutorials'
import { formatSecondsToTime, formatClipDuration } from '../utils/timeFormat'
import { extractYouTubeVideoId } from '../utils/youtubeEmbed'

type ResourceTabKey = 'All' | 'Infographics' | 'Videos' | 'PDFs' | 'Tutorials' | 'External Links'

const PRESENTATION_CONFIG: Record<TopicPresentationStyle, { title: string; badge: string; icon: any }> = {
  'gallery': { title: 'Resource Gallery', badge: 'Gallery View', icon: LayoutGrid },
  'guided-sequence': { title: 'Guided Learning Sequence', badge: 'Step-by-Step', icon: ListOrdered },
  'situation-based': { title: 'Situation-Based Tutorial', badge: 'Problem & Solution', icon: Briefcase },
  'masterclass': { title: 'Interactive Masterclass', badge: 'Masterclass', icon: Sparkles },
  'custom-mixed': { title: 'Custom / Mixed Layout', badge: 'Hybrid View', icon: Layers },
}

interface GmailTopicMetadata {
  day: string
  infographics: number
  whatYouWillLearn: string[]
  practiceTask: string
}

const GMAIL_TOPIC_METADATA: Record<string, GmailTopicMetadata> = {
  'gmail-translate': {
    day: 'Day 01',
    infographics: 2,
    whatYouWillLearn: [
      'कठिन या अंग्रेज़ी भाषा के ईमेल को समझना',
      'Gmail के 3 डॉट्स (⋮) मेनू से Translate विकल्प चुनना',
      'अपनी पसंदीदा भाषा (जैसे Hindi) में तुरंत अनुवाद पाना',
    ],
    practiceTask: 'अपने Gmail इनबॉक्स से कोई भी अंग्रेज़ी ईमेल खोलें और Translate फीचर से उसका हिंदी अनुवाद देखें।',
  },
  'gmail-inbox-categories': {
    day: 'Day 05',
    infographics: 4,
    whatYouWillLearn: [
      'Primary, Updates, Promotions, Social व Forums श्रेणियों की भूमिका',
      'बैंक अलर्ट व जरूरी ईमेल्स Updates टैब में क्यों जाते हैं समझना',
      'Gmail Settings से कौन-से Category Tabs दिखें यह कस्टमाइज़ करना',
    ],
    practiceTask: 'Gmail Settings में जाकर केवल यह जाँचें कि आपके इनबॉक्स में कौन-से Category Tabs चालू हैं।',
  },
  'gmail-search-operators': {
    day: 'Day 08',
    infographics: 3,
    whatYouWillLearn: [
      'has:attachment से केवल फाइलों व PDFs वाले ईमेल खोजना',
      'from: कमांड से किसी खास प्रेषक (Sender) के ईमेल फ़िल्टर करना',
      'older_than:3m और संयुक्त सर्च से पुराने ईमेल 10 सेकंड में पाना',
    ],
    practiceTask: 'Gmail के सर्च बॉक्स में has:attachment और older_than:3m सर्च ऑपरेटर्स चलाकर देखें।',
  },
  'gmail-schedule-send': {
    day: 'Day 12',
    infographics: 2,
    whatYouWillLearn: [
      'ईमेल अभी लिखकर भविष्य के तय समय पर स्वचालित भेजना',
      'Send बटन के पास बने छोटे तीर (▼) से Schedule Send चुनना',
      'Scheduled फ़ोल्डर में जाकर समय जाँचना, बदलना या ईमेल रद्द करना',
    ],
    practiceTask: 'अपने Gmail से एक Test Email अगले दिन सुबह 8 बजे के लिए Schedule करें और Scheduled फ़ोल्डर में जाँचें।',
  },
  'gmail-email-summarize': {
    day: 'Day 02',
    infographics: 2,
    whatYouWillLearn: [
      'लंबे Email या Group Conversation पर अपने-आप दिखने वाले Summarize फीचर को समझना',
      'Summarize बटन न दिखने पर Gemini ✦ से सारांश लेना (अकाउंट व फीचर एक्सेस के अनुसार)',
      'एक ही विषय के Emails को साथ देखने के लिए Conversation view को ON करना',
    ],
    practiceTask: 'अपने Gmail इनबॉक्स में कोई लंबा Email खोलें और Summarize या Gemini ✦ विकल्प से उसका सारांश देखें।',
  },
  'gmail-preview-pane': {
    day: 'Day 03',
    infographics: 2,
    whatYouWillLearn: [
      'Desktop (Web) Gmail में बिना हर बार Back किए Inbox से ही Email पढ़ना',
      'Toolbar आइकन, Quick Settings या General Settings से Reading Pane चालू करना',
      'Mark as read after सेटिंग से 5s, 10s या Never विकल्प चुनना',
    ],
    practiceTask: 'कंप्यूटर के ब्राउज़र में Gmail खोलकर Reading pane में Right of inbox चुनें और सीधे Inbox से Email पढ़कर देखें।',
  },
  'gmail-inbox-density': {
    day: 'Day 04',
    infographics: 2,
    whatYouWillLearn: [
      'Inbox में Email खोले बिना Sender, Subject और Attachment आइकन साफ देखना',
      'Mobile App और Desktop Settings में Density (Default, Comfortable, Compact) बदलना',
      'अपनी सुविधा के अनुसार सबसे उपयोगी View (जैसे Comfortable) चुनना',
    ],
    practiceTask: 'अपने Mobile App या Desktop Gmail में Density को Default से Comfortable और Compact में बदलकर देखें।',
  },
  'gmail-inbox-type': {
    day: 'Day 06',
    infographics: 2,
    whatYouWillLearn: [
      '⭐ Star (आपकी व्यक्तिगत पसंद) और ❗ Important (Email की अहमियत) के बीच का अंतर समझना',
      'जरूरत के अनुसार एक ही Email पर Star और Important दोनों का साथ उपयोग करना',
      'Settings → Inbox type से Starred first या Important first चुनकर जरूरी Emails ऊपर रखना',
    ],
    practiceTask: 'अपने Gmail में किसी जरूरी Email पर ⭐ Star लगाएँ और Settings में Inbox type बदलकर उसका क्रम देखें।',
  },
  'gmail-multiple-inboxes': {
    day: 'Day 07',
    infographics: 2,
    whatYouWillLearn: [
      'Desktop (Web) Gmail की Settings → Inbox से Multiple Inboxes चालू करना',
      'Starred (is:starred), Drafts (is:draft) और Important (is:important) जैसे पैनल एक स्क्रीन पर देखना',
      'अधूरी Draft Emails को समय पर याद रखकर भेजना और जरूरी काम व्यवस्थित रखना',
    ],
    practiceTask: 'Desktop (Web) Gmail की Inbox Settings में Multiple Inboxes खोलकर is:draft व is:starred सेक्शन जाँचें।',
  },
  'gmail-filters': {
    day: 'Day 09',
    infographics: 3,
    whatYouWillLearn: [
      'Search (बाद में ढूँढना) और Filter (नई Email आते ही अपने-आप व्यवस्थित करना) का अंतर समझना',
      'Desktop (Web) Gmail में Filter आइकन या ⋮ → Filter messages like these से Label लगाना',
      'Filter बनाते समय Delete it और Skip the Inbox विकल्पों का उपयोग सावधानी से करना',
    ],
    practiceTask: 'Desktop Gmail में किसी नियमित बिल/स्टेटमेंट Email पर ⋮ → Filter messages like these खोलकर Apply the label विकल्प देखें।',
  },
  'gmail-block-spam-phishing': {
    day: 'Day 10',
    infographics: 2,
    whatYouWillLearn: [
      'Block (Sender रोकना), Report Spam (Junk/Ads) और Report Phishing (धोखाधड़ी) का अंतर समझना',
      'संदिग्ध Email के किसी भी लिंक, बटन या Attachment को कभी न खोलने का नियम अपनाना',
      'Email के तीन डॉट्स (⋮) मेनू में इन तीनों सुरक्षा विकल्पों की सही जगह पहचानना',
    ],
    practiceTask: 'किसी पुरानी Promotional Email के ⋮ (Three Dots) मेनू में Block, Report spam और Report phishing विकल्पों की स्थिति देखें।',
  },
  'gmail-snooze-email': {
    day: 'Day 11',
    infographics: 2,
    whatYouWillLearn: [
      'जरूरी Email को Inbox में दबाने के बजाय Snooze करके तय समय पर वापस ऊपर लाना',
      'Desktop (🕒 Clock आइकन या ⋮ → Snooze) और Mobile App (⋮ → Snooze) से समय चुनना',
      'Snooze की गई Emails को बाएँ मेनू के Snoozed फ़ोल्डर में देखना (Email Delete नहीं होती)',
    ],
    practiceTask: 'अपने Gmail में किसी Test या कम-जरूरी Email को Tomorrow के लिए Snooze करें और Snoozed फ़ोल्डर में जाँचें।',
  },
  'gmail-confidential-mode': {
    day: 'Day 13',
    infographics: 2,
    whatYouWillLearn: [
      'Compose में 🔒 Confidential mode से Expiry Time व Passcode सेट करना',
      'Sent फ़ोल्डर से Remove access क्लिक करके समय से पहले एक्सेस वापस लेना',
      'सुरक्षा सीमा: Screenshot/फोटो नहीं रुकता और Workspace खातों में Admin नियंत्रण संभव है',
    ],
    practiceTask: 'अपने ही Email पते पर बिना संवेदनशील जानकारी के एक Test Email में 1 day Expiry सेट करके Sent में Remove access देखें।',
  },
  'gmail-undo-send': {
    day: 'Day 14',
    infographics: 2,
    whatYouWillLearn: [
      'Send दबाने के तुरंत बाद दिखने वाले Undo बटन से Email वापस Draft में लाना',
      'Desktop Settings → General → Undo Send से 5 से 30 सेकंड का समय चुनना',
      'समझना कि यह कुछ सेकंड की रोक (Delay) है, डिलीवर हो चुकी Email का Recall नहीं',
    ],
    practiceTask: 'Desktop Settings में Undo Send समय (10s) जाँचें और स्वयं को Test Email भेजकर तुरंत Undo पर क्लिक करें।',
  },
  'gmail-archive-email': {
    day: 'Day 15',
    infographics: 2,
    whatYouWillLearn: [
      'Archive (सुरक्षित सहेजना) और Delete (Bin/Trash) के बीच का अंतर समझना',
      'Mobile App में गलती से Swipe होने पर हुई Archive को पहचानना',
      'More → All Mail या Search से Email ढूँढकर Move to Inbox से वापस लाना',
    ],
    practiceTask: 'किसी एक पढ़ी हुई सामान्य Email को Archive करें, फिर More → All Mail से ढूँढकर Move to Inbox द्वारा वापस लाएँ।',
  },
  'gmail-email-suggestions-contacts': {
    day: 'Day 16',
    infographics: 2,
    whatYouWillLearn: [
      'Gmail के Auto-complete Suggestions और आपके Google Contacts का अंतर समझना',
      'contacts.google.com में जरूरी संपर्कों को सही नाम व Email के साथ सेव करना',
      'आधुनिक Gmail में Other contacts / Contacts से अनचाहे सुझाव सुरक्षित रूप से हटाना',
    ],
    practiceTask: 'contacts.google.com में किसी नियमित संपर्क का नाम व Email जाँचें और Compose में To टाइप करके Suggestions देखें।',
  },
  'gmail-conversation-view': {
    day: 'Day 17',
    infographics: 2,
    whatYouWillLearn: [
      'Conversation View (एक ही विषय के सभी Replies को एक Thread में जोड़ना) का सही काम समझना',
      'Settings → General → Conversation view (या Mobile App General settings) से इसे ON या OFF करना',
      'Thread में Down/Up Arrow से पूरी बातचीत Expand/Collapse करना (सावधानी: Archive/Delete पूरी Thread पर लागू होते हैं)',
    ],
    practiceTask: 'Inbox में किसी multi-reply Conversation को खोलकर Expand/Collapse करें और General Settings में Conversation view विकल्प देखें।',
  },
  'gmail-add-to-tasks': {
    day: 'Day 18',
    infographics: 2,
    whatYouWillLearn: [
      'Email खोलकर ⋮ (Three Dots) → Add to Tasks से तुरंत काम (Task) और Related email लिंक जोड़ना',
      'Task में Due Date, Notes और Subtasks जोड़ना तथा Gmail Side Panel, tasks.google.com या Tasks App में देखना',
      'सही चुनाव: Snooze (Email बाद में देखना), Tasks (काम पूरा करना), Keep (Notes), Calendar (Meeting/Event)',
    ],
    practiceTask: 'किसी सामान्य Email पर ⋮ → Add to Tasks दबाकर कल की Due Date सेट करें और फिर Test Task को Mark complete करें।',
  },
  'gmail-signature': {
    day: 'Day 19',
    infographics: 2,
    whatYouWillLearn: [
      'Desktop (Web) Gmail में Settings → See all settings → General → Signature → + Create new से Signature बनाना',
      'Official, Personal और Short जैसे एक से अधिक Signatures बनाकर Compose में Pen (✒️) आइकन से बदलना',
      'प्लेटफ़ॉर्म अंतर समझना: Rich HTML और Multiple Signatures Desktop पर बनते हैं; Mobile App में अलग Mobile Signature सेटिंग होती है',
    ],
    practiceTask: 'Desktop Gmail की General Settings में एक संक्षिप्त Signature बनाएँ और Compose खोलकर उसकी जाँच करें।',
  },
  'gmail-templates': {
    day: 'Day 20',
    infographics: 2,
    whatYouWillLearn: [
      'Desktop (Web) Gmail में पहले Settings → See all settings → Advanced → Templates: Enable करके Save Changes करना',
      'Compose के ⋮ (More options) → Templates → Save draft as template से बार-बार उपयोग होने वाली Email सेव करना',
      'नई Email में ⋮ → Templates → Insert template से संदेश डालना (यह सुविधा केवल Desktop/Web Gmail में उपलब्ध है)',
    ],
    practiceTask: 'Desktop Gmail में Templates Enable करके एक छोटा Test Template सेव करें और नए Compose में Insert करके देखें।',
  },
  'gmail-vacation-responder': {
    day: 'Day 21',
    infographics: 2,
    whatYouWillLearn: [
      'Settings → See all settings → General (नीचे स्क्रॉल करें) से Vacation responder on करके First day व Last day सेट करना',
      'स्पष्ट Subject व Auto Reply Message लिखकर Save Changes करना (Mobile App में भी Settings → Account में उपलब्ध)',
      'निजता के लिए "Only send a reply to my Contacts" समझना (Spam व Mailing Lists को Auto Reply नहीं जाती)',
    ],
    practiceTask: 'Gmail Settings में Vacation responder विकल्प खोलकर तारीख व "Only send a reply to my Contacts" विकल्प देखें (छुट्टी न होने पर OFF रखें)।',
  },
  'gmail-storage': {
    day: 'Day 22',
    infographics: 2,
    whatYouWillLearn: [
      'यह समझना कि 15 GB Free Storage Gmail, Google Photos और Google Drive तीनों के बीच Share होती है',
      'one.google.com/storage, Google Drive या Gmail Settings → Accounts and Import से Storage उपयोग जाँचना',
      'has:attachment larger:10M से बड़ी Emails ढूँढना और ध्यान से जाँचने के बाद Trash/Spam खाली करना (सावधानी: Trash खाली करने पर डेटा स्थायी रूप से हट जाता है)',
    ],
    practiceTask: 'one.google.com/storage पर अपनी Storage स्थिति देखें और Gmail में has:attachment larger:10M सर्च चलाकर बड़ी Attachments देखें।',
  },
  'gmail-large-files-drive': {
    day: 'Day 23',
    infographics: 2,
    whatYouWillLearn: [
      'Gmail की 25 MB Attachment सीमा समझने के बाद Compose में Google Drive (▲) आइकन से बड़ी फाइलें Insert करना',
      'My Drive, Shared with me या Recent से फाइल चुनकर Drive Link के रूप में Email में जोड़ना',
      'सुरक्षा व Storage नियम: भेजने से पहले Access (Restricted / Anyone with the link) सही चुनना और ध्यान रखना कि फाइल आपके Google Storage में रहती है',
    ],
    practiceTask: 'Gmail Compose में Google Drive (▲) आइकन से अपनी एक सामान्य फाइल Drive link के रूप में Insert करके देखें (बिना Send किए)।',
  },
  'gmail-contact-labels': {
    day: 'Day 24',
    infographics: 2,
    whatYouWillLearn: [
      'Google Contacts (contacts.google.com) में "+ Create label" से Group Label बनाना और Members जोड़ना',
      'Gmail Compose में Label का नाम टाइप करके 1-Click में सभी Members को जोड़ना',
      'निजता सुझाव: बाहरी या बड़े Group को Email भेजते समय अन्य लोगों के पते छिपाने के लिए To के बजाय Bcc का उपयोग करना',
    ],
    practiceTask: 'contacts.google.com में एक Test Label बनाकर 1-2 संपर्क जोड़ें और Gmail Compose में उसका नाम टाइप करके देखें।',
  },
  'gmail-mute-conversation': {
    day: 'Day 25',
    infographics: 2,
    whatYouWillLearn: [
      'किसी Group Email Thread को खोलकर ⋮ (Three Dots) → Mute से अनावश्यक Replies को Inbox में आने से रोकना',
      'अंतर समझना: Mute केवल उस विशेष Thread पर लागू होता है, Sender की नई अलग Emails सामान्य रूप से Inbox में आती रहेंगी',
      'Mute की गई Thread को All Mail या Search से ढूँढना और जरूरत पड़ने पर ⋮ → Unmute करना',
    ],
    practiceTask: 'किसी पुरानी Email को ⋮ → Mute करके देखें, फिर More → All Mail से उसे खोजकर वापस Unmute करें।',
  },
  'gmail-mobile-vs-desktop': {
    day: 'Day 26',
    infographics: 2,
    whatYouWillLearn: [
      'Mobile App व Desktop दोनों में मिलने वाले फीचर्स (Read/Send, Star, Mute, Snooze, Schedule Send, Confidential Mode) पहचानना',
      'केवल Desktop/Web Gmail में मिलने वाले एडवांस फीचर्स (Templates, Filters, Multiple Signatures, Full Settings) को समझना',
      'सही रणनीति: चलते-फिरते काम के लिए Mobile App और सेटिंग्स/नियंत्रण के लिए Desktop/Web Gmail का उपयोग करना',
    ],
    practiceTask: 'Mobile Gmail App और Desktop Web Gmail की Settings खोलकर दोनों में उपलब्ध विकल्पों की तुलना करें।',
  },
}

export const TopicDetailPage: React.FC = () => {
  const { categorySlug, topicSlug } = useParams<{ categorySlug: string; topicSlug: string }>()
  const navigate = useNavigate()
  const { categories, topics: allTopics, isLoading, error, retry } = usePublicCurriculum()

  const [activeTab, setActiveTab] = useState<ResourceTabKey>('All')
  const [selectedDemoResource, setSelectedDemoResource] = useState<TopicResource | null>(null)
  
  const [noticeModalState, setNoticeModalState] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: '',
  })

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  )

  const topic = allTopics.find(
    (t) => (t.categoryId === category?.id) && (t.slug === topicSlug || t.id === topicSlug)
  )

  const handleNotifyComingSoon = (featureName: string) => {
    setNoticeModalState({
      isOpen: true,
      title: featureName,
      message: `The "${featureName}" feature is currently in prototype mode. Data will be fully searchable when backend indexing is connected.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumLoadingState />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <CurriculumErrorState error={error} onRetry={retry} />
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  if (!category || !topic) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
        <Header onNotifyComingSoon={handleNotifyComingSoon} />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Topic Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">
            The topic requested could not be located in this category.
          </p>
          <Link
            to={category ? `/category/${category.slug}` : '/'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{category ? `Back to ${category.title}` : 'Return to Home'}</span>
          </Link>
        </div>
        <Footer onNotifyComingSoon={handleNotifyComingSoon} />
      </div>
    )
  }

  // Filter public visible resources: ONLY 'Published' resources (Draft and Hidden are strictly excluded)
  const visibleResources = topic.resources
    .filter((r) => r.status === 'Published')
    .sort((a, b) => a.displayOrder - b.displayOrder)

  // Check if topic has a registered dedicated interactive tutorial (e.g. Power BI Bookmarks)
  const tutorial = getTopicTutorial(topic.id)

  // Determine active presentation style (default to situation-based for gmail, masterclass if tutorial registered and not gmail, otherwise gallery)
  const isGmailCategory = category?.id === 'gmail'
  const gmailMeta = isGmailCategory ? GMAIL_TOPIC_METADATA[topic.id] : undefined

  const presentationStyle: TopicPresentationStyle =
    topic.presentationStyle || (isGmailCategory ? 'situation-based' : (tutorial ? 'masterclass' : 'gallery'))

  // Count resources by format
  const videoCount = visibleResources.filter((r) => r.type === 'YouTube Video' || r.type === 'Facebook Video' || (r.type as any) === 'Video').length
  const infoCount = visibleResources.filter((r) => r.type === 'Infographic').length
  const pdfCount = visibleResources.filter((r) => r.type === 'PDF').length
  const tutCount = visibleResources.filter((r) => r.type === 'Tutorial').length
  const linkCount = visibleResources.filter((r) => r.type === 'External Link').length

  const tabs: Array<{ key: ResourceTabKey; label: string; count: number }> = [
    { key: 'All', label: 'All Resources', count: visibleResources.length },
    { key: 'Infographics', label: 'Infographics', count: infoCount },
    { key: 'Videos', label: 'Videos', count: videoCount },
    { key: 'PDFs', label: 'PDFs', count: pdfCount },
    { key: 'Tutorials', label: 'Tutorials', count: tutCount },
    ...(linkCount > 0 ? [{ key: 'External Links' as ResourceTabKey, label: 'External Links', count: linkCount }] : []),
  ]

  // Filter resources based on active tab
  const filteredResources = visibleResources
    .filter((r) => {
      if (activeTab === 'All') return true
      if (activeTab === 'Infographics') return r.type === 'Infographic'
      if (activeTab === 'Videos') return r.type === 'YouTube Video' || r.type === 'Facebook Video' || (r.type as any) === 'Video'
      if (activeTab === 'PDFs') return r.type === 'PDF'
      if (activeTab === 'Tutorials') return r.type === 'Tutorial'
      if (activeTab === 'External Links') return r.type === 'External Link'
      return true
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)

  // Find related topics objects
  const relatedTopics = allTopics.filter((t) => (topic.relatedTopicIds || []).includes(t.id))

  const getTypeIcon = (type: AdminResourceType | string) => {
    switch (type) {
      case 'YouTube Video':
      case 'Video':
        return <PlayCircle className="w-4 h-4 text-rose-600" />
      case 'Facebook Video':
        return <VideoIcon className="w-4 h-4 text-blue-600" />
      case 'Infographic':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />
      case 'PDF':
        return <FileText className="w-4 h-4 text-amber-600" />
      case 'Tutorial':
        return <BookOpen className="w-4 h-4 text-indigo-600" />
      case 'External Link':
        return <Globe className="w-4 h-4 text-teal-600" />
      default:
        return <Globe className="w-4 h-4 text-teal-600" />
    }
  }

  const getTypeBadgeStyle = (type: AdminResourceType | string) => {
    switch (type) {
      case 'YouTube Video':
      case 'Video':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'Facebook Video':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Infographic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'PDF':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Tutorial':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'External Link':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const renderResourceCard = (resource: TopicResource) => (
    <div
      key={resource.id}
      className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${getTypeBadgeStyle(resource.type)}`}>
            {getTypeIcon(resource.type)}
            <span>{resource.type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              resource.url.startsWith('demo://') 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {resource.url.startsWith('demo://') ? 'DEMO' : 'VERIFIED'}
            </span>
            <span className="text-[11px] font-mono text-slate-600 font-semibold">
              #{resource.displayOrder}
            </span>
          </div>
        </div>

        {/* Video or Image Thumbnail if present */}
        {(resource.thumbnailUrl || (resource.type === 'Infographic' && (resource.directContentUrl || resource.url))) && (
          <div 
            onClick={() => setSelectedDemoResource(resource)}
            className="cursor-pointer relative aspect-video w-full rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-950 group"
          >
            <img
              src={resource.thumbnailUrl || resource.directContentUrl || resource.url}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-slate-900/25 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
              <div className="p-2 rounded-full bg-slate-900/80 text-white shadow-md group-hover:scale-110 transition-transform">
                {getTypeIcon(resource.type)}
              </div>
            </div>
          </div>
        )}

        {/* Resource Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1.5">
          {resource.title}
        </h3>

        {/* Creator attribution if video */}
        {resource.creatorName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>By {resource.creatorName}</span>
          </div>
        )}

        {/* Clip indicator if start/end times exist */}
        {((resource.startSeconds != null && resource.startSeconds > 0) || (resource.endSeconds != null && resource.endSeconds > 0)) && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <Scissors className="w-3 h-3 text-rose-600 shrink-0" />
            <span>
              Clip: {resource.startTime || formatSecondsToTime(resource.startSeconds)} – {resource.endTime || (resource.endSeconds ? formatSecondsToTime(resource.endSeconds) : 'End')}
              {formatClipDuration(resource.startSeconds, resource.endSeconds) && ` (${formatClipDuration(resource.startSeconds, resource.endSeconds)})`}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {resource.description || 'Comprehensive learning material tailored for this topic.'}
        </p>
      </div>

      {/* Metadata & Open Action */}
      <div className="pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.durationOrPages || 'Guide'}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-600">
            {resource.difficulty || 'All Levels'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDemoResource(resource)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <span>Open Resource</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {(resource.type === 'YouTube Video' || resource.type === 'Facebook Video' || (resource.type as string) === 'Video') && (
            <a
              href={
                resource.url.startsWith('demo://')
                  ? '#'
                  : (extractYouTubeVideoId(resource.url) && resource.startSeconds && resource.startSeconds > 0)
                    ? `https://www.youtube.com/watch?v=${extractYouTubeVideoId(resource.url)}&t=${Math.floor(resource.startSeconds)}s`
                    : resource.url
              }
              target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
              rel="noreferrer"
              onClick={(e) => {
                if (resource.url.startsWith('demo://')) {
                  e.preventDefault()
                  setSelectedDemoResource(resource)
                }
              }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center"
              title="Watch on Original Platform"
              aria-label="Watch on Original Platform"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {resource.type === 'Tutorial' && (
            <a
              href={resource.url.startsWith('http') || resource.url.startsWith('demo://') ? resource.url : buildTutorialUrl(resource.url)}
              target={resource.url.startsWith('demo://') ? '_self' : '_blank'}
              rel="noreferrer"
              onClick={(e) => {
                if (resource.url.startsWith('demo://')) {
                  e.preventDefault()
                  setSelectedDemoResource(resource)
                }
              }}
              className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors flex items-center justify-center border border-teal-200"
              title="Launch Tutorial in New Tab"
              aria-label="Launch Tutorial in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        <Header onNotifyComingSoon={handleNotifyComingSoon} />

        {/* Working Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <Breadcrumbs
            hideHome={isGmailCategory}
            items={[
              { label: category.title, to: `/category/${category.slug}` },
              { label: topic.title },
            ]}
          />
        </div>

        {/* Topic Header */}
        <section className={`bg-white border-b border-slate-200 ${isGmailCategory ? 'py-7 sm:py-9' : 'py-10 sm:py-14'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!isGmailCategory && (
              <button
                onClick={() => navigate(`/category/${category.slug}`)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to {category.title}</span>
              </button>
            )}

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider">
                    {category.title}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Level: {topic.difficulty}
                  </span>
                  {!isGmailCategory && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                      {React.createElement(PRESENTATION_CONFIG[presentationStyle].icon, { className: 'w-3 h-3 text-teal-600' })}
                      <span>{PRESENTATION_CONFIG[presentationStyle].badge}</span>
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {topic.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {topic.shortDescription || topic.detailedDescription}
                </p>
              </div>

              {/* Topic Resource Summary Box (omitted for simplified Gmail layout) */}
              {!isGmailCategory && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shrink-0 w-full lg:w-72">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                    Resource Inventory
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Infographics</span>
                      </span>
                      <span className="font-semibold text-slate-900">{infoCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Videos</span>
                      </span>
                      <span className="font-semibold text-slate-900">{videoCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>PDF Handbooks</span>
                      </span>
                      <span className="font-semibold text-slate-900">{pdfCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Tutorials / Labs</span>
                      </span>
                      <span className="font-semibold text-slate-900">{tutCount}</span>
                    </div>
                    {linkCount > 0 && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-teal-600" />
                          <span>External Links</span>
                        </span>
                        <span className="font-semibold text-slate-900">{linkCount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                      <span>Total Resources</span>
                      <span>{visibleResources.length}</span>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Layout Style</span>
                      <span className="text-teal-800 font-semibold">{PRESENTATION_CONFIG[presentationStyle].title}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {visibleResources.length === 0 && !tutorial ? (
            <section className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg mb-1">No Published Resources Yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                Teaching materials for this topic are currently being prepared or saved in draft review.
              </p>
              <button
                onClick={() => navigate(`/category/${category.slug}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to {category.title}</span>
              </button>
            </section>
          ) : (
            <>
              {/* ARCHETYPE 1: Guided Learning Sequence */}
              {presentationStyle === 'guided-sequence' && (
                <section className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                        <ListOrdered className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Guided Learning Sequence</h2>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {visibleResources.length} Steps
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Follow this structured sequence in order. Each step builds logically from foundations to real-world execution.
                        </p>
                      </div>
                    </div>
                  </div>

                  {tutorial && (
                    <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl p-5 border border-teal-500/30 flex items-center justify-between gap-4 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Interactive Lab Companion</span>
                          <h4 className="font-bold text-base text-white">{tutorial.title}</h4>
                        </div>
                      </div>
                      <a
                        href={buildTutorialUrl(tutorial.tutorialPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0"
                      >
                        <span>Start Lab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="space-y-4">
                    {visibleResources.map((resource, idx) => (
                      <div
                        key={resource.id}
                        className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                            {idx + 1}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyle(resource.type)}`}>
                                {getTypeIcon(resource.type)}
                                <span>{resource.type}</span>
                              </span>
                              <span className="text-xs text-slate-500 font-medium">Step {idx + 1} of {visibleResources.length}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-600 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{resource.durationOrPages || 'Guide'}</span>
                              </span>
                              {resource.creatorName && (
                                <>
                                  <span className="text-xs text-slate-400">•</span>
                                  <span className="text-xs text-slate-500 font-medium">By {resource.creatorName}</span>
                                </>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">{resource.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                              {resource.description || 'Step-by-step learning resource for this topic.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <button
                            onClick={() => setSelectedDemoResource(resource)}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                          >
                            <span>Open Step</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          {(resource.type === 'YouTube Video' || resource.type === 'Facebook Video') && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Watch on Platform"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {resource.type === 'Tutorial' && (
                            <a
                              href={resource.url.startsWith('http') || resource.url.startsWith('demo://') ? resource.url : buildTutorialUrl(resource.url)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors border border-teal-200"
                              title="Launch Tutorial"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ARCHETYPE 2: Situation-Based / Gmail Tutorial */}
              {presentationStyle === 'situation-based' && (
                isGmailCategory && gmailMeta ? (
                  <section className="space-y-8">
                    {/* Simplified Hero Action Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30">
                      <div className="absolute -right-20 -top-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            चरण-दर-चरण विज़ुअल गाइड और अभ्यास
                          </h2>
                          <p className="text-base text-slate-200 leading-relaxed">
                            आसान चित्रों और व्यावहारिक उदाहरणों के साथ इस विषय को अपने Gmail में तुरंत लागू करना सीखें।
                          </p>
                        </div>

                        {tutorial && (
                          <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                            <a
                              href={buildTutorialUrl(tutorial.tutorialPath)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
                            >
                              <span>पूरा Tutorial खोलें</span>
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* What You Will Learn (आप क्या सीखेंगे) */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          आप क्या सीखेंगे
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {gmailMeta.whatYouWillLearn.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-start gap-3.5"
                          >
                            <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-base sm:text-[17px] text-slate-800 font-medium leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hands-on Practice Info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <h3 className="text-lg font-bold text-slate-900">
                            हाथों-हाथ अभ्यास (Self Practice)
                          </h3>
                          <p className="text-base text-slate-700 leading-relaxed">
                            {gmailMeta.practiceTask}
                          </p>
                        </div>
                        {tutorial && (
                          <a
                            href={buildTutorialUrl(tutorial.tutorialPath, '#section-3')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shrink-0"
                          >
                            <span>अभ्यास शुरू करें</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="space-y-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-7 sm:p-9 shadow-lg border border-slate-800">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 w-fit mb-3">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Business Challenge & Practical Context</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                        Scenario & Objective: {topic.title}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-3xl">
                        {topic.detailedDescription}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <span className="font-bold text-teal-300 block mb-0.5">Phase 1: Architecture</span>
                          <span className="text-slate-400">Conceptual foundation & diagrams</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <span className="font-bold text-teal-300 block mb-0.5">Phase 2: Walkthrough</span>
                          <span className="text-slate-400">Implementation demonstrations</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <span className="font-bold text-teal-300 block mb-0.5">Phase 3: Execution</span>
                          <span className="text-slate-400">Reference guides & practice</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Solution Toolkit & Resources</h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Curated resources positioned to solve this real-world business challenge.</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {visibleResources.length} Solution Items
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleResources.map(renderResourceCard)}
                      </div>
                    </div>
                  </section>
                )
              )}

              {/* ARCHETYPE 3: Custom / Mixed Layout */}
              {presentationStyle === 'custom-mixed' && (
                <section className="space-y-10">
                  {visibleResources[0] && (
                    <div className="bg-white border-2 border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-sm">
                      <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-3">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span>Featured Primary Learning Material</span>
                      </div>
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${getTypeBadgeStyle(visibleResources[0].type)}`}>
                              {getTypeIcon(visibleResources[0].type)}
                              <span>{visibleResources[0].type}</span>
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{visibleResources[0].durationOrPages || 'Guide'}</span>
                            </span>
                            {visibleResources[0].creatorName && (
                              <span className="text-xs text-slate-500">By {visibleResources[0].creatorName}</span>
                            )}
                          </div>
                          <h3 className="text-2xl font-extrabold text-slate-900">{visibleResources[0].title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{visibleResources[0].description}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-3 w-full lg:w-auto">
                          <button
                            onClick={() => setSelectedDemoResource(visibleResources[0])}
                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-xs"
                          >
                            <span>Launch Featured Resource</span>
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {visibleResources.length > 1 && (
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Supporting Resources</h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Additional infographics, walkthroughs, and reference materials.</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {visibleResources.length - 1} Supporting Items
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleResources.slice(1).map(renderResourceCard)}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* ARCHETYPE 4: Interactive Masterclass (Bookmark layout) */}
              {presentationStyle === 'masterclass' && (
                <>
                  {/* STAGE A — START LEARNING HERO CARD */}
                  {tutorial && (
                    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-7 sm:p-10 shadow-xl border border-teal-500/30">
                      <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-3xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Stage A • Interactive Masterclass</span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                            {tutorial.title}
                          </h2>

                          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            {tutorial.subtitle}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                              <span className="block text-lg font-black text-teal-400">5 WOW</span>
                              <span className="text-[11px] text-slate-300">Live Demonstrations</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                              <span className="block text-lg font-black text-teal-400">20 Steps</span>
                              <span className="text-[11px] text-slate-300">Illustrated Micro-Steps</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                              <span className="block text-lg font-black text-teal-400">Simulator</span>
                              <span className="text-[11px] text-slate-300">Hands-on Practice</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                              <span className="block text-lg font-black text-teal-400">Interactive</span>
                              <span className="text-[11px] text-slate-300">Self-Assessment Quiz</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                          <a
                            href={buildTutorialUrl(tutorial.tutorialPath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
                          >
                            <span>Start Learning</span>
                            <ExternalLink className="w-5 h-5" />
                          </a>

                          <a
                            href="#resources"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/15 transition-colors"
                          >
                            <span>Browse {visibleResources.length} Resources Below</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Section: Recommended Learning Sequence */}
                  {topic.recommendedSequence && topic.recommendedSequence.length > 0 && (
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                            <Milestone className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                              Recommended Learning Sequence
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                              A structured multi-format progression combining visual infographics, video walkthroughs, hands-on tutorials, and reference documentation.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto shrink-0">
                          {topic.recommendedSequence.length} Ordered Steps
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topic.recommendedSequence.map((step) => {
                          const linkedResource = topic.resources.find((r) => r.id === step.resourceId)

                          return (
                            <div
                              key={step.stepNumber}
                              onClick={() => linkedResource && setSelectedDemoResource(linkedResource)}
                              className="group cursor-pointer bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-4 transition-all duration-150 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                    {step.stepNumber}
                                  </span>
                                  {linkedResource && (
                                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getTypeBadgeStyle(linkedResource.type)}`}>
                                      {getTypeIcon(linkedResource.type)}
                                      <span>{linkedResource.type}</span>
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-teal-800 transition-colors">
                                  {step.phaseTitle}
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                  {step.objective}
                                </p>
                              </div>

                              {linkedResource && (
                                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                                  <span className="line-clamp-1">{linkedResource.title}</span>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )}

                  {/* Section: All Topic Resources organized by Tabs (STAGE B) */}
                  <section id="resources" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        {tutorial && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 mb-1.5">
                            <Layers className="w-3.5 h-3.5 text-teal-600" />
                            <span>Stage B • Reference & Learning Materials</span>
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                          Learning Resource Library
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                          Explore and filter all {visibleResources.length} available resources dedicated to {topic.title}.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
                        {tabs.map((tab) => {
                          const isActive = activeTab === tab.key
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setActiveTab(tab.key)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                                isActive
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              <span>{tab.label}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {tab.count}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {filteredResources.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                        <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-700">No resources found in this category tab</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(renderResourceCard)}
                      </div>
                    )}
                  </section>

                  {/* STAGE C — PRACTICE & ASSESSMENT */}
                  {tutorial && (tutorial.hasSimulator || tutorial.hasQuiz || tutorial.hasChallenge) && (
                    <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
                            <Award className="w-3.5 h-3.5" />
                            <span>Stage C • Practice & Assessment</span>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Hands-on Practice & Self-Assessment
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Reinforce your understanding through simulated exercises, guided challenges, and quick quizzes.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mb-3">
                              <Gamepad2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                              Bookmark Simulator
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                              Practice capturing visual states, updating display vs data toggles, and binding buttons in a simulated Power BI Desktop environment.
                            </p>
                          </div>
                          <a
                            href={buildTutorialUrl(tutorial.tutorialPath, '#simulator')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                          >
                            <span>Launch Simulator</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center mb-3">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                              Practice Challenge
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                              Test your skills with a hands-on multi-view dashboard navigation challenge. Can you configure 3 toggles in under 3 minutes?
                            </p>
                          </div>
                          <a
                            href={buildTutorialUrl(tutorial.tutorialPath, '#challenge')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                          >
                            <span>Try Challenge</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base mb-1">
                              Knowledge Check Quiz
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                              Check your understanding of Data, Display, Current Page, and Selected Visuals with 5 instant-scored questions.
                            </p>
                          </div>
                          <a
                            href={buildTutorialUrl(tutorial.tutorialPath, '#quiz')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                          >
                            <span>Take Quiz</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* ARCHETYPE 5: Resource Gallery (Default Tabbed View) */}
              {presentationStyle === 'gallery' && (
                <section id="resources" className="space-y-6">
                  {tutorial && (
                    <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md mb-8">
                      <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Interactive Tutorial Available</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{tutorial.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-300">{tutorial.subtitle}</p>
                      </div>
                      <a
                        href={buildTutorialUrl(tutorial.tutorialPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors shrink-0"
                      >
                        <span>Start Interactive Lab</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Learning Resource Library
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Explore and filter all {visibleResources.length} available resources dedicated to {topic.title}.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
                      {tabs.map((tab) => {
                        const isActive = activeTab === tab.key
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {tab.count}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {filteredResources.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                      <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No resources found in this category tab</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map(renderResourceCard)}
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* Section: Related Topics */}
          {relatedTopics.length > 0 && (
            <section className="pt-8 border-t border-slate-200">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cross-Discipline Connections</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Related Topics in {category.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedTopics.map((relTopic) => (
                  <Link
                    key={relTopic.id}
                    to={`/category/${category.slug}/topic/${relTopic.slug}`}
                    className="group bg-white border border-slate-200 hover:border-teal-300 rounded-xl p-5 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-teal-700 uppercase">
                          {relTopic.difficulty}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {relTopic.resources.length} items
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-teal-800 transition-colors">
                        {relTopic.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {relTopic.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
                      <span>View Topic</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      <Footer onNotifyComingSoon={handleNotifyComingSoon} />

      {/* Demo Resource Inspector Modal */}
      <ResourceDemoModal
        resource={selectedDemoResource}
        onClose={() => setSelectedDemoResource(null)}
      />

      {/* Notice Modal */}
      <NoticeModal
        isOpen={noticeModalState.isOpen}
        title={noticeModalState.title}
        message={noticeModalState.message}
        onClose={() => setNoticeModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
