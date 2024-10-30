import { createContext } from "react"

const ProductsGroupContext = createContext<{
  productGroups: Miscellaneous.ProductGroup[]
  push: (products: Miscellaneous.Product[]) => void
  checkout: () => void
}>({
  productGroups: [],
  push: () => {},
  checkout: () => {}
})

export default ProductsGroupContext