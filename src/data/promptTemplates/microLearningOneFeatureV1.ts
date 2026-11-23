import type { PromptTemplate } from './bookmarkMasterclassV1'

export const MICRO_LEARNING_ONE_FEATURE_V1: PromptTemplate = {
  id: 'micro-learning-one-feature-v1',
  name: 'Micro-Learning — One Feature V1',
  version: '1.0.0',
  status: 'approved',
  description: 'Bite-sized, single-feature tutorial generator for absolute beginners. Requires only Category, Topic, and Feature. Automatically plans one WOW demo, practical problem, clean micro-steps, and hands-on practice without overwhelming theory or unrelated advanced features.',
  categoryFit: 'Any Category (Power BI, Excel, Web Dev, Python, SQL) — Ideal for single UI settings, functions, or properties',
  teachingPhilosophy: 'One Feature at a Time (Show One WOW Demo → Practical Problem → Short Steps → Expected Result → Hands-on Practice)',
  lastUpdated: '2026-11-23',
  basePromptText: `# Micro-Learning Tutorial Authoring Prompt: {{FEATURE_NAME}} ({{TOPIC_TITLE}})

You are an expert instructional designer, master educator, and frontend engineer creating a focused, beginner-friendly micro-learning tutorial for the Digital Learning Hub.

## Target Scope & Specifications
- **Category:** {{CATEGORY_TITLE}} (\`{{CATEGORY_SLUG}}\`)
- **Topic:** {{TOPIC_TITLE}} (\`{{TOPIC_SLUG}}\`)
- **Feature / Property:** {{FEATURE_NAME}}
- **Target Audience Level:** {{LEVEL}} (Strictly focused on this single feature; zero unrelated Intermediate or Advanced features)
- **Target Output File:** \`{{TARGET_OUTPUT_PATH}}\`
- **Language Style:** Simple, conversational Hindi mixed with commonly understood English technical terms (Hinglish). Sentences must be short (15-20 words), clear, and beginner-friendly.
- **Format:** A single, self-contained standalone HTML file (HTML5 + CSS3 + Vanilla JavaScript).
- **Strict Dependency Rule:** Zero external runtime dependencies. No external CDNs, frameworks, or fonts that require internet access. Everything (icons as inline SVG, styles, and interactivity) must run completely offline.

---

## Core Teaching Philosophy: "One Feature, Complete Clarity"
> **(Show One WOW Demo → Explain the Practical Problem → Teach Step by Step → Show Expected Outcome → Give a Hands-on Practice Task)**

Keep the tutorial lightweight, highly focused, and proportional to the feature. Do not begin with dry definitions, long theory, or menu listings. First demonstrate what this specific feature does in a single interactive WOW demo, explain the relatable practical scenario and everyday problem it solves, teach the exact execution micro-steps, and give the student an interactive practice task to reinforce learning.

---

## Two-Stage Authoring Workflow: Learning Blueprint First

To ensure pedagogical alignment and administrative control, tutorial authoring must follow a **Two-Stage Workflow**:

### Stage 1: Present the Focused Learning Blueprint for Administrator Approval
Before generating the standalone HTML tutorial, present a concise **Micro-Learning Blueprint**:
1. **Prerequisite & Context:** What minimal prerequisite or visual baseline does the student need to know before touching this feature?
2. **Single Focused WOW Demonstration:** Exactly what the student will see and interact with to experience the feature's instant benefit (e.g. before vs after toggle or interactive click).
3. **Real-World Relatable Problem:** The everyday operational annoyance, layout clutter, or design bottleneck this feature directly solves.
4. **Proportional Practical Steps:** 3 to 6 focused, numbered micro-steps teaching the exact menu clicks, ribbon tabs, or property toggles.
5. **Expected Outcome & Visual Verification:** The exact visual cue or UI transformation the student should see on screen.
6. **Hands-On Practice Task & Evaluation:** A simple, active practice challenge (and an optional 2 to 3 question mini-quiz if useful).

*Wait for administrator approval of the Learning Blueprint before generating the final HTML tutorial.*

### Stage 2: Generate Final Standalone HTML Tutorial
Upon administrator approval of the Learning Blueprint, generate the complete, self-contained standalone HTML tutorial incorporating all approved modules.

---

## Intelligent Content Planning Rules

### 1. Show One Meaningful WOW Demonstration
- Showcase the single feature in action with immediate visual feedback.
- Highlight the visual transformation (e.g., how changing from a vertical list to a dropdown collapses 15 items into a single neat line, freeing 80% canvas space).
- Every interactive control must perform a real, functional action.

### 2. Proportional Structure — No Fluff or Padding
- **One Feature Focus:** Strictly avoid introducing unrelated Intermediate or Advanced features (e.g., do NOT introduce DAX, Sync Slicers, or Edit Interactions when teaching a basic Dropdown Slicer).
- **Practical Micro-Steps:** 3 to 6 steps maximum. Rule: **One primary action per step** with highlighted \`<span class="action-tag">\` tags.
- **Compact Sample Dataset (When Applicable):** If the feature filters or displays data, provide a small, clean dataset (4 to 8 rows) with functional "Copy to Clipboard" and "Download CSV" buttons. If purely visual or conceptual, omit sample data.
- **Proportional Simulator:** Provide a lightweight, focused simulator only if hands-on practice reinforces learning for this specific feature.
- **Mini Assessment (Optional):** 2 to 3 quick multiple-choice questions with instant green/red feedback testing the feature's purpose and usage.

---

## Technical & Styling Guidelines
1. **Design System:** Clean modern UI inspired by Tailwind CSS / Inter typography (slate-900 headers, teal-600 accents, emerald success, rose alerts).
2. **Responsive:** Fully responsive on mobile, tablet, and desktop viewports.
3. **Accessibility:** Keyboard-accessible buttons, proper ARIA attributes, and high-contrast color ratios.
4. **Self-Contained:** All CSS inside \`<style>\` tags, all JavaScript inside \`<script>\` tags. Zero external dependencies.

---

## Additional Requirements
{{ADDITIONAL_REQUIREMENTS}}

---

## Antigravity Execution Instructions
When generating micro-learning tutorials with this prompt:
1. **Blueprint Stage:** In Turn 1, present the concise **Micro-Learning Blueprint** covering the single feature for administrator review. Do not write HTML until the blueprint is approved.
2. **Final Generation Stage:** Upon administrator approval, write the complete, valid standalone HTML document to \`{{TARGET_OUTPUT_PATH}}\`.
   - If the proposed output file already exists, do NOT overwrite it without explicit approval. Use a separate preview file (e.g., \`index.preview.html\`).
   - Do NOT overwrite existing masterclass tutorials or modify the Bookmark tutorial.
3. **Preserve Project Data:** Preserve all existing category IDs, topic IDs, slugs, and existing resource entries.
4. **Verification & Build:**
   - Verify the tutorial renders properly.
   - Run \`npm run build\` to ensure zero compilation or bundle errors.
5. **Reporting:** Report all created and modified files with local preview URLs.
6. **Strict Deployment Policy:** Do NOT commit, push, or deploy without explicit approval.`
}
