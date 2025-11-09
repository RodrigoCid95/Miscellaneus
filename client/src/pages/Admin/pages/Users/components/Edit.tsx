import { type FC, ChangeEvent, useState } from 'react'
import { makeStyles, Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogContent, Field, Input, Switch, DialogActions, Button, Spinner, tokens } from '@fluentui/react-components'
import { bundleIcon, Edit20Filled, Edit20Regular } from '@fluentui/react-icons'
import { useUsersContext } from '../../../context/users'
import { structs } from '../../../../../../wailsjs/go/models'
import { api } from '../../../../../utils/api'
import { UpdateUser } from '../../../../../../wailsjs/go/controllers/Users'

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
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingHorizontalXXL
  },
})

const EditUser: FC<EditUserProps> = ({ user }) => {
  const styles = useStyles()
  const { loadUsers } = useUsersContext()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [userName, setName] = useState<structs.NewUser['userName']>(user.userName)
  const [msgNameVerification, setMsgNameVerification] = useState<string>('')

  const [fullName, setFullName] = useState<structs.NewUser['fullName']>(user.fullName)
  const [msgFullNameVerification, setMsgFullNameVerification] = useState<string>('')


  const [isAdmin, setIsAdmin] = useState<structs.NewUser['isAdmin']>(user.isAdmin)

  const handleOnIsAdminChange = (ev: ChangeEvent<HTMLInputElement>) => setIsAdmin(ev.currentTarget.checked)

  const handleOnUpdate = () => {
    if (!userName) {
      setMsgNameVerification('Campo requerido.')
      return
    }
    if (!fullName) {
      setMsgFullNameVerification('Campo requerido.')
      return
    }
    setLoading(true)
    const data = new structs.User()
    data.id = user.id
    data.userName = userName
    data.fullName = fullName
    data.isAdmin = isAdmin
    api(UpdateUser, data)
      .then(() => {
        setOpen(false)
        loadUsers()
      })
      .catch(error => {
        console.dir(error)
        setMsgNameVerification(`El usuario "${userName}" ya existe.`)
      })
      .finally(() => setLoading(false))
  }

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
        <DialogTitle>{loading ? "Actualizando usuario ..." : "Editar usuario"}</DialogTitle>
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
                validationState={msgNameVerification != '' ? "warning" : undefined}
                validationMessage={msgNameVerification}
              >
                <Input
                  value={userName}
                  onChange={e => setName(e.target.value)}
                  onBlur={() => {
                    setMsgNameVerification('')
                  }}
                />
              </Field>

              <Field
                label="Nombre completo"
                validationState={msgFullNameVerification != '' ? "warning" : undefined}
                validationMessage={msgFullNameVerification}
              >
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onBlur={() => {
                    setMsgFullNameVerification('')
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
              <Button appearance="primary" onClick={handleOnUpdate}>Guardar</Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}

export default EditUser

interface EditUserProps {
  user: structs.User
}