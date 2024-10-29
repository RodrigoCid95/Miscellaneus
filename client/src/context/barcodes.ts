import { createContext, useContext } from 'react'

const BarCodesContext = createContext<{
  loading: boolean
  loadBarCodes: () => void
  items: Miscellaneous.BarCode[]
}>({
  loading: false,
  loadBarCodes: () => { },
  items: []
})

const useBarCodesContext = () => useContext(BarCodesContext)

export { BarCodesContext, useBarCodesContext }