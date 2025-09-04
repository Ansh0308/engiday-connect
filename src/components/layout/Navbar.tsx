import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FiSettings, FiHome, FiCalendar, FiInfo, FiMail } from 'react-icons/fi'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '#events', label: 'Events', icon: FiCalendar },
    { href: '#about', label: 'About ICT', icon: FiInfo },
    { href: '#contact', label: 'Contact', icon: FiMail },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-card/90 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FiSettings className="text-primary-foreground text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Engineer's Day</h1>
              <p className="text-sm text-muted-foreground">ICT Department</p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href || 
                             (item.href.startsWith('#') && location.hash === item.href)
              
              return (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                  <Link to={item.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Admin Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/admin">
              <Button variant="outline">
                Admin Panel
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar