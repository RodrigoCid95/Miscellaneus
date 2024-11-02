import { type FC, type KeyboardEvent, useState, lazy, Suspense, useRef, useEffect } from "react"
import { type NotFoundProps } from "./NotFound"
import { type SelectorProps } from "./Selector"
import { type ProductOutOfStockProps } from "./ProductOutOfStock"
import { Button, Input, makeStyles, Spinner, tokens } from "@fluentui/react-components"
import { bundleIcon, BarcodeScanner20Filled, BarcodeScanner20Regular } from "@fluentui/react-icons"
import { BrowserCodeReader } from '@zxing/browser'
import { useCheckout } from "../../context/checkout"
import { SearcherContext, useSearcher } from './../../context/searcher'

const BarCodeIcon = bundleIcon(BarcodeScanner20Filled, BarcodeScanner20Regular)
const Scanner = lazy(() => import("./Scanner"))
const NotFoundLazy = lazy(() => import("./NotFound"))
const SelectorLazy = lazy(() => import("./Selector"))
const ProductOutOfStockLazy = lazy(() => import("./ProductOutOfStock"))

const NotFound: FC<NotFoundProps> = (props) => (
  <Suspense fallback={<Spinner />}>
    <NotFoundLazy {...props} />
  </Suspense>
)

const Selector: FC<SelectorProps> = (props) => (
  <Suspense fallback={<Spinner />}>
    <SelectorLazy {...props} />
  </Suspense>
)

const ProductOutOfStock: FC<ProductOutOfStockProps> = (props) => (
  <Suspense fallback={<Spinner />}>
    <ProductOutOfStockLazy {...props} />
  </Suspense>
)

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalS,
    display: 'flex',
    gap: tokens.spacingVerticalS,
  },
  input: {
    width: '100%',
  },
})

const Searcher: FC<SearcherProps> = () => {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [openScanner, setOpenScanner] = useState<boolean>(false)
  const {
    value,
    setValue,
    loading,
    productsToSelection,
    productOutOfStock,
    setProductOutOfStock,
    openNotFound,
    loadProducts
  } = useSearcher()

  useEffect(() => {
    BrowserCodeReader
      .listVideoInputDevices()
      .then((devices) => {
        setDevices(devices)
      })
  })

  return (
    <div className={styles.root}>
      {!loading && (
        <>
          <Input
            ref={inputRef}
            autoFocus={!openScanner}
            className={styles.input}
            placeholder="Buscar..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                loadProducts(value)
              }
            }}
            contentAfter={
              devices.length > 0
                ? (
                  <Button
                    appearance="transparent"
                    icon={<BarCodeIcon />}
                    size="small"
                    onClick={() => setOpenScanner(!openScanner)}
                  />
                )
                : undefined
            }
          />
          {openScanner && (
            <Suspense fallback={<Spinner />}>
              <Scanner />
            </Suspense>
          )}
        </>
      )}
      {loading && <Spinner />}
      {openNotFound && (
        <NotFound />
      )}
      {productsToSelection !== null && (
        <Selector />
      )}
      {productOutOfStock !== null && (
        <ProductOutOfStock
          product={productOutOfStock}
          onClose={() => {
            setProductOutOfStock(null)
            inputRef.current?.focus()
          }}
        />
      )}
    </div>
  )
}

export default () => {
  const { push } = useCheckout()
  const [openNotFound, setOpenNotFound] = useState<boolean>(false)
  const [productsToSelection, setProductsToSelection] = useState<Miscellaneous.Product[] | null>(null)
  const [productOutOfStock, setProductOutOfStock] = useState<Miscellaneous.Product | null>(null)
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const loadProducts = (query: string) => {
    if (query === '') {
      return
    }
    setLoading(true)
    window.findProducts(query)
      .then((results: Miscellaneous.Product[]) => {
        if (results.length > 0) {
          if (results.length === 1) {
            if (results[0].stock === 0) {
              setProductOutOfStock(results[0])
            } else {
              push(results)
            }
            setLoading(false)
          } else {
            setProductsToSelection(results)
          }
          setValue('')
        } else {
          setOpenNotFound(true)
        }
      })
  }

  return (
    <SearcherContext.Provider value={{
      loading,
      loadProducts,
      productsToSelection,
      setProductsToSelection,
      productOutOfStock,
      setProductOutOfStock,
      value,
      setValue,
      openNotFound,
      setOpenNotFound,
      setLoading
    }}>
      <Searcher />
    </SearcherContext.Provider>
  )
}

interface SearcherProps {
}