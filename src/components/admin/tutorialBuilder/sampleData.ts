import type { TutorialDocument } from '../../../types/tutorialBuilder'

export const CONDITIONAL_FORMATTING_PILOT: TutorialDocument = {
  id: 'tut-power-bi-conditional-formatting',
  categoryId: 'power-bi',
  topicTitle: 'Conditional Formatting',
  topicSlug: 'conditional-formatting',
  subtitle: 'Master dynamic color rules, data bars, and KPI indicators in Power BI tables and matrix visuals.',
  difficulty: 'Beginner',
  approach: 'step-by-step',
  status: 'Draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: [
    {
      id: 'block-cf-1',
      type: 'text',
      title: 'What is Conditional Formatting in Power BI?',
      content: 'Conditional Formatting lets report designers apply dynamic formatting (background colors, font colors, data bars, or icons) to visual data cells based on specific rules, field values, or DAX measures.\n\nInstead of scanning hundreds of raw numbers, business stakeholders can instantly identify revenue thresholds, highlight negative variances in red, and celebrate exceeded targets in green.',
    },
    {
      id: 'block-cf-2',
      type: 'step',
      stepNumber: 1,
      title: 'Configure Background Color Rules on Matrix Cells',
      content: '1. Select your target **Sales & Profit Matrix** visual on the report canvas.\n2. In the right-hand **Visualizations pane**, navigate to the **Format visual** tab.\n3. Scroll down and expand the **Cell elements** card.\n4. Ensure your measure (e.g. *Total Sales*) is selected in the Series dropdown.\n5. Toggle **Background color** to **On**, then click the **fx** conditional formatting icon to configure rule boundaries.',
      tip: 'Pro Tip: Always use hex colors with accessible contrast ratios so text remains readable against colored backgrounds.',
      expectedResult: 'The Background Color formatting dialog opens, displaying default minimum and maximum gradient color thresholds ready for custom rule definitions.',
      caption: 'Power BI Cell Elements formatting pane with Background color fx button',
    },
    {
      id: 'block-cf-3',
      type: 'output',
      title: 'Expected Visual Result: Dynamic Profit Heatmap',
      content: 'When applied to your matrix visual:\n• Transactions exceeding ₹50,000 are highlighted with soft green shading.\n• Transactions under ₹10,000 are highlighted in gentle amber/red.\n• Moderate sales numbers retain neutral white background for high visual contrast.',
      outputStyle: 'success',
    },
  ],
}
