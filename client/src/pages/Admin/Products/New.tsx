import { type FC, useState } from "react"
import { Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, makeStyles, ToolbarButton, DialogActions, Spinner, Field, Input, Text } from "@fluentui/react-components"
import { bundleIcon, AddCircle20Filled, AddCircle20Regular } from "@fluentui/react-icons"
import FieldProvider from "./Provider"
import { useProductsContext } from "../../../context/products"

const AddIcon = bundleIcon(AddCircle20Filled, AddCircle20Regular)

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
  dialog: {
    width: 'fit-content',
  },
})

const NewProduct: FC<NewProductProps> = () => {
  const styles = useStyles()
  const { loadProducts } = useProductsContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<Miscellaneous.NewProduct['name']>("")
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [description, setDescription] = useState<Miscellaneous.NewProduct['description']>("")
  const [sku, setSku] = useState<Miscellaneous.NewProduct['sku']>("")
  const [skuVerification, setSkuVerification] = useState<Verification>({})
  const [price, setPrice] = useState<Miscellaneous.NewProduct['price']>(0)
  const [priceVerification, setPriceVerification] = useState<Verification>({})
  const [stock, setStock] = useState<Miscellaneous.NewProduct['price']>(0)
  const [stockVerification, setStockVerification] = useState<Verification>({})
  const [minStock, setMinStock] = useState<Miscellaneous.NewProduct['minStock']>(1)
  const [minStockVerification, setMinStockVerification] = useState<Verification>({})
  const [provider, setProvider] = useState<Miscellaneous.Provider | null>(null)
  const [providerVerification, setProviderVerification] = useState<Verification>({})

  const handleOnCreate = () => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!sku) {
      setSkuVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!price) {
      setPriceVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!stock) {
      setStockVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!minStock) {
      setMinStockVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!provider) {
      setProviderVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newProduct: Miscellaneous.NewProduct = {
      name,
      description,
      sku,
      price,
      stock,
      minStock,
      provider: provider.id
    }
    window.createProduct(newProduct)
      .then(() => {
        setOpen(false)
        loadProducts()
      })
  }

  return (
    <>
      <Dialog
        modalType="alert"
        open={open}
        onOpenChange={(_, data) => {
          setOpen(data.open)
          setLoading(false)
          setName('')
          setDescription('')
          setSku('')
          setPrice(0)
          setStock(0)
          setMinStock(0)
          setProvider(null)
        }}
      >
        <DialogTrigger disableButtonEnhancement>
          <ToolbarButton
            appearance='transparent'
            icon={<AddIcon />}
          />
        </DialogTrigger>
        <DialogSurface className={styles.dialog}>
          <DialogTitle>
            Nuevo producto
          </DialogTitle>
          <DialogBody>
            <DialogContent className={styles.content}>
              <Field
                label="Nombre"
                validationState={nameVerification.state}
                validationMessage={nameVerification.message}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameVerification({})}
                />
              </Field>

              <Field
                label="Descripción"
              >
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              <Field
                label="SKU"
                validationState={skuVerification.state}
                validationMessage={skuVerification.message}
              >
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onBlur={() => setSkuVerification({})}
                />
              </Field>

              <Field
                label="Precio"
                validationState={priceVerification.state}
                validationMessage={priceVerification.message}
              >
                <Input
                  contentBefore={
                    <Text size={400}>$</Text>
                  }
                  type="number"
                  value={price.toString()}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  onBlur={() => setPriceVerification({})}
                />
              </Field>

              <Field
                label="Stock"
                validationState={stockVerification.state}
                validationMessage={stockVerification.message}
              >
                <Input
                  type="number"
                  value={stock.toString()}
                  onChange={(e) => setStock(Number(e.target.value))}
                  onBlur={() => setStockVerification({})}
                />
              </Field>

              <Field
                label="Stock mínimo"
                validationState={minStockVerification.state}
                validationMessage={minStockVerification.message}
              >
                <Input
                  type="number"
                  value={minStock.toString()}
                  onChange={(e) => setMinStock(Number(e.target.value))}
                  onBlur={() => setMinStockVerification({})}
                />
              </Field>

              <FieldProvider
                value={provider}
                verification={providerVerification}
                onBlur={() => setProviderVerification({})}
                onChange={setProvider}
              />
            </DialogContent>
            <DialogActions>
              {!loading && (
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
              )}
              {
                loading
                  ? <Spinner />
                  : <Button appearance="primary" onClick={handleOnCreate}>Crear</Button>
              }
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

export default NewProduct

interface NewProductProps {
}