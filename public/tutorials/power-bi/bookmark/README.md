# Power BI Bookmark Interactive Tutorial
## Digital Learning Lab Gold-Standard Tutorial

### Overview
This tutorial is a **visually rich, highly interactive, beginner-friendly Power BI Bookmark Tutorial** designed as the **Role Model for future Digital Learning Lab tutorials**.

### Location & Structure
```text
public/tutorials/power-bi/bookmark/
├── index.html        # Main self-contained interactive tutorial & content editor
├── README.md         # Architecture and usage instructions
├── CONTENT-GUIDE.md  # Content authoring and screenshot replacement guide
└── QA-REPORT.md      # Testing matrix and genuine screenshot tracker
```

### Complete Modules Implemented
1. **Module 1 (5 Interactive WOW Demos):**
   - **Sales View vs Profit View:** Seamless single-dashboard chart toggle.
   - **Show/Hide Filter Panel:** Slide-out drawer demonstrating canvas space optimization.
   - **Reset Filters:** Interactive Product/City slicers with instant reset.
   - **Multi-View Dashboard Navigation:** Three distinct dashboard views (Executive Overview, Product Analysis, City Analysis).
   - **Before vs After:** Interactive Selection Pane manual hassle vs 1-click Bookmark.
2. **Module 2 (Problem & Expected Output):** Practical electronics shop scenario.
3. **Module 3 (Sample Data):** 4-row dataset with Copy to Clipboard and Download CSV buttons.
4. **Module 4 (20 Micro-Learning Practical Steps):**
   - One main action per step.
   - Large annotated UI diagram with numbered pointers and click highlights.
   - Lightbox zoom modal for detailed inspection.
5. **Module 5 (Interactive Bookmark Simulator):**
   - Simulated Power BI Desktop workspace.
   - Selection Pane with toggleable eye icons.
   - Bookmarks Pane with `+ Add`, `Apply`, `Update`, and `Delete` actions.
6. **Module 6 (Student Challenge):**
   - "अब तीसरा Bookmark खुद बनाइए!" — Discount View challenge with interactive checklist and hints.
7. **Module 7 (Interactive Quiz):**
   - 6 multiple-choice revision questions with bilingual explanations and score tracking.
8. **Simple Tutorial Content Editor:**
   - Click `✏️ Content Editor` in the top header.
   - Edit step titles, instructions, expected outcomes, and pro-tips.
   - Reorder, add, or delete steps.
   - **Upload genuine Power BI Desktop screenshots** to replace SVG diagrams without coding.
   - Save local drafts in browser `localStorage`.
   - Export standalone updated HTML or JSON packages ready for deployment.

### How to Run Locally
#### Option 1: Standalone Browser Launch
Open `public/tutorials/power-bi/bookmark/index.html` directly in any modern browser. Zero build step or internet connection required.

#### Option 2: Via Digital Learning Hub Development Server
Run in the project root:
```bash
npm run dev
```
Visit: `http://localhost:5173/tutorials/power-bi/bookmark/index.html`
