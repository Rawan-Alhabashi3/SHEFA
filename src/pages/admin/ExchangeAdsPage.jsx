import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage'
import { formatPrice } from '../../utils/format'

function AdminExchangeAdsPage() {
  const { t } = useTranslation("admin");
  return (
    <AdminModulePage
      title={t('exchangeAds.title')}
      description={t('exchangeAds.description')}
      resource="exchange-ads"
      columns={[
        { key: 'id', label: t('exchangeAds.columns.id') },
        { key: 'medicine_name', label: t('exchangeAds.columns.medicine') },
        { key: 'ad_type', label: t('exchangeAds.columns.type'), badge: true, badgeLabelKey: 'adTypes', badgeNs: 'common' },
        { key: 'price', label: t('exchangeAds.columns.price'), render: (row) => formatPrice(row.price || 0) },
        {
          key: 'security_check_status',
          label: t('exchangeAds.columns.verification'),
          badge: true,
          badgeLabelKey: 'statusLabels',
          badgeNs: 'common',
          badgeValue: row => (row.security_check_status ? 'approved' : 'pending'),
        },
        {
          key: 'is_showing',
          label: t('exchangeAds.columns.visible'),
          badge: true,
          badgeLabelKey: 'accountStatuses',
          badgeNs: 'common',
          badgeValue: row => (row.is_showing ? 'active' : 'suspended'),
        },
      ]}
      editableFields={[
        { name: 'security_check_status', label: t('exchangeAds.actions.approve'), nextValue: () => 1 },
        { name: 'security_check_status', label: t('exchangeAds.actions.reject'), nextValue: () => 0 },
      ]}
    />
  )
}

export default AdminExchangeAdsPage
