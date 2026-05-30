import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../services/driverService';
function ProfilePage() {
  const {
    t
  } = useTranslation("driver");
  const {
    user,
    refreshProfile
  } = useAuth();
  const [form, setForm] = useState({
    username: '',
    phone: '',
    email: '',
    governorate: '',
    vehicle_type: '',
    vehicle_plate_number: '',
    availability_mode: 'offline',
    password: '',
    password_confirmation: ''
  });
  const [notice, setNotice] = useState('');
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      username: user?.username || '',
      phone: user?.phone || '',
      email: user?.email || '',
      governorate: user?.governorate || '',
      vehicle_type: user?.delivery?.vehicle_type || '',
      vehicle_plate_number: user?.delivery?.vehicle_plate_number || '',
      availability_mode: user?.delivery?.availability_mode || 'offline'
    }));
  }, [user]);
  const onSubmit = async event => {
    event.preventDefault();
    await updateMyProfile(form);
    await refreshProfile();
    setNotice(t('profile.success.profileUpdated'));
  };
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('profile.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('profile.description')}</p>
      </div>
      {notice ? <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-200">{notice}</p> : null}
      <Card className="p-5">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          {[['username', t('profile.form.fullName')], ['phone', t('profile.form.phone')], ['email', t('profile.form.email')], ['governorate', t('profile.form.city')], ['vehicle_type', t('profile.form.vehicleType')], ['vehicle_plate_number', t('profile.form.vehiclePlateNumber')]].map(([key, label]) => <div key={key}>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
              <input className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" value={form[key]} onChange={e => setForm(p => ({
            ...p,
            [key]: e.target.value
          }))} />
            </div>)}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{t('profile.form.availabilityStatus')}</label>
            <select className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" value={form.availability_mode} onChange={e => setForm(p => ({
            ...p,
            availability_mode: e.target.value
          }))}>
              <option value="online">{t('profile.status.online')}</option>
              <option value="busy">{t('profile.status.busy')}</option>
              <option value="offline">{t('profile.status.offline')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{t('profile.form.password')}</label>
            <input type="password" className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" value={form.password} onChange={e => setForm(p => ({
            ...p,
            password: e.target.value
          }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{t('profile.form.confirmPassword')}</label>
            <input type="password" className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-sm" value={form.password_confirmation} onChange={e => setForm(p => ({
            ...p,
            password_confirmation: e.target.value
          }))} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="!rounded-xl">{t('profile.buttons.saveProfile')}</Button>
          </div>
        </form>
      </Card>
    </section>;
}
export default ProfilePage;