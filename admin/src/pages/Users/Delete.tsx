import { useCallback, useState, type FC } from "react"
import { type Emitter } from "../../utils/Emitters"
import { makeStyles, CheckboxOnChangeData, Dialog, DialogTrigger, Button, DialogSurface, DialogTitle, DialogBody, DialogContent, Checkbox, DialogActions, Spinner } from "@fluentui/react-components"
import { bundleIcon, Delete20Filled, Delete20Regular } from "@fluentui/react-icons"

const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular)
const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
})

const DeleteUser: FC<DeleteUserProps> = ({ loadUserListEmitter, user }) => {
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

  const deleteUser = useCallback(() => {
    setLoading(true)
    fetch(`${window.location.origin}/api/users/${user.id}`, {
      method: 'delete'
    })
      .then(res => res.json())
      .then(() => {
        setOpen(false)
        loadUserListEmitter.emit()
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
      <DialogSurface>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <p>¿Estás seguro(a) que quieres eliminar el usuario "{user.name}({user.userName})"?</p>
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
                : <Button disabled={!checked} appearance="primary" onClick={deleteUser}>Eliminar</Button>
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

export default DeleteUser

interface DeleteUserProps {
  loadUserListEmitter: Emitter
  user: Miscellaneous.User
}