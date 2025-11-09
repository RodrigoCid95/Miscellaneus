import { Card, createTableColumn, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Link, makeStyles, Spinner, TableCellLayout, TableColumnDefinition, Text, tokens } from "@fluentui/react-components"
import { useProvidersContext } from "../../../context/providers"
import EditProvider from "./Edit"
import DeleteProvider from "./Delete"
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

const columns: TableColumnDefinition<structs.Provider>[] = [
  createTableColumn<structs.Provider>({
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
  createTableColumn<structs.Provider>({
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
  createTableColumn<structs.Provider>({
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
      getRowId={(item: structs.Provider) => item.id}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<structs.Provider>>
        {({ item, rowId }) => (
          <DataGridRow<structs.Provider> key={rowId}>
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
  const { loading, items } = useProvidersContext()

  return (
    <Card className={styles.root}>
      <Content loading={loading} items={items} />
    </Card>
  )
}

interface ContentProps {
  loading: boolean
  items: structs.Provider[]
}
