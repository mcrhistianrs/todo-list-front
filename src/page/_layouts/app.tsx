import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <span className="font-semibold">DashBoard</span>
        </div>
        <footer className="text-sm">
          TodoFy - {new Date().getFullYear()}
        </footer>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
