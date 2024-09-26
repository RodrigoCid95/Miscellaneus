import { type FC, type KeyboardEvent, useCallback, useState, lazy, Suspense, useRef, useEffect } from "react"
import { Button, Input, makeStyles, Spinner, tokens } from "@fluentui/react-components"
import { bundleIcon, BarcodeScanner20Filled, BarcodeScanner20Regular } from "@fluentui/react-icons"
import { BrowserCodeReader } from '@zxing/browser'
import NotFound from "./NotFound"
import Selector from "./Selector"

const BarCodeIcon = bundleIcon(BarcodeScanner20Filled, BarcodeScanner20Regular)
const Scanner = lazy(() => import("./Scanner"))

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

const Searcher: FC<SearcherProps> = ({ onPush }) => {
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [openScanner, setOpenScanner] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [openError, setOpenError] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [productsToSelection, setProductsToSelection] = useState<Miscellaneous.Product[] | null>(null)

  useEffect(() => {
    BrowserCodeReader
      .listVideoInputDevices()
      .then((devices) => {
        setDevices(devices)
      })
  }, [setDevices])

  const loadProducts = useCallback((query: string) => {
    setLoading(true)
    fetch(`${window.location.origin}/api/products/${query}`)
      .then(res => res.json())
      .then((results: Miscellaneous.Product[]) => {
        if (results.length > 0) {
          if (results.length === 1) {
            onPush(results)
            setLoading(false)
          } else {
            setProductsToSelection(results)
          }
          setValue('')
        } else {
          setOpenError(true)
        }
      })
  }, [onPush, setLoading, setProductsToSelection, setValue, setOpenError])

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
              <Scanner onInput={(code) => {
                setValue(code)
                loadProducts(code)
              }} />
            </Suspense>
          )}
        </>
      )}
      {loading && <Spinner />}
      <NotFound
        openError={openError}
        value={value}
        setOpenError={() => {
          setOpenError(false)
          setLoading(false)
        }}
      />
      <Selector
        products={productsToSelection}
        onClose={() => {
          setProductsToSelection(null)
          setLoading(false)
        }}
        onSelect={product => {
          setProductsToSelection(null)
          onPush([product])
          setLoading(false)
        }}
      />
    </div>
  )
}

export default Searcher

interface SearcherProps {
  onPush: (product: Miscellaneous.Product[]) => void
}