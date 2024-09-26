import { type FC } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button } from "@fluentui/react-components"

const NotFound: FC<NotFoundProps> = ({ openError, setOpenError, value }) => {
  return (
    <Dialog modalType="alert" open={openError} onOpenChange={(_, data) => setOpenError(data.open)}>
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

interface NotFoundProps {
  openError: boolean
  setOpenError: (openError: boolean) => void
  value: string
}