import { useEffect, useState, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, Spinner, webDarkTheme, webLightTheme } from '@fluentui/react-components'

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
const Login = lazy(() => import('./pages/Login'))

const Container = () => {
  const [theme, setTheme] = useState(darkModeQuery.matches ? webDarkTheme : webLightTheme)
  useEffect(() => {
    darkModeQuery.addEventListener('change', e => setTheme(e.matches ? webDarkTheme : webLightTheme))
  })
  return (
    <FluentProvider theme={theme} style={{ display: 'contents' }}>
      <Suspense fallback={<Spinner />}>
        <Login />
      </Suspense>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Container />,
)

window.addEventListener('contextmenu', e => e.preventDefault())