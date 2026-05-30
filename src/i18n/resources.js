import arCommon from './locales/ar/common'
import arAuth from './locales/ar/auth'
import arNavbar from './locales/ar/navbar'
import arHome from './locales/ar/home'
import arMarketplace from './locales/ar/marketplace'
import arPharmacy from './locales/ar/pharmacy'
import arMedicines from './locales/ar/medicines'
import arCart from './locales/ar/cart'
import arCheckout from './locales/ar/checkout'
import arOrders from './locales/ar/orders'
import arNotifications from './locales/ar/notifications'
import arDashboard from './locales/ar/dashboard'
import arAdmin from './locales/ar/admin'
import arDriver from './locales/ar/driver'
import arDonation from './locales/ar/donation'
import arCommunity from './locales/ar/community'
import arAbout from './locales/ar/about'
import arCoupons from './locales/ar/coupons'
import arValidation from './locales/ar/validation'
import arErrors from './locales/ar/errors'
import enCommon from './locales/en/common'
import enAuth from './locales/en/auth'
import enNavbar from './locales/en/navbar'
import enHome from './locales/en/home'
import enMarketplace from './locales/en/marketplace'
import enPharmacy from './locales/en/pharmacy'
import enMedicines from './locales/en/medicines'
import enCart from './locales/en/cart'
import enCheckout from './locales/en/checkout'
import enOrders from './locales/en/orders'
import enNotifications from './locales/en/notifications'
import enDashboard from './locales/en/dashboard'
import enAdmin from './locales/en/admin'
import enDriver from './locales/en/driver'
import enDonation from './locales/en/donation'
import enCommunity from './locales/en/community'
import enAbout from './locales/en/about'
import enCoupons from './locales/en/coupons'
import enValidation from './locales/en/validation'
import enErrors from './locales/en/errors'

export const namespaces = [
  'common',
  'auth',
  'navbar',
  'home',
  'marketplace',
  'pharmacy',
  'medicines',
  'cart',
  'checkout',
  'orders',
  'notifications',
  'dashboard',
  'admin',
  'driver',
  'donation',
  'community',
  'about',
  'coupons',
  'validation',
  'errors',
]

const resources = {
  ar: {
    common: arCommon,
    auth: arAuth,
    navbar: arNavbar,
    home: arHome,
    marketplace: arMarketplace,
    pharmacy: arPharmacy,
    medicines: arMedicines,
    cart: arCart,
    checkout: arCheckout,
    orders: arOrders,
    notifications: arNotifications,
    dashboard: arDashboard,
    admin: arAdmin,
    driver: arDriver,
    donation: arDonation,
    community: arCommunity,
    about: arAbout,
    coupons: arCoupons,
    validation: arValidation,
    errors: arErrors,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    navbar: enNavbar,
    home: enHome,
    marketplace: enMarketplace,
    pharmacy: enPharmacy,
    medicines: enMedicines,
    cart: enCart,
    checkout: enCheckout,
    orders: enOrders,
    notifications: enNotifications,
    dashboard: enDashboard,
    admin: enAdmin,
    driver: enDriver,
    donation: enDonation,
    community: enCommunity,
    about: enAbout,
    coupons: enCoupons,
    validation: enValidation,
    errors: enErrors,
  },
}

export default resources
