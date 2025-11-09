import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const ProductsContext = createContext<{
  loading: boolean
  loadProducts: () => void
  filterProducts: (query: string) => void
  items: structs.Product[]
}>({
  loading: false,
  loadProducts: () => { },
  filterProducts: () => { },
  items: []
})

const useProductsContext = () => useContext(ProductsContext)

export { ProductsContext, useProductsContext }