export type ResourceStatus = 'Published' | 'Draft' | 'Hidden'

export type AdminResourceType = 
  | 'YouTube Video' 
  | 'Facebook Video' 
  | 'Infographic' 
  | 'PDF' 
  | 'Tutorial' 
  | 'External Link'
  | 'Video'

export type ResourceType = 'Infographic' | 'Video' | 'PDF'

export interface CategoryItem {
  id: string
  title: string
  slug: string
  description: string
  iconName: string
  resourceCount: number
  color: string
  displayOrder?: number
}

export interface TopicResource {
  id: string
  title: string
  description?: string
  type: AdminResourceType
  url: string
  displayOrder: number
  durationOrPages?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  status?: ResourceStatus
  isDemo?: boolean
  creatorName?: string
  creatorUrl?: string
  thumbnailUrl?: string
  originalPlatform?: 'YouTube' | 'Facebook' | 'Web'
  keywords?: string[]
  directContentUrl?: string
  originalSourceUrl?: string
  startTime?: string
  endTime?: string
  startSeconds?: number
  endSeconds?: number
}

export type TopicPresentationStyle = 
  | 'gallery' 
  | 'guided-sequence' 
  | 'situation-based' 
  | 'masterclass' 
  | 'custom-mixed'

export interface TopicSequenceStep {
  stepNumber: number
  resourceId: string
  phaseTitle: string
  objective: string
}

export interface TopicItem {
  id: string
  categoryId: string
  title: string
  slug: string
  shortDescription: string
  detailedDescription?: string
  iconName?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  displayOrder?: number
  presentationStyle?: TopicPresentationStyle
  resources: TopicResource[]
  recommendedSequence?: TopicSequenceStep[]
  relatedTopicIds?: string[]
}

export interface LearningPathItem {
  id: string
  title: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  duration: string
  moduleCount: number
  description: string
  featured: boolean
}

export interface ResourceItem {
  id: string
  title: string
  category: string
  type: ResourceType
  description: string
  readOrWatchTime: string
  tag: string
  publishedDate: string
  creatorName?: string
  creatorUrl?: string
}
