import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import useAppStore from '../../context/useAppStore'

function GlobalToastListener() {
  const event = useAppStore((s) => s.lastCartEvent)
  const seenAt = useRef(null)

  useEffect(() => {
    if (!event?.type || !event?.at) return
    if (seenAt.current === event.at) return
    seenAt.current = event.at

    switch (event.type) {
      case 'add':
      case 'increment':
        toast.success('Added to cart')
        break
      case 'decrement':
      case 'setQty':
        toast.info('Cart updated')
        break
      case 'remove':
        toast.info('Item removed from cart')
        break
      case 'clear':
        toast.info('Cart cleared')
        break
      case 'areaSeparated':
        toast.warning('Added as a separate delivery group')
        break
      case 'blockedGovernorate':
        toast.warning('You cannot add medicines from another governorate to the current cart.')
        break
      case 'blockedPrescription':
        toast.warning('This medicine requires a physical prescription and cannot be ordered online.')
        break
      case 'purgedRestricted':
        toast.info('Prescription-only medicines were removed from cart.')
        break
      case 'favoriteAdded':
        toast.success('Added to favorites')
        break
      case 'favoriteRemoved':
        toast.info('Removed from favorites')
        break
      case 'favoriteSyncFailed':
        toast.error('Could not update favorites. Please try again.')
        break
      default:
        break
    }
  }, [event])

  return null
}

export default GlobalToastListener

