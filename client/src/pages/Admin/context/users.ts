import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const UsersContext = createContext<{
  loading: boolean
  items: structs.User[]
  loadUsers: () => void
}>({
  loading: false,
  items: [],
  loadUsers: () => { }
})

const useUsersContext = () => useContext(UsersContext)

export { UsersContext, useUsersContext }