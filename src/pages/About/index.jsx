import { useTranslation } from "react-i18next";
import { BadgeCheck, Clock3, CreditCard, Headset, HeartPulse, Pill, ShieldCheck, Sparkles, Star, Store, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import SectionTitle from '../../components/common/SectionTitle';
import { useAuth } from '../../context/AuthContext';
import { getAboutOverview, getPublicFeedback, submitFeedback } from '../../services/feedbackService';
function StarPicker({
  value,
  hoverValue,
  onHover,
  onSelect
}) {
  const {
    t
  } = useTranslation("about");
  return <div className="flex items-center gap-1">
      {Array.from({
      length: 5
    }).map((_, idx) => {
      const rating = idx + 1;
      const active = rating <= (hoverValue || value);
      return <button key={rating} type="button" onMouseEnter={() => onHover(rating)} onMouseLeave={() => onHover(0)} onClick={() => onSelect(rating)} className="rounded-full p-1 transition hover:scale-110" aria-label={`Rate ${rating} stars`}>
            <Star size={20} className={active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
          </button>;
    })}
    </div>;
}
function AboutPage() {
  const {
    t
  } = useTranslation("about");
  const {
    isAuthenticated,
    user
  } = useAuth();
  const [overview, setOverview] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'feedback',
    subject: '',
    message: '',
    rating: 0,
    order_reference: ''
  });
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setForm(prev => ({
      ...prev,
      name: prev.name || user.username || user.name || '',
      email: prev.email || user.email || ''
    }));
  }, [isAuthenticated, user]);
  useEffect(() => {
    let mounted = true;
    setLoadingOverview(true);
    getAboutOverview().then(res => {
      if (!mounted) return;
      const payload = res?.data || res;
      setOverview(payload?.data || payload || null);
    }).catch(() => {
      if (!mounted) return;
      setOverview(null);
    }).finally(() => {
      if (!mounted) return;
      setLoadingOverview(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let mounted = true;
    setLoadingTestimonials(true);
    getPublicFeedback().then(res => {
      if (!mounted) return;
      const payload = res?.data || res;
      const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setTestimonials(items);
    }).catch(() => {
      if (!mounted) return;
      setTestimonials([]);
    }).finally(() => {
      if (!mounted) return;
      setLoadingTestimonials(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  const featureCards = useMemo(() => [{
    icon: BadgeCheck,
    title: t('features.verifiedPharmacies.title'),
    description: t('features.verifiedPharmacies.description')
  }, {
    icon: Truck,
    title: t('features.fastDelivery.title'),
    description: t('features.fastDelivery.description')
  }, {
    icon: ShieldCheck,
    title: t('features.prescriptionSupport.title'),
    description: t('features.prescriptionSupport.description')
  }, {
    icon: CreditCard,
    title: t('features.securePayments.title'),
    description: t('features.securePayments.description')
  }, {
    icon: Sparkles,
    title: t('features.pharmacyRewards.title'),
    description: t('features.pharmacyRewards.description')
  }, {
    icon: Headset,
    title: t('features.customerSupport.title'),
    description: t('features.customerSupport.description')
  }], [t]);

  const flowSteps = useMemo(() => [t('workflow.steps.browsePharmacies'), t('workflow.steps.selectMedicines'), t('workflow.steps.placeOrder'), t('workflow.steps.pharmacyPrepares'), t('workflow.steps.driverDelivers')], [t]);

  const trustPillars = useMemo(() => [t('trust.pillars.0'), t('trust.pillars.1'), t('trust.pillars.2'), t('trust.pillars.3')], [t]);

  const stats = useMemo(() => [{
    label: t('statistics.totalPharmacies'),
    value: overview?.total_pharmacies ?? '—',
    icon: Store
  }, {
    label: t('statistics.medicinesAvailable'),
    value: overview?.medicines_available ?? '—',
    icon: Pill
  }, {
    label: t('statistics.ordersDelivered'),
    value: overview?.orders_delivered ?? '—',
    icon: Truck
  }, {
    label: t('statistics.happyCustomers'),
    value: overview?.happy_customers ?? '—',
    icon: HeartPulse
  }], [overview]);
  const onFormChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const onSubmit = async event => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error(t('feedback.errors.completeRequired'));
      return;
    }
    if (form.message.trim().length < 12) {
      toast.error(t('feedback.errors.messageTooShort'));
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        rating: form.rating || null,
        order_reference: form.order_reference.trim() || null
      });
      toast.success(t('feedback.errors.submitted'));
      setForm(prev => ({
        ...prev,
        type: 'feedback',
        subject: '',
        message: '',
        rating: 0,
        order_reference: ''
      }));
      setHoverRating(0);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('feedback.errors.unableToSubmit'));
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="bg-slate-50 dark:bg-slate-950">
      <Container className="py-10">
        <section className="grid gap-6 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-8 text-white shadow-sm dark:shadow-slate-950/20 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="text-sm font-semibold text-blue-100">{t('hero.badge')}</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{t('hero.title')}</h1>
            <p className="mt-4 max-w-xl text-sm text-blue-100 md:text-base">{t('hero.description')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/medicines">
                <Button variant="light">{t('hero.buttons.browseMedicines')}</Button>
              </Link>
              <Link to="/pharmacies">
                <Button variant="ghostOnDark">
                  {t('hero.buttons.explorePharmacies')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur">
            <h3 className="text-lg font-bold">{t('hero.whyChoose.title')}</h3>
            <div className="mt-4 space-y-3 text-sm text-blue-50">
              <p className="flex items-center gap-2"><Clock3 size={16} /> {t('hero.whyChoose.fastFulfillment')}</p>
              <p className="flex items-center gap-2"><BadgeCheck size={16} />{t('hero.whyChoose.verifiedEcosystem')}</p>
              <p className="flex items-center gap-2"><ShieldCheck size={16} />{t('hero.whyChoose.saferStandards')}</p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-sm dark:shadow-slate-950/20 md:p-9">
          <SectionTitle eyebrow={t('mission.eyebrow')} title={t('mission.title')} />
          <p className="max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
            {t('mission.vision')}
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
            {t('mission.commitment')}
          </p>
        </section>

        <section className="mt-12">
          <SectionTitle eyebrow={t('features.eyebrow')} title={t('features.title')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map(item => <article key={item.title} className="card-lift rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                <div className="mb-3 inline-flex rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-600 dark:text-blue-300">
                  <item.icon size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </article>)}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-sm dark:shadow-slate-950/20 md:p-9">
          <SectionTitle eyebrow={t('workflow.eyebrow')} title={t('workflow.title')} />
          <div className="grid gap-3 md:grid-cols-5">
            {flowSteps.map((step, idx) => <div key={step} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">{t('workflow.step')}{idx + 1}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{step}</p>
              </div>)}
          </div>
        </section>

        <section className="mt-12">
          <SectionTitle eyebrow={t('statistics.eyebrow')} title={t('statistics.title')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => <article key={stat.label} className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm dark:shadow-slate-950/20">
                <div className="mb-3 inline-flex rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-600 dark:text-blue-300">
                  <stat.icon size={18} />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{loadingOverview ? '...' : stat.value}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
              </article>)}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-sm dark:shadow-slate-950/20 md:p-9">
          <SectionTitle eyebrow={t('trust.eyebrow')} title={t('trust.title')} />
          <div className="grid gap-3 md:grid-cols-2">
            {trustPillars.map(item => <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                <ShieldCheck size={18} className="mt-0.5 text-blue-600 dark:text-blue-300" />
                <p className="text-sm text-slate-700 dark:text-slate-200">{item}</p>
              </div>)}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-sm dark:shadow-slate-950/20 md:p-9">
            <SectionTitle eyebrow={t('feedback.eyebrow')} title={t('feedback.title')} />
            <p className="mb-5 text-sm text-slate-600 dark:text-slate-300">{t('feedback.description')}</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.fullName')}</label>
                  <input value={form.name} onChange={e => onFormChange('name', e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('feedback.form.fullNamePlaceholder')} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.email')}</label>
                  <input type="email" value={form.email} onChange={e => onFormChange('email', e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('feedback.form.emailPlaceholder')} required />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.type')}</label>
                  <select value={form.type} onChange={e => onFormChange('type', e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                    <option value="feedback">{t('feedback.form.feedback')}</option>
                    <option value="complaint">{t('feedback.form.complaint')}</option>
                    <option value="suggestion">{t('feedback.form.suggestion')}</option>
                    <option value="support_issue">{t('feedback.form.supportIssue')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.orderReference')}</label>
                  <input value={form.order_reference} onChange={e => onFormChange('order_reference', e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('feedback.form.orderReferencePlaceholder')} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.subject')}</label>
                <input value={form.subject} onChange={e => onFormChange('subject', e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('feedback.form.subjectPlaceholder')} required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.message')}</label>
                <textarea value={form.message} onChange={e => onFormChange('message', e.target.value)} rows={5} className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('feedback.form.messagePlaceholder')} required />
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('feedback.form.rating')}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StarPicker value={form.rating} hoverValue={hoverRating} onHover={setHoverRating} onSelect={rating => onFormChange('rating', rating)} />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {form.rating ? `${form.rating} ${t('feedback.form.ratingSelected')}` : t('feedback.form.noRatingSelected')}
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t('feedback.form.sending') : t('feedback.form.submit')}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-sm dark:shadow-slate-950/20 md:p-9">
            <SectionTitle eyebrow={t('feedback.reviews.eyebrow')} title={t('feedback.reviews.title')} />
            {loadingTestimonials ? <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 text-sm text-slate-500 dark:text-slate-400">{t('feedback.reviews.loading')}</div> : testimonials.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-5 text-sm text-slate-500 dark:text-slate-400">{t('feedback.reviews.noReviews')}</div> : <div className="space-y-3">
                {testimonials.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({
                    length: 5
                  }).map((_, i) => <Star key={`${item.id}-${i}`} size={14} className={i + 1 <= Number(item.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </article>)}
              </div>}
            <div className="mt-5 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 p-4 text-sm text-blue-700 dark:text-blue-200">
              {t('feedback.reviews.notice')}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-blue-950 p-7 text-white shadow-sm dark:shadow-slate-950/20 md:p-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">{t('cta.supportTeam')}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-white md:text-3xl">{t('cta.title')}</h2>
              <p className="mt-3 text-sm leading-6 text-blue-100 md:text-base">{t('cta.description')}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <a href="mailto:support@shifa.app" className="inline-flex h-11 w-full text-nowrap items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-blue-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow dark:bg-slate-900 dark:text-blue-100 dark:shadow-slate-950/20 dark:hover:bg-blue-950/50 md:w-auto">
                {t('cta.contactSupport')}
              </a>
              <Link to="/medicines" className="inline-flex h-11 w-full text-nowrap items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20 md:w-auto">
                {t('cta.browseMedicines')}
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>;
}
export default AboutPage;