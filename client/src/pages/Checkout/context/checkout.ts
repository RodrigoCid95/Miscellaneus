import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const CheckoutContext = createContext<{
  productGroups: ProductGroup[]
  setProductGroups: Dispatch<SetStateAction<ProductGroup[]>>
  push: (products: structs.Product[]) => void
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

export type ProductGroup = {
  id: string
  name: string
  description: string
  sku: string
  price: number
  stock: number
  minStock: number
  count: number
}

export { CheckoutContext, useCheckout }