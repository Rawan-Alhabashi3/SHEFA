import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layouts/DefaultLayout'
import PharmacyLayout from '../layouts/PharmacyLayout'
import DriverLayout from '../layouts/DriverLayout'
import AdminLayout from '../layouts/AdminLayout'
import HomePage from '../pages/Home'
import MedicinesPage from '../pages/Medicines'
import PharmaciesPage from '../pages/Pharmacies'
import PharmacyDetailsPage from '../pages/Pharmacies/Details'
import MarketplacePage from '../pages/Marketplace'
import CommunityMedicinesPage from '../pages/CommunityMedicines'
import AboutPage from '../pages/About'
import CartPage from '../pages/Cart'
import OrdersPage from '../pages/Orders'
import MyCommunityMedicinesPage from '../pages/MyCommunityMedicines'
import MyCouponsPage from '../pages/MyCoupons'
import FavoritesPage from '../pages/Favorites'
import NotificationsPage from '../pages/Notifications'
import CheckoutPage from '../pages/Checkout'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
import PharmacyDashboardPage from '../pages/pharmacy/DashboardPage'
import PharmacyOrdersPage from '../pages/pharmacy/OrdersPage'
import PharmacyMedicinesPage from '../pages/pharmacy/MedicinesPage'
import PharmacyCouponCampaignsPage from '../pages/pharmacy/CouponCampaignsPage'
import PharmacyExchangeRequestsPage from '../pages/pharmacy/ExchangeRequestsPage'
import PharmacyReviewsPage from '../pages/pharmacy/ReviewsPage'
import DriverDashboardPage from '../pages/driver/DashboardPage'
import DriverOrdersPage from '../pages/driver/OrdersPage'
import DriverHistoryPage from '../pages/driver/HistoryPage'
import DriverActiveDeliveriesPage from '../pages/driver/ActiveDeliveriesPage'
import DriverEarningsPage from '../pages/driver/EarningsPage'
import DriverAnalyticsPage from '../pages/driver/AnalyticsPage'
import DriverNotificationsPage from '../pages/driver/NotificationsPage'
import DriverProfilePage from '../pages/driver/ProfilePage'
import DriverSettingsPage from '../pages/driver/SettingsPage'
import AdminDashboardPage from '../pages/admin/DashboardPage'
import AdminUsersPage from '../pages/admin/UsersPage'
import AdminOrdersPage from '../pages/admin/OrdersPage'
import AdminPharmaciesPage from '../pages/admin/PharmaciesPage'
import AdminDriversPage from '../pages/admin/DriversPage'
import AdminMedicinesPage from '../pages/admin/MedicinesPage'
import AdminCouponCampaignsPage from '../pages/admin/CouponCampaignsPage'
import AdminPaymentsPage from '../pages/admin/PaymentsPage'
import AdminNotificationsPage from '../pages/admin/NotificationsPage'
import AdminReviewsPage from '../pages/admin/ReviewsPage'
import AdminExchangeAdsPage from '../pages/admin/ExchangeAdsPage'
import AdminExchangeRequestsPage from '../pages/admin/ExchangeRequestsPage'
import AdminDeliveryMissionsPage from '../pages/admin/DeliveryMissionsPage'
import AdminCouponsPage from '../pages/admin/CouponsPage'
import AdminReportsPage from '../pages/admin/ReportsPage'
import AdminCategoriesPage from '../pages/admin/CategoriesPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/pharmacies" element={<PharmaciesPage />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetailsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/community-medicines" element={<CommunityMedicinesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route element={<ProtectedRoute roles={['citizen']} />}>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/my-orders" element={<OrdersPage />} />
            <Route path="/my-community-medicines" element={<MyCommunityMedicinesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/my-coupons" element={<MyCouponsPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute roles={['pharmacy', 'specialist']} />}>
          <Route element={<PharmacyLayout />}>
            <Route path="/pharmacy/dashboard" element={<PharmacyDashboardPage />} />
            <Route path="/pharmacy/orders" element={<PharmacyOrdersPage />} />
            <Route path="/pharmacy/medicines" element={<PharmacyMedicinesPage />} />
            <Route path="/pharmacy/community-requests" element={<PharmacyExchangeRequestsPage />} />
            <Route path="/pharmacy/coupon-campaigns" element={<PharmacyCouponCampaignsPage />} />
            <Route path="/pharmacy/reviews" element={<PharmacyReviewsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['delivery']} />}>
          <Route element={<DriverLayout />}>
            <Route path="/driver/dashboard" element={<DriverDashboardPage />} />
            <Route path="/driver/orders" element={<DriverOrdersPage />} />
            <Route path="/driver/active-deliveries" element={<DriverActiveDeliveriesPage />} />
            <Route path="/driver/history" element={<DriverHistoryPage />} />
            <Route path="/driver/earnings" element={<DriverEarningsPage />} />
            <Route path="/driver/analytics" element={<DriverAnalyticsPage />} />
            <Route path="/driver/notifications" element={<DriverNotificationsPage />} />
            <Route path="/driver/profile" element={<DriverProfilePage />} />
            <Route path="/driver/settings" element={<DriverSettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/delivery-missions" element={<AdminDeliveryMissionsPage />} />
            <Route path="/admin/pharmacies" element={<AdminPharmaciesPage />} />
            <Route path="/admin/drivers" element={<AdminDriversPage />} />
            <Route path="/admin/medicines" element={<AdminMedicinesPage />} />
            <Route path="/admin/coupon-campaigns" element={<AdminCouponCampaignsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/exchange-ads" element={<AdminExchangeAdsPage />} />
            <Route path="/admin/exchange-requests" element={<AdminExchangeRequestsPage />} />
            <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
