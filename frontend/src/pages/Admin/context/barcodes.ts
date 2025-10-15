import { createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const BarCodesContext = createContext<{
  loading: boolean
  loadBarCodes: () => void
  items: models.BarCode[]
}>({
  loading: false,
  loadBarCodes: () => { },
  items: []
})

const useBarCodesContext = () => useContext(BarCodesContext)

export { BarCodesContext, useBarCodesContext }