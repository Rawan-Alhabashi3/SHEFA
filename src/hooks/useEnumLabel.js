import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { translateEnum } from '../utils/translateEnum'

export function useEnumLabel(ns = 'common') {
  const { t } = useTranslation(ns)

  return useCallback(
    (value, options = {}) => translateEnum(t, value, { ns, ...options }),
    [t, ns],
  )
}
