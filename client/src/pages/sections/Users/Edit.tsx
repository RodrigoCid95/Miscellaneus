import { ChangeEvent, useCallback, useState, type FC } from 'react'
import { type Emitter } from './../../../utils/Emitters'
import { makeStyles, Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogContent, Field, Input, Switch, DialogActions, Button, Spinner } from '@fluentui/react-components'
import { bundleIcon, Edit20Filled, Edit20Regular } from '@fluentui/react-icons'

const EditIcon = bundleIcon(Edit20Filled, Edit20Regular)

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

const EditUser: FC<EditUserProps> = ({ loadUserListEmitter, user }) => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [full_name, setFullName] = useState<Miscellaneous.NewUser['name']>(user.name)
  const [name, setName] = useState<Miscellaneous.NewUser['userName']>(user.userName)
  const [isAdmin, setIsAdmin] = useState<Miscellaneous.NewUser['isAdmin']>(user.isAdmin)
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [fullNameVerification, setFullNameVerification] = useState<Verification>({})

  const handleOnIsAdminChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => setIsAdmin(ev.currentTarget.checked), [setIsAdmin])

  const updateUser = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!full_name) {
      setFullNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newUser: Partial<Miscellaneous.User> = {
      userName: name,
      name: full_name,
      isAdmin,
    }
    fetch(`${window.location.origin}/api/users`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({id: user.id, ...newUser})
    })
      .then(res => res.json())
      .then(response => {
        if (response.ok) {
          setOpen(false)
          loadUserListEmitter.emit()
        } else {
          setNameVerification({ message: `El usuario "${name}" ya existe.`, state: 'warning' })
          setLoading(false)
        }
      })
  }, [setLoading, name, full_name, isAdmin])

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
          icon={<EditIcon />}
        />
      </DialogTrigger>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field
              label="Nombre de usuario"
              validationState={nameVerification.state}
              validationMessage={nameVerification.message}
            >
              <Input value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameVerification({})} />
            </Field>

            <Field
              label="Nombre completo"
              validationState={fullNameVerification.state}
              validationMessage={fullNameVerification.message}
            >
              <Input value={full_name} onChange={e => setFullName(e.target.value)} onBlur={(() => setFullNameVerification({}))} />
            </Field>

            <Switch
              checked={isAdmin}
              onChange={handleOnIsAdminChange}
              label={isAdmin ? "Es administrador" : "Es vendedor"}
            />
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
                : <Button appearance="primary" onClick={updateUser}>Guardar</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default EditUser

interface EditUserProps {
  loadUserListEmitter: Emitter
  user: Miscellaneous.User
}