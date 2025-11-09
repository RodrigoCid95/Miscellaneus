import { type FC, useState } from "react"
import { Button, Field, Input, makeStyles } from "@fluentui/react-components"
import { useProfileContext } from "../../../context/profile"
import { structs } from "../../../../../../wailsjs/go/models"
import { api, APIError } from "../../../../../utils/api"
import { UpdateProfile } from "../../../../../../wailsjs/go/controllers/Profile"

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
  const [userName, setUserName] = useState<structs.NewUser['userName']>(profile?.userName || '')
  const [fullName, setFullName] = useState<structs.NewUser['fullName']>(profile?.fullName || '')
  const [nameVerification, setNameVerification] = useState<Verification>({})
  const [fullNameVerification, setFullNameVerification] = useState<Verification>({})

  const handleOnUpdate = () => {
    if (!userName) {
      setNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!fullName) {
      setFullNameVerification({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    setLoading(true)
    const data = new structs.ProfileData()
    data.fullName = fullName
    data.userName = userName
    api(UpdateProfile, data)
      .then(() => {
        setProfile({
          ...(profile as structs.User),
          userName,
          fullName
        })
      })
      .catch(error => {
        if (error instanceof APIError && error.name === 'UserAlreadyExist') {
          setNameVerification({ message: error.message, state: 'warning' })
        } else {
          console.error(error)
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Field
        label="Nombre de usuario"
        validationState={nameVerification.state}
        validationMessage={nameVerification.message}
      >
        <Input disabled={loading} value={userName} onChange={e => setUserName(e.target.value)} onBlur={() => setNameVerification({})} />
      </Field>

      <Field
        label="Nombre completo"
        validationState={fullNameVerification.state}
        validationMessage={fullNameVerification.message}
      >
        <Input disabled={loading} value={fullName} onChange={e => setFullName(e.target.value)} onBlur={(() => setFullNameVerification({}))} />
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