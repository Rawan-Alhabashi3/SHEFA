import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Container from '../common/Container'
import SearchBar from '../common/SearchBar'
import SearchDropdown from '../common/SearchDropdown'

import useDebounce from '../../hooks/useDebounce'
import { GOVERNORATES } from '../../constants/locations'
import { searchMarketplace } from '../../services/searchService'

const governorateTranslationKeys = {
  Damascus: 'damascus',
  'Rif Dimashq': 'rifDimashq',
  Aleppo: 'aleppo',
  Homs: 'homs',
  Hama: 'hama',
  Lattakia: 'lattakia',
  Tartous: 'tartous',
  Daraa: 'daraa',
  'Deir ez-Zor': 'deirEzZor',
  Hasakah: 'hasakah',
  Raqqa: 'raqqa',
  Suwayda: 'suwayda',
  Quneitra: 'quneitra',
}

const defaultResults = {
  medicines: [],
  pharmacies: [],
  categories: [],
}

function SearchSection() {
  const { t } = useTranslation('home')

  const navigate = useNavigate()
  const wrapperRef = useRef(null)

  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [results, setResults] = useState(defaultResults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  const debouncedQuery = useDebounce(query, 400)

  const hasAnyResult = useMemo(
    () =>
      results.medicines.length ||
      results.pharmacies.length ||
      results.categories.length,
    [results]
  )

  useEffect(() => {
    const handleOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)

    return () =>
      document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    const normalized = debouncedQuery.trim()

    if (!normalized) {
      setResults(defaultResults)
      setLoading(false)
      setError(false)
      return
    }

    const controller = new AbortController()

    setLoading(true)
    setError(false)

    searchMarketplace({
      query: normalized,
      city,
      signal: controller.signal,
    })
      .then((data) => {
        setResults({
          medicines: Array.isArray(data?.medicines)
            ? data.medicines
            : [],
          pharmacies: Array.isArray(data?.pharmacies)
            ? data.pharmacies
            : [],
          categories: Array.isArray(data?.categories)
            ? data.categories
            : [],
        })
      })
      .catch((err) => {
        if (
          err?.name !== 'CanceledError' &&
          err?.code !== 'ERR_CANCELED'
        ) {
          setError(true)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [debouncedQuery, city])

  const onPick = (type, item) => {
    setOpen(false)

    if (type === 'medicine') {
      navigate(
        `/medicines?search=${encodeURIComponent(item.name)}`
      )
      return
    }

    if (type === 'pharmacy') {
      navigate(
        `/pharmacies?search=${encodeURIComponent(item.name)}`
      )
      return
    }

    navigate(
      `/medicines?category=${encodeURIComponent(item.name)}`
    )
  }

  const onSubmit = () => {
    if (!query.trim()) return

    navigate(
      `/medicines?search=${encodeURIComponent(query.trim())}${city
        ? `&governorate=${encodeURIComponent(city)}`
        : ''
      }`
    )

    setOpen(false)
  }

  return (
    <Container className="-mt-8">
      <section
        ref={wrapperRef}
        className="fade-in-up relative rounded-2xl bg-white p-4 shadow-lg dark:bg-slate-900 md:p-6"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <SearchBar
            value={query}
            placeholder={t('search.placeholder')}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => {
              if (query.trim() || hasAnyResult) {
                setOpen(true)
              }
            }}
          />

          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="rounded-full border border-slate-200 px-4 py-3 text-sm dark:border-slate-700"
          >
            <option value="">
              {t('search.allCities')}
            </option>

            {GOVERNORATES.map((governorate) => (
              <option
                key={governorate}
                value={governorate}
              >
                {t(
                  `search.governorates.${governorateTranslationKeys[governorate]}`
                )}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onSubmit}
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t('search.submit')}
          </button>
        </div>

        <SearchDropdown
          open={open && !!query.trim()}
          loading={loading}
          error={error}
          results={results}
          onPick={onPick}
          labels={{
            unavailable: t('search.unavailable'),
            empty: t('search.empty'),
            medicines: t('search.groups.medicines'),
            pharmacies: t('search.groups.pharmacies'),
            categories: t('search.groups.categories'),
            medicineFallback: t('search.medicineFallback'),
          }}
        />
      </section>
    </Container>
  )
}

export default SearchSection
