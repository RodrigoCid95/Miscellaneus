import { useEffect, useState } from "react"
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import ToolbarPage from "../../components/Toolbar"
import { ProductsContext, useProductsContext } from "../../context/products"
import New from './components/New'
import List from './components/List'
import Searcher from "./components/Searcher"
import { models } from "../../../../../wailsjs/go/models"
import { GetProducts, GetFilterProducts } from "../../../../../wailsjs/go/controllers/Products"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const Products = () => {
  const { loadProducts } = useProductsContext()

  return (
    <>
      <ToolbarPage title="Productos">
        <New />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={loadProducts}
        />
        <Searcher />
      </ToolbarPage>
      <List />
    </>
  )
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<models.Product[]>([])

  const loadProducts = () => {
    setLoading(true)
    GetProducts()
      .then(products => {
        setItems(products)
        setLoading(false)
      })
  }

  const filterProducts = (query: string) => {
    setLoading(true)
    GetFilterProducts(query)
      .then(products => {
        setItems(products)
        setLoading(false)
      })
  }

  useEffect(loadProducts, [])

  return (
    <ProductsContext.Provider value={{ loading, loadProducts, filterProducts, items }}>
      <Products />
    </ProductsContext.Provider>
  )
}