import { type FC, useEffect, useState } from 'react'
import { Card, CardHeader, makeStyles, Spinner, Text, tokens } from '@fluentui/react-components'
import { getDayHistory, getMonthHistory, getWeekHistory } from '../../../services/history'
import { getProducts } from '../../../services/products'

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
    const processSales = (sales: Miscellaneous.History[]) => {
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
      return { top, total }
    }

    const date = new Date()
    const day = date.getDate()
    const mounth = date.getMonth() + 1
    const year = date.getFullYear()
    const startDate = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const week = Math.ceil((days + startDate.getDay() + 1) / 7)

    getDayHistory(year, mounth, day)
      .then(sales => {
        const { top, total } = processSales(sales)
        setDayTop(top)
        setDaySales(total)
      })

    getWeekHistory(year, week)
      .then(sales => {
        const { top, total } = processSales(sales)
        setWeekTop(top)
        setWeekSales(total)
      })

    getMonthHistory(year, mounth)
      .then(sales => {
        const { top, total } = processSales(sales)
        setMonthTop(top)
        setMonthSales(total)
      })

    getProducts()
      .then(products => {
        const productList = products
          .filter(product => product.stock === 0 || product.stock < product.minStock)
          .sort((a, b) => b.stock - a.stock)
        setProducts(productList)
      })
  }, [])

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