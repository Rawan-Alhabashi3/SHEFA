import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'

function AdminCouponsPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('coupons.title')}
      description={t('coupons.description')}
      resource="coupons"
      columns={[
        { key: 'id', label: t('coupons.columns.id') },
        { key: 'code', label: t('coupons.columns.code') },
        { key: 'discount_percentage', label: t('coupons.columns.discountPercentage') },
        { key: 'is_used', label: t('coupons.columns.used'), render: (row) => (row.is_used ? t('coupons.statuses.approved') : t('coupons.statuses.pending')), badge: true },
        { key: 'valid_until', label: t('coupons.columns.validUntil') },
      ]}
      editableFields={[
        { name: 'is_used', label: t('coupons.actions.toggleUsed'), nextValue: (row) => !row.is_used },
      ]}
    />
  )
}

export default AdminCouponsPage
