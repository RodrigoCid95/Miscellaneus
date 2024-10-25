import { createContext, useContext } from 'react'

const HistoryContext = createContext<{
  loading: boolean
  items: Miscellaneous.History[]
  remove: (id: Miscellaneous.History['id']) => void
  loadHistory: () => void
}>({
  loading: false,
  items: [],
  remove: () => { },
  loadHistory: () => { },
})



const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }