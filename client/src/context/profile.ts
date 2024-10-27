import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'

const ProfileContext = createContext<{
  profile?: Miscellaneous.User
  setProfile: Dispatch<SetStateAction<Miscellaneous.User | undefined>>
}>({
  setProfile: () => { }
})

const useProfileContext = () => useContext(ProfileContext)

export { ProfileContext, useProfileContext }