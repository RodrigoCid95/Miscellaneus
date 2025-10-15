import { createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const UsersContext = createContext<{
  loading: boolean
  items: models.User[]
  loadUsers: () => void
}>({
  loading: false,
  items: [],
  loadUsers: () => { }
})

const useUsersContext = () => useContext(UsersContext)

export { UsersContext, useUsersContext }