import { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

const Admin = lazy(() => import('./pages/Admin'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App><Admin /></App>
)
document.title = `Miscellaneous | Administrador`