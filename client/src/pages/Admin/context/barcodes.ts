import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const BarCodesContext = createContext<{
  loading: boolean
  loadBarCodes: () => void
  items: structs.BarCode[]
}>({
  loading: false,
  loadBarCodes: () => { },
  items: []
})

const useBarCodesContext = () => useContext(BarCodesContext)

export { BarCodesContext, useBarCodesContext }