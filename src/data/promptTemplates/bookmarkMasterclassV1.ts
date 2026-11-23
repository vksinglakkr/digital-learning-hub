export interface PromptTemplate {
  id: string
  name: string
  version: string
  status: 'approved' | 'draft-reconstructed'
  description: string
  categoryFit: string
  teachingPhilosophy: string
  provenRoleModelPath?: string
  lastUpdated: string
  reconstructionNotice?: string
  basePromptText: string
}

export const BOOKMARK_MASTERCLASS_TEMPLATE_V1: PromptTemplate = {
  id: 'bookmark-masterclass-v1',
  name: 'Bookmark Interactive Masterclass — V1',
  version: '1.2.0',
  status: 'draft-reconstructed',
  description: 'Role-model masterclass template based on the gold-standard Power BI Bookmark interactive tutorial. Features the "Show the Full Power First — Then Organize Learning by Difficulty" principle, interactive WOW demos across difficulty levels, flexible micro-learning, integrated simulator, challenge, quiz, and content editor.',
  categoryFit: 'Power BI, Excel, Business Intelligence, Data Analytics, Interactive Software Tools',
  teachingPhilosophy: 'Show the Full Power First — Then Organize Learning by Difficulty (First Show the Power → Explain the Problem → Teach Step by Step → Let the Student Practice)',
  provenRoleModelPath: 'public/tutorials/power-bi/bookmark/index.html',
  lastUpdated: '2026-11-23',
  reconstructionNotice: 'Notice: The original authoring prompt text file was not present in the repository. This template has been meticulously reconstructed directly from the gold-standard Power BI Bookmark tutorial (public/tutorials/power-bi/bookmark/index.html) and its documentation (README.md, CONTENT-GUIDE.md, QA-REPORT.md) for administrator review.',
  basePromptText: `# Masterclass Tutorial Authoring Prompt: {{TOPIC_TITLE}}

You are an expert instructional designer, master educator, and frontend engineer creating a gold-standard interactive learning tutorial for the Digital Learning Hub.

## Target Topic & Output Specifications
- **Category:** {{CATEGORY_TITLE}} (\`{{CATEGORY_SLUG}}\`)
- **Topic:** {{TOPIC_TITLE}} (\`{{TOPIC_SLUG}}\`)
- **Target Output File:** \`{{TARGET_OUTPUT_PATH}}\`
- **Language Style:** Simple, conversational Hindi mixed with commonly understood English technical terms (Hinglish). Sentences must be short (15-20 words), clear, and beginner-friendly.
- **Format:** A single, self-contained standalone HTML file (HTML5 + CSS3 + Vanilla JavaScript).
- **Strict Dependency Rule:** Zero external runtime dependencies. No external CDNs, frameworks, or fonts that require internet access. Everything (icons as inline SVG, styles, and interactivity) must run completely offline.

---

## Core Teaching Philosophy
> **"Show the Full Power First — Then Organize Learning by Difficulty."**  
> *(First Show the Power → Explain the Problem → Teach Step by Step → Let the Student Practice)*

Do not begin with dry definitions, long theory, or menu listings. First demonstrate what is possible across the full breadth of the feature to spark curiosity, explain the relatable business scenario and problem, organize the micro-learning logically by difficulty level, and then give the student an interactive simulator, challenge, and quiz to practice.

---

## Two-Stage Authoring Workflow: Learning Blueprint First

To ensure pedagogical alignment and administrative control, tutorial authoring must follow a **Two-Stage Workflow**:

### Stage 1: Present the Learning Blueprint for Administrator Approval
Before generating the standalone HTML tutorial, identify the topic's important capabilities and practical use cases across the full spectrum. Present a concise **Learning Blueprint** for administrator review:
1. **Key Capabilities:** Core functionalities and real-world use cases identified for {{TOPIC_TITLE}}.
2. **Proposed WOW Demonstrations:** Opening interactive demonstrations planned to showcase the feature's breadth (including selected Intermediate/Advanced capabilities).
3. **Identified Learning Levels:** Natural classification into Beginner, Intermediate, and/or Advanced levels based on actual complexity and prerequisites (do not force all three levels if the topic does not justify them).
4. **Features to Teach in Detail:** Specific execution micro-steps mapped to each identified learning level.
5. **Hands-On Practice Plan:** Planned integrated simulator(s), student challenge scenario, and assessment quiz.

*Wait for administrator approval or customization of the Learning Blueprint before generating the final HTML tutorial.*

### Stage 2: Generate Final Standalone HTML Tutorial
Upon administrator approval of the Learning Blueprint, generate the complete, self-contained standalone HTML tutorial incorporating all approved modules.

---

## Pedagogical Principles & Content Architecture

### 1. Show the Breadth in Opening WOW Demonstrations
- The opening WOW Demo section must showcase the full breadth and possibilities of {{TOPIC_TITLE}} through meaningful interactive demonstrations.
- **Not Limited to Beginner Features:** Showcase selected Intermediate and Advanced capabilities too (e.g., multi-condition cross-filtering, synchronizing visual states, or automated reset behaviors), giving students an inspiring sense of the feature's real power without overwhelming them.
- **Group Related Capabilities:** Group complementary capabilities into unified demonstrations where practical. Do not create separate, superficial demos for minor options.
- **Functional Interactivity:** Every interactive control, toggle, or button must perform a real, meaningful action that changes the view, data, or state. Do not add nonfunctional or purely decorative buttons.

### 2. Organize Learning Content by Difficulty Level
- Automatically classify the practical learning content into **Beginner**, **Intermediate**, and/or **Advanced** levels based on actual complexity and prerequisite skills:
  - **Beginner Level:** Fundamental concepts, primary UI access points, basic visual setup, single-click operations.
  - **Intermediate Level:** Multi-select operations, cross-visual interactions, formatting nuances, layout optimization.
  - **Advanced Level:** Multi-state synchronization, complex business logic, edge-case troubleshooting, performance considerations.
- **Natural Difficulty Scoping:** Do not artificially force all three levels when a topic does not justify them. If a topic naturally spans only Beginner and Intermediate, organize accordingly without padding.
- **Administrator Customization:** Default to automatic planning, but allow the administrator to review, adjust, or override learning levels and feature coverage during Blueprint review.

### 3. Flexible Structure & No Fixed Counts
- **No Fixed Component Counts:** Decide the exact quantity of demonstrations, practical steps, sample data rows, challenge tasks, and quiz questions based strictly on the pedagogical requirements of {{TOPIC_TITLE}}. Do not artificially force fixed numbers.
- **Selective Module Usage:** The modules below are suggested starting points. Choose, combine, reorder, or omit modules based on the topic's learning objectives. Not every tutorial needs all eight modules.

---

## Suggested Learning Modules — Select and Adapt According to Topic Requirements

### Module 1: Interactive WOW Demonstrations (Show the Full Power First)
- Place this module prominently near the top so the student immediately experiences what {{TOPIC_TITLE}} achieves.
- Provide live, clickable demonstration cards illustrating key transformations spanning beginner to advanced capabilities.
- A Before/After comparison is not required in every demonstration—use clickable demonstrations, visual comparisons, state toggles, or other suitable explanations best fitting the concept.
- Every interactive control must perform a meaningful action.
- Each demonstration card must include:
  - An interactive preview canvas with responsive, clickable controls.
  - A concise educational callout box explaining the core takeaway (*"यहाँ क्या हुआ?"*).

### Module 2: Real-World Business Scenario & Expected Output
- Present a relatable real-world business context, scenario, or story (e.g., retail store sales, departmental budgeting, inventory monitoring, or customer support metrics).
- State the specific challenge or operational bottleneck faced before applying {{TOPIC_TITLE}}.
- Provide a clear expected output comparison illustrating the tangible final result the student will build.

### Module 3: Clean Sample Dataset (When Applicable)
- When the topic involves tabular or analytical data, provide a compact, clean sample dataset (e.g., 4 to 8 rows).
- Include functional **"Copy to Clipboard"** and **"Download CSV"** buttons so students can follow along in their own desktop software.
- If the topic is purely conceptual or settings-focused and requires no data table, omit this module.

### Module 4: Practical Step-by-Step Micro-Learning (Grouped by Difficulty)
- Break down the implementation into clear, numbered micro-steps organized by difficulty level (Beginner → Intermediate → Advanced).
- Rule: **One primary action per step** (never crowd multiple menu clicks or unrelated tasks into a single step).
- For each step, provide:
  1. A clear numbered title and phase indicator (including difficulty tier).
  2. Detailed instructions with highlighted \`<span class="action-tag">\` tags for buttons, tabs, ribbon items, or fields.
  3. **Expected Outcome:** Exactly what the student should see on screen after completing the action.
  4. **Pro-Tips (Selective):** Include a Pro-Tip only when it adds meaningful learning value (such as a time-saving keyboard shortcut or a common beginner pitfall). Do not force Pro-Tips on every step, and never invent official Microsoft recommendations.
  5. **Visual Media:** An SVG diagram is not required for every step. Use genuine software screenshots when available. When genuine screenshots are unavailable, use clearly labeled simulated illustrations.
  6. **Image Zoom:** Provide an image zoom or Lightbox inspection modal where useful for inspecting fine UI details.

### Module 5: Interactive Hands-On Simulator
- Provide an integrated, simulated software workspace embedded directly in the tutorial when hands-on practice reinforces learning.
- **Simulator Quantity:** Do not fix the number of simulators. One integrated simulator may cover multiple WOW demonstrations and workflows. Create separate simulators only when different workflows or distinct learning objectives justify them. Do not automatically create one simulator for every WOW demonstration.
- Provide simulated panels relevant to the topic (e.g., Selection Pane eye visibility toggles, Bookmarks Pane operations, or slicer controls).
- The simulated canvas must update dynamically in real time when controls are toggled, simulating authentic software behavior.

### Module 6: Student Practice Challenge
- Give the student an active practice challenge (*"अब आप खुद करके देखिए!"*) extending what was taught across the covered difficulty tiers.
- Include an interactive checklist where students check off steps as they complete them.
- Provide a progress indicator and an optional, toggleable **"Hint"** box providing guidance if the student gets stuck.

### Module 7: Interactive Self-Assessment Quiz
- Provide multiple-choice questions testing both conceptual understanding and practical decision-making across the difficulty levels taught.
- Instant feedback upon selecting an option:
  - Correct option highlights green with an encouraging, clear explanation.
  - Incorrect option highlights red with a helpful diagnostic hint.
- Dynamic score tracking and a **"Retake Quiz"** button.

### Module 8: Built-in Tutorial Content Editor (Optional Lightweight In-Browser Authoring)
- Retain the built-in Content Editor as an optional module, recommended for substantial masterclasses (such as the Bookmark Masterclass).
- When included, it must support:
  - Editing step titles, instructions, expected outcomes, and pro-tips directly in the browser.
  - Reordering steps (Move Up / Move Down), adding steps, or deleting steps.
  - **Screenshot Replacement:** An image file picker converting local PNG/JPG screenshots into Base64 Data URLs so instructors can replace illustrations with genuine software screenshots without editing code.
  - **Local Draft Saving:** Persisting in-progress edits to browser \`localStorage\` with a visible draft status badge.
  - **Reliable Standalone Export:** Generating an exported standalone HTML file that actually includes all uploaded screenshots, custom text, styles, and scripts. Do not claim exported HTML is self-contained unless all required content is actually baked in.
  - **Export / Import JSON:** Reliable export and import of tutorial configuration.

---

## Technical & Styling Guidelines
1. **Design System:** Clean modern UI inspired by Tailwind CSS / Inter typography (slate-900 headers, teal-600 accents, emerald success, rose alerts).
2. **Responsive:** Fully responsive on mobile, tablet, and desktop viewports.
3. **Accessibility:** Keyboard-accessible buttons, proper ARIA attributes for modals, and high-contrast color ratios.
4. **Self-Contained:** All CSS inside \`<style>\` tags, all JavaScript inside \`<script>\` tags. Zero external dependencies.

---

## Additional Administrator Requirements
{{ADDITIONAL_REQUIREMENTS}}

---

## Antigravity Execution Instructions
When generating tutorials with this prompt:
1. **Blueprint Stage:** In Turn 1, identify key capabilities, classify learning levels (Beginner, Intermediate, Advanced), and present the concise **Learning Blueprint** for administrator review. Do not write the full HTML tutorial until the blueprint is approved.
2. **Final Generation Stage:** Upon administrator approval of the Learning Blueprint, write the complete, valid standalone HTML document to \`{{TARGET_OUTPUT_PATH}}\`.
   - If the proposed output file already exists, do NOT overwrite it without explicit approval. Use a separate preview or test file (e.g., \`index.preview.html\` or \`index.test.html\`).
   - Do NOT modify the existing Bookmark gold-standard tutorial (\`public/tutorials/power-bi/bookmark/index.html\`).
3. **Preserve Project Data:** Preserve all existing category IDs, topic IDs, slugs, and existing resource entries.
4. **Registration:** Register the new tutorial in \`src/config/topicTutorials.ts\` only after verification and explicit administrator approval.
5. **Verification & Build:**
   - Verify the tutorial renders in the browser under the Vite development server.
   - Run \`npm run build\` to ensure zero compilation or bundle errors.
6. **Reporting:** Report all created and modified files with line numbers and local preview URLs.
7. **Strict Deployment Policy:** Do NOT commit, push, or deploy without explicit approval.`
}
