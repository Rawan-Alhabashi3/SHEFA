import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
function AdminReviewsPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('reviews.title')} description={t('reviews.description')} resource="reviews" columns={[
    {
      key: 'id',
      label: t('reviews.columns.id')
    },
    {
      key: 'pharmacy',
      label: t('reviews.columns.pharmacy'),
      render: row => row.pharmacy?.pharmacy_name || '-'
    },
    {
      key: 'user',
      label: t('reviews.columns.user'),
      render: row => row.user?.username || '-'
    },
    {
      key: 'rate',
      label: t('reviews.columns.rating'),
      badge: true
    },
    {
      key: 'comment',
      label: t('reviews.columns.comment')
    }
  ]} />;
}
export default AdminReviewsPage;