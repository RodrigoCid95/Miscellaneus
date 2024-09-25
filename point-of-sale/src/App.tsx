import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader, makeStyles, Title1, Toolbar, ToolbarDivider, Text } from '@fluentui/react-components'
import LogoutButton from './Components/logout'
import Searcher from './Components/Searcher'
import ProductList from './Components/List'

const useStyle = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    width: '100dvw',
    padding: '0',
    margin: '0',
  },
  header: {
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  footer: {
    flexShrink: 0,
  },
  total: {
    margin: '20px',
    width: 'fit-content',
    float: 'right'
  },
})

function App() {
  const styles = useStyle()
  const [productGroups, setProductGroups] = useState<Miscellaneous.ProductGroup[]>([])

  const handleOnCheckout = useCallback(async () => {
    const user: Miscellaneous.User = await fetch(`${window.location.origin}/api/profile`).then(res => res.json())
    const date = new Date()
    const newSales: Miscellaneous.NewSale[] = []
    for (const product of productGroups) {
      newSales.push({
        product: {
          id: product.id,
          name: product.name
        },
        user: user.id,
        date: date.toLocaleDateString(),
        count: product.count,
        total: product.price * product.count
      })
    }
    await fetch(`${window.location.origin}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSales)
    })
    setProductGroups([])
  }, [productGroups, setProductGroups])

  useEffect(() => {
    const checkout = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault()
        handleOnCheckout()
      }
    }
    window.addEventListener('keydown', checkout)
    return () => {
      window.removeEventListener('keydown', checkout)
    }
  }, [handleOnCheckout])

  const handleOnPush = useCallback((products: Miscellaneous.Product[]) => {
    const pGroups = [...productGroups]
    for (const product of products) {
      const index = pGroups.findIndex((p) => p.id === product.id)
      if (index === -1) {
        pGroups.push({
          ...product,
          count: 1
        })
      } else {
        if (pGroups[index].count < pGroups[index].stock) {
          pGroups[index].count++
        }
      }
    }
    setProductGroups(pGroups)
  }, [productGroups, setProductGroups])

  const calcTotal = useCallback(() => {
    let total = 0
    for (const group of productGroups) {
      total += group.price * group.count
    }
    return total.toFixed(2)
  }, [productGroups])

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Toolbar>
          <Title1>Miscellaneous</Title1>
          <ToolbarDivider />
          <LogoutButton />
        </Toolbar>
        <Searcher onPush={handleOnPush} />
      </div>
      <div className={styles.content}>
        <ProductList products={productGroups} onUpdate={setProductGroups} />
      </div>
      <div className={styles.footer}>
        <Card className={styles.total}>
          <CardHeader
            header={<Text weight="semibold">Total:</Text>}
          />
          <p>${calcTotal()}</p>
        </Card>
      </div>
    </div>
  )
}

export default App
