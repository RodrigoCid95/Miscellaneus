/// <reference types="vite/client" />

interface Verification {
  message?: string
  state?: 'error' | 'warning' | 'success' | 'none'
}