import { type FC, useCallback, useEffect, useState } from "react"
import { type TableColumnDefinition, makeStyles, Dialog, DialogTrigger, ToolbarButton, DialogSurface, DialogTitle, DialogBody, DialogContent, DialogActions, Button, createTableColumn, TableCellLayout, tokens, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Spinner, Text } from "@fluentui/react-components"
import { bundleIcon, History20Filled, History20Regular, BoxArrowLeft20Filled, BoxArrowLeft20Regular } from "@fluentui/react-icons"
import { Emitter } from "../../utils/Emitters"

const loadHistoryListEmitter = new Emitter()
const HistoryIcon = bundleIcon(History20Filled, History20Regular)
const RestoreIcon = bundleIcon(BoxArrowLeft20Filled, BoxArrowLeft20Regular)
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
    overflow: 'auto',
  },
  spinner: {
    marginTop: tokens.spacingVerticalL,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  table: {
    marginTop: tokens.spacingVerticalXXL
  },
})

const columns: TableColumnDefinition<Miscellaneous.History>[] = [
  createTableColumn<Miscellaneous.History>({
    columnId: 'product',
    compare: (a, b) => {
      return a.product.localeCompare(b.product)
    },
    renderHeaderCell: () => 'Producto',
    renderCell: (item) => (
      <TableCellLayout truncate>
        {item.product}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Miscellaneous.History>({
    columnId: 'count',
    compare: (a, b) => {
      return a.count.toString().localeCompare(b.count.toString())
    },
    renderHeaderCell: () => 'Cantidad',
    renderCell: (item) => (
      <TableCellLayout truncate>
        {item.count}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Miscellaneous.History>({
    columnId: 'Total',
    compare: (a, b) => {
      return a.total.toString().localeCompare(b.total.toString())
    },
    renderHeaderCell: () => 'Cantidad',
    renderCell: (item) => (
      <TableCellLayout truncate>
        ${item.total}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Miscellaneous.History>({
    columnId: 'date',
    compare: (a, b) => {
      return a.date.toString().localeCompare(b.date.toString())
    },
    renderHeaderCell: () => 'Hora',
    renderCell: (item) => (
      <TableCellLayout truncate>
        {(new Date(item.date)).toLocaleTimeString()}
      </TableCellLayout>
    ),
  }),
  createTableColumn<Miscellaneous.History>({
    columnId: 'options',
    renderHeaderCell: () => 'Devolver',
    renderCell: (item) => {
      const styles = useStyles()
      const [loading, setLoading] = useState<boolean>(false)

      const handleOnRestore = useCallback(() => {
        setLoading(true)
        fetch(`/api/history/${item.id}`, {
          method: 'delete'
        })
          .then(() => {
            setLoading(false)
            loadHistoryListEmitter.emit()
          })
      }, [setLoading, item])

      return (
        <TableCellLayout truncate>
          {loading && <Spinner className={styles.spinner} />}
          {!loading && <Button icon={<RestoreIcon />} onClick={handleOnRestore} />}
        </TableCellLayout>
      )
    },
  }),
]

const History: FC<HistoryProps> = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<Miscellaneous.History[]>([])

  const loadList = useCallback(() => {
    setLoading(true)
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
  }, [setLoading, setItems])

  useEffect(() => {
    loadHistoryListEmitter.on(loadList)
    return () => loadHistoryListEmitter.off(loadList)
  }), [loadList]

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        if (data.open) {
          loadList()
        }
        setOpen(data.open)
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          appearance='transparent'
          icon={<HistoryIcon />}
        />
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Historial</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            {loading && <Spinner className={styles.spinner} />}
            {!loading && items.length > 0 ? (
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
                    <DataGridRow<Miscellaneous.Product> key={rowId}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            ) : <Text>No hay nada aún.</Text>}
          </DialogContent>
          <DialogActions>
            {!loading && (
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cerrar</Button>
              </DialogTrigger>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default History

interface HistoryProps {
}