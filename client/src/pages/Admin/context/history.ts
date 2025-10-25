import { createContext, useContext } from 'react'
import { DateRangeType } from '@fluentui/react-calendar-compat'
import { models } from '../../../../wailsjs/go/models'

const HistoryContext = createContext<{
  loading: boolean
  items: models.HistoryItem[]
  loadItems: (type: DateRangeType, data: number[]) => void
  removeItem: (id: models.HistoryItem['id']) => void
}>({
  loading: false,
  items: [],
  loadItems: () => { },
  removeItem: () => { },
})

const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }