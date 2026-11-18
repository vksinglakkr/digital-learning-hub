import React, { useState } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import type { TopicItem } from '../../types'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  ChevronsUp, 
  ChevronUp, 
  ChevronDown, 
  ChevronsDown,
  BookOpen,
  Filter,
  X
} from 'lucide-react'

export const TopicManager: React.FC = () => {
  const { 
    categories, 
    topics, 
    addTopic, 
    updateTopic, 
    deleteTopic, 
    reorderTopic, 
    moveTopic 
  } = useLearningHub()

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(
    categories[0]?.id || ''
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null)

  // Form State
  const [categoryId, setCategoryId] = useState(selectedCategoryFilter || categories[0]?.id || '')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [detailedDescription, setDetailedDescription] = useState('')
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate')

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<TopicItem | null>(null)

  // Filter topics based on selection
  const filteredTopics = topics
    .filter((t) => (selectedCategoryFilter ? t.categoryId === selectedCategoryFilter : true))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const openAddModal = () => {
    setEditingTopic(null)
    setCategoryId(selectedCategoryFilter || categories[0]?.id || '')
    setTitle('')
    setSlug('')
    setShortDescription('')
    setDetailedDescription('')
    setDifficulty('Intermediate')
    setIsModalOpen(true)
  }

  const openEditModal = (t: TopicItem) => {
    setEditingTopic(t)
    setCategoryId(t.categoryId)
    setTitle(t.title)
    setSlug(t.slug)
    setShortDescription(t.shortDescription)
    setDetailedDescription(t.detailedDescription || '')
    setDifficulty(t.difficulty || 'Intermediate')
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !categoryId) return

    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (editingTopic) {
      updateTopic(editingTopic.id, {
        categoryId,
        title: title.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim() || shortDescription.trim(),
        difficulty,
      })
    } else {
      addTopic({
        categoryId,
        title: title.trim(),
        slug: generatedSlug,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim() || shortDescription.trim(),
        difficulty,
      })
    }
    setIsModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteTopic(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span>Manage Topics ({filteredTopics.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and organize topics by category. Use drag-and-drop or directional buttons to reorder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Topics List */}
      {filteredTopics.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs font-medium">No topics registered for this category yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic, index) => {
            const parentCategory = categories.find((c) => c.id === topic.categoryId)

            return (
              <div
                key={topic.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10)
                  if (!isNaN(fromIdx)) moveTopic(topic.categoryId, fromIdx, index)
                }}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-xl transition-all gap-4"
              >
                {/* Left Info & Drag Handle */}
                <div className="flex items-start md:items-center gap-3">
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className="w-6 h-6 rounded-md bg-slate-200/80 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {topic.displayOrder || index + 1}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                      <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        {parentCategory?.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        /{topic.slug}
                      </span>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {topic.resources.length} resources
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-xl">
                      {topic.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  {/* Directional Reorder buttons */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => reorderTopic(topic.categoryId, topic.id, 'top')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move to Top"
                      aria-label="Move to Top"
                    >
                      <ChevronsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderTopic(topic.categoryId, topic.id, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderTopic(topic.categoryId, topic.id, 'down')}
                      disabled={index === filteredTopics.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderTopic(topic.categoryId, topic.id, 'bottom')}
                      disabled={index === filteredTopics.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move to Bottom"
                      aria-label="Move to Bottom"
                    >
                      <ChevronsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditModal(topic)}
                    className="p-1.5 text-slate-600 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors"
                    title="Edit Topic"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(topic)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors"
                    title="Delete Topic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Topic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingTopic ? 'Edit Topic' : 'Create New Topic'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parent Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600 font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drill Through"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL Slug <span className="text-slate-400 font-normal lowercase">(auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. drill-through"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence description of the topic..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Curriculum Description
                </label>
                <textarea
                  rows={3}
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="In-depth explanation of concepts covered under this topic..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  {editingTopic ? 'Update Topic' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title || ''}
        itemDescription="Deleting this topic will also remove all resources registered under it."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
