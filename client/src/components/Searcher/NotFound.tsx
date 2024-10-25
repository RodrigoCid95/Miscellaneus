import { type FC } from "react"
import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, DialogTrigger, Button } from "@fluentui/react-components"
import { useSearcher } from "../../context/searcher"

const NotFound: FC<NotFoundProps> = () => {
  const { value, setOpenNotFound, setLoading } = useSearcher()

  return (
    <Dialog modalType="alert" open onOpenChange={(_, data) => {
      if (!data.open) {
        setOpenNotFound(false)
        setLoading(false)
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
}