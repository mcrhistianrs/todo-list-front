import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { useUserStore } from '@/store'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signInForm = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, setUser } = useUserStore();

  async function handleSignIn(data: SignInForm) {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        const result = await response.json()
        if (result.token !== undefined) {
          toast.success('Login successful!')
          let decodedToken=null
          const base64Url = result.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          decodedToken = JSON.parse(jsonPayload);
          setUser(decodedToken.id)
          navigate('/dashboard') // Redirect to the dashboard after successful login
        }
      } else {
        toast.error('Invalid credentials')
      }
    } catch {
      toast.error('An error occurred during login')
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-full w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              TodoFy
            </h1>
            <p className="text-sm text-muted-foreground">
              Suas tarefas organizadas de forma simples
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="email"
              />
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="senha"
              />
            </div>
            <div>
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
