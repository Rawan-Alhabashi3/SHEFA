import { ArrowLeft, Eye, EyeOff, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import { useAuth } from '../../context/AuthContext';
import { registerRequest } from '../../services/authService';
const GOVERNORATES = ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Lattakia', 'Tartous', 'Daraa', 'Deir ez-Zor', 'Hasakah', 'Raqqa', 'Suwayda', 'Quneitra', 'Rif Dimashq'];
function RegisterPage() {
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
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    governorate: 'Damascus',
    address: '',
    pharmacy_name: '',
    pharmacy_address: '',
    pharmacy_phone: '',
    vehicle_type: '',
    area: '',
    license_image: null
  });
  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()), [form.email]);

  /** @returns {string} validation message key or empty string */
  const validate = () => {
    if (!form.name.trim()) return 'fullNameRequired';
    if (!form.email.trim()) return 'emailRequired';
    if (!isValidEmail) return 'invalidEmailShort';
    if (!form.phone.trim()) return 'phoneRequired';
    if (!form.password) return 'passwordRequired';
    if (form.password.length < 6) return 'passwordMin';
    if (form.password !== form.password_confirmation) return 'passwordMismatch';
    if (role === 'citizen') {
      if (!form.address.trim()) return 'addressRequiredCitizen';
    }
    if (role === 'pharmacy') {
      if (!form.pharmacy_name.trim()) return 'pharmacyNameRequired';
      if (!form.area.trim()) return 'areaRequiredPharmacy';
      if (!form.license_image) return 'licenseRequired';
    }
    return '';
  };
  const onSubmit = async event => {
    event.preventDefault();
    const key = validate();
    if (key) {
      setError(tv(key));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email.trim());
      payload.append('phone', form.phone.trim());
      payload.append('password', form.password);
      payload.append('password_confirmation', form.password_confirmation);
      payload.append('role', role);
      payload.append('governorate', form.governorate);
      if (role === 'citizen') payload.append('address', form.address);
      if (role === 'pharmacy') {
        payload.append('pharmacy_name', form.pharmacy_name);
        payload.append('area', form.area.trim());
        if (form.pharmacy_address) payload.append('pharmacy_address', form.pharmacy_address);
        if (form.pharmacy_phone) payload.append('pharmacy_phone', form.pharmacy_phone);
        payload.append('license_image', form.license_image);
      }
      if (role === 'delivery') {
        if (form.vehicle_type) payload.append('vehicle_type', form.vehicle_type);
      }
      const response = await registerRequest(payload);
      const data = response?.data || {};
      login({
        token: data.token,
        role: data.role,
        user: data.user || null
      });
      navigate(location.state?.from || data.redirect_path || '/', {
        replace: true
      });
    } catch (err) {
      const backend = err?.response?.data;
      setError(typeof backend?.message === 'string' ? backend.message : t('register.registerFailed'));
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
            <div className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white md:block">
              <p className="text-sm text-blue-100">{t('register.heroEyebrow')}</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight">{t('register.heroTitle')}</h1>
              <p className="mt-4 max-w-sm text-blue-100">{t('register.heroBody')}</p>
            </div>

            <div className="p-7 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('register.title')}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('register.subtitle')}</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.fullName')}</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.fullNamePlaceholder')} value={form.name} onChange={e => setForm(p => ({
                    ...p,
                    name: e.target.value
                  }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.email')}</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('login.emailPlaceholder')} value={form.email} onChange={e => setForm(p => ({
                    ...p,
                    email: e.target.value
                  }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.phone')}</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.phonePlaceholder')} value={form.phone} onChange={e => setForm(p => ({
                    ...p,
                    phone: e.target.value
                  }))} />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.password')}</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 focus-within:border-blue-300 dark:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:ring-blue-950">
                      <input className="w-full bg-transparent text-sm outline-none" type={showPassword ? 'text' : 'password'} placeholder={t('login.passwordPlaceholder')} value={form.password} onChange={e => setForm(p => ({
                      ...p,
                      password: e.target.value
                    }))} />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:text-blue-300">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.confirmPassword')}</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 focus-within:border-blue-300 dark:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 dark:ring-blue-950">
                      <input className="w-full bg-transparent text-sm outline-none" type={showConfirm ? 'text' : 'password'} placeholder={t('login.passwordPlaceholder')} value={form.password_confirmation} onChange={e => setForm(p => ({
                      ...p,
                      password_confirmation: e.target.value
                    }))} />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:text-blue-300">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.role')}</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                      <option value="citizen">{t('roles.citizen')}</option>
                      <option value="pharmacy">{t('roles.pharmacy')}</option>
                      <option value="delivery">{t('roles.delivery')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.city')}</label>
                    <select value={form.governorate} onChange={e => setForm(p => ({
                    ...p,
                    governorate: e.target.value
                  }))} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                      {GOVERNORATES.map(g => <option key={g} value={g}>
                          {t(`cities.${g}`)}
                        </option>)}
                    </select>
                  </div>
                </div>

                {role === 'citizen' ? <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.address')}</label>
                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.addressPlaceholder')} value={form.address} onChange={e => setForm(p => ({
                  ...p,
                  address: e.target.value
                }))} />
                  </div> : null}

                {role === 'pharmacy' ? <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.pharmacyName')}</label>
                        <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.pharmacyNamePlaceholder')} value={form.pharmacy_name} onChange={e => setForm(p => ({
                      ...p,
                      pharmacy_name: e.target.value
                    }))} />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.area')}</label>
                        <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.areaPlaceholder')} value={form.area} onChange={e => setForm(p => ({
                      ...p,
                      area: e.target.value
                    }))} />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.pharmacyPhone')}</label>
                        <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.phonePlaceholder')} value={form.pharmacy_phone} onChange={e => setForm(p => ({
                      ...p,
                      pharmacy_phone: e.target.value
                    }))} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.pharmacyAddress')}</label>
                      <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950" placeholder={t('register.addressShortPlaceholder')} value={form.pharmacy_address} onChange={e => setForm(p => ({
                    ...p,
                    pharmacy_address: e.target.value
                  }))} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.licenseImage')}</label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:border-blue-200 dark:border-blue-700/70 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:bg-blue-950/40">
                        <Upload size={16} className="text-blue-600 dark:text-blue-300" />
                        <span>{form.license_image ? form.license_image.name : t('register.uploadLicense')}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => setForm(p => ({
                      ...p,
                      license_image: e.target.files?.[0] || null
                    }))} />
                      </label>
                    </div>
                  </div> : null}

                {role === 'delivery' ? <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{t('register.vehicleType')}</label>
                    <select value={form.vehicle_type} onChange={e => setForm(p => ({
                  ...p,
                  vehicle_type: e.target.value
                }))} className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950">
                      <option value="">{t('register.vehicleSelect')}</option>
                      <option value="motorbike">{t('vehicles.motorbike')}</option>
                      <option value="car">{t('vehicles.car')}</option>
                      <option value="van">{t('vehicles.van')}</option>
                    </select>
                  </div> : null}

                {error ? <p className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('register.creatingAccount') : t('register.submit')}
                </Button>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('register.hasAccount')}{' '}
                  <Link className="font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:text-blue-200" to="/login">
                    {t('register.loginLink')}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>;
}
export default RegisterPage;