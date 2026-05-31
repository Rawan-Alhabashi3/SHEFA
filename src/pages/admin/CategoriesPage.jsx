import { useTranslation } from 'react-i18next'
import AdminModulePage from '../../components/admin/AdminModulePage'

function AdminCategoriesPage() {
  const { t } = useTranslation('admin')

  return (
    <AdminModulePage
      title={t('categories.title')}
      description={t('categories.description')}
      resource="categories"
      columns={[
        { key: 'id', label: t('categories.columns.id') },
        { key: 'slug', label: t('categories.columns.slug') },
        { key: 'name_en', label: t('categories.columns.nameEn') },
        { key: 'name_ar', label: t('categories.columns.nameAr') },
        { key: 'icon', label: t('categories.columns.icon') },
        { key: 'color', label: t('categories.columns.color') },
        { key: 'sort_order', label: t('categories.columns.sortOrder') },
        {
          key: 'is_active',
          label: t('categories.columns.status'),
          badge: true,
          badgeLabelKey: 'accountStatuses',
          badgeNs: 'common',
          badgeValue: row => (row.is_active ? 'active' : 'suspended'),
        },
      ]}
      quickCreate={{
        slug: '',
        name_en: '',
        name_ar: '',
        icon: 'pill',
        color: '#3b82f6',
        description: '',
        sort_order: 0,
        is_active: true,
      }}
      editableFields={[
        {
          name: 'is_active',
          label: t('categories.actions.toggleActive'),
          nextValue: row => !row.is_active,
        },
      ]}
    />
  )
}

export default AdminCategoriesPage
