import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const ProfileContext = createContext<{
  profile?: models.User
  setProfile: Dispatch<SetStateAction<models.User | undefined>>
}>({
  setProfile: () => { }
})

const useProfileContext = () => useContext(ProfileContext)

export { ProfileContext, useProfileContext }
