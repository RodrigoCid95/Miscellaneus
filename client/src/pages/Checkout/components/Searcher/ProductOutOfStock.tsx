import { type FC } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components"
import { models } from "../../../../../wailsjs/go/models"

const ProductOutOfStock: FC<ProductOutOfStockProps> = ({ product, onClose }) => {

  return (
    <Dialog
      open
      modalType="alert"
      onOpenChange={(_, data) => {
        if (!data.open) {
          onClose()
        }
      }}
    >
      <DialogSurface>
        <DialogTitle>¡No hay existencias!</DialogTitle>
        <DialogBody>
          <DialogContent>
            <p>
              El producto {product.name} no tiene existencias suficientes.
            </p>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="primary"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default ProductOutOfStock

export interface ProductOutOfStockProps {
  product: models.Product
  onClose(): void
}