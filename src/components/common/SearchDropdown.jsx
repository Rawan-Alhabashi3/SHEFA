import { FolderHeart, Pill, Store } from 'lucide-react';
import EmptySearchState from './EmptySearchState';
import SearchLoader from './SearchLoader';
import SearchResultItem from './SearchResultItem';
function Group({
  title,
  children
}) {
  return <div className="border-b border-slate-100 dark:border-slate-800 p-2 last:border-b-0">
      <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>;
}
function SearchDropdown({
  open,
  loading,
  error,
  results,
  onPick,
  labels = {}
}) {
  if (!open) return null;
  const hasResults = results.medicines.length > 0 || results.pharmacies.length > 0 || results.categories.length > 0;
  return <div className="absolute left-0 top-[calc(100%+10px)] z-40 max-h-96 w-full overflow-y-auto rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl dark:shadow-slate-950/40">
      {loading ? <SearchLoader /> : null}
      {!loading && error ? <EmptySearchState text={labels.unavailable} /> : null}
      {!loading && !error && !hasResults ? <EmptySearchState text={labels.empty} /> : null}
      {!loading && !error && hasResults ? <>
          {results.medicines.length > 0 ? <Group title={labels.medicines}>
              {results.medicines.map(item => <SearchResultItem key={`medicine-${item.id}`} icon={Pill} title={item.name} subtitle={item.pharmacy_name || labels.medicineFallback} onClick={() => onPick('medicine', item)} />)}
            </Group> : null}
          {results.pharmacies.length > 0 ? <Group title={labels.pharmacies}>
              {results.pharmacies.map(item => <SearchResultItem key={`pharmacy-${item.id}`} icon={Store} title={item.name} subtitle={item.city} onClick={() => onPick('pharmacy', item)} />)}
            </Group> : null}
          {results.categories.length > 0 ? <Group title={labels.categories}>
              {results.categories.map(item => <SearchResultItem key={`category-${item.id}-${item.name}`} icon={FolderHeart} title={item.name} onClick={() => onPick('category', item)} />)}
            </Group> : null}
        </> : null}
    </div>;
}
export default SearchDropdown;
