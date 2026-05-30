import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';

function AdminUsersPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('users.title')} description={t('users.description')} resource="users" columns={[
    {
      key: 'id',
      label: t('users.columns.id')
    },
    {
      key: 'username',
      label: t('users.columns.name')
    },
    {
      key: 'email',
      label: t('users.columns.email')
    },
    {
      key: 'role',
      label: t('users.columns.role'),
      badge: true
    },
    {
      key: 'governorate',
      label: t('users.columns.city')
    },
    {
      key: 'account_status',
      label: t('users.columns.status'),
      render: row => row.account_status ? t('users.statuses.active') : t('users.statuses.suspended'),
      badge: true
    }
  ]} quickCreate={{
    username: '',
    email: '',
    password: 'password123',
    password_confirmation: 'password123',
    role: 'citizen',
    governorate: 'Damascus'
  }} editableFields={[
    {
      name: 'account_status',
      label: t('users.actions.toggleStatus'),
      nextValue: row => !row.account_status
    }
  ]} />;
}
export default AdminUsersPage;