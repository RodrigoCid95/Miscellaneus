import { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

const Login = lazy(() => import('./pages/Login'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App>
    <Login />
  </App>,
)