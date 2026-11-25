/**
 * Digital Learning Hub — Gmail Mastery Series Shared Engine
 * File: public/tutorials/gmail/shared/tutorial.js
 * 
 * Renders topic tutorials dynamically from window.TUTORIAL_DATA.
 * Supports arbitrary number of infographics, dynamic checklist, lightbox, and toasts.
 */

(function () {
  'use strict';

  // State management
  let stepsState = {};
  let currentData = null;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Universal Media Helpers (YouTube, Facebook, Instagram Reels)
  function parseYoutubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
    return match ? match[1] : null;
  }

  function parseInstagramCode(url) {
    if (!url) return null;
    const match = url.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([^/?#&]+)/i);
    return match ? match[1] : null;
  }

  function loadMedia(idx, url, platform) {
    const container = document.getElementById(`media-player-${idx}`);
    if (!container) return;

    if (platform === 'YouTube') {
      const ytId = parseYoutubeId(url);
      if (ytId) {
        container.innerHTML = `
          <iframe 
            src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0" 
            title="Video" 
            class="media-iframe" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
        return;
      }
    } else if (platform === 'Instagram') {
      const igCode = parseInstagramCode(url);
      if (igCode) {
        container.innerHTML = `
          <iframe 
            src="https://www.instagram.com/p/${igCode}/embed" 
            title="Instagram Reel" 
            class="media-iframe media-iframe-reel" 
            frameborder="0" 
            scrolling="no" 
            allowtransparency="true">
          </iframe>
        `;
        return;
      }
    } else if (platform === 'Facebook') {
      const encodedUrl = encodeURIComponent(url);
      container.innerHTML = `
        <iframe 
          src="https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=0&width=500" 
          title="Facebook Video" 
          class="media-iframe" 
          frameborder="0" 
          allowfullscreen="true" 
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
        </iframe>
      `;
      return;
    }

    // Direct platform link fallback
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #ffffff;">
        <p style="margin-bottom: 1rem; font-weight: 600;">यह वीडियो देखने के लिए सीधे ${platform} खोलें:</p>
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="btn-platform btn-platform-${platform.toLowerCase()}">
          <span>↗ Open on ${platform}</span>
        </a>
      </div>
    `;
  }

  // Base path resolution for local Vite dev and GitHub Pages deployment
  function getAppBasePath() {
    const path = window.location.pathname || '';
    const idx = path.toLowerCase().indexOf('/tutorials/');
    if (idx !== -1) {
      const base = path.substring(0, idx);
      return base.endsWith('/') ? base : base + '/';
    }
    return '/';
  }

  function resolveTopicUrl(data) {
    const rawPath = (data && data.topicPath) ? data.topicPath : '';
    let cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;

    // Safe fallback derived from folder structure if topicPath is missing
    if (!cleanPath) {
      const pathParts = (window.location.pathname || '').split('/');
      const tutIdx = pathParts.findIndex(p => p.toLowerCase() === 'tutorials');
      if (tutIdx !== -1 && pathParts[tutIdx + 1] === 'gmail' && pathParts[tutIdx + 2]) {
        cleanPath = 'category/gmail/topic/' + pathParts[tutIdx + 2];
      } else {
        cleanPath = 'category/gmail';
      }
    }

    const base = getAppBasePath();
    return base + cleanPath;
  }

  // Sanitize visible badges: remove Day numbers from UI badges
  function formatBadgeText(rawBadge, fallback) {
    if (!rawBadge) return fallback || '';
    const cleaned = String(rawBadge).replace(/Day\s*\d+\s*[•·-]?\s*/gi, '').trim();
    return cleaned || fallback || '';
  }

  // Canonical public URL resolver for Share feature
  function getCanonicalShareUrl(data) {
    let slug = 'translate';
    if (data && data.topicPath) {
      const parts = data.topicPath.split('/').filter(Boolean);
      slug = parts[parts.length - 1];
    } else {
      const pathParts = (window.location.pathname || '').split('/').filter(Boolean);
      slug = pathParts[pathParts.length - 1] || 'translate';
      if (slug.endsWith('.html')) slug = pathParts[pathParts.length - 2] || 'translate';
    }
    return `https://vksinglakkr.github.io/digital-learning-hub/tutorials/gmail/${slug}/`;
  }

  // Print full tutorial via native browser dialog
  function printTutorial() {
    window.print();
  }

  // Print individual original infographic in isolated print frame
  function printInfographic(imgSrc, title) {
    if (!imgSrc) return;
    const cleanTitle = title || 'Gmail Infographic Guide';

    let printFrame = document.getElementById('dlh-print-frame');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'dlh-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(cleanTitle)}</title>
  <style>
    @page { size: auto; margin: 1cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .print-header { text-align: center; margin-bottom: 1rem; }
    .print-brand { font-size: 10pt; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 0.05em; }
    .print-title { font-size: 14pt; font-weight: 800; color: #0f172a; margin-top: 0.25rem; }
    .img-wrap { width: 100%; display: flex; justify-content: center; align-items: center; }
    img { max-width: 100%; max-height: 85vh; object-fit: contain; display: block; border-radius: 6px; }
    .print-footer { margin-top: 0.75rem; font-size: 8pt; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="print-header">
    <div class="print-brand">Digital Learning Hub • Gmail Mastery</div>
    <div class="print-title">${escapeHtml(cleanTitle)}</div>
  </div>
  <div class="img-wrap">
    <img src="${imgSrc}" alt="${escapeHtml(cleanTitle)}" onload="window.focus(); window.print();" />
  </div>
  <div class="print-footer">
    Digital Learning Hub — https://vksinglakkr.github.io/digital-learning-hub/
  </div>
</body>
</html>`);
    frameDoc.close();
  }

  // Share tutorial (Native Web Share with fallback to clipboard copy)
  function shareTutorial() {
    const data = currentData || {};
    const publicUrl = getCanonicalShareUrl(data);
    const shareTitle = `${data.title || 'Gmail Tutorial'} | Digital Learning Hub`;
    const shareText = data.subtitle || 'अपनी भाषा में Gmail सीखें आसान विजुअल स्टेप्स में';

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: publicUrl
      }).then(() => {
        showToast('✅ लिंक शेयर कर दिया गया!');
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyShareLink(publicUrl);
        }
      });
    } else {
      copyShareLink(publicUrl);
    }
  }

  function copyShareLink(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('📋 लिंक कॉपी हो गया! अब आप इसे कहीं भी शेयर कर सकते हैं।');
      }).catch(() => {
        fallbackCopyText(url);
      });
    } else {
      fallbackCopyText(url);
    }
  }

  function fallbackCopyText(text) {
    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    try {
      document.execCommand('copy');
      showToast('📋 लिंक कॉपी हो गया!');
    } catch {
      showToast('URL: ' + text);
    }
    document.body.removeChild(input);
  }

  // Render Summary Box helper
  function renderSummaryBox(summaryBox) {
    if (!summaryBox) return '';

    if (summaryBox.type === 'steps' || (!summaryBox.type && summaryBox.items)) {
      const itemsHtml = (summaryBox.items || []).map(item => `
        <div class="step-item">
          <strong>${item.title || ''}</strong>
          ${item.text || ''}
        </div>
      `).join('');

      return `
        <div class="steps-box">
          <div class="steps-box-title">
            <span>⚡</span> ${summaryBox.title || 'मुख्य स्टेप्स:'}
          </div>
          <div class="steps-grid">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    if (summaryBox.type === 'categories') {
      const itemsHtml = (summaryBox.items || []).map(item => `
        <div class="cat-item">
          <strong>${item.icon || ''} ${item.name || ''}</strong>
          ${item.desc || ''}
        </div>
      `).join('');

      return `
        <div class="cat-guide-box">
          <div class="cat-guide-title">
            <span>📁</span> ${summaryBox.title || 'सभी Categories की पहचान:'}
          </div>
          <div class="cat-grid">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    if (summaryBox.type === 'cheat') {
      const itemsHtml = (summaryBox.items || []).map(item => `
        <div class="cheat-item">
          <span class="cheat-cmd">${item.cmd || ''}</span>
          <div class="cheat-desc">${item.desc || ''}</div>
        </div>
      `).join('');

      return `
        <div class="cheat-guide-box">
          <div class="cheat-guide-title">
            <span>⚡</span> ${summaryBox.title || 'Search Operators Quick Cheat Sheet:'}
          </div>
          <div class="cheat-grid">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    if (summaryBox.customHtml) {
      return summaryBox.customHtml;
    }

    return '';
  }

  // Main Render Function
  function renderTutorial(data) {
    if (!data) return;
    currentData = data;

    // Reset checklist state
    const totalSteps = (data.sections && data.sections.practice && data.sections.practice.steps) ? data.sections.practice.steps.length : 0;
    stepsState = {};
    for (let i = 1; i <= totalSteps; i++) {
      stepsState[i] = false;
    }

    const root = document.getElementById('tutorial-root') || document.body;

    // 1. Header
    const brandTitle = data.brandTitle || 'Digital Learning Hub';

    // 2. Learning Outcomes
    const outcomesList = Array.isArray(data.learningOutcomes) ? data.learningOutcomes : [];
    const outcomesHtml = (outcomesList.length > 0) ? `
      <div class="learning-outcomes-card">
        <div class="outcomes-header">
          <span class="outcomes-badge-icon">🎯</span>
          <h2 class="outcomes-heading">आप क्या सीखेंगे</h2>
        </div>
        <div class="outcomes-grid">
          ${outcomesList.map(item => `
            <div class="outcomes-item">
              <span class="outcomes-check">✓</span>
              <span class="outcomes-text">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    // 3. Section 1 (Problem)
    const prob = (data.sections && data.sections.problem) ? data.sections.problem : {};
    const probStepNum = prob.stepNum || 'Section 1';
    const probHeading = prob.heading || 'पहले समस्या समझें';
    const cleanProbBadge = formatBadgeText(prob.badge, 'Status 1');
    const probImg = prob.image || '';
    const probAlt = prob.alt || probHeading;
    const cleanProbLbTitle = formatBadgeText(prob.lightboxTitle, `${cleanProbBadge}: ${probHeading}`);

    // 4. Section 2 (Solution / How-To)
    const sol = (data.sections && data.sections.solution) ? data.sections.solution : {};
    const solStepNum = sol.stepNum || 'Section 2';
    const solHeading = sol.heading || 'अब करना सीखें';
    const solCards = sol.cards || [];

    const solCardsHtml = solCards.map((card, idx) => {
      const cleanCardBadge = formatBadgeText(card.badge, `Status ${idx + 2}`);
      const cardImg = card.image || '';
      const cardAlt = card.alt || cleanCardBadge;
      const cleanCardLbTitle = formatBadgeText(card.lightboxTitle, `${cleanCardBadge}: ${solHeading}`);

      return `
        <div class="visual-card">
          <div class="visual-topbar">
            <span class="visual-badge">
              <span>${cleanCardBadge}</span>
            </span>
            <div class="visual-tools">
              <button class="btn-visual-tool" onclick="window.TutorialEngine.printInfographic('${cardImg}', '${escapeHtml(cleanCardLbTitle)}')" title="यह इन्फोग्राफिक प्रिंट करें">
                <span class="tool-icon">🖨️</span> <span>Print</span>
              </button>
              <button class="btn-visual-tool btn-zoom" onclick="window.TutorialEngine.openLightbox('${cardImg}', '${escapeHtml(cleanCardLbTitle)}')">
                <span>🔍 पूरा देखें</span>
              </button>
            </div>
          </div>
          <div class="visual-img-wrap" onclick="window.TutorialEngine.openLightbox('${cardImg}', '${escapeHtml(cleanCardLbTitle)}')">
            <img 
              src="${cardImg}" 
              alt="${escapeHtml(cardAlt)}" 
              class="visual-img"
              loading="lazy"
            />
          </div>
        </div>
      `;
    }).join('');

    const summaryBoxHtml = renderSummaryBox(sol.summaryBox);

    // Zoom button target for Section 2 topbar
    const firstSolImg = (solCards.length > 0) ? solCards[0].image : '';
    const firstSolLbTitle = (solCards.length > 0) ? formatBadgeText(solCards[0].lightboxTitle, `${formatBadgeText(solCards[0].badge, 'Status 2')}: ${solHeading}`) : '';

    // 5. Optional Media (YouTube, Facebook, Instagram Reels)
    const mediaList = Array.isArray(data.media) ? data.media : [];
    const hasMedia = mediaList.length > 0;

    const mediaCardsHtml = mediaList.map((item, idx) => {
      const platform = item.platform || 'Video';
      const title = item.title || `${platform} Demonstration`;
      const desc = item.desc || '';
      const url = item.url || '';
      const isReel = platform === 'Instagram';
      const isYoutube = platform === 'YouTube';
      const ytId = isYoutube ? parseYoutubeId(url) : null;
      const posterBg = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';

      return `
        <div class="media-card">
          <div class="media-card-header">
            <div class="media-card-topbar">
              <span class="platform-badge platform-${platform.toLowerCase()}">
                <span>${platform === 'YouTube' ? '▶' : platform === 'Instagram' ? '📷' : '👥'}</span>
                <span>${platform}</span>
              </span>
              <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="btn-platform btn-platform-${platform.toLowerCase()}">
                <span>Watch on ${platform} ↗</span>
              </a>
            </div>
            <h3 class="media-card-title">${escapeHtml(title)}</h3>
            ${desc ? `<p class="media-card-desc">${escapeHtml(desc)}</p>` : ''}
          </div>

          <div class="media-player-container ${isReel ? 'reel-container' : ''}" id="media-player-${idx}">
            <div 
              class="media-poster" 
              style="${posterBg ? `background-image: url('${posterBg}');` : 'background: #1e293b;'}" 
              onclick="window.TutorialEngine.loadMedia(${idx}, '${escapeHtml(url)}', '${platform}')"
            >
              <div class="media-poster-overlay"></div>
              <div class="media-play-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span class="media-poster-caption">Click to load ${platform} player</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 6. Section 3 (Practice)
    const prac = (data.sections && data.sections.practice) ? data.sections.practice : {};
    const pracStepNum = prac.stepNum || 'Section 3';
    const pracHeading = prac.heading || 'खुद करके देखें';
    const pracIcon = prac.icon || '🎯';
    const pracTitle = prac.title || 'हाथों-हाथ Practice';
    const pracSubtitle = prac.subtitle || 'सीखने को पक्का करने के लिए अपने Gmail में यह छोटा कार्य करके देखें:';
    const pracMission = prac.mission || '';
    const pracSteps = prac.steps || [];

    const checklistHtml = pracSteps.map((stepText, idx) => {
      const stepNum = idx + 1;
      return `
        <div class="checklist-row" id="step-row-${stepNum}" onclick="window.TutorialEngine.toggleStep(${stepNum})">
          <div class="check-box-icon" id="check-icon-${stepNum}">✓</div>
          <div class="check-text">
            ${stepText}
          </div>
        </div>
      `;
    }).join('');

    // 6. Footer & Topic Navigation
    const topicUrl = resolveTopicUrl(data);
    const footerSeries = (data.footer && data.footer.series) ? data.footer.series : 'Digital Learning Hub • Gmail Mastery Series';
    const footerTopic = (data.footer && data.footer.topic) ? data.footer.topic.replace(/Day\s*\d+\s*[•:-]?\s*/gi, '') : (data.title || '');

    // Full Template Assembly
    root.innerHTML = `
      <!-- TOP STICKY HEADER (TWO-ROW) -->
      <header class="site-header">
        <!-- Row 1: Brand & Quick Actions -->
        <div class="header-row-top">
          <div class="container header-top-inner">
            <a href="${topicUrl}" class="brand-group" title="Digital Learning Hub">
              <span class="brand-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </span>
              <span class="brand-title">${brandTitle}</span>
            </a>
            <div class="header-actions">
              <button class="header-tool-btn" onclick="window.TutorialEngine.printTutorial()" title="पूरा Tutorial प्रिंट करें (PDF)">
                <span class="tool-icon">🖨️</span>
                <span class="tool-label">Print</span>
              </button>
              <button class="header-tool-btn" onclick="window.TutorialEngine.shareTutorial()" title="Tutorial लिंक शेयर करें">
                <span class="tool-icon">🔗</span>
                <span class="tool-label">Share</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Row 2: Back to Topic & Learning Navigation -->
        <div class="header-row-nav">
          <div class="container header-nav-inner">
            <a href="${topicUrl}" class="back-to-topic-btn" title="विषय पेज पर वापस जाएँ">
              <span class="back-arrow">←</span>
              <span class="back-text">वापस</span>
            </a>
            <nav class="nav-links" aria-label="Lesson Sections">
              <a href="#section-1" class="nav-btn">समस्या समझें</a>
              <a href="#section-2" class="nav-btn">करना सीखें</a>
              ${hasMedia ? '<a href="#section-video" class="nav-btn nav-btn-video">🎬 Video से समझें</a>' : ''}
              <a href="#section-3" class="nav-btn">अभ्यास करें</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-pill">
            <span>✉️ GMAIL MASTERY</span>
          </div>
          <h1 class="hero-title">
            ${data.title || ''}
          </h1>
          <p class="hero-subtitle">
            ${data.subtitle || ''}
          </p>

          <!-- Learning Outcomes Card: आप क्या सीखेंगे -->
          ${outcomesHtml}
        </div>
      </section>

      <!-- MAIN LESSON CONTENT -->
      <main class="container">

        <!-- SECTION 1: PROBLEM -->
        <section class="lesson-section" id="section-1">
          <div class="section-header-bar">
            <div class="section-title-wrap">
              <span class="section-step-num">${probStepNum}</span>
              <h2 class="section-heading">${probHeading}</h2>
            </div>
            <div class="section-header-tools">
              <button class="btn-zoom" onclick="window.TutorialEngine.openLightbox('${probImg}', '${escapeHtml(cleanProbLbTitle)}')">
                <span>🔍 पूरा देखें (Full Size)</span>
              </button>
            </div>
          </div>

          <div class="visual-card">
            <div class="visual-topbar">
              <span class="visual-badge">
                <span>${cleanProbBadge}</span>
              </span>
              <div class="visual-tools">
                <button class="btn-visual-tool" onclick="window.TutorialEngine.printInfographic('${probImg}', '${escapeHtml(cleanProbLbTitle)}')" title="यह इन्फोग्राफिक प्रिंट करें">
                  <span class="tool-icon">🖨️</span> <span>Print</span>
                </button>
                <button class="btn-visual-tool btn-zoom" onclick="window.TutorialEngine.openLightbox('${probImg}', '${escapeHtml(cleanProbLbTitle)}')">
                  <span>🔍 पूरा देखें</span>
                </button>
              </div>
            </div>
            <div class="visual-img-wrap" onclick="window.TutorialEngine.openLightbox('${probImg}', '${escapeHtml(cleanProbLbTitle)}')">
              <img 
                src="${probImg}" 
                alt="${escapeHtml(probAlt)}" 
                class="visual-img"
                loading="eager"
              />
            </div>
          </div>

          <!-- Section 1 to Section 2 Navigation -->
          <div class="section-nav-footer">
            <a href="#section-2" class="btn-step-next">
              <span>आगे बढ़ें: 2. करना सीखें (इन्फोग्राफिक निर्देश)</span>
              <span class="btn-arrow">↓</span>
            </a>
          </div>
        </section>

        <!-- SECTION 2: SOLUTION / HOW-TO -->
        <section class="lesson-section" id="section-2" style="padding-top: 0.5rem;">
          <div class="section-header-bar">
            <div class="section-title-wrap">
              <span class="section-step-num">${solStepNum}</span>
              <h2 class="section-heading">${solHeading}</h2>
            </div>
            ${(firstSolImg && !sol.hideHeaderZoomBtn) ? `
            <button class="btn-zoom" onclick="window.TutorialEngine.openLightbox('${firstSolImg}', '${escapeHtml(firstSolLbTitle)}')">
              <span>🔍 पूरा देखें (Full Size)</span>
            </button>
            ` : ''}
          </div>

          ${solCardsHtml}

          ${summaryBoxHtml}

          <!-- Section 2 to Next Section Navigation -->
          <div class="section-nav-footer">
            ${hasMedia ? `
            <a href="#section-video" class="btn-step-next btn-step-video">
              <span>🎬 आगे बढ़ें: Video से समझें (${mediaList.length} Video${mediaList.length > 1 ? 's' : ''})</span>
              <span class="btn-arrow">↓</span>
            </a>
            ` : `
            <a href="#section-3" class="btn-step-next btn-step-practice">
              <span>🎯 आगे बढ़ें: 3. खुद करके देखें (हाथों-हाथ Practice)</span>
              <span class="btn-arrow">↓</span>
            </a>
            `}
          </div>
        </section>

        <!-- SECTION VIDEO: OPTIONAL MULTI-PLATFORM MEDIA -->
        ${hasMedia ? `
        <section class="lesson-section" id="section-video" style="padding-top: 0.5rem;">
          <div class="section-header-bar">
            <div class="section-title-wrap">
              <span class="section-step-num">Optional Media • Video Guide</span>
              <h2 class="section-heading">Video से समझें</h2>
            </div>
            <span class="media-count-badge">${mediaList.length} Available Video${mediaList.length > 1 ? 's' : ''}</span>
          </div>

          <div class="media-grid ${mediaList.length > 1 ? 'multi-media' : ''}">
            ${mediaCardsHtml}
          </div>

          <div class="section-nav-footer">
            <a href="#section-3" class="btn-step-next btn-step-practice">
              <span>🎯 आगे बढ़ें: 3. खुद करके देखें (हाथों-हाथ Practice)</span>
              <span class="btn-arrow">↓</span>
            </a>
          </div>
        </section>
        ` : ''}

        <!-- SECTION 3: PRACTICE -->
        <section class="lesson-section" id="section-3" style="padding-top: 0.5rem;">
          <div class="section-header-bar">
            <div class="section-title-wrap">
              <span class="section-step-num">${pracStepNum}</span>
              <h2 class="section-heading">${pracHeading}</h2>
            </div>
          </div>

          <div class="practice-card">
            <div class="practice-header">
              <div class="practice-icon">${pracIcon}</div>
              <div class="practice-title-group">
                <h3>${pracTitle}</h3>
                <p>${pracSubtitle}</p>
              </div>
            </div>

            <!-- Practice Statement -->
            <div class="practice-mission-box">
              ${pracMission}
            </div>

            <!-- Interactive Checklist Steps -->
            <div class="checklist">
              ${checklistHtml}
            </div>

            <div class="practice-footer">
              <div class="practice-progress" id="progress-text">
                प्रगति: <span id="progress-val" style="color: var(--primary);">0 / ${totalSteps} चरण पूरे</span>
              </div>
              <button class="btn-reset-practice" onclick="window.TutorialEngine.resetPractice()">
                🔄 Reset Checklist
              </button>
            </div>
          </div>

          <!-- Section 3 back to Section 2 Reference Navigation -->
          <div class="section-nav-footer" style="margin-top: 1rem;">
            <a href="#section-2" class="btn-step-back">
              <span>↑ 2. इन्फोग्राफिक निर्देश दोबारा देखें</span>
            </a>
          </div>
        </section>

      </main>

      <!-- LIGHTBOX MODAL FOR FULL-SIZE VIEW -->
      <div class="lightbox-modal" id="lightbox" onclick="window.TutorialEngine.closeLightbox(event)">
        <div class="lightbox-topbar">
          <span class="lightbox-title" id="lightbox-label">Full-Size Image View</span>
          <div class="lightbox-actions">
            <button class="btn-lightbox-tool" onclick="window.TutorialEngine.printInfographic(document.getElementById('lightbox-img').src, document.getElementById('lightbox-label').innerText)" title="यह चित्र प्रिंट करें">
              <span>🖨️ Print</span>
            </button>
            <button class="lightbox-close" onclick="window.TutorialEngine.closeLightbox()" title="बंद करें (Esc)">✕</button>
          </div>
        </div>
        <div class="lightbox-content" onclick="event.stopPropagation()">
          <img id="lightbox-img" src="" alt="Full size preview" />
        </div>
      </div>

      <!-- TOAST -->
      <div id="toast"></div>

      <!-- FOOTER -->
      <footer class="site-footer">
        <div class="container">
          <p style="margin-bottom: 0.75rem;">
            <a href="${topicUrl}" class="btn-step-back" style="font-weight: 700;">
              <span>← Back to Topic Page (विषय पर वापस जाएँ)</span>
            </a>
          </p>
          <p style="font-weight: 700; color: var(--slate-700); margin-bottom: 0.25rem;">
            ${footerSeries}
          </p>
          <p>${footerTopic}</p>
        </div>
      </footer>
    `;
  }

  // Lightbox functions
  function openLightbox(src, label) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxLabel = document.getElementById('lightbox-label');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = src;
    if (lightboxLabel) lightboxLabel.innerText = label || 'Full-Size Image View';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(e) {
    if (e && e.target && e.target.id === 'lightbox-img') return;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  // Toast function
  let toastTimer = null;
  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  }

  // Checklist functions
  function toggleStep(num) {
    stepsState[num] = !stepsState[num];
    const row = document.getElementById(`step-row-${num}`);
    if (row) {
      row.classList.toggle('checked', stepsState[num]);
    }

    const totalSteps = Object.keys(stepsState).length;
    const completed = Object.values(stepsState).filter(Boolean).length;
    const progressEl = document.getElementById('progress-val');
    if (progressEl) {
      progressEl.innerText = `${completed} / ${totalSteps} चरण पूरे`;
    }

    if (completed === totalSteps && totalSteps > 0) {
      const toastMsg = (currentData && currentData.sections && currentData.sections.practice && currentData.sections.practice.toastSuccess)
        ? currentData.sections.practice.toastSuccess
        : '🎉 बहुत बढ़िया! आपने सभी अभ्यास चरण पूरे कर लिए!';
      showToast(toastMsg);
    }
  }

  function resetPractice() {
    const totalSteps = Object.keys(stepsState).length;
    for (let i = 1; i <= totalSteps; i++) {
      stepsState[i] = false;
      const row = document.getElementById(`step-row-${i}`);
      if (row) row.classList.remove('checked');
    }
    const progressEl = document.getElementById('progress-val');
    if (progressEl) {
      progressEl.innerText = `0 / ${totalSteps} चरण पूरे`;
    }
    showToast('Checklist रीसेट हो गई है!');
  }

  // Keyboard shortcut for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    }
  });

  // Global Engine Object
  window.TutorialEngine = {
    render: renderTutorial,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    toggleStep: toggleStep,
    resetPractice: resetPractice,
    showToast: showToast,
    resolveTopicUrl: resolveTopicUrl,
    loadMedia: loadMedia,
    printTutorial: printTutorial,
    printInfographic: printInfographic,
    shareTutorial: shareTutorial
  };

  // Auto-init on page load if TUTORIAL_DATA exists
  function autoInit() {
    if (window.TUTORIAL_DATA) {
      renderTutorial(window.TUTORIAL_DATA);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
