import { useEffect, useState } from "react"
import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, tokens, Text } from "@fluentui/react-components"
import { useProductsContext } from "../../../context/products"
import BarCodeViewer from "./BarCode"
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
const desktopColumns: TableColumnDefinition<models.Product>[] = [
  createTableColumn<models.Product>({
    columnId: 'name',
    compare: (a, b) => {
      return a.name.localeCompare(b.name)
    },
    renderHeaderCell: () => {
      return 'Nombre'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'description',
    renderHeaderCell: () => {
      return 'Descripción'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.description || ''}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'provider',
    compare: (a, b) => {
      return a.provider.name.localeCompare(b.provider.name)
    },
    renderHeaderCell: () => {
      return 'Proveedor'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.provider.name}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'sku',
    renderHeaderCell: () => {
      return 'SKU'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.sku}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'price',
    renderHeaderCell: () => {
      return 'Precio'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          ${item.price}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'stock',
    compare: (a, b) => {
      return a.stock.toString().localeCompare(b.stock.toString())
    },
    renderHeaderCell: () => {
      return 'Existencias'
    },
    renderCell: (item) => {
      return (
        <TableCellLayout truncate>
          {item.stock.toString()}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'status',
    compare: (a, b) => {
      const statusA = a.stock > 0 ? a.stock < a.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      const statusB = b.stock > 0 ? b.stock < b.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      return statusA.localeCompare(statusB)
    },
    renderHeaderCell: () => {
      return 'Estado'
    },
    renderCell: (item) => {
      const status = item.stock > 0 ? item.stock < item.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'

      return (
        <TableCellLayout truncate>
          {status}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <BarCodeViewer barCode={{
            id: item.sku as unknown as number,
            name: item.name,
            value: item.sku,
            tag: item.name
          }} />
          <Edit item={item} />
          <Delete item={item} />
        </div>
      )
    },
  }),
]
const mobileColumns: TableColumnDefinition<models.Product>[] = [
  createTableColumn<models.Product>({
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
  createTableColumn<models.Product>({
    columnId: 'status',
    compare: (a, b) => {
      const statusA = a.stock > 0 ? a.stock < a.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      const statusB = b.stock > 0 ? b.stock < b.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'
      return statusA.localeCompare(statusB)
    },
    renderHeaderCell: () => {
      return 'Estado'
    },
    renderCell: (item) => {
      const status = item.stock > 0 ? item.stock < item.minStock ? 'Por agotarse' : 'Disponible' : 'Agotado'

      return (
        <TableCellLayout>
          {status}
        </TableCellLayout>
      )
    },
  }),
  createTableColumn<models.Product>({
    columnId: 'actions',
    renderHeaderCell: () => {
      return 'Opciones'
    },
    renderCell: (item) => {
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <BarCodeViewer barCode={{
            id: item.sku as unknown as number,
            name: item.name,
            value: item.sku,
            tag: item.name
          }} />
          <Edit item={item} />
          <Delete item={item} />
        </div>
      )
    },
  }),
]
const match = window.matchMedia('(min-width: 1024px)')

const List = ({ loading, items }: ContentProps) => {
  const styles = useStyles()
  const [isDesktop, setIsDesltop] = useState<boolean>(match.matches)

  useEffect(() => {
    const handleOnChange = ({ matches }: any) => setIsDesltop(matches)
    match.addEventListener('change', handleOnChange)
    return () => match.removeEventListener('change', handleOnChange)
  }, [])

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
      columns={isDesktop ? desktopColumns : mobileColumns}
      sortable
      getRowId={(item: models.Product) => item.id}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<models.Product>>
        {({ item, rowId }) => (
          <DataGridRow<models.Product> key={rowId} style={{ backgroundColor: item.stock === 0 ? tokens.colorPaletteDarkRedBackground2 : item.stock < item.minStock ? tokens.colorPaletteDarkOrangeBackground2 : undefined }}>
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
  const { loading, items } = useProductsContext()

  return (
    <Card className={styles.root}>
      <List loading={loading} items={items} />
    </Card>
  )
}

interface ContentProps {
  loading: boolean
  items: models.Product[]
}
