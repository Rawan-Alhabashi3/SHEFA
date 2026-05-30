import { useTranslation } from 'react-i18next'
import {
  BadgeCheck,
  Gift,
  Sparkles,
  Tag,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import Container from '../common/Container'
import Button from '../common/Button'
import SectionTitle from '../common/SectionTitle'
import EmptyState from '../common/EmptyState'

import { formatPrice } from '../../utils/format'
import {
  FALLBACK_MEDICINE_IMAGE,
  resolveImageUrl,
  withFallback,
} from '../../utils/image'

function CampaignCard({ campaign }) {
  const { t } = useTranslation('home')

  const p = campaign.pharmacy

  const cats = Array.isArray(campaign.eligible_categories)
    ? campaign.eligible_categories.join(', ')
    : ''

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700/70 dark:shadow-slate-950/20">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {campaign.title}
        </h3>

        <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">
          {campaign.reward_percentage}
          {t('campaigns.card.percentCare')}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
        {campaign.description ||
          t('campaigns.card.defaultDescription')}
      </p>

      <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
        {t('campaigns.card.rule')}
        {campaign.required_purchase_count}{' '}
        {t('campaigns.card.ordersOver')}{' '}
        {Number(campaign.minimum_order_amount).toFixed(2)}{' '}
        {t('campaigns.card.usdOrderTotal')}
      </p>

      {cats ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t('campaigns.card.eligible')}
          {cats}
        </p>
      ) : null}

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {p?.pharmacy_name}
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('campaigns.card.couponValid')}{' '}
        {campaign.expiration_days}{' '}
        {t('campaigns.card.daysCareOnly')}
      </p>

      <Link
        to={p?.id ? `/pharmacies/${p.id}` : '/marketplace'}
      >
        <Button className="mt-4 w-full">
          {t('campaigns.card.viewPharmacy')}
        </Button>
      </Link>
    </article>
  )
}

function CommunityCard({ item }) {
  const { t } = useTranslation('home')

  const image = item.images?.[0]?.path || item.image

  const isDonation = item.ad_type === 'donation'

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20">
      <img
        src={
          resolveImageUrl(image) ||
          FALLBACK_MEDICINE_IMAGE
        }
        alt={item.medicine_name}
        className="h-32 w-full object-cover"
        onError={(event) =>
          withFallback(
            event,
            FALLBACK_MEDICINE_IMAGE
          )
        }
      />

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${isDonation
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200'
              }`}
          >
            {isDonation
              ? t('campaigns.community.badges.donation')
              : t('campaigns.community.badges.resale')}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
            <BadgeCheck size={12} />
            {t('campaigns.community.badges.verified')}
          </span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100">
          {item.medicine_name}
        </h3>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {[item.governorate, item.area]
            .filter(Boolean)
            .join(t('campaigns.community.locationSeparator'))}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {item.assigned_pharmacy?.pharmacy_name ||
            item.assignedPharmacy?.pharmacy_name}
        </p>

        <p
          className={`mt-3 text-lg font-extrabold ${isDonation
              ? 'text-emerald-700 dark:text-emerald-200'
              : 'text-slate-900 dark:text-slate-100'
            }`}
        >
          {isDonation
            ? t('campaigns.community.free')
            : formatPrice(item.price || 0)}
        </p>
      </div>
    </article>
  )
}

export default function HomeRewardCampaignsSection({
  campaigns = [],
  communityListings = [],
  loading = false,
}) {
  const { t } = useTranslation('home')

  return (
    <Container className="pb-16">
      <section className="py-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <SectionTitle
            eyebrow={t('campaigns.eyebrow')}
            title={t('campaigns.title')}
          />

          <Link
            to="/marketplace"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
          >
            {t('campaigns.browseMarketplace')}
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {t('campaigns.loading')}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState
            title={t('campaigns.emptyTitle')}
            description={t(
              'campaigns.emptyDescription'
            )}
          />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {campaigns
              .slice(0, 6)
              .map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                />
              ))}
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/70 dark:bg-blue-950/60 dark:text-blue-100">
          <Sparkles
            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300"
            size={18}
          />

          <div>
            <p className="font-bold">
              {t('campaigns.cosmeticsOnly')}
            </p>

            <p className="mt-1 text-blue-800 dark:text-blue-100">
              {t(
                'campaigns.validationDescription'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionTitle
            eyebrow={t('campaigns.community.eyebrow')}
            title={t('campaigns.community.title')}
          />

          <Link
            to="/community-medicines"
            className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
          >
            {t('campaigns.community.openHub')}
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/20"
                />
              )
            )}
          </div>
        ) : communityListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            {t('campaigns.community.emptyDescription')}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            {communityListings.map((item) => (
              <CommunityCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/marketplace"
          className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-800 transition hover:bg-blue-100 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950"
        >
          <Tag className="mb-3" />

          <p className="font-bold">
            {t('campaigns.marketplaceCta.title')}
          </p>

          <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
            {t('campaigns.marketplaceCta.description')}
          </p>
        </Link>

        <Link
          to="/community-medicines"
          className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-950"
        >
          <Gift className="mb-3" />

          <p className="font-bold">
            {t('campaigns.donationCta.title')}
          </p>

          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-200">
            {t('campaigns.donationCta.description')}
          </p>
        </Link>
      </div>
    </Container>
  )
}
