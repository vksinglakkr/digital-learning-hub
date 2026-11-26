export interface CuriosityCard {
  id: string
  problem: string
  solution: string
  tag?: string
  // Target link if an existing, verified tutorial or category route exists.
  // If not yet available as a dedicated tutorial, targetUrl is undefined (no misleading link).
  targetUrl?: string
  actionLabel?: string
  iconType: 
    | 'presentation' 
    | 'file-text' 
    | 'mail' 
    | 'bar-chart' 
    | 'video' 
    | 'undo' 
    | 'template' 
    | 'filter' 
    | 'clock' 
    | 'drive' 
    | 'task'
}

export const CURIOSITY_CARDS: CuriosityCard[] = [
  {
    id: 'emails-inbox',
    problem: 'इतनी सारी Emails! जरूरी कौन-सी है?',
    solution: 'Gmail से Inbox सँभालना सीखें।',
    tag: 'Gmail',
    targetUrl: '/category/gmail',
    actionLabel: 'कैसे करें? सीखें',
    iconType: 'mail'
  },
  {
    id: 'excel-rows',
    problem: 'Excel में हजारों Rows! क्या समझ आएगा?',
    solution: 'Power BI से जानकारी को आसानी से समझें।',
    tag: 'Power BI',
    targetUrl: '/category/power-bi',
    actionLabel: 'कैसे करें? सीखें',
    iconType: 'bar-chart'
  },
  {
    id: 'ppt-slides',
    problem: '100 Slides की PPT! इतनी कौन पढ़े?',
    solution: 'AI से उसकी जरूरी बातें समझें।',
    tag: 'AI Tools',
    // No dedicated tutorial published yet for PPT AI summary; keep truthful (no broken link)
    iconType: 'presentation'
  },
  {
    id: 'doc-pages',
    problem: '50 पेज का Document! कहाँ से शुरू करूँ?',
    solution: 'मुख्य बातें और निष्कर्ष जानें।',
    tag: 'Smart Work',
    // No dedicated tutorial published yet
    iconType: 'file-text'
  },
  {
    id: 'video-length',
    problem: 'इतना लंबा Video! पूरा देखना पड़ेगा?',
    solution: 'Transcript से जरूरी बातें समझें।',
    tag: 'Productivity',
    // No dedicated tutorial published yet
    iconType: 'video'
  }
]
