import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, Text, tokens } from "@fluentui/react-components"
import { useUsersContext } from "../../../context/users"
import Edit from "./Edit"
import Delete from "./Delete"
import { models } from "../../../../../../wailsjs/go/models"

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL,
    marginBottom: tokens.spacingVerticalXXL,
    marginLeft: tokens.spacingHorizontalXXL,
    marginRight: tokens.spacingHorizontalXXL,
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
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 616px)": {
      gap: tokens.spacingHorizontalS,
      padding: tokens.spacingVerticalXS
    }
  },
})

const columns: TableColumnDefinition<models.User>[] = [
  createTableColumn<models.User>({
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
  createTableColumn<models.User>({
    columnId: 'full_name',
    compare: (a, b) => {
      return a.fullName.localeCompare(b.fullName)
    },
    renderHeaderCell: () => {
      return 'Nombre completo'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.fullName}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.User>({
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
  createTableColumn<models.User>({
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

const Content = ({ loading, items }: ContentProps) => {
  const styles = useStyles()

  if (loading) {
    return <Spinner className={styles.spinner} />
  }

  if (items.length === 0) {
    return <Text>No hay nada por aquí.</Text>
  }

  return (
    <DataGrid
      className={styles.table}
      items={items}
      columns={columns}
      sortable
      getRowId={(item: models.User) => item.id}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<models.User>>
        {({ item, rowId }) => (
          <DataGridRow<models.User> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

export default () => {
  const styles = useStyles()
  const { loading, items } = useUsersContext()

  return (
    <Card className={styles.root}>
      <Content loading={loading} items={items} />
    </Card>
  )
}

interface ContentProps {
  loading: boolean
  items: models.User[]
}
