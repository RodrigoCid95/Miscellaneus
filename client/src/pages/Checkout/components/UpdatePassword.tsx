import { type FC, useState } from "react"
import { makeStyles, Dialog, DialogTrigger, ToolbarButton, DialogSurface, DialogTitle, DialogBody, DialogContent, Spinner, DialogActions, Button } from "@fluentui/react-components"
import { bundleIcon, KeyMultiple20Filled, KeyMultiple20Regular } from "@fluentui/react-icons"
import { PasswordFormProvider, PasswordForm } from "./PasswordForm"
import { usePasswordForm } from "../context/passwordForm"

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

const Content = () => {
  const styles = useStyles()
  const { loading, save } = usePasswordForm()

  return (
    <>
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
            : <Button appearance="primary" onClick={save}>Actualziar</Button>
        }
      </DialogActions>
    </>
  )
}

const UpdatePassword: FC<UpdatePasswordProps> = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)

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
          <PasswordFormProvider>
            <Content />
          </PasswordFormProvider>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default UpdatePassword

interface UpdatePasswordProps {
}