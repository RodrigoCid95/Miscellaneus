import { type Dispatch, type SetStateAction, createContext, useContext } from "react"
import { models } from "../../../../wailsjs/go/models"

const SearcherContext = createContext<{
  loading: boolean
  value: string
  productsToSelection: models.Product[] | null
  productOutOfStock: models.Product | null
  openNotFound: boolean
  setProductsToSelection: Dispatch<SetStateAction<models.Product[] | null>>
  setProductOutOfStock: Dispatch<SetStateAction<models.Product | null>>
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