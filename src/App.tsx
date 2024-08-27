import './global.css'

import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { router } from './routes'

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster richColors />
    </HelmetProvider>
  )
}

export default App
