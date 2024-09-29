import { type FC, useEffect, useState } from 'react'
import { Card, CardHeader, makeStyles, Spinner, Text, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXXL,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    '@media (min-width: 425px)': {
      width: 'fit-content',
    },
  },
  list: {
    padding: tokens.spacingHorizontalL,
    paddingTop: 0
  }
})

const Board: FC<BoardProps> = () => {
  const styles = useStyles()
  const [daySales, setDaySales] = useState<number>(NaN)
  const [dayTop, setDayTop] = useState<TopList>([])
  const [weekSales, setWeekSales] = useState<number>(NaN)
  const [weekTop, setWeekTop] = useState<TopList>([])
  const [monthSales, setMonthSales] = useState<number>(NaN)
  const [monthTop, setMonthTop] = useState<TopList>([])
  const [products, setProducts] = useState<Miscellaneous.Product[] | null>(null)

  useEffect(() => {
    let date = new Date()
    const startUTCDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    date.setDate(date.getDate() + 1)
    const endUTCDay = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    date = new Date()
    date.setDate(date.getDate() - date.getDay())
    const startUTCWeek = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    date.setDate(date.getDate() + 7)
    const endUTCWeek = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    date = new Date()
    const startURTMonth = Date.UTC(date.getUTCFullYear(), date.getUTCMonth())
    date.setMonth(date.getMonth() + 1)
    const endUTCMonth = Date.UTC(date.getUTCFullYear(), date.getUTCMonth())
    fetch(`${window.location.origin}/api/history/${startUTCDay}/${endUTCDay}`)
      .then(res => res.json())
      .then((sales: Miscellaneous.History[]) => {
        const topList: TopList = []
        let total = 0
        for (const sale of sales) {
          total += sale.total
          const index = topList.findIndex(item => item.name === sale.product)
          if (index > -1) {
            topList[index].count += sale.count
          } else {
            topList.push({ name: sale.product, count: sale.count })
          }
        }
        const top = topList.sort((a, b) => b.count - a.count).slice(0, 10)
        setDayTop(top)
        setDaySales(total)
      })
    fetch(`${window.location.origin}/api/history/${startUTCWeek}/${endUTCWeek}`)
      .then(res => res.json())
      .then((sales: Miscellaneous.History[]) => {
        const topList: TopList = []
        let total = 0
        for (const sale of sales) {
          total += sale.total
          const index = topList.findIndex(item => item.name === sale.product)
          if (index > -1) {
            topList[index].count += sale.count
          } else {
            topList.push({ name: sale.product, count: sale.count })
          }
        }
        const top = topList.sort((a, b) => b.count - a.count).slice(0, 10)
        setWeekTop(top)
        setWeekSales(total)
      })
    fetch(`${window.location.origin}/api/history/${startURTMonth}/${endUTCMonth}`)
      .then(res => res.json())
      .then((sales: Miscellaneous.History[]) => {
        const topList: TopList = []
        let total = 0
        for (const sale of sales) {
          total += sale.total
          const index = topList.findIndex(item => item.name === sale.product)
          if (index > -1) {
            topList[index].count += sale.count
          } else {
            topList.push({ name: sale.product, count: sale.count })
          }
        }
        const top = topList.sort((a, b) => b.count - a.count).slice(0, 10)
        setMonthTop(top)
        setMonthSales(total)
      })
    fetch(`${window.location.origin}/api/products`)
      .then(res => res.json())
      .then((products: Miscellaneous.Product[]) => {
        const productList = products
          .filter(product => product.stock === 0 || product.stock < product.minStock)
          .sort((a, b) => b.stock - a.stock)
        setProducts(productList)
      })
  }, [setDaySales, setDayTop, setWeekSales, setWeekTop, setMonthSales, setMonthTop])

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <CardHeader
          header={<Text weight='semibold'>Productos agotados o por agotarse</Text>}
        />
        {
          products === null
            ? <Spinner />
            : products.length === 0
              ? <Text>No hay productos agotados o por agotarse</Text>
              : (
                <ol className={styles.list}>
                  {products.map((product, index) => <li key={index}>{product.name} - {product.stock}</li>)}
                </ol>
              )
        }
      </Card>
      <Card className={styles.card}>
        <CardHeader
          header={<Text weight='semibold'>Ventas del mes</Text>}
        />
        {isNaN(monthSales) ? <Spinner /> : <Text>${monthSales.toString()}</Text>}
        {monthTop.length > 0 && (
          <>
            <Text weight='semibold'>Productos más vendidos</Text>
            <ol className={styles.list}>
              {monthTop.map((item, index) => <li key={index}>{item.name} ({item.count})</li>)}
            </ol>
          </>
        )}
      </Card>
      <Card className={styles.card}>
        <CardHeader
          header={<Text weight='semibold'>Ventas de la semana</Text>}
        />
        {isNaN(weekSales) ? <Spinner /> : <Text>${weekSales.toString()}</Text>}
        {weekTop.length > 0 && (
          <>
            <Text weight='semibold'>Productos más vendidos</Text>
            <ol className={styles.list}>
              {weekTop.map((item, index) => <li key={index}>{item.name} ({item.count})</li>)}
            </ol>
          </>
        )}
      </Card>
      <Card className={styles.card}>
        <CardHeader
          header={<Text weight='semibold'>Ventas del día</Text>}
        />
        {isNaN(daySales) ? <Spinner /> : <Text>${daySales.toString()}</Text>}
        {dayTop.length > 0 && (
          <>
            <Text weight='semibold'>Productos más vendidos</Text>
            <ol className={styles.list}>
              {dayTop.map((item, index) => <li key={index}>{item.name} ({item.count})</li>)}
            </ol>
          </>
        )}
      </Card>
    </div>
  )
}

export default Board

interface TopListItem {
  name: Miscellaneous.Product['name']
  count: number
}
type TopList = TopListItem[]
interface BoardProps {
}