import { type DrawerProps } from '@fluentui/react-components'
import { type Dispatch, type SetStateAction, createContext, useContext } from 'react'

const AdminAppContext = createContext<{
  path: string
  setPath: Dispatch<SetStateAction<string>>
  typeDrawer: DrawerType
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  matches: boolean
}>({
  path: '',
  setPath: () => { },
  typeDrawer: 'overlay',
  isOpen: false,
  setIsOpen: () => { },
  matches: false
})

const useAdminAppContext = () => useContext(AdminAppContext)

type DrawerType = Required<DrawerProps>["type"]

export { AdminAppContext, useAdminAppContext }
export type { DrawerType }
