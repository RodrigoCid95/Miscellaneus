import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, tokens } from "@fluentui/react-components"
import { useProductsContext } from "../../../context/products"
import BarCodeViewer from "./BarCode"
import Edit from "./Edit"
import Delete from "./Delete"

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
          <Edit item={item} />
          <Delete item={item} />
        </TableCellLayout>
      )
    },
  }),
]

export default () => {
  const styles = useStyles()
  const { loading, items } = useProductsContext()

  return (
    <Card className={styles.root}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={items}
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