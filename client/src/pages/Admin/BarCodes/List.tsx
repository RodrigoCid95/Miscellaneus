import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, Text, tokens } from "@fluentui/react-components"
import { useBarCodesContext } from "../../../context/barcodes"
import BarCodeViewer from "./Viewer"
import EditBarcode from "./Edit"
import DeleteBarCode from "./Delete"

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL
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
    gap: tokens.spacingHorizontalM
  }
})

const columns: TableColumnDefinition<Miscellaneous.BarCode>[] = [
  createTableColumn<Miscellaneous.BarCode>({
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
  createTableColumn<Miscellaneous.BarCode>({
    columnId: 'tag',
    renderHeaderCell: () => {
      return 'Etiqueta'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.tag}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.BarCode>({
    columnId: 'value',
    renderHeaderCell: () => {
      return 'Valor'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.value}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.BarCode>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <BarCodeViewer barCode={item} />
          <EditBarcode item={item} />
          <DeleteBarCode item={item} />
        </div>
      )
    },
  }),
]

export default () => {
  const styles = useStyles()
  const { loading, items } = useBarCodesContext()

  return (
    <Card className={styles.root}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && items.length > 0 ? (
        <DataGrid
          className={styles.table}
          items={items}
          columns={columns}
          sortable
          getRowId={(item: Miscellaneous.BarCode) => item.id}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Miscellaneous.BarCode>>
            {({ item, rowId }) => (
              <DataGridRow<Miscellaneous.BarCode> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      ) : <Text>No hay nada por aquí</Text>}
    </Card>
  )
}