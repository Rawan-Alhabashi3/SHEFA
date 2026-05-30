function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-sm font-medium text-blue-600 dark:text-blue-300">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default SectionTitle
