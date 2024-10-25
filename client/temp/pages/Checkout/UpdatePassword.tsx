import { type FC, useEffect, useState } from "react"
import { makeStyles, Dialog, DialogTrigger, ToolbarButton, DialogSurface, DialogTitle, DialogBody, DialogContent, Spinner, DialogActions, Button } from "@fluentui/react-components"
import { bundleIcon, KeyMultiple20Filled, KeyMultiple20Regular } from "@fluentui/react-icons"
import PasswordForm, { emitters } from "../../Components/PasswordForm"

const KeysIcon = bundleIcon(KeyMultiple20Filled, KeyMultiple20Regular)
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

const UpdatePassword: FC<UpdatePasswordProps> = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const handleOnStart = () => setLoading(true)
    const handleOnEnd = () => setLoading(false)
    emitters.start.on(handleOnStart)
    emitters.end.on(handleOnEnd)
    return () => {
      emitters.start.off(handleOnStart)
      emitters.end.off(handleOnEnd)
    }
  }, [setLoading])

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          appearance='transparent'
          icon={<KeysIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Actualizar contraseña</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <PasswordForm />
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
                : <Button appearance="primary" onClick={() => emitters.save.emit()}>Crear</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default UpdatePassword

interface UpdatePasswordProps {
}