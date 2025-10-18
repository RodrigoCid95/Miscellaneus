import { createRoot } from 'react-dom/client'
import Activity from './components/Activity'
import App from './App'
import './main.css'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
    <Activity>
        <App />
    </Activity>
)
