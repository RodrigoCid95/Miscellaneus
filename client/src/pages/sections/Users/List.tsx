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
import EditUser from "./Edit"
import DeleteUser from "./Delete"

const loadUserListEmitter = new Emitter()
const useStyles = makeStyles({
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
          <EditUser
            loadUserListEmitter={loadUserListEmitter}
            user={item}
          />
          <DeleteUser
            loadUserListEmitter={loadUserListEmitter}
            user={item}
          />
        </div>
      )
    },
  }),
]

const UserList: FC = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(true)
  const [userList, setUserList] = useState<Miscellaneous.User[]>([])

  const loadUserList = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/users`)
      .then(res => res.json())
      .then(users => {
        setUserList(users)
        setLoading(false)
      })
  }, [setLoading, setUserList])

  useEffect(() => {
    loadUserList()
    loadUserListEmitter.on(loadUserList)
    return () => {
      loadUserListEmitter.off(loadUserList)
    }
  }, [loadUserList])

  return (
    <>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={userList}
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
    </>
  )
}

export { loadUserListEmitter }
export default UserList