/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import { storageService } from '../services/storageService'
import { backupService, type LearningHubBackup, type SafetySnapshot } from '../services/backupService'
import type { 
  CategoryItem, 
  TopicItem, 
  TopicResource
} from '../types'

export type ReorderDirection = 'up' | 'down' | 'top' | 'bottom'

export interface LearningHubContextType {
  categories: CategoryItem[]
  topics: TopicItem[]
  
  // Category operations
  addCategory: (category: Omit<CategoryItem, 'id' | 'resourceCount'>) => string
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void
  deleteCategory: (id: string) => void
  reorderCategory: (id: string, direction: ReorderDirection) => void
  moveCategory: (fromIndex: number, toIndex: number) => void

  // Topic operations
  addTopic: (topic: Omit<TopicItem, 'id' | 'resources'>) => string
  updateTopic: (id: string, updates: Partial<TopicItem>) => void
  deleteTopic: (id: string) => void
  reorderTopic: (categoryId: string, topicId: string, direction: ReorderDirection) => void
  moveTopic: (categoryId: string, fromIndex: number, toIndex: number) => void

  // Resource operations
  addResource: (topicId: string, resource: Omit<TopicResource, 'id' | 'displayOrder'>) => string
  addResourcesBatch: (topicId: string, resources: Array<Omit<TopicResource, 'id' | 'displayOrder'>>) => { count: number; ids: string[] }
  updateResource: (topicId: string, resourceId: string, updates: Partial<TopicResource>) => void
  deleteResource: (topicId: string, resourceId: string) => void
  reorderResource: (topicId: string, resourceId: string, direction: ReorderDirection) => void
  moveResource: (topicId: string, fromIndex: number, toIndex: number) => void

  // Reset
  resetDemoData: () => void

  // Backup & Restore
  exportBackup: () => void
  importBackupData: (backup: LearningHubBackup) => void
  safetySnapshot: SafetySnapshot | null
  restoreSafetySnapshot: () => boolean
}

const LearningHubContext = createContext<LearningHubContextType | undefined>(undefined)

export const LearningHubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoryItem[]>(() => storageService.getCategories())
  const [topics, setTopics] = useState<TopicItem[]>(() => storageService.getTopics())
  const [safetySnapshot, setSafetySnapshot] = useState<SafetySnapshot | null>(() => backupService.getSafetySnapshot())

  const saveCats = (newCats: CategoryItem[]) => {
    // update resource counts
    const updated = newCats.map((cat) => {
      const catTopics = topics.filter((t) => t.categoryId === cat.id)
      const count = catTopics.reduce((acc, t) => acc + t.resources.length, 0)
      return { ...cat, resourceCount: count }
    })
    setCategories(updated)
    storageService.saveCategories(updated)
  }

  const saveTops = (newTops: TopicItem[], currentCats: CategoryItem[] = categories) => {
    setTopics(newTops)
    storageService.saveTopics(newTops)

    // sync resource counts back to categories
    const updatedCats = currentCats.map((cat) => {
      const catTopics = newTops.filter((t) => t.categoryId === cat.id)
      const count = catTopics.reduce((acc, t) => acc + t.resources.length, 0)
      return { ...cat, resourceCount: count }
    })
    setCategories(updatedCats)
    storageService.saveCategories(updatedCats)
  }

  // ================= CATEGORY ACTIONS =================
  const addCategory = (catData: Omit<CategoryItem, 'id' | 'resourceCount'>): string => {
    const newId = catData.slug || storageService.generateId('cat')
    const newCat: CategoryItem = {
      ...catData,
      id: newId,
      resourceCount: 0,
      displayOrder: categories.length + 1,
    }
    const updated = [...categories, newCat]
    saveCats(updated)
    return newId
  }

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    saveCats(updated)
  }

  const deleteCategory = (id: string) => {
    const updatedCats = categories.filter((cat) => cat.id !== id)
    // delete associated topics
    const updatedTopics = topics.filter((t) => t.categoryId !== id)
    saveCats(updatedCats)
    saveTops(updatedTopics, updatedCats)
  }

  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= categories.length || toIndex >= categories.length) {
      return
    }
    const updated = [...categories]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    // reassign display orders
    const ordered = updated.map((cat, idx) => ({ ...cat, displayOrder: idx + 1 }))
    saveCats(ordered)
  }

  const reorderCategory = (id: string, direction: ReorderDirection) => {
    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) return
    let targetIndex = index
    if (direction === 'up' && index > 0) targetIndex = index - 1
    else if (direction === 'down' && index < categories.length - 1) targetIndex = index + 1
    else if (direction === 'top') targetIndex = 0
    else if (direction === 'bottom') targetIndex = categories.length - 1
    moveCategory(index, targetIndex)
  }

  // ================= TOPIC ACTIONS =================
  const addTopic = (topicData: Omit<TopicItem, 'id' | 'resources'>): string => {
    const newId = storageService.generateId(topicData.categoryId || 'top')
    const catTopics = topics.filter((t) => t.categoryId === topicData.categoryId)
    const newTopic: TopicItem = {
      ...topicData,
      id: newId,
      displayOrder: catTopics.length + 1,
      resources: [],
      relatedTopicIds: topicData.relatedTopicIds || [],
    }
    const updated = [...topics, newTopic]
    saveTops(updated)
    return newId
  }

  const updateTopic = (id: string, updates: Partial<TopicItem>) => {
    const updated = topics.map((t) => (t.id === id ? { ...t, ...updates } : t))
    saveTops(updated)
  }

  const deleteTopic = (id: string) => {
    const updated = topics.filter((t) => t.id !== id)
    saveTops(updated)
  }

  const moveTopic = (categoryId: string, fromIndex: number, toIndex: number) => {
    const catTopics = topics.filter((t) => t.categoryId === categoryId)
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= catTopics.length || toIndex >= catTopics.length) {
      return
    }
    const reordered = [...catTopics]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    const reorderedIds = reordered.map((t, idx) => ({ id: t.id, displayOrder: idx + 1 }))
    const updated = topics.map((t) => {
      const match = reorderedIds.find((r) => r.id === t.id)
      return match ? { ...t, displayOrder: match.displayOrder } : t
    })
    saveTops(updated)
  }

  const reorderTopic = (categoryId: string, topicId: string, direction: ReorderDirection) => {
    const catTopics = topics.filter((t) => t.categoryId === categoryId).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    const index = catTopics.findIndex((t) => t.id === topicId)
    if (index === -1) return
    let targetIndex = index
    if (direction === 'up' && index > 0) targetIndex = index - 1
    else if (direction === 'down' && index < catTopics.length - 1) targetIndex = index + 1
    else if (direction === 'top') targetIndex = 0
    else if (direction === 'bottom') targetIndex = catTopics.length - 1
    moveTopic(categoryId, index, targetIndex)
  }

  // ================= RESOURCE ACTIONS =================
  const addResource = (topicId: string, resData: Omit<TopicResource, 'id' | 'displayOrder'>): string => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic) return ''
    const newId = storageService.generateId('res')
    const newResource: TopicResource = {
      ...resData,
      id: newId,
      displayOrder: targetTopic.resources.length + 1,
      isDemo: true,
    }
    const updatedTopic: TopicItem = {
      ...targetTopic,
      resources: [...targetTopic.resources, newResource],
    }
    const updatedTopics = topics.map((t) => (t.id === topicId ? updatedTopic : t))
    saveTops(updatedTopics)
    return newId
  }

  const addResourcesBatch = (
    topicId: string,
    resourcesData: Array<Omit<TopicResource, 'id' | 'displayOrder'>>
  ): { count: number; ids: string[] } => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic || resourcesData.length === 0) return { count: 0, ids: [] }

    const startIndex = targetTopic.resources.length
    const newIds: string[] = []
    const newResources: TopicResource[] = resourcesData.map((resData, idx) => {
      const newId = storageService.generateId('res')
      newIds.push(newId)
      return {
        ...resData,
        id: newId,
        displayOrder: startIndex + idx + 1,
        isDemo: true,
      }
    })

    const updatedTopic: TopicItem = {
      ...targetTopic,
      resources: [...targetTopic.resources, ...newResources],
    }
    const updatedTopics = topics.map((t) => (t.id === topicId ? updatedTopic : t))
    saveTops(updatedTopics)
    return { count: newResources.length, ids: newIds }
  }

  const updateResource = (topicId: string, resourceId: string, updates: Partial<TopicResource>) => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic) return
    const updatedResources = targetTopic.resources.map((res) =>
      res.id === resourceId ? { ...res, ...updates } : res
    )
    const updatedTopic: TopicItem = { ...targetTopic, resources: updatedResources }
    const updatedTopics = topics.map((t) => (t.id === topicId ? updatedTopic : t))
    saveTops(updatedTopics)
  }

  const deleteResource = (topicId: string, resourceId: string) => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic) return
    const updatedResources = targetTopic.resources
      .filter((res) => res.id !== resourceId)
      .map((res, idx) => ({ ...res, displayOrder: idx + 1 }))
    const updatedTopic: TopicItem = { ...targetTopic, resources: updatedResources }
    const updatedTopics = topics.map((t) => (t.id === topicId ? updatedTopic : t))
    saveTops(updatedTopics)
  }

  const moveResource = (topicId: string, fromIndex: number, toIndex: number) => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic) return
    const resources = [...targetTopic.resources].sort((a, b) => a.displayOrder - b.displayOrder)
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= resources.length || toIndex >= resources.length) {
      return
    }
    const [moved] = resources.splice(fromIndex, 1)
    resources.splice(toIndex, 0, moved)
    const reordered = resources.map((res, idx) => ({ ...res, displayOrder: idx + 1 }))
    const updatedTopic: TopicItem = { ...targetTopic, resources: reordered }
    const updatedTopics = topics.map((t) => (t.id === topicId ? updatedTopic : t))
    saveTops(updatedTopics)
  }

  const reorderResource = (topicId: string, resourceId: string, direction: ReorderDirection) => {
    const targetTopic = topics.find((t) => t.id === topicId)
    if (!targetTopic) return
    const resources = [...targetTopic.resources].sort((a, b) => a.displayOrder - b.displayOrder)
    const index = resources.findIndex((r) => r.id === resourceId)
    if (index === -1) return
    let targetIndex = index
    if (direction === 'up' && index > 0) targetIndex = index - 1
    else if (direction === 'down' && index < resources.length - 1) targetIndex = index + 1
    else if (direction === 'top') targetIndex = 0
    else if (direction === 'bottom') targetIndex = resources.length - 1
    moveResource(topicId, index, targetIndex)
  }

  // ================= RESET ACTION =================
  const resetDemoData = () => {
    const { categories: newCats, topics: newTops } = storageService.resetToDefault()
    setCategories(newCats)
    setTopics(newTops)
  }

  // ================= BACKUP & RESTORE ACTIONS =================
  const exportBackup = () => {
    const backup = backupService.generateBackup(categories, topics)
    backupService.downloadBackup(backup)
  }

  const importBackupData = (backup: LearningHubBackup) => {
    // 1. Create safety snapshot of current data before overwriting
    backupService.createSafetySnapshot(categories, topics)
    setSafetySnapshot(backupService.getSafetySnapshot())

    // 2. Synchronize incoming categories and topics
    const incomingCats = backup.data.categories
    const incomingTops = backup.data.topics

    const syncedCats = incomingCats.map((cat) => {
      const catTopics = incomingTops.filter((t) => t.categoryId === cat.id)
      const count = catTopics.reduce((acc, t) => acc + (t.resources?.length || 0), 0)
      return { ...cat, resourceCount: count }
    })

    setCategories(syncedCats)
    setTopics(incomingTops)
    storageService.saveCategories(syncedCats)
    storageService.saveTopics(incomingTops)
  }

  const restoreSafetySnapshot = (): boolean => {
    const snap = backupService.getSafetySnapshot()
    if (!snap) return false

    setCategories(snap.data.categories)
    setTopics(snap.data.topics)
    storageService.saveCategories(snap.data.categories)
    storageService.saveTopics(snap.data.topics)
    return true
  }

  return (
    <LearningHubContext.Provider
      value={{
        categories,
        topics,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        moveCategory,
        addTopic,
        updateTopic,
        deleteTopic,
        reorderTopic,
        moveTopic,
        addResource,
        addResourcesBatch,
        updateResource,
        deleteResource,
        reorderResource,
        moveResource,
        resetDemoData,
        exportBackup,
        importBackupData,
        safetySnapshot,
        restoreSafetySnapshot,
      }}
    >
      {children}
    </LearningHubContext.Provider>
  )
}

export const useLearningHub = (): LearningHubContextType => {
  const context = useContext(LearningHubContext)
  if (!context) {
    throw new Error('useLearningHub must be used within a LearningHubProvider')
  }
  return context
}
