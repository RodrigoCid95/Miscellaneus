import { type Dispatch, type SetStateAction, createContext, useContext } from "react"
import { structs } from "../../../../wailsjs/go/models"

const SearcherContext = createContext<{
  loading: boolean
  value: string
  productsToSelection: structs.Product[] | null
  productOutOfStock: structs.Product | null
  openNotFound: boolean
  setProductsToSelection: Dispatch<SetStateAction<structs.Product[] | null>>
  setProductOutOfStock: Dispatch<SetStateAction<structs.Product | null>>
  setValue: Dispatch<SetStateAction<string>>
  loadProducts: (query: string) => void
  setOpenNotFound: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
}>({
  loading: false,
  value: '',
  productsToSelection: null,
  productOutOfStock: null,
  setProductsToSelection: () => { },
  setProductOutOfStock: () => { },
  setValue: () => { },
  loadProducts: () => { },
  openNotFound: false,
  setOpenNotFound: () => { },
  setLoading: () => { },
})

const useSearcher = () => useContext(SearcherContext)

export { SearcherContext, useSearcher }