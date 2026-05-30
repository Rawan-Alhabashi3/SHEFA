import { Globe, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../common/Container';
function Footer() {
  const {
    t
  } = useTranslation('common');
  const quickLinks = ['linkMedicines', 'linkPharmacies', 'linkRewards', 'linkConsultation'];
  const services = ['serviceOrdering', 'serviceDelivery', 'servicePrescription'];
  return <footer className="mt-16 bg-blue-950 py-12 text-slate-200">
      <Container className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-white">{t('footer.brand')}</h3>
          <p className="mt-3 text-sm text-slate-300">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">{t('footer.quickLinks')}</h4>
          {quickLinks.map(key => <p key={key} className="mb-1 text-sm">
              {t(`footer.${key}`)}
            </p>)}
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">{t('footer.servicesTitle')}</h4>
          {services.map(key => <p key={key} className="mb-1 text-sm">
              {t(`footer.${key}`)}
            </p>)}
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-white">{t('footer.contact')}</h4>
          <p className="text-sm">{t("support@shifa.app")}</p>
          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Mail size={15} />{t("support@shifa.app")}</p>
            <p className="flex items-center gap-2"><Phone size={15} /> +966 555 123 456</p>
            <p className="flex items-center gap-2"><Globe size={15} /> {t('footer.website')}</p>
          </div>
        </div>
      </Container>
    </footer>;
}
export default Footer;