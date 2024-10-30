import { createContext, useContext } from 'react'

const UsersContext = createContext<{
  loading: boolean
  items: Miscellaneous.User[]
  loadUsers: () => void
}>({
  loading: false,
  items: [],
  loadUsers: () => { }
})

const useUsersContext = () => useContext(UsersContext)

export { UsersContext, useUsersContext }