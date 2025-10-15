import { useEffect, useState } from "react"
import { ToolbarButton } from "@fluentui/react-components"
import { ArrowSync20Filled, ArrowSync20Regular, bundleIcon } from "@fluentui/react-icons"
import ToolbarPage from "../../components/Toolbar"
import New from './components/New'
import { UsersContext, useUsersContext } from "../../context/users"
import List from "./components/List"
import { models } from "../../../../../wailsjs/go/models"
import { GetUsers } from "../../../../../wailsjs/go/controllers/Users"

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
  const [items, setItems] = useState<models.User[]>([])

  const loadUsers = () => {
    setLoading(true)
    GetUsers()
      .then(users => setItems(users))
      .catch(error => {
        console.error(error)
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  return (
    <UsersContext.Provider value={{ loading, items, loadUsers }}>
      <Users />
    </UsersContext.Provider>
  )
}