import { type FC } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button } from "@fluentui/react-components"

const NotFound: FC<NotFoundProps> = ({ onClose, value }) => {
  return (
    <Dialog modalType="alert" open onOpenChange={(_, data) => {
      if (!data.open) {
        onClose()
      }
    }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Producto no encontrado</DialogTitle>
          <DialogContent>
            El producto que buscaste con el termino "{value}" no existe, agrégalo o verifica que esté bien escrito.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Cerrar</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default NotFound

export interface NotFoundProps {
  onClose: () => void
  value: string
}