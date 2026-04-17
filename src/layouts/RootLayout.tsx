import { Outlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster />
    </div>
  )
}
