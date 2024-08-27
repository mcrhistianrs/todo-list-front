import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './page/_layouts/app'
import { AuthLayout } from './page/_layouts/auth'
import { Dashboard } from './page/app/dashboard'
import { SignIn } from './page/auth/sign-in'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
        },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
])
