import { createContext, useContext } from 'react'
import { DateRangeType } from '@fluentui/react-calendar-compat'

const HistoryContext = createContext<{
  loading: boolean
  items: Miscellaneous.History[]
  loadItems: (type: DateRangeType, data: number[]) => void
  removeItem: (id: Miscellaneous.History['id']) => void
}>({
  loading: false,
  items: [],
  loadItems: () => { },
  removeItem: () => { },
})

const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }