import { type FC, useCallback, useState } from "react"
import { Button, Divider, Field, Input, makeStyles } from "@fluentui/react-components"
import { profileController } from './../../../utils/Profile'

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

const DataForm: FC<DataFormProps> = () => {
  const styles = useStyles()
  const [loading, setLoading] = useState<boolean>(false)
  const [full_name, setFullName] = useState<Miscellaneous.NewUser['name']>(profileController.profile?.name || '')
  const [name, setName] = useState<Miscellaneous.NewUser['userName']>(profileController.profile?.userName || '')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [fullNameVerification, setFullNameVerification] = useState<Verification>({})

  const handleOnUpdate = useCallback(() => {
    if (!name) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!full_name) {
      setFullNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    fetch(`${window.location.origin}/api/profile`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ name: full_name, userName: name })
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        if (res.ok) {
          profileController.profile = {
            ...(profileController.profile as Miscellaneous.User),
            userName: name,
            name: full_name
          }
        } else {
          if (res.code === 'user-already-exists') {
            setNameVerification({ message: res.message, state: 'warning' })
          } else {
            console.error(res)
          }
        }
      })
  }, [name, setNameVerification, full_name, setFullNameVerification, setLoading])

  return (
    <>
      <Divider style={{ maxHeight: '16px' }}>Datos Personales</Divider>
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
  user: Miscellaneous.User | null
}