import { type FC, useState } from "react"
import { Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, makeStyles, DialogActions, Spinner, Field, Input, Text } from "@fluentui/react-components"
import { bundleIcon, Edit20Filled, Edit20Regular } from "@fluentui/react-icons"
import FieldProvider from "./Provider"
import { useProductsContext } from "../../../context/products"
import { structs } from "../../../../../../wailsjs/go/models"
import { UpdateProduct } from "../../../../../../wailsjs/go/controllers/Products"

const EditIcon = bundleIcon(Edit20Filled, Edit20Regular)

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

const EditProduct: FC<EditProductProps> = ({ item }) => {
  const styles = useStyles()
  const { loadProducts } = useProductsContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<structs.Product['name']>(item.name)
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [description, setDescription] = useState<structs.Product['description']>(item.description)
  const [sku, setSku] = useState<structs.Product['sku']>(item.sku)
  const [skuVerification, setSkuVerification] = useState<Verification>({})
  const [price, setPrice] = useState<structs.Product['price']>(item.price)
  const [priceVerification, setPriceVerification] = useState<Verification>({})
  const [stock, setStock] = useState<structs.Product['price']>(item.stock)
  const [stockVerification, setStockVerification] = useState<Verification>({})
  const [minStock, setMinStock] = useState<structs.Product['minStock']>(item.minStock)
  const [minStockVerification, setMinStockVerification] = useState<Verification>({})
  const [provider, setProvider] = useState<structs.Product['provider'] | null>(item.provider)
  const [providerVerification, setProviderVerification] = useState<Verification>({})

  const handleOnUpdate = () => {
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
    const data = new structs.DataProduct()
    data.id = item.id
    data.name = name
    data.description = description
    data.sku = sku
    data.price = price
    data.stock = stock
    data.minStock = minStock
    data.idProvider = provider.id
    UpdateProduct(data)
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
        }}
      >
        <DialogTrigger disableButtonEnhancement>
          <Button
            aria-label="Edit"
            icon={<EditIcon />}
          />
        </DialogTrigger>
        <DialogSurface className={styles.dialog}>
          <DialogTitle>
            Editar producto
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
                  : <Button appearance="primary" onClick={handleOnUpdate}>Guardar</Button>
              }
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

export default EditProduct

interface EditProductProps {
  item: structs.Product
}