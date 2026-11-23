# Content Guide — Power BI Bookmark Interactive Tutorial
**Project:** Digital Learning Lab (\`C:\\Users\\HP\\Documents\\Digital-Learning-Hub\`)  
**Tutorial Path:** \`public/tutorials/power-bi/bookmark/\`

---

## 1. Overview
This content guide is intended for content authors, instructional designers, and developers who want to edit or extend the **Power BI Bookmark Interactive Tutorial**.

---

## 2. File Organization
\`\`\`text
public/tutorials/power-bi/bookmark/
├── index.html        # Main self-contained single-page tutorial (HTML + CSS + JS)
├── README.md         # Architecture and quick-start instructions
├── CONTENT-GUIDE.md  # Content authoring and screenshot replacement guide (this file)
└── QA-REPORT.md      # Testing matrix and genuine screenshot tracker
\`\`\`

---

## 3. How to Edit the Text & Instructions

All educational text is structured inside \`index.html\`:

### 3.1 Editing the WOW Demos (Module 1)
- Find section with ID \`#demos\`.
- Each demo is contained inside a \`<div class="demo-content" id="demo-X">\`.
- **Educational Callout:** To modify the key teaching takeaway, edit the \`<div class="edu-callout">\` block within each demo.

### 3.2 Editing the Sample Dataset (Module 3)
- The HTML table is located inside \`<table class="data-table">\`.
- The clipboard copy text is located in JavaScript: \`copySampleData()\`.
- The CSV download format is located in JavaScript: \`downloadSampleCsv()\`.
- If modifying values, ensure the totals in Module 1 and Module 2 match:
  - Laptop: ₹50,000 (Profit: ₹12,000)
  - Mobile: ₹35,000 (Profit: ₹9,000)
  - Tablet: ₹20,000 (Profit: ₹5,000)
  - Accessories: ₹15,000 (Profit: ₹4,000)
  - **Total Sales:** ₹1,20,000 | **Total Profit:** ₹30,000

### 3.3 Editing the 20 Practical Learning Steps (Module 4)
All 20 steps are configured in the JavaScript array \`stepsData\` at the bottom of \`index.html\`:
\`\`\`javascript
{
  id: 1,
  topic: "Data Setup",
  title: "1. Power BI Desktop खोलें",
  instruction: "अपने कंप्यूटर पर <span class='action-tag'>Power BI Desktop</span> ऐप को ओपन करें...",
  expected: "Power BI Desktop की खाली कैनवास स्क्रीन खुलेगी।",
  protip: "Power BI Desktop को Microsoft Store से मुफ्त में डाउनलोड किया जा सकता है।",
  svg: \`<svg>...</svg>\`
}
\`\`\`
To edit a step:
1. Update \`instruction\` for what the user should click or do.
2. Update \`expected\` for the outcome.
3. Update \`protip\` for Microsoft official best practices.

---

## 4. How to Substitute Genuine Power BI Screenshots

Currently, all 20 steps render crisp inline SVG instructional illustrations with red numbered markers and highlighted click targets.

When replacing an SVG with a genuine screenshot:
1. Place the PNG screenshot in an \`assets/\` folder:
   \`public/tutorials/power-bi/bookmark/assets/step-02-enter-data.png\`
2. In \`stepsData\` in \`index.html\`, replace the \`svg\` property:
   \`\`\`javascript
   // Change from inline svg string:
   svg: \`<img src="assets/step-02-enter-data.png" alt="Enter Data Ribbon" style="max-width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);" />\`
   \`\`\`
3. Update the top bar badge in the diagram frame from \`Illustrative Demo\` to \`Genuine Screenshot\`.

---

## 5. Language Guidelines
- Maintain simple conversational Hindi with commonly understood English technical words:
  - *Bookmark, Dashboard, Slicer, Filter, Selection Pane, View Tab, Canvas, Clustered Column Chart, Eye Icon, Data, Display.*
- Keep instructional sentences short (maximum 15-20 words per sentence).
- Always explain **why** before explaining **how**.
