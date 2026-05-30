function PharmacyDetails({ pharmacy }) {
  if (!pharmacy) return null
  return (
    <section className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm dark:shadow-slate-950/20">
      <h2 className="text-2xl font-bold">{pharmacy.name}</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{pharmacy.location}</p>
    </section>
  )
}

export default PharmacyDetails
