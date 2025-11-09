import { type FC, type ReactNode, useState } from "react"
import { type TableColumnDefinition, makeStyles, Dialog, DialogTrigger, ToolbarButton, DialogSurface, DialogTitle, DialogBody, DialogContent, DialogActions, Button, createTableColumn, TableCellLayout, tokens, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Spinner, Text } from "@fluentui/react-components"
import { bundleIcon, History20Filled, History20Regular, BoxArrowLeft20Filled, BoxArrowLeft20Regular } from "@fluentui/react-icons"
import { HistoryContext, useHistory } from "./context/history"
import { GetHistory, RestoreHistory } from "../../../wailsjs/go/controllers/Checkout"
import { structs } from "../../../wailsjs/go/models"

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

const columns: TableColumnDefinition<structs.Sale>[] = [
  createTableColumn<structs.Sale>({
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
  createTableColumn<structs.Sale>({
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
  createTableColumn<structs.Sale>({
    columnId: 'Total',
    compare: (a, b) => {
      return a.total.toString().localeCompare(b.total.toString())
    },
    renderHeaderCell: () => 'Total',
    renderCell: (item) => (
      <TableCellLayout truncate>
        ${item.total}
      </TableCellLayout>
    ),
  }),
  createTableColumn<structs.Sale>({
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
  createTableColumn<structs.Sale>({
    columnId: 'options',
    renderHeaderCell: () => 'Devolver',
    renderCell: (item) => {
      const styles = useStyles()
      const [loading, setLoading] = useState<boolean>(false)
      const { remove } = useHistory()

      const handleOnRestore = () => {
        setLoading(true)
        remove(item.id)
      }

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
  const { loading, items, loadHistory } = useHistory()

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        if (data.open) {
          loadHistory()
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
                getRowId={(item: structs.Product) => item.id}
                resizableColumns
              >
                <DataGridHeader>
                  <DataGridRow>
                    {({ renderHeaderCell }) => (
                      <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<structs.Product>>
                  {({ item, rowId }) => (
                    <DataGridRow<structs.Product> key={rowId}>
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

const HistoryProvider: FC<HistoryProviderProps> = ({ children }) => {
  const [items, setItems] = useState<structs.Sale[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const remove = (id: structs.Sale['id']) => {
    RestoreHistory(id)
      .finally(loadHistory)
  }
  
  const loadHistory = () => {
    setLoading(true)
    GetHistory()
      .then(data => {
        setItems(data)
        setLoading(false)
      })
  }

  return (
    <HistoryContext.Provider value={{ loading, items, remove, loadHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export default () => (
  <HistoryProvider>
    <History />
  </HistoryProvider>
)

interface HistoryProps {
}

interface HistoryProviderProps {
  children: ReactNode
}