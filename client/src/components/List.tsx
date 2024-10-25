import { type FC, useState } from "react"
import { DataGrid, DataGridHeader, DataGridRow, DataGridHeaderCell, DataGridBody, DataGridCell, createTableColumn, TableCellLayout, TableColumnDefinition, makeStyles, tokens } from "@fluentui/react-components"
import ProductDetails from "./Details"
import { useCheckout } from "../context/checkout"

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalS
  },
})

const columns: TableColumnDefinition<Miscellaneous.ProductGroup>[] = [
  createTableColumn<Miscellaneous.ProductGroup>({
    columnId: 'name',
    compare: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    renderHeaderCell: () => {
      return 'Nombre'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.ProductGroup>({
    columnId: 'descriptions',
    renderHeaderCell: () => {
      return 'Descripción'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.description}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.ProductGroup>({
    columnId: 'units',
    renderHeaderCell: () => {
      return 'Cantidad'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.count}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.ProductGroup>({
    columnId: 'price',
    renderHeaderCell: () => {
      return 'Precio'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          ${item.price}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.ProductGroup>({
    columnId: 'subTotal',
    renderHeaderCell: () => {
      return 'Sub Total'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          ${item.price * item.count}
        </TableCellLayout>
      )
    },
  }),
]

const ProductList: FC<ProductListProps> = () => {
  const styles = useStyles()
  const { productGroups: products, setProductGroups: onUpdate } = useCheckout()
  const [productToDetails, setProductToDetails] = useState<Miscellaneous.ProductGroup | null>(null)

  const handleOnQuit = () => {
    const newList = new Array<Miscellaneous.ProductGroup>(...products)
    const index = newList.findIndex((p) => p.id === productToDetails?.id)
    if (index !== -1) {
      newList.splice(index, 1)
      onUpdate(newList)
    }
    setProductToDetails(null)
  }

  const handleOnClose = (count: Miscellaneous.ProductGroup['count']) => {
    const newList = new Array<Miscellaneous.ProductGroup>(...products)
    const index = newList.findIndex((p) => p.id === productToDetails?.id)
    if (index !== -1) {
      products[index].count = count
      onUpdate(newList)
    }
    setProductToDetails(null)
  }

  return (
    <div className={styles.root}>
      <DataGrid
        items={products}
        columns={columns}
        sortable
        getRowId={(item: Miscellaneous.ProductGroup) => item.id}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Miscellaneous.ProductGroup>>
          {({ item, rowId }) => (
            <DataGridRow<Miscellaneous.ProductGroup> key={rowId} onClick={() => setProductToDetails(item)}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      <ProductDetails product={productToDetails} onClose={handleOnClose} onQuit={handleOnQuit} />
    </div>
  )
}

export default ProductList

interface ProductListProps {
}