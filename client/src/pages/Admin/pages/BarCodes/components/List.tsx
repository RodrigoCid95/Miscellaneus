import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, Text, tokens } from "@fluentui/react-components"
import { useBarCodesContext } from "../../../context/barcodes"
import BarCodeViewer from "./Viewer"
import EditBarcode from "./Edit"
import DeleteBarCode from "./Delete"
import { structs } from "../../../../../../wailsjs/go/models"

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

const columns: TableColumnDefinition<structs.BarCode>[] = [
  createTableColumn<structs.BarCode>({
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
  createTableColumn<structs.BarCode>({
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
  createTableColumn<structs.BarCode>({
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
  createTableColumn<structs.BarCode>({
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
      getRowId={(item: structs.BarCode) => item.id}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<structs.BarCode>>
        {({ item, rowId }) => (
          <DataGridRow<structs.BarCode> key={rowId}>
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
  const { loading, items } = useBarCodesContext()

  return (
    <Card className={styles.root}>
      <Content loading={loading} items={items} />
    </Card >
  )
}

interface ContentProps {
  loading: boolean
  items: structs.BarCode[]
}
