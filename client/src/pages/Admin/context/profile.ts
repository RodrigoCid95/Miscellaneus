import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const ProfileContext = createContext<{
  profile?: structs.User
  setProfile: Dispatch<SetStateAction<structs.User | undefined>>
}>({
  setProfile: () => { }
})

const useProfileContext = () => useContext(ProfileContext)

export { ProfileContext, useProfileContext }
