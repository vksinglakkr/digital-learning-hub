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
    const brandBadge = data.brandBadge || 'Explanation Type';
    const brandTitle = data.brandTitle || 'Digital Learning Hub';

    // 2. Hero Meta Tags
    const metaTagsHtml = (data.meta || []).map(tag => `<span class="meta-tag">${tag}</span>`).join('');

    // 3. Section 1 (Problem)
    const prob = (data.sections && data.sections.problem) ? data.sections.problem : {};
    const probStepNum = prob.stepNum || 'Section 1';
    const probHeading = prob.heading || 'पहले समस्या समझें';
    const probBadge = prob.badge || 'Status 1';
    const probHint = prob.hint || 'चित्र पर क्लिक करके बड़ा देखें';
    const probImg = prob.image || '';
    const probAlt = prob.alt || probHeading;
    const probLightboxTitle = prob.lightboxTitle || `${probBadge}: ${probHeading}`;

    // 4. Section 2 (Solution / How-To)
    const sol = (data.sections && data.sections.solution) ? data.sections.solution : {};
    const solStepNum = sol.stepNum || 'Section 2';
    const solHeading = sol.heading || 'अब करना सीखें';
    const solCards = sol.cards || [];

    const solCardsHtml = solCards.map((card, idx) => {
      const cardBadge = card.badge || `Status ${idx + 2}`;
      const cardHint = card.hint || 'चित्र पर क्लिक करके बड़ा देखें';
      const cardImg = card.image || '';
      const cardAlt = card.alt || cardBadge;
      const cardLbTitle = card.lightboxTitle || `${cardBadge}: ${solHeading}`;
      const actionHtml = card.zoomBtn
        ? `<button class="btn-zoom" onclick="window.TutorialEngine.openLightbox('${cardImg}', '${escapeHtml(cardLbTitle)}')"><span>🔍 पूरा देखें</span></button>`
        : `<span style="font-size: 0.72rem; color: var(--slate-400);">${cardHint}</span>`;

      return `
        <div class="visual-card">
          <div class="visual-topbar">
            <span class="visual-badge">
              <span>${cardBadge}</span>
            </span>
            ${actionHtml}
          </div>
          <div class="visual-img-wrap" onclick="window.TutorialEngine.openLightbox('${cardImg}', '${escapeHtml(cardLbTitle)}')">
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
    const firstSolLbTitle = (solCards.length > 0) ? (solCards[0].lightboxTitle || `${solCards[0].badge}: ${solHeading}`) : '';

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
    const footerTopic = (data.footer && data.footer.topic) ? data.footer.topic : (data.title || '');

    // Full Template Assembly
    root.innerHTML = `
      <!-- TOP STICKY HEADER -->
      <header class="site-header">
        <div class="container">
          <div class="header-inner">
            <div class="header-left">
              <a href="${topicUrl}" class="back-to-topic-btn" title="Back to Topic Detail Page">
                <span class="back-arrow">←</span>
                <span class="back-text">Back to Topic</span>
              </a>
              <span class="header-divider"></span>
              <a href="${topicUrl}" class="brand-group" title="Digital Learning Hub">
                <span class="brand-badge">${brandBadge}</span>
                <span class="brand-title">${brandTitle}</span>
              </a>
            </div>
            <nav class="nav-links">
              <a href="#section-1" class="nav-btn">1. समस्या समझें</a>
              <a href="#section-2" class="nav-btn">2. करना सीखें</a>
              ${hasMedia ? '<a href="#section-video" class="nav-btn nav-btn-video">🎬 Video से समझें</a>' : ''}
              <a href="#section-3" class="nav-btn">3. खुद करके देखें</a>
            </nav>
          </div>
        </div>
      </header>

      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-pill">
            <span>✉️ GMAIL MASTERY SERIES</span> &bull; <span>${data.dayPill || 'DAY 01'}</span>
          </div>
          <h1 class="hero-title">
            ${data.title || ''}
          </h1>
          <p class="hero-subtitle">
            ${data.subtitle || ''}
          </p>
          <div class="hero-meta">
            ${metaTagsHtml}
          </div>
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
            <button class="btn-zoom" onclick="window.TutorialEngine.openLightbox('${probImg}', '${escapeHtml(probLightboxTitle)}')">
              <span>🔍 पूरा देखें (Full Size)</span>
            </button>
          </div>

          <div class="visual-card">
            <div class="visual-topbar">
              <span class="visual-badge">
                <span>${probBadge}</span>
              </span>
              <span style="font-size: 0.72rem; color: var(--slate-400);">${probHint}</span>
            </div>
            <div class="visual-img-wrap" onclick="window.TutorialEngine.openLightbox('${probImg}', '${escapeHtml(probLightboxTitle)}')">
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
          <button class="lightbox-close" onclick="window.TutorialEngine.closeLightbox()" title="बंद करें (Esc)">✕</button>
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
    loadMedia: loadMedia
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
