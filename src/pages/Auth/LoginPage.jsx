import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import { useAuth } from '../../context/AuthContext';
import { loginRequest } from '../../services/authService';
function LoginPage() {
  const {
    t
  } = useTranslation('auth');
  const {
    t: tv
  } = useTranslation('validation');
  const {
    t: tc
  } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login
  } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()), [form.email]);
  const onSubmit = async event => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError(tv('emailPasswordRequired'));
      return;
    }
    if (!isValidEmail) {
      setError(tv('invalidEmailAddress'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await loginRequest({
        email: form.email.trim(),
        password: form.password
      });
      const payload = response?.data || {};
      login({
        token: payload.token,
        role: payload.role,
        user: payload.user || null
      });
      const fallback = location.state?.from || '/';
      navigate(payload.redirect_path || fallback, {
        replace: true
      });
    } catch (err) {
      setError(err?.response?.data?.message || t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950">
      <Container className="py-8 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-transparent bg-white dark:bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 backdrop-blur transition-all duration-200 hover:border-blue-100 dark:border-blue-900/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40 hover:text-blue-700 dark:text-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
              <ArrowLeft size={18} className="text-blue-600 dark:text-blue-300 rtl:rotate-180" />
              {t('backToHome')}
            </Link>
            <Link to="/" className="text-lg font-extrabold tracking-tight text-blue-600 dark:text-blue-300 transition hover:text-blue-700 dark:text-blue-200">
              {tc('appName')}
            </Link>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/20 transition-shadow duration-300 hover:shadow-md md:grid-cols-2">
            <div className="relative hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.20),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
              <div className="relative">
                <p className="text-sm text-blue-100">{t('login.heroEyebrow')}</p>
                <h1 className="mt-2 text-4xl font-extrabold leading-tight">{t('login.heroTitle')}</h1>
                <p className="mt-4 max-w-sm text-blue-100">{t('login.heroBody')}</p>
                <div className="mt-7 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
                  <ShieldCheck className="text-white" />
                  <div>
                    <p className="text-sm font-semibold">{t('login.secureTitle')}</p>
                    <p className="text-xs text-blue-100">{t('login.secureHint')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-7 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('login.title')}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('login.subtitle')}</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('login.email')}</label>
                  <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('login.emailPlaceholder')} value={form.email} onChange={event => setForm(prev => ({
                  ...prev,
                  email: event.target.value
                }))} />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('login.password')}</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 transition focus-within:border-blue-300 dark:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:ring-blue-950">
                    <input className="w-full bg-transparent text-sm outline-none" type={showPassword ? 'text' : 'password'} placeholder={t('login.passwordPlaceholder')} value={form.password} onChange={event => setForm(prev => ({
                    ...prev,
                    password: event.target.value
                  }))} />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:text-blue-300">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={form.remember} onChange={event => setForm(prev => ({
                    ...prev,
                    remember: event.target.checked
                  }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 dark:text-blue-300" />
                    {t('login.rememberMe')}
                  </label>
                  <Link to="/login" className="text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200">
                    {t('login.forgotPassword')}
                  </Link>
                </div>

                {error ? <p className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('login.signingIn') : t('login.submit')}
                </Button>

                <button type="button" onClick={() => navigate('/', {
                replace: true
              })} className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950">
                  {t('login.continueGuest')}
                </button>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('login.noAccount')}{' '}
                  <Link className="font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200" to="/register" state={{
                  from: location.state?.from
                }}>
                    {t('login.createAccount')}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>;
}
export default LoginPage;