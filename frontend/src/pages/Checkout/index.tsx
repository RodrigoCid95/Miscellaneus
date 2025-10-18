import { lazy, useState, Suspense, useEffect } from "react"
import { Button, Card, makeStyles, Spinner, Title2, Toolbar, ToolbarDivider } from "@fluentui/react-components"
import { bundleIcon, CheckmarkSquare20Filled, CheckmarkSquare20Regular } from "@fluentui/react-icons"
import Title from "./components/Title"
import Logout from './../../components/Logout'
import { useCheckout, CheckoutContext } from './context/checkout'
import { models } from "../../../wailsjs/go/models"
import { SaveCheckout } from '../../../wailsjs/go/controllers/Checkout'

const History = lazy(() => import('./History'))
const UpdatePassword = lazy(() => import('./components/UpdatePassword'))
const Searcher = lazy(() => import('./components/Searcher'))
const ProductList = lazy(() => import('./components/List'))

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
    overflow: 'auto',
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

const Checkout = () => {
  const styles = useStyle()
  const { productGroups, checkout, loading } = useCheckout()

  let total = 0
  for (const group of productGroups) {
    total += group.price * group.count
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Toolbar>
          <Title />
          {productGroups.length > 0 && (
            <>
              <ToolbarDivider />
              {
                loading
                  ? <Spinner />
                  : <Button appearance="transparent" icon={<CheckIcon />} onClick={checkout} />
              }
            </>
          )}
          <ToolbarDivider />
          <Suspense fallback={<Spinner />}>
            <History />
          </Suspense>
          <Suspense fallback={<Spinner />}>
            <UpdatePassword />
          </Suspense>
          <Logout />
        </Toolbar>
        <Suspense fallback={<Spinner />}>
          <Searcher />
        </Suspense>
      </div>
      <div className={styles.content}>
        <Suspense fallback={<Spinner />}>
          <ProductList />
        </Suspense>
      </div>
      <div className={styles.footer}>
        <Card className={styles.total}>
          <Title2>Total: ${total.toFixed(2)}</Title2>
        </Card>
      </div>
    </div>
  )
}

export default () => {
  const [productGroups, setProductGroups] = useState<models.ProductGroup[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const checkout = () => {
    if (!loading && productGroups.length > 0) {
      setLoading(true)
      SaveCheckout(productGroups)
        .then(() => {
          setProductGroups([])
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    const handleOnKeydown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault()
        checkout()
      }
    }
    window.addEventListener('keydown', handleOnKeydown)
    return () => window.removeEventListener('keydown', handleOnKeydown)
  })

  const push = (products: models.Product[]) => {
    const pGroups = [...productGroups]
    for (const product of products) {
      const index = pGroups.findIndex((p) => p.id === product.id)
      if (index === -1) {
        pGroups.push({
          ...product,
          count: 1,
          convertValues: function (a: any, classs: any, asMap?: boolean) {
            throw new Error("Function not implemented.")
          }
        })
      } else {
        if (pGroups[index].count < pGroups[index].stock) {
          pGroups[index].count++
        }
      }
    }
    setProductGroups(pGroups)
  }

  return (
    <CheckoutContext.Provider value={{ productGroups, setProductGroups, push, checkout, loading }}>
      <Checkout />
    </CheckoutContext.Provider>
  )
}