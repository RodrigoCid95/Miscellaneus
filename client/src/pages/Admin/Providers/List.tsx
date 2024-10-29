import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Link, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, Text, tokens } from "@fluentui/react-components"
import { useProvidersContext } from "../../../context/providers"
import EditProvider from "./Edit"
import DeleteProvider from "./Delete"

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

const columns: TableColumnDefinition<Miscellaneous.Provider>[] = [
  createTableColumn<Miscellaneous.Provider>({
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
  createTableColumn<Miscellaneous.Provider>({
    columnId: 'phone',
    renderHeaderCell: () => {
      return 'Teléfono'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          <Link href={`tel:${item.phone}`}>{item.phone}</Link>
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Provider>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <EditProvider item={item} />
          <DeleteProvider item={item} />
        </div>
      )
    },
  }),
]

export default () => {
  const styles = useStyles()
  const { loading, items } = useProvidersContext()

  return (
    <Card className={styles.root}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && items.length > 0 ? (
        <DataGrid
          className={styles.table}
          items={items}
          columns={columns}
          sortable
          getRowId={(item: Miscellaneous.Provider) => item.id}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Miscellaneous.Provider>>
            {({ item, rowId }) => (
              <DataGridRow<Miscellaneous.Provider> key={rowId}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      ): <Text>No hay nada por aquí.</Text>}
    </Card>
  )
}