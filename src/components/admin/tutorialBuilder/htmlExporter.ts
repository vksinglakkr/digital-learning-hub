import type { TutorialDocument, TutorialBlock } from '../../../types/tutorialBuilder'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatMarkdown(text?: string): string {
  if (!text) return ''
  // Escape HTML first
  let html = escapeHtml(text)
  // Convert bold **text** to <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Convert italic *text* to <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Convert bullet lists
  html = html.replace(/^• (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p class="mt-3">')
  html = html.replace(/\n/g, '<br/>')
  return `<p>${html}</p>`
}

export function generateTutorialHtml(doc: TutorialDocument): string {
  const blocksHtml = doc.blocks
    .map((block, idx) => renderBlockHtml(block, idx + 1))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(doc.topicTitle)} — Digital Learning Hub</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    .top-banner {
      background: linear-gradient(135deg, #042f2e 0%, #0f172a 100%);
      color: #ffffff;
      padding: 40px 20px 48px;
      border-bottom: 3px solid #0d9488;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 16px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .badge-teal { background-color: #ccfbf1; color: #115e59; }
    .badge-slate { background-color: #f1f5f9; color: #475569; }
    .badge-amber { background-color: #fef3c7; color: #92400e; }
    .badge-green { background-color: #dcfce7; color: #166534; }
    .badge-indigo { background-color: #e0e7ff; color: #3730a3; }
    
    .title {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin: 14px 0 10px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 16px;
      color: #cbd5e1;
      max-width: 720px;
      line-height: 1.5;
    }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
    }
    
    main {
      padding: 40px 0 80px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      transition: border-color 0.15s ease;
    }
    .card:hover {
      border-color: #cbd5e1;
    }
    .block-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    .block-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #0f172a;
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .callout {
      border-radius: 12px;
      padding: 14px 18px;
      margin-top: 14px;
      font-size: 13px;
    }
    .callout-tip {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
    }
    .callout-result {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      color: #0f766e;
    }
    .callout-warning {
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #92400e;
    }
    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      overflow-x: auto;
      margin-top: 12px;
      line-height: 1.5;
    }
    .img-frame {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      margin: 14px 0 6px;
      text-align: center;
    }
    .img-frame img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      cursor: zoom-in;
    }
    .caption {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
    }
    .quiz-option {
      display: block;
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #f8fafc;
      font-size: 14px;
      cursor: pointer;
      margin-bottom: 8px;
      transition: all 0.15s ease;
    }
    .quiz-option:hover {
      border-color: #0d9488;
      background: #f0fdfa;
    }
    .quiz-option.correct {
      border-color: #22c55e;
      background: #dcfce7;
      color: #14532d;
      font-weight: 700;
    }
    .quiz-option.wrong {
      border-color: #ef4444;
      background: #fee2e2;
      color: #7f1d1d;
    }
    .explanation-box {
      display: none;
      margin-top: 12px;
      padding: 12px 16px;
      background: #f1f5f9;
      border-left: 4px solid #0d9488;
      font-size: 13px;
      border-radius: 0 8px 8px 0;
    }
    footer {
      text-align: center;
      padding: 30px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
    }
    /* Zoom modal */
    #zoomModal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.9);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      cursor: zoom-out;
    }
    #zoomModal img {
      max-width: 95vw;
      max-height: 90vh;
      border-radius: 8px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  </style>
</head>
<body>

  <!-- Header Banner -->
  <header class="top-banner">
    <div class="container">
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#99f6e4;">
        <span>Digital Learning Hub</span>
        <span>•</span>
        <span>${escapeHtml(doc.categoryId.toUpperCase())}</span>
      </div>
      <h1 class="title">${escapeHtml(doc.topicTitle)}</h1>
      <p class="subtitle">${escapeHtml(doc.subtitle)}</p>
      <div class="meta-bar">
        <span class="badge badge-teal">${escapeHtml(doc.approach.replace('-', ' '))}</span>
        <span class="badge badge-slate">${escapeHtml(doc.difficulty)}</span>
        <span class="badge badge-amber">Self-Contained Tutorial</span>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container">
    ${blocksHtml}
  </main>

  <!-- Zoom Modal -->
  <div id="zoomModal" onclick="closeZoom()">
    <img id="zoomImg" src="" alt="Enlarged screenshot">
  </div>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>Built with <strong>Digital Learning Hub Tutorial Builder</strong> • Self-contained offline-ready module</p>
    </div>
  </footer>

  <script>
    function checkAnswer(btn, isCorrect, explanationId) {
      const parent = btn.parentElement;
      const allButtons = parent.querySelectorAll('.quiz-option');
      allButtons.forEach(b => {
        b.disabled = true;
        b.style.cursor = 'default';
      });
      if (isCorrect) {
        btn.classList.add('correct');
        btn.innerHTML = '✓ ' + btn.innerHTML;
      } else {
        btn.classList.add('wrong');
        btn.innerHTML = '✗ ' + btn.innerHTML;
      }
      const exp = document.getElementById(explanationId);
      if (exp) exp.style.display = 'block';
    }

    function openZoom(src) {
      const modal = document.getElementById('zoomModal');
      const img = document.getElementById('zoomImg');
      img.src = src;
      modal.style.display = 'flex';
    }

    function closeZoom() {
      document.getElementById('zoomModal').style.display = 'none';
    }
  </script>
</body>
</html>`
}

function renderBlockHtml(block: TutorialBlock, index: number): string {
  switch (block.type) {
    case 'text':
      return `
    <article class="card">
      ${block.title ? `<div class="block-header"><h2 class="block-title">${escapeHtml(block.title)}</h2><span class="badge badge-slate">Overview</span></div>` : ''}
      <div class="block-body">${formatMarkdown(block.content)}</div>
    </article>`

    case 'step':
      return `
    <article class="card">
      <div class="block-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <span class="step-number">${block.stepNumber || index}</span>
          <h2 class="block-title">${escapeHtml(block.title || `Step ${block.stepNumber || index}`)}</h2>
        </div>
        <span class="badge badge-teal">Practical Step</span>
      </div>
      <div class="block-body">${formatMarkdown(block.content)}</div>
      ${block.imageUrl ? `
        <div class="img-frame">
          <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.caption || 'Step screenshot')}" onclick="openZoom(this.src)">
        </div>
        ${block.caption ? `<div class="caption">${escapeHtml(block.caption)}</div>` : ''}
      ` : ''}
      ${block.tip ? `
        <div class="callout callout-tip">
          <strong>💡 Pro Tip:</strong> ${escapeHtml(block.tip)}
        </div>` : ''}
      ${block.expectedResult ? `
        <div class="callout callout-result">
          <strong>🎯 Expected Result:</strong> ${escapeHtml(block.expectedResult)}
        </div>` : ''}
    </article>`

    case 'image':
      return `
    <article class="card">
      ${block.title ? `<div class="block-header"><h2 class="block-title">${escapeHtml(block.title)}</h2><span class="badge badge-slate">Visual Model</span></div>` : ''}
      ${block.content ? `<div class="block-body" style="margin-bottom:12px;">${formatMarkdown(block.content)}</div>` : ''}
      ${block.imageUrl ? `
        <div class="img-frame">
          <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.caption || 'Diagram')}" onclick="openZoom(this.src)">
        </div>
        ${block.caption ? `<div class="caption">${escapeHtml(block.caption)}</div>` : ''}
      ` : ''}
    </article>`

    case 'example':
      return `
    <article class="card">
      <div class="block-header">
        <h2 class="block-title">${escapeHtml(block.title || 'Example & Sample Data')}</h2>
        <span class="badge badge-indigo">${escapeHtml(block.language || 'Code / Formula')}</span>
      </div>
      ${block.content ? `<div class="block-body">${formatMarkdown(block.content)}</div>` : ''}
      ${block.codeOrData ? `
        <pre class="code-box"><code>${escapeHtml(block.codeOrData)}</code></pre>
      ` : ''}
    </article>`

    case 'output':
      const styleClass = block.outputStyle === 'warning' ? 'callout-warning' : 'callout-result'
      return `
    <article class="card">
      <div class="block-header">
        <h2 class="block-title">${escapeHtml(block.title || 'Expected Output')}</h2>
        <span class="badge badge-green">Output Checkpoint</span>
      </div>
      <div class="callout ${styleClass}" style="margin-top:0;">
        ${formatMarkdown(block.content)}
      </div>
    </article>`

    case 'quiz':
      const quizId = `quiz_${block.id}`
      const expId = `exp_${block.id}`
      const optionsHtml = (block.options || [])
        .map(
          (opt, optIdx) => `
        <button 
          class="quiz-option" 
          onclick="checkAnswer(this, ${optIdx === (block.correctOptionIndex ?? 0)}, '${expId}')"
        >
          <strong>${String.fromCharCode(65 + optIdx)}.</strong> ${escapeHtml(opt)}
        </button>`
        )
        .join('')

      return `
    <article class="card">
      <div class="block-header">
        <h2 class="block-title">Knowledge Check Question</h2>
        <span class="badge badge-amber">Self-Assessment</span>
      </div>
      <p style="font-weight:700; margin-bottom:16px; font-size:16px;">${escapeHtml(block.question || 'Select the correct answer:')}</p>
      <div id="${quizId}">
        ${optionsHtml}
      </div>
      <div id="${expId}" class="explanation-box">
        <strong>Explanation:</strong> ${escapeHtml(block.explanation || 'Review the practical steps above to reinforce this concept.')}
      </div>
    </article>`

    default:
      return ''
  }
}

export function downloadTutorialHtml(doc: TutorialDocument) {
  const html = generateTutorialHtml(doc)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const filename = `${doc.topicSlug || 'tutorial'}-index.html`
  triggerDownload(blob, filename)
}

export function downloadTutorialJson(doc: TutorialDocument) {
  const json = JSON.stringify(doc, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const filename = `tutorial-${doc.topicSlug || 'manifest'}.json`
  triggerDownload(blob, filename)
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
