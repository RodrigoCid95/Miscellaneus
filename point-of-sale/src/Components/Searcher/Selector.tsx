import { type FC } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button, createTableColumn, TableCellLayout, TableColumnDefinition, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow } from "@fluentui/react-components"


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
        <TableCellLayout>
          {item.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<Miscellaneous.Product>({
    columnId: 'descriptions',
    renderHeaderCell: () => {
      return 'Descripción'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.description}
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
        <TableCellLayout>
          ${item.price}
        </TableCellLayout>
      )
    },
  }),
]

const Selector: FC<SelectorProps> = ({ products, onClose, onSelect }) => {
  return (
    <Dialog
      modalType="alert"
      open={products !== null}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onClose()
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Selecciona un producto</DialogTitle>
          <DialogContent>
            Tu búsqueda arrojó más de un producto, elige uno:
            <br />
            {products && (
              <DataGrid
                items={products}
                columns={columns}
                sortable
                getRowId={(item: Miscellaneous.Product) => item.id}
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
                    <DataGridRow<Miscellaneous.Product> key={rowId} onClick={() => onSelect(item)}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            )}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Cancelar</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default Selector

interface SelectorProps {
  products: Miscellaneous.Product[] | null
  onClose: () => void
  onSelect: (product: Miscellaneous.Product) => void
}