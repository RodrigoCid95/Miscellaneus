import { type FC, useState } from "react"
import { Button, Field, Input, makeStyles } from "@fluentui/react-components"
import { useProfileContext } from "../../../context/profile"
import { updateProfile } from "../../../services/profile"

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

const DataForm: FC<DataFormProps> = () => {
  const styles = useStyles()
  const { profile, setProfile } = useProfileContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [full_name, setFullName] = useState<Miscellaneous.NewUser['name']>(profile?.name || '')
  const [name, setName] = useState<Miscellaneous.NewUser['userName']>(profile?.userName || '')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [fullNameVerification, setFullNameVerification] = useState<Verification>({})

  const handleOnUpdate = () => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!full_name) {
      setFullNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    updateProfile({ name: full_name, userName: name })
      .then(res => {
        setLoading(false)
        if (res.ok) {
          setProfile({
            ...(profile as Miscellaneous.User),
            userName: name,
            name: full_name
          })
        } else {
          if (res.code === 'user-already-exists') {
            setNameVerification({ message: res.message, state: 'warning' })
          } else {
            console.error(res)
          }
        }
      })
  }

  return (
    <>
      <Field
        label="Nombre de usuario"
        validationState={nameVerification.state}
        validationMessage={nameVerification.message}
      >
        <Input disabled={loading} value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameVerification({})} />
      </Field>

      <Field
        label="Nombre completo"
        validationState={fullNameVerification.state}
        validationMessage={fullNameVerification.message}
      >
        <Input disabled={loading} value={full_name} onChange={e => setFullName(e.target.value)} onBlur={(() => setFullNameVerification({}))} />
      </Field>

      <div className={styles.buttons}>
        <Button disabled={loading} appearance="primary" onClick={handleOnUpdate}>
          Actualizar
        </Button>
      </div>
    </>
  )
}

export default DataForm

interface DataFormProps {
}