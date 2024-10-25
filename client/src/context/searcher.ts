import { type Dispatch, type SetStateAction, createContext, useContext } from "react"

const SearcherContext = createContext<{
  loading: boolean
  value: string
  productsToSelection: Miscellaneous.Product[] | null
  productOutOfStock: Miscellaneous.Product | null
  openNotFound: boolean
  setProductsToSelection: Dispatch<SetStateAction<Miscellaneous.Product[] | null>>
  setProductOutOfStock: Dispatch<SetStateAction<Miscellaneous.Product | null>>
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