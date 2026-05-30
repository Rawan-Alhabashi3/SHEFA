import { useTranslation } from "react-i18next";
import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { updateDriverAvailability } from '../../services/driverService';
function SettingsPage() {
  const {
    t
  } = useTranslation("driver");
  const [notice, setNotice] = useState('');
  const setMode = async mode => {
    await updateDriverAvailability({
      availability_mode: mode
    });
    setNotice(`${t('settings.success.availabilityUpdated')} ${mode}.`);
  };
  return <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('settings.description')}</p>
      </div>
      {notice ? <p className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-200">{notice}</p> : null}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('settings.status.onlineOfflineStatus')}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => setMode('online')}>{t('settings.buttons.setOnline')}</Button>
          <Button className="!rounded-lg px-3 py-2 text-xs" onClick={() => setMode('busy')}>{t('settings.buttons.setBusy')}</Button>
          <Button variant="secondary" className="!rounded-lg px-3 py-2 text-xs" onClick={() => setMode('offline')}>{t('settings.buttons.setOffline')}</Button>
        </div>
      </Card>
    </section>;
}
export default SettingsPage;