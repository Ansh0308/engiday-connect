import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

const ProtectedRoute = ({ children, redirectTo = '/admin' }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('admin_logged_in')
      const isValid = isLoggedIn === 'true'
      
      setIsAuthenticated(isValid)
      
      if (!isValid) {
        navigate(redirectTo, { replace: true })
      }
    }

    checkAuth()

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_logged_in') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [navigate, redirectTo])

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null
}

export default ProtectedRoute