import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
import { formatPrice } from '../../utils/format';

function AdminPaymentsPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('payments.title')} description={t('payments.description')} resource="payments" columns={[
    {
      key: 'id',
      label: t('payments.columns.id')
    },
    {
      key: 'order_id',
      label: t('payments.columns.order')
    },
    {
      key: 'payment_method',
      label: t('payments.columns.method'),
      badge: true
    },
    {
      key: 'payment_status',
      label: t('payments.columns.status'),
      badge: true
    },
    {
      key: 'amount',
      label: t('payments.columns.amount'),
      render: row => formatPrice(row.amount || 0)
    },
    {
      key: 'currency',
      label: t('payments.columns.currency')
    }
  ]} editableFields={[
    {
      name: 'payment_status',
      label: t('payments.actions.setPaid'),
      nextValue: () => 'paid'
    },
    {
      name: 'payment_status',
      label: t('payments.actions.setFailed'),
      nextValue: () => 'failed'
    }
  ]} />;
}
export default AdminPaymentsPage;