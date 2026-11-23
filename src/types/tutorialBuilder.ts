export type TeachingApproach = 
  | 'step-by-step' 
  | 'interactive-masterclass' 
  | 'visual-learning' 
  | 'prompt-result' 
  | 'custom'

export type TutorialBlockType = 
  | 'text' 
  | 'step' 
  | 'image' 
  | 'example' 
  | 'output' 
  | 'quiz'

export interface TutorialBlock {
  id: string
  type: TutorialBlockType
  title?: string
  content?: string
  // Step-specific
  stepNumber?: number
  tip?: string
  expectedResult?: string
  // Image-specific
  imageUrl?: string
  caption?: string
  altText?: string
  // Example / Data specific
  codeOrData?: string
  language?: string
  // Output-specific
  outputStyle?: 'success' | 'info' | 'warning'
  // Quiz-specific
  question?: string
  options?: string[]
  correctOptionIndex?: number
  explanation?: string
}

export interface TutorialDocument {
  id: string
  categoryId: string
  topicTitle: string
  topicSlug: string
  subtitle: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  approach: TeachingApproach
  blocks: TutorialBlock[]
  createdAt: string
  updatedAt: string
  status: 'Draft'
  author?: string
}

export interface ApproachMeta {
  id: TeachingApproach
  title: string
  subtitle: string
  badge: string
  description: string
  recommendedFor: string
  defaultBlockTypes: TutorialBlockType[]
}

export const TEACHING_APPROACHES: ApproachMeta[] = [
  {
    id: 'step-by-step',
    title: 'Practical Step-by-Step',
    subtitle: 'Clear, sequential walkthrough with screenshots and checkpoints',
    badge: 'Procedural',
    description: 'Walks the student through linear instructions with screenshot guidance and expected results at each micro-step.',
    recommendedFor: 'Power Query merges, tool setup, software configuration',
    defaultBlockTypes: ['text', 'step', 'output'],
  },
  {
    id: 'interactive-masterclass',
    title: 'Interactive Masterclass',
    subtitle: 'Concept immersion, live demos, practice challenges, and quizzes',
    badge: 'Role Model',
    description: 'First experience the power, then learn how to build it. Incorporates conceptual framing, guided steps, and knowledge checks.',
    recommendedFor: 'Power BI Bookmarks, DAX context transition, complex architectures',
    defaultBlockTypes: ['text', 'step', 'output', 'quiz'],
  },
  {
    id: 'visual-learning',
    title: 'Visual / Mobile Learning',
    subtitle: 'Diagram-first mental models, infographics, and quick cards',
    badge: 'Visual First',
    description: 'Built around high-resolution diagrams, architecture flowcharts, and quick memory aids for rapid visual comprehension.',
    recommendedFor: 'Math Magic tricks, Git branch trees, keyboard shortcuts',
    defaultBlockTypes: ['text', 'image', 'example', 'quiz'],
  },
  {
    id: 'prompt-result',
    title: 'Prompt & Result Learning',
    subtitle: 'Side-by-side inputs, prompt formulas, and verified outputs',
    badge: 'AI & Formulas',
    description: 'Direct comparison between business intent, exact prompt/formula syntax, and produced output.',
    recommendedFor: 'AI prompt engineering, n8n webhook payloads, advanced Excel formulas',
    defaultBlockTypes: ['text', 'example', 'output'],
  },
  {
    id: 'custom',
    title: 'Custom / Mix & Match',
    subtitle: 'Flexible canvas to assemble any combination of learning blocks',
    badge: 'Modular',
    description: 'A completely open workspace allowing you to mix any learning blocks to match unique teaching goals.',
    recommendedFor: 'Hybrid topics, cross-discipline case studies',
    defaultBlockTypes: ['text'],
  },
]

export interface BlockTypeInfo {
  type: TutorialBlockType
  label: string
  oneSentenceExplanation: string
  badgeColor: string
}

export const BLOCK_TYPE_INFOS: Record<TutorialBlockType, BlockTypeInfo> = {
  text: {
    type: 'text',
    label: 'Text / Explanation',
    oneSentenceExplanation: 'Explains foundational concepts, business context, and core principles in simple language.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  step: {
    type: 'step',
    label: 'Step-by-Step Instruction',
    oneSentenceExplanation: 'Walks the student through precise action steps with expected results, pro-tips, and optional screenshots.',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  image: {
    type: 'image',
    label: 'Image / Diagram',
    oneSentenceExplanation: 'Shows standalone architecture diagrams, annotated screenshots, or visual models with zoom support.',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  example: {
    type: 'example',
    label: 'Example / Sample Data',
    oneSentenceExplanation: 'Provides copyable code, DAX formulas, Excel formulas, JSON payloads, or data tables.',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  output: {
    type: 'output',
    label: 'Expected Output Checkpoint',
    oneSentenceExplanation: 'A color-coded visual checkpoint showing what the student should see when the step is complete.',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  quiz: {
    type: 'quiz',
    label: 'Practice Question',
    oneSentenceExplanation: 'An interactive multiple-choice question with instant answer feedback and clear explanation.',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
  },
}
