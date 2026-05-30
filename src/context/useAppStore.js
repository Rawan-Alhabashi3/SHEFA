import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CART_STORAGE_KEY = 'shifa_cart'

function clampQty(nextQty, maxQty) {
  if (!Number.isFinite(nextQty) || nextQty < 0) return 0
  if (Number.isFinite(maxQty) && maxQty >= 0) return Math.min(nextQty, maxQty)
  return nextQty
}

function isPrescriptionMedicine(medicine) {
  return Boolean(medicine?.requires_prescription)
}

function isOrderableCartItem(item) {
  return !isPrescriptionMedicine(item?.medicine)
}

const useAppStore = create(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      lastCartEvent: null,

      addToCart: (medicine, quantity = 1) =>
        set((state) => {
          const id = medicine?.id
          if (id == null) return state
          if (isPrescriptionMedicine(medicine)) {
            return {
              ...state,
              lastCartEvent: { type: 'blockedPrescription', id, at: Date.now() },
            }
          }

          const itemGovernorate = medicine?.pharmacy?.governorate || null
          const existingGovernorates = new Set(state.cart.map((i) => i.medicine?.pharmacy?.governorate).filter(Boolean))
          if (existingGovernorates.size > 0 && itemGovernorate && !existingGovernorates.has(itemGovernorate)) {
            return {
              ...state,
              lastCartEvent: { type: 'blockedGovernorate', id, at: Date.now() },
            }
          }

          const maxQty = Number(medicine?.quantity_available)
          const safeMax = Number.isFinite(maxQty) ? Math.max(0, maxQty) : Infinity
          const delta = clampQty(Number(quantity) || 1, safeMax)
          if (delta <= 0) return state

          const existing = state.cart.find((i) => i.id === id)
          const nextQty = clampQty((existing?.quantity || 0) + delta, safeMax)
          if (nextQty <= 0) return state

          const nextCart = existing
            ? state.cart.map((i) => (i.id === id ? { ...i, medicine, quantity: nextQty } : i))
            : [...state.cart, { id, medicine, quantity: nextQty }]

          return {
            ...state,
            cart: nextCart,
            lastCartEvent: { type: existing ? 'increment' : 'add', id, at: Date.now() },
          }
        }),

      pushCartEvent: (event) =>
        set((state) => ({
          ...state,
          lastCartEvent: { ...event, at: Date.now() },
        })),

      setCartQuantity: (medicineId, quantity, maxStock) =>
        set((state) => {
          const id = medicineId
          const maxQty = Number.isFinite(Number(maxStock)) ? Number(maxStock) : Infinity
          const nextQty = clampQty(Number(quantity) || 0, maxQty)

          if (nextQty <= 0) {
            return {
              ...state,
              cart: state.cart.filter((i) => i.id !== id),
              lastCartEvent: { type: 'remove', id, at: Date.now() },
            }
          }

          return {
            ...state,
            cart: state.cart.map((i) => (i.id === id ? { ...i, quantity: nextQty } : i)),
            lastCartEvent: { type: 'setQty', id, at: Date.now() },
          }
        }),

      incrementCartItem: (medicineId) => {
        const item = get().cart.find((i) => i.id === medicineId)
        if (!item?.medicine) return
        get().addToCart(item.medicine, 1)
      },

      decrementCartItem: (medicineId) =>
        set((state) => {
          const item = state.cart.find((i) => i.id === medicineId)
          if (!item) return state
          const nextQty = (item.quantity || 0) - 1
          if (nextQty <= 0) {
            const nextCart = state.cart.filter((i) => i.id !== medicineId)
            return {
              ...state,
              cart: nextCart,
              lastCartEvent: { type: 'remove', id: medicineId, at: Date.now() },
            }
          }
          const nextCart = state.cart.map((i) => (i.id === medicineId ? { ...i, quantity: nextQty } : i))
          return {
            ...state,
            cart: nextCart,
            lastCartEvent: { type: 'decrement', id: medicineId, at: Date.now() },
          }
        }),

      removeFromCart: (medicineId) =>
        set((state) => {
          const nextCart = state.cart.filter((i) => i.id !== medicineId)
          return {
            ...state,
            cart: nextCart,
            lastCartEvent: { type: 'remove', id: medicineId, at: Date.now() },
          }
        }),

      clearCart: () =>
        set((state) => ({
          ...state,
          cart: [],
          lastCartEvent: { type: 'clear', at: Date.now() },
        })),

      purgeRestrictedCartItems: () =>
        set((state) => {
          const nextCart = state.cart.filter(isOrderableCartItem)
          if (nextCart.length === state.cart.length) return state
          return {
            ...state,
            cart: nextCart,
            lastCartEvent: { type: 'purgedRestricted', at: Date.now() },
          }
        }),

      cartCount: () => get().cart.filter(isOrderableCartItem).reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),

      cartSummary: () => {
        const items = get().cart.filter(isOrderableCartItem)
        let subtotal = 0
        for (const item of items) {
          const qty = Number(item.quantity) || 0
          const price = Number(item.medicine?.price) || 0
          subtotal += price * qty
        }
        return { subtotal, savings: 0, total: subtotal }
      },

      setFavorites: (items) =>
        set((state) => ({
          ...state,
          favorites: Array.isArray(items) ? items : [],
        })),

      addFavoriteLocal: (item) =>
        set((state) => {
          if (!item?.id) return state
          const exists = state.favorites.some((f) => f.id === item.id)
          if (exists) return state
          return {
            ...state,
            favorites: [item, ...state.favorites],
          }
        }),

      removeFavoriteLocal: (medicineId) =>
        set((state) => ({
          ...state,
          favorites: state.favorites.filter((f) => f.id !== medicineId),
        })),

      clearFavorites: () =>
        set((state) => ({
          ...state,
          favorites: [],
        })),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ cart: state.cart, favorites: state.favorites }),
    },
  ),
)

export default useAppStore
