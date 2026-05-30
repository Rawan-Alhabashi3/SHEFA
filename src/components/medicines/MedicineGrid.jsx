import MedicineCard from './MedicineCard'

function MedicineGrid({ medicines = [] }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{medicines.map((m) => <MedicineCard key={m.id} medicine={m} />)}</div>
}

export default MedicineGrid
