import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, tokens } from "@fluentui/react-components"
import { useUsersContext } from "../../../context/users"
import Edit from "./Edit"
import Delete from "./Delete"

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

const columns: TableColumnDefinition<Miscellaneous.User>[] = [
  createTableColumn<Miscellaneous.User>({
    columnId: 'user_name',
    compare: (a, b) => {
      return a.userName.localeCompare(b.userName)
    },
    renderHeaderCell: () => {
      return 'Nombre de usuario'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.userName}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.User>({
    columnId: 'name',
    compare: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    renderHeaderCell: () => {
      return 'Nombre completo'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.User>({
    columnId: 'is_admin',
    compare: (a, b) => {
      const format = (ia: boolean) => ia ? 'Administrador' : 'Vendedor'
      return format(a.isAdmin).localeCompare(format(b.isAdmin))
    },
    renderHeaderCell: () => {
      return 'Tipo'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.isAdmin ? 'Administrador' : 'Vendedor'}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.User>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <Edit user={item} />
          <Delete user={item} />
        </div>
      )
    },
  }),
]

export default () => {
  const styles = useStyles()
  const { loading, items } = useUsersContext()

  return (
    <Card className={styles.root}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={items}
          columns={columns}
          sortable
          getRowId={(item: Miscellaneous.User) => item.id}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Miscellaneous.User>>
            {({ item, rowId }) => (
              <DataGridRow<Miscellaneous.User> key={rowId}>
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