import { type FC, useState, useEffect, Suspense } from "react"
import { FluentProvider, Spinner, webDarkTheme, webLightTheme } from '@fluentui/react-components'

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')

const App: FC<any> = ({children}) => {
  const [theme, setTheme] = useState(darkModeQuery.matches ? webDarkTheme : webLightTheme)
  
  useEffect(() => {
    darkModeQuery.addEventListener('change', e => setTheme(e.matches ? webDarkTheme : webLightTheme))
  })

  return (
    <FluentProvider theme={theme} style={{ display: 'contents' }}>
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </FluentProvider>
  )
}

window.addEventListener('contextmenu', e => e.preventDefault())

export default App