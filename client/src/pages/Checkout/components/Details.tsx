import { type FC, useRef } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button, SpinButton } from "@fluentui/react-components"
import { ProductGroup } from "../context/checkout"

const ProductDetails: FC<ProductDetailsProps> = ({ product, onClose, onQuit }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog modalType="alert" open={product !== null} onOpenChange={(_, data) => {
      if (!data.open && product && inputRef.current) {
        onClose(Number(inputRef.current.value))
      }
    }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Detalles</DialogTitle>
          <DialogContent>
            {product && (
              <>
                <p>Nombre: {product.name}</p>
                <p>Descripción: {product.description || 'Sin descripción'}</p>
                <p>Precio: ${product.price}</p>
                <p>Existencias: {product.stock}</p>
                <p>Cantidad: <SpinButton ref={inputRef} autoFocus defaultValue={product.count} min={1} max={product.stock} /></p>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Aceptar</Button>
            </DialogTrigger>
            <Button appearance="secondary" onClick={onQuit}>Quitar</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default ProductDetails

interface ProductDetailsProps {
  product: ProductGroup | null
  onClose: (count: ProductGroup['count']) => void
  onQuit: () => void
}