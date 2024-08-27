import { NotebookIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="grid-cols-2 grid min-h-screen antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <NotebookIcon className="h-5 w-5" />
          <span className="font-semibold">TodoFy</span>
        </div>
        <footer className="text-sm">
         TodoFy - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
      </div>
    </div>
  )
}
