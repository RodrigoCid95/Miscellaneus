import { type FC, type ChangeEvent, useState } from "react"
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, makeStyles, Spinner, Switch, tokens, ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, PersonAdd20Filled, PersonAdd20Regular } from "@fluentui/react-icons"
import { useUsersContext } from "../../../context/users"
import { models } from "../../../../../../wailsjs/go/models"
import { CreateUser } from "../../../../../../wailsjs/go/controllers/Users"

const AddPersonIcon = bundleIcon(PersonAdd20Filled, PersonAdd20Regular)

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
  },
  dialog: {
    width: 'fit-content',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingHorizontalXXL
  },
})

const NewUser: FC<NewUserProps> = () => {
  const styles = useStyles()
  const { loadUsers } = useUsersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [name, setName] = useState<models.NewUser['userName']>('')
  const [msgNameValidation, setMsgNameValidation] = useState<string>('')


  const [full_name, setFullName] = useState<models.NewUser['fullName']>('')
  const [msgFullNameValidation, setMsgFullNameValidation] = useState<string>('')

  const [password, setPassword] = useState<string>('')
  const [msgPasswordNameValidation, setMsgPasswordNameValidation] = useState<string>('')

  const [isAdmin, setIsAdmin] = useState<models.NewUser['isAdmin']>(false)

  const handleOnIsAdminChange = (ev: ChangeEvent<HTMLInputElement>) => setIsAdmin(ev.currentTarget.checked)

  const handleOnCreate = () => {
    if (!name) {
      setMsgNameValidation('Campo requerido.')
      return
    }
    if (!full_name) {
      setMsgFullNameValidation('Campo requerido.')
      return
    }
    if (!password) {
      setMsgPasswordNameValidation('Campo requerido.')
      return
    }
    setLoading(true)
    const data = new models.NewUser()
    data.userName = name
    data.fullName = full_name
    data.isAdmin = isAdmin
    data.password = password
    CreateUser(data)
      .then(() => {
        setOpen(false)
        loadUsers()
      })
      .catch(() => setMsgFullNameValidation(`El usuario "${name}" ya existe.`))
  }

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
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{loading ? "Creando usuario ..." : "Nuevo usuario"}</DialogTitle>
        {loading && (
          <DialogBody className={styles.spinnerContainer}>
            <Spinner />
          </DialogBody>
        )}
        {!loading && (
          <DialogBody>
            <DialogContent className={styles.content}>
              <Field
                label="Nombre de usuario"
                validationState={msgNameValidation != '' ? "warning" : undefined}
                validationMessage={msgNameValidation}
              >
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => {
                    setMsgNameValidation('')
                  }}
                />
              </Field>

              <Field
                label="Nombre completo"
                validationState={msgFullNameValidation != '' ? "warning" : undefined}
                validationMessage={msgFullNameValidation}
              >
                <Input
                  value={full_name}
                  onChange={e => setFullName(e.target.value)}
                  onBlur={() => {
                    setMsgFullNameValidation('')
                  }}
                />
              </Field>

              <Field
                label="Contraseña"
                validationState={msgPasswordNameValidation != '' ? "warning" : undefined}
                validationMessage={msgPasswordNameValidation}
              >
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => {
                    setMsgPasswordNameValidation('')
                  }}
                />
              </Field>

              <Switch
                checked={isAdmin}
                onChange={handleOnIsAdminChange}
                label={isAdmin ? "Es administrador" : "Es vendedor"}
              />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={handleOnCreate}>Crear</Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default NewUser

interface NewUserProps {
}