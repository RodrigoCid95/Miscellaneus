import { type FC, useCallback, useState } from "react"
import { makeStyles, CheckboxOnChangeData, Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, Checkbox, DialogActions, Spinner } from "@fluentui/react-components"
import { bundleIcon, Delete20Filled, Delete20Regular } from "@fluentui/react-icons"
import { useProvidersContext } from "../../../context/providers"
import { deleteProvider } from "../../../services/providers"

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

const DeleteProvider: FC<DeleteProviderProps> = ({ item }) => {
  const styles = useStyles()
  const { loadProviders } = useProvidersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)

  const handleChange = useCallback((
    _: any,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked))
  }, [setChecked])

  const handleOnDelete = useCallback(() => {
    setLoading(true)
    deleteProvider(item.id)
      .then(() => {
        setOpen(false)
        loadProviders()
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
        <DialogTitle>Eliminar proveedor</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <p>¿Estás seguro(a) que quieres eliminar el proveedor "{item.name}"?</p>
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
                : <Button disabled={!checked} appearance="primary" onClick={handleOnDelete}>Eliminar</Button>
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

export default DeleteProvider

interface DeleteProviderProps {
  item: Miscellaneous.Provider
}