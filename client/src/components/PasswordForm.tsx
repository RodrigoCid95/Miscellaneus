import { useState, type FC, type ReactNode } from "react"
import { Field, Input } from "@fluentui/react-components"
import { PasswordFormContext, usePasswordForm } from "../context/passwordForm"
import { updatePassword } from "../services/updatePassword"

const PasswordFormProvider: FC<PasswordFormProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [pass1, setPass1] = useState<string>('')
  const [pass2, setPass2] = useState<string>('')
  const [pass3, setPass3] = useState<string>('')
  const [passVerification1, setPassVerification1] = useState<Verification>({})
  const [passVerification2, setPassVerification2] = useState<Verification>({})
  const [passVerification3, setPassVerification3] = useState<Verification>({})

  const save = () => {
    if (!pass1) {
      setPassVerification1({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!pass2) {
      setPassVerification2({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (!pass3) {
      setPassVerification3({ message: 'Campo requerido.', state: 'warning' })
      return
    }
    if (pass2 !== pass3) {
      setPassVerification2({ message: 'Las contraseñas no coinciden.', state: 'warning' })
      setPassVerification3({ message: 'Las contraseñas no coinciden.', state: 'warning' })
      return
    }
    setLoading(true)
    updatePassword(pass1, pass2)
      .then(res => {
        setLoading(false)
        if (res.ok) {
          setPass1('')
          setPass2('')
          setPass3('')
        } else {
          if (res.code === 'password-invalid') {
            setPassVerification1({ message: res.message, state: 'error' })
          }
        }
      })
  }

  return (
    <PasswordFormContext.Provider value={{
      save,
      loading,
      pass1,
      pass2,
      pass3,
      passVerification1,
      passVerification2,
      passVerification3,
      setLoading,
      setPass1,
      setPass2,
      setPass3,
      setPassVerification1,
      setPassVerification2,
      setPassVerification3
    }}>
      {children}
    </PasswordFormContext.Provider>
  )
}

const PasswordForm: FC<PasswordFormProps> = () => {
  const {
    loading,
    pass1,
    pass2,
    pass3,
    passVerification1,
    passVerification2,
    passVerification3,
    setPass1,
    setPass2,
    setPass3,
    setPassVerification1,
    setPassVerification2,
    setPassVerification3
  } = usePasswordForm()

  return (
    <>
      <Field
        label="Contraseña actual"
        validationState={passVerification1.state}
        validationMessage={passVerification1.message}
      >
        <Input disabled={loading} type="password" value={pass1} onChange={e => setPass1(e.target.value)} onBlur={() => setPassVerification1({})} />
      </Field>

      <Field
        label="Nueva contraseña"
        validationState={passVerification2.state}
        validationMessage={passVerification2.message}
      >
        <Input disabled={loading} type="password" value={pass2} onChange={e => setPass2(e.target.value)} onBlur={() => setPassVerification2({})} />
      </Field>

      <Field
        label="Repite tu contraseña"
        validationState={passVerification3.state}
        validationMessage={passVerification3.message}
      >
        <Input disabled={loading} type="password" value={pass3} onChange={e => setPass3(e.target.value)} onBlur={() => setPassVerification3({})} />
      </Field>
    </>
  )
}

export { PasswordFormProvider, PasswordForm }


interface PasswordFormProviderProps {
  children: ReactNode
}
interface PasswordFormProps {
}