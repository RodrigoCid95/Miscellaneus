import { createContext, useContext } from 'react'

const ProductsContext = createContext<{
  loading: boolean
  loadProducts: () => void
  filterProducts: (query: string) => void
  items: Miscellaneous.Product[]
}>({
  loading: false,
  loadProducts: () => { },
  filterProducts: () => { },
  items: []
})

const useProductsContext = () => useContext(ProductsContext)

export { ProductsContext, useProductsContext }