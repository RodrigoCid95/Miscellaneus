import { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

const Checkout = lazy(() => import('./pages/Checkout'))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App>
    <Checkout />
  </App>,
)