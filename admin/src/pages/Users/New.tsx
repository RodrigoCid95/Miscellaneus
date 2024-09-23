import { type FC, type ChangeEvent, useCallback, useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle, DialogTrigger,
  Field,
  Input,
  makeStyles,
  Spinner,
  Switch,
  ToolbarButton
} from "@fluentui/react-components"
import {
  bundleIcon,
  PersonAdd20Filled,
  PersonAdd20Regular
} from "@fluentui/react-icons"
import { loadUserListEmitter } from './List'

const AddPersonIcon = bundleIcon(PersonAdd20Filled, PersonAdd20Regular)

const useStyles = makeStyles({
  content: {
    display: "flex",
    flexDirection: "column",
    rowGap: "10px",
  },
})

const NewUser: FC<NewUserProps> = () => {
  const styles = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [full_name, setFullName] = useState<Miscellaneous.NewUser['name']>('')
  const [name, setName] = useState<Miscellaneous.NewUser['userName']>('')
  const [isAdmin, setIsAdmin] = useState<Miscellaneous.NewUser['isAdmin']>(false)
  const [password, setPassword] = useState<string>('')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [fullNameVerification, setFullNameVerification] = useState<Verification>({})
  const [passwordVerification, setPasswordVerification] = useState<Verification>({})

  const handleOnIsAdminChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => setIsAdmin(ev.currentTarget.checked), [setIsAdmin])

  const createUser = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!full_name) {
      setFullNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!password) {
      setPasswordVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const newUser: Miscellaneous.NewUser = {
      userName: name,
      name: full_name,
      isAdmin,
      password: password,
    }
    fetch(`${window.location.origin}/api/users`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newUser)
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
  }, [setLoading, name, full_name, isAdmin, password])

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open)
        setFullName('')
        setName('')
        setPassword('')
        setIsAdmin(false)
        setLoading(false)
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <ToolbarButton
          appearance='transparent'
          icon={<AddPersonIcon />}
        />
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Nuevo usuario</DialogTitle>
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

            <Field
              label="Contraseña"
              validationState={passwordVerification.state}
              validationMessage={passwordVerification.message}
            >
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setPasswordVerification({})} />
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
                : <Button appearance="primary" onClick={createUser}>Guardar</Button>
            }
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default NewUser

interface NewUserProps {
}