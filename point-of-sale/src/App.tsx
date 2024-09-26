import { useCallback, useEffect, useState, lazy, Suspense } from 'react'
import { Card, CardHeader, makeStyles, Title1, Toolbar, ToolbarDivider, Text, Button, Spinner } from '@fluentui/react-components'
import { bundleIcon, CheckmarkSquare20Filled, CheckmarkSquare20Regular } from '@fluentui/react-icons'
import LogoutButton from './Components/logout'

const Searcher = lazy(() => import('./Components/Searcher'))
const ProductList = lazy(() => import('./Components/List'))

const CheckIcon = bundleIcon(CheckmarkSquare20Filled, CheckmarkSquare20Regular)
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
  const [loading, setLoading] = useState<boolean>(false)

  const handleOnCheckout = useCallback(async () => {
    if (!loading && productGroups.length > 0) {
      setLoading(true)
      const newSales: Miscellaneous.NewSale[] = []
      for (const product of productGroups) {
        newSales.push({
          product: product.id,
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
      setLoading(false)
    }
  }, [productGroups, setProductGroups, loading, setLoading])

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
          {productGroups.length > 0 && (
            <>
              <ToolbarDivider />
              {
                !loading
                  ? <Button appearance="transparent" icon={<CheckIcon />} onClick={handleOnCheckout} />
                  : <Spinner />
              }
            </>
          )}
          <ToolbarDivider />
          <LogoutButton />
        </Toolbar>
        <Suspense fallback={<Spinner />}>
          <Searcher onPush={handleOnPush} />
        </Suspense>
      </div>
      <div className={styles.content}>
        <Suspense fallback={<Spinner />}>
          <ProductList products={productGroups} onUpdate={setProductGroups} />
        </Suspense>
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
