import { useCallback, useEffect, useState, type FC } from "react"
import {
  Card,
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
const filterProductListEmitter = new Emitter()
const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL,
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
      return 'Existencias'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.stock.toString()}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'status',
    compare: (a, b) => {
      const statusA = a.stock > 0 ? a.stock < a.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      const statusB = b.stock > 0 ? b.stock < b.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      return statusA.localeCompare(statusB)
    },
    renderHeaderCell: () => {
      return 'Estado'
    },
    renderCell: (item) => {
      const status = item.stock > 0 ? item.stock < item.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'

      return (
        <TableCellLayout truncate>
          {status}
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
      .then(products => {
        setList(products)
        setLoading(false)
      })
  }, [setLoading, setList])

  const filterProducts = useCallback((query: string) => {
    setLoading(true)
    fetch(`${window.location.origin}/api/products/${query}`)
      .then(res => res.json())
      .then(products => {
        const filterList = products.filter((product: Miscellaneous.Product) => {
          return product.name.toLowerCase().includes(query.toLowerCase())
        })
        setList(filterList)
        setLoading(false)
      })
  }, [setLoading, setList])

  useEffect(() => {
    loadProductList()
    loadProductListEmitter.on(loadProductList)
    filterProductListEmitter.on(filterProducts)
    return () => {
      loadProductListEmitter.off(loadProductList)
      filterProductListEmitter.off(filterProducts)
    }
  }, [loadProductList, filterProducts])

  return (
    <Card className={styles.root}>
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
              <DataGridRow<Miscellaneous.Product> key={rowId} style={{ backgroundColor: item.stock === 0 ? tokens.colorPaletteDarkRedBackground2 : item.stock < item.minStock ? tokens.colorPaletteDarkOrangeBackground2 : undefined }}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </Card>
  )
}

export { loadProductListEmitter, filterProductListEmitter }

export default ProductList