import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminModulePage from '../../components/admin/AdminModulePage'
import CategoryModal from '../../components/admin/CategoryModal'
import Button from '../../components/common/Button'
import { createAdminResource, updateAdminResource } from '../../services/adminService'

function AdminCategoriesPage() {
  const { t } = useTranslation('admin')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleModalSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await updateAdminResource('categories', editingCategory.id, formData)
      } else {
        await createAdminResource('categories', formData)
      }
      handleModalClose()
      handleRefresh()
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const columns = [
    { key: 'id', label: t('categories.columns.id') },
    { key: 'slug', label: t('categories.columns.slug') },
    { key: 'name_en', label: t('categories.columns.nameEn') },
    { key: 'name_ar', label: t('categories.columns.nameAr') },
    { key: 'icon', label: t('categories.columns.icon') },
    {
      key: 'color',
      label: t('categories.columns.color'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <span 
            className="inline-block w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700"
            style={{ backgroundColor: row.color }}
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">{row.color}</span>
        </div>
      ),
    },
    { key: 'sort_order', label: t('categories.columns.sortOrder') },
    {
      key: 'is_active',
      label: t('categories.columns.status'),
      badge: true,
      badgeLabelKey: 'accountStatuses',
      badgeNs: 'common',
      badgeValue: row => (row.is_active ? 'active' : 'suspended'),
    },
  ]

  const editableFields = [
    {
      name: 'is_active',
      label: t('categories.actions.toggleActive'),
      nextValue: row => !row.is_active,
    },
  ]

  return (
    <>
      <AdminModulePage
        key={refreshKey}
        title={t('categories.title')}
        description={t('categories.description')}
        resource="categories"
        columns={columns}
        quickCreate={null}
        editableFields={editableFields}
        onDataLoaded={setCategories}
        onCreateButton={handleCreate}
        onEditRow={handleEdit}
      />
      
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        existingCategories={categories}
      />
    </>
  )
}

export default AdminCategoriesPage
