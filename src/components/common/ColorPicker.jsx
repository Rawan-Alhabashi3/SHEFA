import { useTranslation } from 'react-i18next'

const COLOR_PALETTE = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Indigo', value: '#6366f1' },
]

function ColorPicker({ value, onChange, usedColors = [], disabled = false }) {
  const { t } = useTranslation('admin')

  const allColorsUsed = usedColors.length >= COLOR_PALETTE.length
  const allowReuse = allColorsUsed

  const selectedColor = COLOR_PALETTE.find(c => c.value === value)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {COLOR_PALETTE.map((color) => {
          const isUsed = usedColors.includes(color.value)
          const isSelected = value === color.value
          const isDisabled = disabled || (!allowReuse && isUsed && !isSelected)

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => !isDisabled && onChange(color.value)}
              disabled={isDisabled}
              className={`
                relative flex aspect-square items-center justify-center rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-slate-900 dark:border-slate-100 ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2 scale-105 shadow-lg' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-105'
                }
                ${isDisabled 
                  ? 'opacity-40 cursor-not-allowed grayscale' 
                  : 'cursor-pointer'
                }
              `}
              style={{ backgroundColor: color.value }}
              title={isUsed && !allowReuse ? `${t('categories.colorUsed')}: ${color.name}` : color.name}
            >
              {isSelected && (
                <span className="text-white text-sm font-bold drop-shadow-md">✓</span>
              )}
            </button>
          )
        })}
      </div>
      {allColorsUsed && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {t('categories.allColorsUsed', { defaultValue: 'All predefined colors are already in use. Color reuse is now allowed.' })}
        </p>
      )}
      {selectedColor && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
          <span 
            className="inline-block w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-sm"
            style={{ backgroundColor: selectedColor.value }}
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {selectedColor.name}
          </span>
        </div>
      )}
    </div>
  )
}

export { ColorPicker, COLOR_PALETTE }
