import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'

const CheckoutContext = createContext<{
  productGroups: Miscellaneous.ProductGroup[]
  setProductGroups: Dispatch<SetStateAction<Miscellaneous.ProductGroup[]>>
  push: (products: Miscellaneous.Product[]) => void
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