import { type FC, useCallback, useState } from "react"
import { makeStyles, CheckboxOnChangeData, Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, Checkbox, DialogActions, Spinner } from "@fluentui/react-components"
import { bundleIcon, Delete20Filled, Delete20Regular } from "@fluentui/react-icons"
import { loadProductListEmitter } from "./List"

const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular)
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

const DeleteProduct: FC<DeleteProductProps> = ({ item }) => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)

  const handleChange = useCallback((
    _: any,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked))
  }, [setChecked])

  const deleteBarCode = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/products/${item.id}`, {
      method: 'delete'
    })
      .then(() => {
        setOpen(false)
        loadProductListEmitter.emit()
      })
  }, [setLoading])

  return (
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
          icon={<DeleteIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <p>¿Estás seguro(a) que quieres eliminar el producto "{item.name}"?</p>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              label="Si, estoy seguro"
            />
          </DialogContent>
          <DialogActions>
            {
              loading
                ? <Spinner />
                : <Button disabled={!checked} appearance="primary" onClick={deleteBarCode}>Eliminar</Button>
            }
            {!loading && (
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default DeleteProduct

interface DeleteProductProps {
  item: Miscellaneous.Product
}