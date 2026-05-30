import { Search } from 'lucide-react'

function SearchBar({
  placeholder = '',
  value = '',
  onChange = () => {},
  onFocus = () => {},
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm dark:shadow-slate-950/20">
      <Search size={18} className="text-slate-400 dark:text-slate-500" />
      <input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="w-full bg-transparent text-sm outline-none"
        placeholder={placeholder}
      />
    </label>
  )
}

export default SearchBar
