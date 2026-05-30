import { useTranslation } from "react-i18next";
import AdminModulePage from '../../components/admin/AdminModulePage';
import { formatPrice } from '../../utils/format';

function AdminOrdersPage() {
  const {
    t
  } = useTranslation("admin");
  return <AdminModulePage title={t('orders.title')} description={t('orders.description')} resource="orders" columns={[
    {
      key: 'id',
      label: t('orders.columns.orderId')
    },
    {
      key: 'customer_name',
      label: t('orders.columns.customer')
    },
    {
      key: 'order_status',
      label: t('orders.columns.orderStatus'),
      badge: true
    },
    {
      key: 'delivery_status',
      label: t('orders.columns.delivery'),
      badge: true
    },
    {
      key: 'total_price',
      label: t('orders.columns.total'),
      render: row => formatPrice(row.total_price || 0)
    },
    {
      key: 'created_at',
      label: t('orders.columns.created'),
      render: row => new Date(row.created_at).toLocaleDateString()
    }
  ]} editableFields={[
    {
      name: 'order_status',
      label: t('orders.actions.setPreparing'),
      nextValue: () => 'preparing'
    },
    {
      name: 'order_status',
      label: t('orders.actions.setDelivered'),
      nextValue: () => 'delivered'
    }
  ]} />;
}
export default AdminOrdersPage;