import { Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Container from '../../components/common/Container'
import EmptyState from '../../components/common/EmptyState'
import useAppStore from '../../context/useAppStore'
import { formatPrice } from '../../utils/format'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'
import { FALLBACK_MEDICINE_IMAGE, resolveImageUrl, withFallback } from '../../utils/image'

function CartPage() {
  const { t } = useTranslation('cart')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const cart = useAppStore((s) => s.cart)
  const incrementCartItem = useAppStore((s) => s.incrementCartItem)
  const decrementCartItem = useAppStore((s) => s.decrementCartItem)
  const removeFromCart = useAppStore((s) => s.removeFromCart)
  const clearCart = useAppStore((s) => s.clearCart)
  const purgeRestrictedCartItems = useAppStore((s) => s.purgeRestrictedCartItems)
  const cartSummary = useAppStore((s) => s.cartSummary)
  const orderableCart = cart.filter((item) => !item?.medicine?.requires_prescription)

  useEffect(() => {
    purgeRestrictedCartItems()
  }, [purgeRestrictedCartItems])

  const summary = cartSummary()

  const grouped = useMemo(() => {
    const ug = t('unknownGovernorate')
    const ua = t('unknownArea')
    return orderableCart.reduce((acc, item) => {
      const pharmacy = item.medicine?.pharmacy || null
      const governorate = pharmacy?.governorate || ug
      const area = pharmacy?.area || ua
      const pharmacyId = pharmacy?.id ?? item.medicine?.pharmacy_id ?? 'unknown'

      if (!acc[governorate]) acc[governorate] = {}
      if (!acc[governorate][area]) acc[governorate][area] = {}
      if (!acc[governorate][area][pharmacyId]) {
        acc[governorate][area][pharmacyId] = { pharmacy, items: [] }
      }
      acc[governorate][area][pharmacyId].items.push(item)
      return acc
    }, {})
  }, [orderableCart, t])

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        {orderableCart.length > 0 ? (
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-rose-200 dark:border-rose-700/70 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40 hover:text-rose-700 dark:text-rose-200"
          >
            {t('clearCart')}
          </button>
        ) : null}
      </div>

      {orderableCart.length === 0 ? (
        <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Object.entries(grouped).map(([governorate, areaGroups]) => (
              <section key={governorate} className="space-y-3">
                <div className="rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 px-4 py-3">
                  <p className="text-sm font-extrabold text-blue-800 dark:text-blue-100">{governorate}</p>
                </div>

                {Object.entries(areaGroups).map(([area, pharmacyGroups]) => (
                  <div key={area} className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {area} — {t('deliveryGroup')}
                      </p>
                    </div>

                    {Object.entries(pharmacyGroups).map(([key, group]) => {
                      const pharmacyName = group.pharmacy?.pharmacy_name || t('pharmacyNumber', { id: key })

                      return (
                        <div key={key} className="space-y-2">
                          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pharmacyName}</p>
                          </div>

                          {group.items.map((item) => {
                    const medicine = item.medicine || {}
                    const stock = Number(medicine.quantity_available)
                    const maxQty = Number.isFinite(stock) ? Math.max(0, stock) : Infinity

                    const qty = Number(item.quantity) || 0
                    const price = Number(medicine.price) || 0
                    const unitPrice = price
                    const subtotal = unitPrice * qty

                    const imageSrc = resolveImageUrl(medicine.image) || FALLBACK_MEDICINE_IMAGE

                    return (
                      <article key={item.id} className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20">
                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                          <img
                            src={imageSrc}
                            alt={medicine.name || t('medicineAlt')}
                            className="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-24"
                            onError={(event) => withFallback(event, FALLBACK_MEDICINE_IMAGE)}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{medicine.name || t('untitledMedicine')}</h3>
                                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                  {medicine.description || ''}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="rounded-full p-2 text-slate-500 dark:text-slate-400 transition hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:bg-rose-950/40 hover:text-rose-700 dark:text-rose-200"
                                aria-label={t('ariaRemoveItem')}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => decrementCartItem(item.id)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200"
                                  aria-label={t('ariaDecreaseQty')}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="min-w-10 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => incrementCartItem(item.id)}
                                  disabled={qty >= maxQty}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                                  aria-label={t('ariaIncreaseQty')}
                                >
                                  <Plus size={16} />
                                </button>
                                {Number.isFinite(stock) ? (
                                  <span className="text-xs text-slate-500 dark:text-slate-400">{t('stockLabel', { count: stock })}</span>
                                ) : null}
                              </div>

                              <div className="text-end">
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t('unit')}</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatPrice(unitPrice)}</p>
                              </div>

                              <div className="text-end">
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t('subtotal')}</p>
                                <p className="text-base font-bold text-blue-600 dark:text-blue-300">{formatPrice(subtotal)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('summary')}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">{t('subtotal')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatPrice(summary.subtotal)}</span>
              </div>
              {summary.savings > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">{t('discounts')}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-200">- {formatPrice(summary.savings)}</span>
                </div>
              ) : null}
              <div className="border-t pt-3" />
              <div className="flex items-center justify-between">
                <span className="text-slate-900 dark:text-slate-100">{t('total')}</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{formatPrice(summary.total)}</span>
              </div>
            </div>

            <Button
              className="mt-5 w-full"
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: '/checkout' } })
                  return
                }
                navigate('/checkout')
              }}
            >
              {t('continueCheckout')}
            </Button>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('groupedHint')}</p>
          </aside>
        </div>
      )}
    </Container>
  )
}

export default CartPage
