/// <reference types="vite/client" />

import './../../server/types'

declare global {
  type Callback = (...args: any[]) => void | Promise<void>
  interface Verification {
    message?: string
    state?: 'error' | 'warning' | 'success' | 'none'
  }
}
