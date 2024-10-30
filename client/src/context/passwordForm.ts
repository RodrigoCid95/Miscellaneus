import { type Dispatch, type SetStateAction, createContext, useContext } from "react"

const PasswordFormContext = createContext<{
  save: () => void
  loading: boolean
  pass1: string
  pass2: string
  pass3: string
  passVerification1: Verification
  passVerification2: Verification
  passVerification3: Verification
  setLoading: Dispatch<SetStateAction<boolean>>
  setPass1: Dispatch<SetStateAction<string>>
  setPass2: Dispatch<SetStateAction<string>>
  setPass3: Dispatch<SetStateAction<string>>
  setPassVerification1: Dispatch<SetStateAction<Verification>>
  setPassVerification2: Dispatch<SetStateAction<Verification>>
  setPassVerification3: Dispatch<SetStateAction<Verification>>
}>({
  save: () => { },
  loading: false,
  pass1: "",
  pass2: "",
  pass3: "",
  passVerification1: {},
  passVerification2: {},
  passVerification3: {},
  setLoading: () => { },
  setPass1: () => { },
  setPass2: () => { },
  setPass3: () => { },
  setPassVerification1: () => { },
  setPassVerification2: () => { },
  setPassVerification3: () => { }
})

const usePasswordForm = () => useContext(PasswordFormContext)

export { PasswordFormContext, usePasswordForm }