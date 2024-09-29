import { type FC } from "react"
import ToolbarPage from "./../../../Components/Toolbar"
import ProductList, { loadProductListEmitter, filterProductListEmitter } from "./List"
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import NewProduct from "./New"
import Searcher from "./Searcher"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const ProductsPage: FC<ProductsPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Productos" onOpenMenu={onOpenMenu}>
        <NewProduct />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={() => loadProductListEmitter.emit()}
        />
        <Searcher onSearch={query => filterProductListEmitter.emit(query)}/>
      </ToolbarPage>
      <ProductList />
    </>
  )
}

export default ProductsPage

interface ProductsPageProps {
  onOpenMenu(): void
}