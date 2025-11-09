import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const HistoryContext = createContext<{
  loading: boolean
  items: structs.Sale[]
  remove: (id: structs.Sale['id']) => void
  loadHistory: () => void
}>({
  loading: false,
  items: [],
  remove: () => { },
  loadHistory: () => { },
})



const useHistory = () => useContext(HistoryContext)

export { HistoryContext, useHistory }