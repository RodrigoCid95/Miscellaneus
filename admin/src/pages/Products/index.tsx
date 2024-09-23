import { type FC } from "react"
import ToolbarPage from "./../../components/Toolbar"

const ProductsPage: FC<ProductsPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Productos" onOpenMenu={onOpenMenu} />
    </>
  )
}

export default ProductsPage

interface ProductsPageProps {
  onOpenMenu(): void
}