import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'

function CategoriesPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('categories.title')}
      description={t('categories.description')}
      resource="medicines"
      columns={[
        { key: 'id', label: t('categories.columns.id') },
        { key: 'name', label: t('categories.columns.medicine') },
        { key: 'category', label: t('categories.columns.category'), badge: true },
        { key: 'category_label', label: t('categories.columns.categoryLabel') },
        { key: 'manufacturer', label: t('categories.columns.manufacturer') },
      ]}
      editableFields={[
        { name: 'category', label: t('categories.actions.setGeneral'), nextValue: () => 'general' },
      ]}
    />
  )
}

export default CategoriesPage
