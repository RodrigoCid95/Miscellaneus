import { type FC } from 'react'
import { makeStyles, tokens, TableColumnDefinition, createTableColumn, TableCellLayout, Spinner, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, Text, Button, Card } from '@fluentui/react-components'
import { bundleIcon, BoxArrowLeft20Filled, BoxArrowLeft20Regular } from '@fluentui/react-icons'
import { useHistory } from '../../context/history'
import { models } from '../../../../../wailsjs/go/models'

const RestoreIcon = bundleIcon(BoxArrowLeft20Filled, BoxArrowLeft20Regular)
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

const columns: TableColumnDefinition<HistoryListItem>[] = [
  createTableColumn<HistoryListItem>({
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
  createTableColumn<HistoryListItem>({
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
  createTableColumn<HistoryListItem>({
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
  createTableColumn<HistoryListItem>({
    columnId: 'user',
    compare: (a, b) => {
      return a.user.localeCompare(b.user)
    },
    renderHeaderCell: () => 'Vendedor',
    renderCell: (item) => (
      <TableCellLayout truncate>
        {item.user || ''}
      </TableCellLayout>
    ),
  }),
  createTableColumn<HistoryListItem>({
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
  createTableColumn<HistoryListItem>({
    columnId: 'options',
    renderHeaderCell: () => 'Devolver',
    renderCell: (item) => {
      const { removeItem } = useHistory()
      const styles = useStyles()

      return (
        <div className={styles.actions}>
          <Button icon={<RestoreIcon />} onClick={() => removeItem(item.id)} />
        </div>
      )
    },
  }),
]

const List: FC<HistoryListProps> = ({ loading, items }) => {
  const styles = useStyles()

  if (loading) {
    return <Spinner className={styles.spinner} />
  }

  if (items.length === 0) {
    return <Text>No hay nada aún.</Text>
  }

  return (
    <DataGrid
      className={styles.table}
      items={items}
      columns={columns}
      sortable
      getRowId={(item: HistoryListItem) => item.id}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<HistoryListItem>>
        {({ item, rowId }) => (
          <DataGridRow<HistoryListItem> key={rowId}>
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
  const { loading, items } = useHistory()

  return (
    <Card className={styles.root}>
      <List loading={loading} items={items} />
    </Card>
  )
}

interface HistoryListItem extends models.History {
  start: number
  end: number
}
interface HistoryListProps {
  loading: boolean
  items: models.History[]

}