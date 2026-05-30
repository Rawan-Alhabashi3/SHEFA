import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import LocalizedApp from './i18n/LocalizedApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizedApp>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </LocalizedApp>
  </StrictMode>,
)
