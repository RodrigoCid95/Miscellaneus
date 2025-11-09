import { type FC } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button, createTableColumn, TableCellLayout, TableColumnDefinition, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow } from "@fluentui/react-components"
import { useCheckout } from "../../context/checkout"
import { useSearcher } from "../../context/searcher"
import { structs } from "../../../../../wailsjs/go/models"


const columns: TableColumnDefinition<structs.Product>[] = [
  createTableColumn<structs.Product>({
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
  createTableColumn<structs.Product>({
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
  createTableColumn<structs.Product>({
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
  createTableColumn<structs.Product>({
    columnId: 'existents',
    renderHeaderCell: () => {
      return 'Existencias'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout>
          {item.stock === 0 ? 'Agotado' : item.stock}
        </TableCellLayout>
      )
    },
  }),
]

const Selector: FC<SelectorProps> = () => {
  const { push } = useCheckout()
  const { productsToSelection, setProductsToSelection, setLoading } = useSearcher()

  const handleOnSelect = (product: structs.Product) => {
    if (product.stock > 0) {
      setProductsToSelection(null)
      push([product])
      setLoading(false)
    }
  }

  return (
    <Dialog
      modalType="alert"
      open
      onOpenChange={(_, data) => {
        if (!data.open) {
          setProductsToSelection(null)
          setLoading(false)
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Selecciona un producto</DialogTitle>
          <DialogContent>
            Tu búsqueda arrojó más de un producto, elige uno:
            <br />
            {productsToSelection && (
              <DataGrid
                items={productsToSelection}
                columns={columns}
                sortable
                getRowId={(item: structs.Product) => item.id}
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
                    <DataGridRow<structs.Product> key={rowId} onClick={() => handleOnSelect(item)}>
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

export interface SelectorProps {
}