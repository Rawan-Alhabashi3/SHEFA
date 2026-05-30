import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
function AdminNotificationsPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('notifications.title')} description={t('notifications.description')} resource="notifications" columns={[
    {
      key: 'id',
      label: t('notifications.columns.id')
    },
    {
      key: 'title',
      label: t('notifications.columns.title')
    },
    {
      key: 'message',
      label: t('notifications.columns.message')
    },
    {
      key: 'user',
      label: t('notifications.columns.user'),
      render: row => row.user?.username || '-'
    },
    {
      key: 'created_at',
      label: t('notifications.columns.created'),
      render: row => new Date(row.created_at).toLocaleDateString()
    }
  ]} quickCreate={{
    user_id: '',
    title: '',
    message: ''
  }} />;
}
export default AdminNotificationsPage;