import { useEffect, useState } from "react"
import { ToolbarButton } from "@fluentui/react-components"
import { ArrowSync20Filled, ArrowSync20Regular, bundleIcon } from "@fluentui/react-icons"
import ToolbarPage from "../../../components/Toolbar"
import New from './New'
import { UsersContext, useUsersContext } from "../../../context/users"
import { getUsers } from "../../../services/users"
import List from "./List"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const Users = () => {
  const { loadUsers } = useUsersContext()
  return (
    <>
      <ToolbarPage title='Usuarios'>
        <New />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={loadUsers}
        />
      </ToolbarPage>
      <List />
    </>
  )
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<Miscellaneous.User[]>([])

  const loadUsers = () => {
    setLoading(true)
    getUsers()
      .then(users => {
        setItems(users)
        setLoading(false)
      })
  }

  useEffect(loadUsers, [])

  return (
    <UsersContext.Provider value={{ loading, items, loadUsers }}>
      <Users />
    </UsersContext.Provider>
  )
}