import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
function AdminCouponCampaignsPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('couponCampaigns.title')} description={t('couponCampaigns.description')} resource="coupon-campaigns" columns={[
    {
      key: 'id',
      label: t('couponCampaigns.columns.id')
    },
    {
      key: 'title',
      label: t('couponCampaigns.columns.title')
    },
    {
      key: 'pharmacy_id',
      label: t('couponCampaigns.columns.pharmacy')
    },
    {
      key: 'reward_percentage',
      label: t('couponCampaigns.columns.rewardPercentage')
    },
    {
      key: 'minimum_order_amount',
      label: t('couponCampaigns.columns.minOrder')
    },
    {
      key: 'is_active',
      label: t('couponCampaigns.columns.active'),
      render: row => row.is_active ? t('coupons.statuses.approved') : t('coupons.statuses.pending'),
      badge: true
    }
  ]} editableFields={[
    {
      name: 'is_active',
      label: t('couponCampaigns.actions.toggleActive'),
      nextValue: row => !row.is_active
    }
  ]} />;
}
export default AdminCouponCampaignsPage;