import { type FC, useCallback, useEffect, useState } from "react"
import { Field, Input } from "@fluentui/react-components"
import { Emitter } from "../utils/Emitters"

const emitters = {
  save: new Emitter(),
  start: new Emitter(),
  end: new Emitter(),
}

const PasswordForm: FC<PasswordFormProps> = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [pass1, setPass1] = useState<string>('')
  const [pass2, setPass2] = useState<string>('')
  const [pass3, setPass3] = useState<string>('')
  const [passVerification1, setPassVerification1] = useState<Verification>({})
  const [passVerification2, setPassVerification2] = useState<Verification>({})
  const [passVerification3, setPassVerification3] = useState<Verification>({})

  const handleOnUpdate = useCallback(() => {
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
    emitters.start.emit()
    fetch(`${window.location.origin}/api/profile`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ currentPass: pass1, newPass: pass2 })
    })
      .then(res => res.json())
      .then(res => {
        emitters.end.emit()
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
  }, [setLoading, pass1, setPassVerification1, pass2, setPassVerification2, pass3, setPassVerification3, setPass1, setPass2, setPass3])

  useEffect(() => {
    const handleOnStart = () => setLoading(true)
    const handleOnEnd = () => setLoading(false)
    emitters.save.on(handleOnUpdate)
    emitters.start.on(handleOnStart)
    emitters.end.on(handleOnEnd)
    return () => {
      emitters.save.off(handleOnUpdate)
      emitters.start.off(handleOnStart)
      emitters.end.off(handleOnEnd)
    }
  }, [setLoading, handleOnUpdate])

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

export default PasswordForm

export { emitters }

interface PasswordFormProps {
}