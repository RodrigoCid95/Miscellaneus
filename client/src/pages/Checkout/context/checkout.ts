import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const CheckoutContext = createContext<{
  productGroups: models.ProductGroup[]
  setProductGroups: Dispatch<SetStateAction<models.ProductGroup[]>>
  push: (products: models.Product[]) => void
  checkout: () => void
  loading: boolean
}>({
  productGroups: [],
  setProductGroups: () => {},
  push: () => {},
  checkout: () => {},
  loading: false
})

const useCheckout = () => useContext(CheckoutContext)

export { CheckoutContext, useCheckout }