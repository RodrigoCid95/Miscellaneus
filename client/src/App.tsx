import { useState, useEffect, Suspense, lazy } from "react"
import { makeStyles, Spinner } from "@fluentui/react-components"
import { GetProfile } from "../wailsjs/go/controllers/Profile"
import { models } from "../wailsjs/go/models"

const Login = lazy(() => import('./pages/login'))
const Admin = lazy(() => import('./pages/Admin'))
const Checkout = lazy(() => import('./pages/Checkout'))

const useStyles = makeStyles({
  spinner: {
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: "translate(-50%, -50%)"
  }
})

export default () => {
  const styles = useStyles()
  const [profile, setProfile] = useState<Profile>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    GetProfile()
      .then(p => {
        setProfile(p)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Spinner className={styles.spinner} />
  }

  if (profile == null) {
    return (
      <Suspense fallback={<Spinner className={styles.spinner} />}>
        <Login />
      </Suspense>
    )
  }

  if (profile.isAdmin) {
    return (
      <Suspense fallback={<Spinner className={styles.spinner} />}>
        <Admin />
      </Suspense>
    )
  }
  
  return (
    <Suspense fallback={<Spinner className={styles.spinner} />}>
      <Checkout />
    </Suspense>
  )
}

type Profile = models.User | null