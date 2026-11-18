import React, { useState } from 'react'
import { useLearningHub } from '../../context/LearningHubContext'
import { DeleteConfirmModal } from './DeleteConfirmModal'
import type { CategoryItem } from '../../types'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  GripVertical, 
  ChevronsUp, 
  ChevronUp, 
  ChevronDown, 
  ChevronsDown,
  Layers,
  X
} from 'lucide-react'

export const CategoryManager: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategory, 
    moveCategory 
  } = useLearningHub()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [iconName, setIconName] = useState('Layers')

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null)

  const openAddModal = () => {
    setEditingCategory(null)
    setTitle('')
    setSlug('')
    setDescription('')
    setIconName('Layers')
    setIsModalOpen(true)
  }

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat)
    setTitle(cat.title)
    setSlug(cat.slug)
    setDescription(cat.description)
    setIconName(cat.iconName || 'Layers')
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        title: title.trim(),
        slug: generatedSlug,
        description: description.trim(),
        iconName,
      })
    } else {
      addCategory({
        title: title.trim(),
        slug: generatedSlug,
        description: description.trim(),
        iconName,
        color: 'teal',
      })
    }
    setIsModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-700" />
            <span>Manage Categories ({categories.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize main disciplines. Drag or use the directional controls to adjust display sequence.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10)
              if (!isNaN(fromIdx)) moveCategory(fromIdx, index)
            }}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-xl transition-all gap-4"
          >
            {/* Left info & Drag Handle */}
            <div className="flex items-start md:items-center gap-3">
              <div 
                className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <span className="w-6 h-6 rounded-md bg-slate-200/80 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                {cat.displayOrder || index + 1}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    /{cat.slug}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    {cat.resourceCount} resources
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-xl">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Right actions: Reorder buttons & Edit/Delete */}
            <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
              {/* Accessible Reorder buttons */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => reorderCategory(cat.id, 'top')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move to Top"
                  aria-label="Move to Top"
                >
                  <ChevronsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderCategory(cat.id, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Up"
                  aria-label="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderCategory(cat.id, 'down')}
                  disabled={index === categories.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move Down"
                  aria-label="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderCategory(cat.id, 'bottom')}
                  disabled={index === categories.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Move to Bottom"
                  aria-label="Move to Bottom"
                >
                  <ChevronsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => openEditModal(cat)}
                className="p-1.5 text-slate-600 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                title="Edit Category"
                aria-label="Edit Category"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteTarget(cat)}
                className="p-1.5 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
                title="Delete Category"
                aria-label="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                  Category Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cloud Architecture"
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
                  placeholder="e.g. cloud-architecture"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of this educational discipline..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Icon Identifier
                </label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-600 font-mono"
                >
                  <option value="BarChart3">BarChart3 (Analytics / BI)</option>
                  <option value="Workflow">Workflow (Automation)</option>
                  <option value="TableProperties">TableProperties (Spreadsheets)</option>
                  <option value="GitBranch">GitBranch (Version Control)</option>
                  <option value="Sparkles">Sparkles (AI & Productivity)</option>
                  <option value="Binary">Binary (Math / Logic)</option>
                  <option value="Layers">Layers (General)</option>
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
                  {editingCategory ? 'Update Category' : 'Create Category'}
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
        itemDescription="Deleting this category will also remove all topics and resources indexed under it."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
