import { createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const HistoryContext = createContext<{
  loading: boolean
  items: models.Sale[]
  remove: (id: models.Sale['id']) => void
  loadHistory: () => void
}>({
  loading: false,
  items: [],
  remove: () => { },
  loadHistory: () => { },
})



const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }