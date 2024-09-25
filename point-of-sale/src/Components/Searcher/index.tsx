import { type FC, useCallback, useState } from "react"
import { Input, makeStyles, Spinner, tokens } from "@fluentui/react-components"
import NotFound from "./NotFound"
import Selector from "./Selector"

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalS
  },
  input: {
    width: '100%',
  },
})

const Searcher: FC<SearcherProps> = ({ onPush }) => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(false)
  const [openError, setOpenError] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [productsToSelection, setProductsToSelection] = useState<Miscellaneous.Product[] | null>(null)

  const handleOnKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setLoading(true)
      fetch(`${window.location.origin}/api/products/${value}`)
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
    }
  }, [value, setValue, setLoading])

  return (
    <div className={styles.root}>
      {!loading && <Input autoFocus className={styles.input} placeholder="Buscar..." value={value} onChange={e => setValue(e.target.value)} onKeyUp={handleOnKeyUp} />}
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