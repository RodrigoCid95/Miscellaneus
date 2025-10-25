import { useState } from 'react'
import { Button, Field, FieldProps, Input, Spinner, ToggleButton, makeStyles, shorthands, tokens, Text } from '@fluentui/react-components'
import { bundleIcon, EyeOffRegular, EyeRegular } from "@fluentui/react-icons"
import { Login } from './../../../wailsjs/go/controllers/Auth'
import './style.css'
import { controllers } from '../../../wailsjs/go/models'
import { api } from '../../utils/api'

const Eye = bundleIcon(EyeOffRegular, EyeRegular)

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXL),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '240px',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  buttonContainer: {
    marginTop: tokens.spacingVerticalS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    flexDirection: 'column'
  },
  errorMessage: {
    color: tokens.colorPaletteRedForeground1,
    textAlign: 'center'
  },
})

export default () => {
  const styles = useStyles()

  const [userName, setUsername] = useState('')
  const [msgValidation1, setMsgValidation1] = useState('')
  const [validationState1, setValidationState1] = useState<FieldProps["validationState"]>('none')

  const [password, setPassword] = useState('')
  const [msgValidation2, setMsgValidation2] = useState('')
  const [validationState2, setValidationState2] = useState<FieldProps["validationState"]>('none')

  const [eye, setEye] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleLogin = () => {
    if (!userName) {
      setMsgValidation1('Escribe un nombre de usuario.')
      setValidationState1('warning')
      return
    }
    if (!password) {
      setMsgValidation2('Escribe una contraseña.')
      setValidationState2('warning')
      return
    }
    setLoading(true)
    setGeneralError('')
    const credentials = new controllers.Credentials()
    credentials.user_name = userName
    credentials.password = password
    api(Login, credentials)
      .then(() => window.location.reload())
      .catch(error => {
        if (error) {
          if (error.name === 'UserNotFound') {
            setMsgValidation1(error.message)
            setValidationState1('error')
            return
          }
          if (error.name === 'WrongPassword') {
            setMsgValidation2(error.message)
            setValidationState2('error')
            return
          }
        }
        setGeneralError('Ocurrió un error inesperado, vuelve a intentar más tarde.')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Field
          label='Nombre de Usuario'
          style={{ width: '100%' }}
          validationState={validationState1}
          validationMessage={msgValidation1}
          onBlur={() => {
            setValidationState1('none')
            setMsgValidation1('')
          }}
        >
          <Input
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field
          label='Contraseña'
          style={{ width: '100%' }}
          validationState={validationState2}
          validationMessage={msgValidation2}
          onBlur={() => {
            setValidationState2('none')
            setMsgValidation2('')
          }}
        >
          <Input
            type={eye ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            contentAfter={(
              <ToggleButton
                appearance="transparent"
                icon={<Eye />}
                checked={eye}
                onClick={() => setEye(!eye)}
              />
            )}
          />
        </Field>
        <div className={styles.buttonContainer}>
          {loading && <Spinner />}
          {!loading && (
            <>
              <Button onClick={handleLogin}>
                Iniciar Sesión
              </Button>
              <br />
              {generalError !== "" && <Text className={styles.errorMessage}>{generalError}</Text>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}