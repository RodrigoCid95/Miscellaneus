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
import BarCodeViewer from "./Viewer"
import EditBarcode from "./Edit"
import DeleteBarCode from "./Delete"

const loadBarCodeListEmitter = new Emitter()
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

const BarCodeList: FC = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<Miscellaneous.BarCode[]>([])

  const loadBarCodeList = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/bar-codes`)
      .then(res => res.json())
      .then(barCodes => {
        setList(barCodes)
        setLoading(false)
      })
  }, [setLoading, setList])

  useEffect(() => {
    loadBarCodeList()
    loadBarCodeListEmitter.on(loadBarCodeList)
    return () => {
      loadBarCodeListEmitter.off(loadBarCodeList)
    }
  }, [loadBarCodeList])

  return (
    <Card className={styles.root}>
      {loading && <Spinner className={styles.spinner} />}
      {!loading && (
        <DataGrid
          className={styles.table}
          items={list}
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
      )}
    </Card>
  )
}

export { loadBarCodeListEmitter }
export default BarCodeList