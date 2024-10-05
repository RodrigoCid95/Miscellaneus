import {
  type FC,
} from 'react'
import {
  ToolbarButton
} from '@fluentui/react-components'
import {
  bundleIcon,
  ArrowSync20Filled,
  ArrowSync20Regular
} from '@fluentui/react-icons'
import ToolbarPage from './../../../Components/Toolbar'
import UserList, { loadUserListEmitter } from './List'
import NewUser from './New'

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const UsersPage: FC<UsersPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Usuarios" onOpenMenu={onOpenMenu}>
        <NewUser />
        <ToolbarButton
          appearance='transparent'
          icon={<ReloadIcon />}
          onClick={() => loadUserListEmitter.emit()}
        />
      </ToolbarPage>
      <UserList />
    </>
  )
}

export default UsersPage

interface UsersPageProps {
  onOpenMenu(): void
}