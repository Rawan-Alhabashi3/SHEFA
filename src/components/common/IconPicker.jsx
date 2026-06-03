import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pill,
  Shield,
  Heart,
  Activity,
  Wind,
  Sparkles,
  Stethoscope,
  Syringe,
  Package,
  Baby,
  Droplets,
  Thermometer,
  FlaskConical,
  TestTube,
  Beaker,
  Dna,
  Bone,
  Eye,
  HeartPulse,
  CircleDot,
  Zap,
  CheckCircle2,
  Star,
  Tag,
  Store,
  Truck,
  MapPin,
  Gift,
  Plus,
  Search,
  UserCircle2,
  Clock3,
  CreditCard,
  ClipboardList,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  XCircle,
  BadgeCheck,
  Percent,
  HandHeart,
  MessageCircle,
  Phone,
  WalletCards,
  Minus,
  ArrowLeft,
  Upload,
  Users,
  Headset,
  Languages,
  Moon,
  Sun,
  FolderHeart,
  Globe,
  Mail,
  LogOut,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Check,
  Bell,
  CheckCheck,
  History,
  Boxes,
  PackageX,
  Undo2,
  Camera,
  ShoppingCart,
  Lock,
  ShieldPlus,
  Menu,
  X,
} from 'lucide-react'

const ICON_OPTIONS = [
  { name: 'pill', icon: Pill, label: 'Pill' },
  { name: 'shield', icon: Shield, label: 'Shield' },
  { name: 'heart', icon: Heart, label: 'Heart' },
  { name: 'activity', icon: Activity, label: 'Activity' },
  { name: 'wind', icon: Wind, label: 'Wind' },
  { name: 'sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'stethoscope', icon: Stethoscope, label: 'Stethoscope' },
  { name: 'syringe', icon: Syringe, label: 'Syringe' },
  { name: 'package', icon: Package, label: 'Package' },
  { name: 'baby', icon: Baby, label: 'Baby' },
  { name: 'droplets', icon: Droplets, label: 'Droplets' },
  { name: 'thermometer', icon: Thermometer, label: 'Thermometer' },
  { name: 'flask', icon: FlaskConical, label: 'Flask' },
  { name: 'test-tube', icon: TestTube, label: 'Test Tube' },
  { name: 'beaker', icon: Beaker, label: 'Beaker' },
  { name: 'dna', icon: Dna, label: 'DNA' },
  { name: 'bone', icon: Bone, label: 'Bone' },
  { name: 'eye', icon: Eye, label: 'Eye' },
  { name: 'heart-pulse', icon: HeartPulse, label: 'Heart Pulse' },
  { name: 'circle-dot', icon: CircleDot, label: 'Circle Dot' },
  { name: 'zap', icon: Zap, label: 'Zap' },
  { name: 'star', icon: Star, label: 'Star' },
  { name: 'tag', icon: Tag, label: 'Tag' },
  { name: 'store', icon: Store, label: 'Store' },
  { name: 'truck', icon: Truck, label: 'Truck' },
  { name: 'map-pin', icon: MapPin, label: 'Map Pin' },
  { name: 'gift', icon: Gift, label: 'Gift' },
  { name: 'plus', icon: Plus, label: 'Plus' },
  { name: 'search', icon: Search, label: 'Search' },
  { name: 'user-circle', icon: UserCircle2, label: 'User Circle' },
  { name: 'clock', icon: Clock3, label: 'Clock' },
  { name: 'credit-card', icon: CreditCard, label: 'Credit Card' },
  { name: 'clipboard', icon: ClipboardList, label: 'Clipboard' },
  { name: 'package-check', icon: PackageCheck, label: 'Package Check' },
  { name: 'refresh', icon: RefreshCw, label: 'Refresh' },
  { name: 'shield-check', icon: ShieldCheck, label: 'Shield Check' },
  { name: 'x-circle', icon: XCircle, label: 'X Circle' },
  { name: 'badge-check', icon: BadgeCheck, label: 'Badge Check' },
  { name: 'percent', icon: Percent, label: 'Percent' },
  { name: 'hand-heart', icon: HandHeart, label: 'Hand Heart' },
  { name: 'message-circle', icon: MessageCircle, label: 'Message Circle' },
  { name: 'phone', icon: Phone, label: 'Phone' },
  { name: 'wallet', icon: WalletCards, label: 'Wallet' },
  { name: 'minus', icon: Minus, label: 'Minus' },
  { name: 'arrow-left', icon: ArrowLeft, label: 'Arrow Left' },
  { name: 'upload', icon: Upload, label: 'Upload' },
  { name: 'users', icon: Users, label: 'Users' },
  { name: 'headset', icon: Headset, label: 'Headset' },
  { name: 'languages', icon: Languages, label: 'Languages' },
  { name: 'moon', icon: Moon, label: 'Moon' },
  { name: 'sun', icon: Sun, label: 'Sun' },
  { name: 'folder-heart', icon: FolderHeart, label: 'Folder Heart' },
  { name: 'globe', icon: Globe, label: 'Globe' },
  { name: 'mail', icon: Mail, label: 'Mail' },
  { name: 'logout', icon: LogOut, label: 'Logout' },
  { name: 'pencil', icon: Pencil, label: 'Pencil' },
  { name: 'trash', icon: Trash2, label: 'Trash' },
  { name: 'toggle-left', icon: ToggleLeft, label: 'Toggle Left' },
  { name: 'toggle-right', icon: ToggleRight, label: 'Toggle Right' },
  { name: 'chevron-down', icon: ChevronDown, label: 'Chevron Down' },
  { name: 'check', icon: Check, label: 'Check' },
  { name: 'bell', icon: Bell, label: 'Bell' },
  { name: 'check-check', icon: CheckCheck, label: 'Check Check' },
  { name: 'history', icon: History, label: 'History' },
  { name: 'boxes', icon: Boxes, label: 'Boxes' },
  { name: 'package-x', icon: PackageX, label: 'Package X' },
  { name: 'undo', icon: Undo2, label: 'Undo' },
  { name: 'camera', icon: Camera, label: 'Camera' },
  { name: 'shopping-cart', icon: ShoppingCart, label: 'Shopping Cart' },
  { name: 'lock', icon: Lock, label: 'Lock' },
  { name: 'shield-plus', icon: ShieldPlus, label: 'Shield Plus' },
  { name: 'menu', icon: Menu, label: 'Menu' },
  { name: 'x', icon: X, label: 'X' },
]

function IconPicker({ value, onChange, disabled = false }) {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')

  const filteredIcons = ICON_OPTIONS.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase()) ||
    icon.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedIcon = ICON_OPTIONS.find(icon => icon.name === value)

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('categories.searchIcons', { defaultValue: 'Search icons...' })}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500 dark:focus:ring-blue-950"
        />
      </div>

      <div className="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto pr-1">
        {filteredIcons.map((iconOption) => {
          const Icon = iconOption.icon
          const isSelected = value === iconOption.name

          return (
            <button
              key={iconOption.name}
              type="button"
              onClick={() => !disabled && onChange(iconOption.name)}
              disabled={disabled}
              className={`
                relative flex aspect-square items-center justify-center rounded-xl border-2 transition-all
                ${isSelected 
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 scale-105' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={iconOption.label}
            >
              <Icon 
                size={24} 
                className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}
              />
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-sm">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedIcon && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3">
          {(() => {
            const Icon = selectedIcon.icon
            return <Icon size={20} className="text-slate-600 dark:text-slate-300" />
          })()}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {selectedIcon.label}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({selectedIcon.name})
          </span>
        </div>
      )}
    </div>
  )
}

export { IconPicker, ICON_OPTIONS }
