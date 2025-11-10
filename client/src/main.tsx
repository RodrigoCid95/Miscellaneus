import { createRoot } from 'react-dom/client'
import Activity from './components/Activity'
import App from './App'
import './main.css'

async function main() {
    if (!('go' in window)) {
        const { controllers } = await import('./polyfill')
        Object.defineProperty(window, 'go', { value: { controllers }, writable: false })
    }

    const container = document.getElementById('root')
    const root = createRoot(container!)
    root.render(
        <Activity>
            <App />
        </Activity>
    )
}

main()
