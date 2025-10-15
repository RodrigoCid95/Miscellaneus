import { SearchBox } from "@fluentui/react-components"
import { useProductsContext } from "../../../context/products"

export default () => {
  const { filterProducts } = useProductsContext()

  return <SearchBox placeholder="Search..." onChange={(_, { value }) => filterProducts(value)} />
}
