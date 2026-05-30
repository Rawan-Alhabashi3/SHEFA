import PharmacyCard from './PharmacyCard'

function PharmacyGrid({ pharmacies = [] }) {
  return <div className="grid gap-5 md:grid-cols-3">{pharmacies.map((pharmacy) => <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />)}</div>
}

export default PharmacyGrid
