import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { GOVERNORATE_AREAS, GOVERNORATES } from '../../constants/locations';
import { updateMyProfile } from '../../services/driverService';

function PharmacyProfilePage() {
  const {
    t
  } = useTranslation("pharmacy");
  const {
    t: tProfile
  } = useTranslation("profile");
  const {
    user,
    refreshProfile
  } = useAuth();
  const [form, setForm] = useState({
    username: '',
    phone: '',
    email: '',
    governorate: '',
    area: '',
    pharmacy_name: '',
    pharmacy_address: '',
    pharmacy_phone: '',
    is_specialist: false,
    password: '',
    password_confirmation: ''
  });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const availableAreas = useMemo(() => {
    if (!form.governorate) return [];
    return GOVERNORATE_AREAS[form.governorate] || [];
  }, [form.governorate]);

  const handleGovernorateChange = (e) => {
    const newGovernorate = e.target.value;
    setForm(prev => ({
      ...prev,
      governorate: newGovernorate,
      area: ''
    }));
  };
  
  useEffect(() => {
    if (user?.pharmacy) {
      setForm(prev => ({
        ...prev,
        username: user?.username || '',
        phone: user?.phone || '',
        email: user?.email || '',
        governorate: user?.governorate || '',
        area: user?.area || '',
        pharmacy_name: user?.pharmacy?.pharmacy_name || '',
        pharmacy_address: user?.pharmacy?.address || '',
        pharmacy_phone: user?.pharmacy?.phone || '',
        is_specialist: Boolean(user?.pharmacy?.is_specialist)
      }));
    }
  }, [user]);

  const onSubmit = async event => {
    event.preventDefault();
    setError('');
    setNotice('');
    
    try {
      await updateMyProfile(form);
      await refreshProfile();
      setNotice(tProfile('success.profileUpdated'));
    } catch (err) {
      setError(err?.response?.data?.message || t('profile.error.updateFailed'));
    }
  };

  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('profile.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('profile.description')}</p>
      </div>
      
      {notice ? <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-200">{notice}</p> : null}
      {error ? <p className="rounded-xl bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}
      
      <Card className="p-5">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          {[
            ['username', tProfile('form.fullName')],
            ['phone', tProfile('form.phone')],
            ['email', tProfile('form.email')],
            ['pharmacy_name', t('profile.form.pharmacyName')],
            ['pharmacy_address', t('profile.form.pharmacyAddress')],
            ['pharmacy_phone', t('profile.form.pharmacyPhone')]
          ].map(([key, label]) => <div key={key}>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
              <input 
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
                value={form[key]} 
                onChange={e => setForm(p => ({
                  ...p,
                  [key]: e.target.value
                }))} 
              />
            </div>)}
          
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{tProfile('form.city')}</label>
            <select
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
              value={form.governorate}
              onChange={handleGovernorateChange}
            >
              <option value="">{tProfile('form.selectCity')}</option>
              {GOVERNORATES.map(gov => (
                <option key={gov} value={gov}>{t(`locations.governorates.${gov}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{tProfile('form.area')}</label>
            <select
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
              value={form.area}
              onChange={e => setForm(p => ({...p, area: e.target.value}))}
              disabled={!form.governorate}
            >
              <option value="">{tProfile('form.selectArea')}</option>
              {availableAreas.map(area => (
                <option key={area} value={area}>{t(`locations.areas.${area}`)}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 rounded-xl border border-blue-200 dark:border-blue-700/40 bg-blue-50 dark:bg-blue-950/30 p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.is_specialist} 
                onChange={e => setForm(p => ({...p, is_specialist: e.target.checked}))}
                className="h-4 w-4 rounded border border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-950 accent-blue-600 dark:accent-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-blue-900 dark:text-blue-100">{t('profile.form.participateAsSpecialist')}</div>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">{t('profile.form.participateAsSpecialistDescription')}</p>
              </div>
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{tProfile('form.password')}</label>
            <input 
              type="password" 
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
              value={form.password} 
              onChange={e => setForm(p => ({
                ...p,
                password: e.target.value
              }))} 
              placeholder={tProfile('form.passwordPlaceholder')}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{tProfile('form.confirmPassword')}</label>
            <input 
              type="password" 
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm outline-none transition focus:border-blue-300 dark:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-950"
              value={form.password_confirmation} 
              onChange={e => setForm(p => ({
                ...p,
                password_confirmation: e.target.value
              }))} 
              placeholder={tProfile('form.confirmPasswordPlaceholder')}
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="!rounded-xl">{tProfile('buttons.saveProfile')}</Button>
          </div>
        </form>
      </Card>
    </section>;
}

export default PharmacyProfilePage;
