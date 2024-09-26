import { useCallback, useEffect, useState, type FC } from "react"
import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  makeStyles,
  Spinner,
  TableCellLayout,
  TableColumnDefinition,
  tokens
} from "@fluentui/react-components"
import { Emitter } from './../../../utils/Emitters'
import EditProduct from "./Edit"
import DeleteProduct from "./Delete"
import BarCodeViewer from "./BarCode"

const loadProductListEmitter = new Emitter()
const useStyles = makeStyles({
  container: {
    overflow: 'auto'
  },
  spinner: {
    marginTop: tokens.spacingVerticalL,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    marginTop: tokens.spacingVerticalXXL
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap'
  }
})

const columns: TableColumnDefinition<Miscellaneous.Product>[] = [
  createTableColumn<Miscellaneous.Product>({
    columnId: 'name',
    compare: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    renderHeaderCell: () => {
      return 'Nombre'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'description',
    renderHeaderCell: () => {
      return 'Descripción'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.description || ''}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'provider',
    compare: (a, b) => {
      return a.provider.name.localeCompare(b.provider.name)
    },
    renderHeaderCell: () => {
      return 'Proveedor'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.provider.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'sku',
    renderHeaderCell: () => {
      return 'SKU'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.sku}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'price',
    renderHeaderCell: () => {
      return 'Precio'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          ${item.price}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'stock',
    compare: (a, b) => {
      return a.stock.toString().localeCompare(b.stock.toString())
    },
    renderHeaderCell: () => {
      return 'Stock'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.stock}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <TableCellLayout className={styles.actions}>
          <BarCodeViewer barCode={{
            id: item.sku as unknown as number,
            name: item.name,
            value: item.sku
          }} />
          <EditProduct item={item} />
          <DeleteProduct item={item} />
        </TableCellLayout>
      )
    },
  }),
]

const ProductList: FC = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<Miscellaneous.Product[]>([])

  const loadProductList = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/products`)
      .then(res => res.json())
      .then(barCodes => {
        setList(barCodes)
        setLoading(false)
      })
  }, [setLoading, setList])

  useEffect(() => {
    loadProductList()
    loadProductListEmitter.on(loadProductList)
    return () => {
      loadProductListEmitter.off(loadProductList)
    }
  }, [loadProductList])

  return (
    <div className={styles.container}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={list}
          columns={columns}
          sortable
          getRowId={(item: Miscellaneous.Product) => item.id}
          resizableColumns
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Miscellaneous.Product>>
            {({ item, rowId }) => (
              <DataGridRow<Miscellaneous.Product> key={rowId} style={{ backgroundColor: item.stock < item.minStock ? tokens.colorPaletteDarkRedBackground2 : undefined }}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </div>
  )
}

export { loadProductListEmitter }
export default ProductList