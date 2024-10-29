import { lazy, useEffect, useState, Suspense, FC, LazyExoticComponent } from "react"
import { Button, Caption1, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, makeStyles, Spinner, Tab, TabList, tokens } from "@fluentui/react-components"
import { BarcodeScanner20Filled, BarcodeScanner20Regular, Board20Filled, Board20Regular, BoxMultiple20Filled, BoxMultiple20Regular, bundleIcon, ContactCardGroup20Filled, ContactCardGroup20Regular, Dismiss24Regular, FluentIcon, History20Filled, History20Regular, People20Filled, People20Regular, Person20Filled, Person20Regular } from "@fluentui/react-icons"
import { DrawerType, AdminAppContext, useAdminAppContext } from '../../context/admin'
import { ConfigContext, useConfigContext } from "../../context/config"
import { getConfig, saveConfig } from "../../services/config"
import { getProfile } from "../../services/profile"
import { ProfileContext, useProfileContext } from "../../context/profile"
import LogoutButton from "../../components/Logout"

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100dvh'
  },
  drawer: {
    display: 'flex',
    flexWrap: "wrap",
    rowGap: tokens.spacingHorizontalXXL,
    columnGap: tokens.spacingHorizontalXXL,
  },
  drawerHeader: {
    display: 'flex',
    flexDirection: 'row'
  },
  spinner: {
    marginTop: '16px'
  },
  content: {
    padding: [tokens.spacingHorizontalXXL, tokens.spacingVerticalXXL],
    display: 'block',
    width: '100%'
  }
})
const routes: Route[] = [
  {
    path: '',
    title: 'Inicio',
    Icon: bundleIcon(Board20Filled, Board20Regular),
    page: lazy(() => import('./Dashboard'))
  },
  {
    path: 'history',
    title: 'Historial',
    Icon: bundleIcon(History20Filled, History20Regular),
    page: lazy(() => import('./History'))
  },
  {
    path: 'products',
    title: 'Productos',
    Icon: bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular),
    page: lazy(() => import('./Products'))
  },
  {
    path: 'barcodes',
    title: 'Códigos de barras',
    Icon: bundleIcon(BarcodeScanner20Filled, BarcodeScanner20Regular),
    page: lazy(() => import('./BarCodes'))
  },
  {
    path: 'providers',
    title: 'Proveedores',
    Icon: bundleIcon(ContactCardGroup20Filled, ContactCardGroup20Regular),
    page: lazy(() => import('./Providers'))
  },
  {
    path: 'users',
    title: 'Usuarios',
    Icon: bundleIcon(People20Filled, People20Regular),
    page: lazy(() => import('./Users'))
  },
  {
    path: 'profile',
    title: 'Perfil',
    Icon: bundleIcon(Person20Filled, Person20Regular),
    page: lazy(() => import('./Profile'))
  }
]
const ConfigLazy = lazy(() => import('./../../components/Config'))
const match = window.matchMedia("(min-width: 1024px)")

const Admin = () => {
  const styles = useStyles()
  const { path, setPath, typeDrawer, isOpen, setIsOpen } = useAdminAppContext()
  const { config } = useConfigContext()
  const { profile } = useProfileContext()
  const Page = routes.find(route => route.path === path)?.page

  return (
    <div className={styles.root}>
      <Drawer
        className={styles.drawer}
        type={typeDrawer}
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader className={styles.drawerHeader}>
          <DrawerHeaderTitle
            action={
              typeDrawer === 'overlay'
                ? (
                  <Button
                    appearance="subtle"
                    aria-label="Close"
                    icon={<Dismiss24Regular />}
                    onClick={() => setIsOpen(false)}
                  />
                ) : ''
            }
          >
            {config && config.name}
            <br />
            {profile && <Caption1>{profile.name}</Caption1>}
          </DrawerHeaderTitle>
          {profile === null && <Spinner />}
        </DrawerHeader>

        <DrawerBody
          tabIndex={0}
          role="group"
        >
          <TabList
            defaultSelectedValue={path}
            vertical
          >
            {routes.map(({ path, title, Icon }, i) => (
              <Tab
                key={i}
                icon={<Icon />}
                value={path}
                onClick={() => {
                  setPath(path)
                  if (!match.matches) {
                    setIsOpen(false)
                  }
                }}
              >
                {title}
              </Tab>
            ))}
          </TabList>
        </DrawerBody>

        <DrawerFooter>
          <Suspense fallback={<Spinner />}>
            <ConfigLazy />
          </Suspense>
          <LogoutButton />
        </DrawerFooter>
      </Drawer>

      <div className={styles.content}>
        {Page && (
          <Suspense fallback={<Spinner className={styles.spinner} />}>
            <Page onOpenMenu={() => setIsOpen(!isOpen)} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

const AdminAppProvider: FC<any> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(match.matches)
  const [typeDrawer, setTypeDrawer] = useState<DrawerType>(match.matches ? "inline" : "overlay")
  const [path, setPath] = useState<string>('barcodes')

  useEffect(() => {
    const handleOnChange = ({ matches }: any) => {
      setTypeDrawer(matches ? 'inline' : 'overlay')
      setIsOpen(matches)
    }
    match.addEventListener('change', handleOnChange)
    return () => match.removeEventListener('change', handleOnChange)
  }, [])

  return (
    <AdminAppContext.Provider value={{ matches: match.matches, path, setPath, typeDrawer, isOpen, setIsOpen }}>
      {children}
    </AdminAppContext.Provider>
  )
}

const ConfigProvider: FC<any> = ({ children }) => {
  const [config, setConfig] = useState<Miscellaneous.Config | undefined>(undefined)

  const loadConfig = () => {
    getConfig()
      .then(c => setConfig(c))
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const setConfiguration = async (config: Miscellaneous.Config) => {
    await saveConfig(config)
    setConfig(config)
  }

  return (
    <ConfigContext.Provider value={{ config, setConfig: setConfiguration, loadConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

const ProfileProvider: FC<any> = ({ children }) => {
  const [profile, setProfile] = useState<Miscellaneous.User | undefined>(undefined)

  useEffect(() => {
    getProfile()
      .then(p => setProfile(p))
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export default () => (
  <AdminAppProvider>
    <ConfigProvider>
      <ProfileProvider>
        <Admin />
      </ProfileProvider>
    </ConfigProvider>
  </AdminAppProvider>
)

interface Route {
  path: string
  title: string
  Icon: FluentIcon
  page: LazyExoticComponent<FC<any>>
}