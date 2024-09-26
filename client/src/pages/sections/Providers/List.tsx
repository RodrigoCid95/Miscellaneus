import { useCallback, useEffect, useState, type FC } from "react"
import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Link,
  makeStyles,
  Spinner,
  TableCellLayout,
  TableColumnDefinition,
  tokens
} from "@fluentui/react-components"
import { Emitter } from './../../../utils/Emitters'
import EditProvider from "./Edit"
import DeleteProvider from "./Delete"

const loadProvidersEmitter = new Emitter()
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

const ProviderList: FC = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<Miscellaneous.Provider[]>([])

  const loadProviderList = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/providers`)
      .then(res => res.json())
      .then(barCodes => {
        setList(barCodes)
        setLoading(false)
      })
  }, [setLoading, setList])

  useEffect(() => {
    loadProviderList()
    loadProvidersEmitter.on(loadProviderList)
    return () => {
      loadProvidersEmitter.off(loadProviderList)
    }
  }, [loadProviderList])

  return (
    <>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={list}
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
      )}
    </>
  )
}

export { loadProvidersEmitter }
export default ProviderList