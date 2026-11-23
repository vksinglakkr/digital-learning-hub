import { BOOKMARK_MASTERCLASS_TEMPLATE_V1, type PromptTemplate } from './bookmarkMasterclassV1'
import { MICRO_LEARNING_ONE_FEATURE_V1 } from './microLearningOneFeatureV1'

export type { PromptTemplate }

// Pilot Template Library Catalog
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  BOOKMARK_MASTERCLASS_TEMPLATE_V1,
  MICRO_LEARNING_ONE_FEATURE_V1
]

export function getPromptTemplateById(id: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.id === id)
}
