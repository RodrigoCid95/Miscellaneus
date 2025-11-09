import { createContext, useContext } from 'react'
import { DateRangeType } from '@fluentui/react-calendar-compat'
import { structs } from '../../../../wailsjs/go/models'

const HistoryContext = createContext<{
  loading: boolean
  items: structs.HistoryItem[]
  loadItems: (type: DateRangeType, data: number[]) => void
  removeItem: (id: structs.HistoryItem['id']) => void
}>({
  loading: false,
  items: [],
  loadItems: () => { },
  removeItem: () => { },
})

const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }