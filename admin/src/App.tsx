import { type LazyExoticComponent, type FC, useCallback, useEffect, useState, lazy, Suspense } from "react"
import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Drawer,
  DrawerProps,
  Button,
  makeStyles,
  tokens,
  Spinner,
  TabList,
  Tab,
  DrawerFooter,
  Caption1
} from "@fluentui/react-components"
import {
  type FluentIcon,
  Dismiss24Regular,
  bundleIcon,
  Board20Filled,
  Board20Regular,
  People20Filled,
  People20Regular,
  BoxMultiple20Filled,
  BoxMultiple20Regular,
  Person20Filled,
  Person20Regular,
} from "@fluentui/react-icons"
import { router } from './utils/Router'
import LogoutButton from "./components/logout"
import { profileController } from './utils/Profile'

const routes: Route[] = [
  {
    path: '',
    title: 'Inicio',
    Icon: bundleIcon(Board20Filled, Board20Regular),
    page: lazy(() => import('./pages/Dashboard'))
  },
  {
    path: 'products',
    title: 'Productos',
    Icon: bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular),
    page: lazy(() => import('./pages/Products'))
  },
  {
    path: 'users',
    title: 'Usuarios',
    Icon: bundleIcon(People20Filled, People20Regular),
    page: lazy(() => import('./pages/Users'))
  },
  {
    path: 'profile',
    title: 'Perfil',
    Icon: bundleIcon(Person20Filled, Person20Regular),
    page: lazy(() => import('./pages/Profile'))
  }
]

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

type DrawerType = Required<DrawerProps>["type"]

function App() {
  const styles = useStyles()
  const match = window.matchMedia("(min-width: 1024px)")
  const [isOpen, setIsOpen] = useState(match.matches)
  const [type, setType] = useState<DrawerType>(match.matches ? "inline" : "overlay")
  const [profile, setProfile] = useState<Miscellaneous.User | null>(profileController.profile)
  const [path, setPath] = useState<string>(router.path)

  const onMediaQueryChange = useCallback(
    ({ matches }: any) => {
      setType(matches ? "inline" : "overlay")
      setIsOpen(matches)
    },
    [setType, setIsOpen]
  )

  const onRouteChange = useCallback(() => setPath(router.path), [])
  const onProfileChange = useCallback(() => setProfile(profileController.profile), [])

  useEffect(() => {
    match.addEventListener("change", onMediaQueryChange)
    router.on('change', onRouteChange)
    profileController.onChange(onProfileChange)
    fetch(`${window.location.origin}/api/profile`)
      .then(res => res.json())
      .then(user => profileController.profile = user)
    return () => {
      match.removeEventListener("change", onMediaQueryChange)
      router.off('change', onRouteChange)
      profileController.off(onProfileChange)
    }
  }, [onMediaQueryChange, onRouteChange])

  const Page = routes.find(route => route.path === path)?.page

  return (
    <div className={styles.root}>
      <Drawer
        className={styles.drawer}
        type={type}
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader className={styles.drawerHeader}>
          <DrawerHeaderTitle
            action={
              type === 'overlay'
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
            Miscellaneus
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
            defaultSelectedValue={router.path}
            vertical
          >
            {routes.map(({ path, title, Icon }, i) => (
              <Tab
                key={i}
                icon={<Icon />}
                value={path}
                onClick={() => {
                  router.path = path
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

export default App

interface Route {
  path: string
  title: string
  Icon: FluentIcon
  page: LazyExoticComponent<FC<any>>
}