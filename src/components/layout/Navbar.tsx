"use client"

import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FiSettings, FiHome, FiCalendar, FiInfo, FiMail } from "react-icons/fi"

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { href: "/", label: "Home", icon: FiHome, type: "link" },
    { href: "#events", label: "Events", icon: FiCalendar, type: "scroll" },
    { href: "#about", label: "About ICT", icon: FiInfo, type: "scroll" },
    { href: "#contact", label: "Contact", icon: FiMail, type: "scroll" },
  ]

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-card/90 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <motion.div className="flex items-center space-x-4" whileHover={{ scale: 1.05 }}>
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FiSettings className="text-primary-foreground text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Engineer's Day</h1>
              <p className="text-sm text-muted-foreground">ICT Department</p>
            </div>
          </motion.div>

          {/* Developer Credits - Hidden on small screens */}
          <motion.div 
            className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-card/50 rounded-lg border border-border/50"
            whileHover={{ scale: 1.02 }}
          >
            <img src="/images/CPclub.png" alt="CP Club" className="w-8 h-8 rounded-full" />
            <div className="text-xs">
              <p className="text-muted-foreground font-medium">Developed by</p>
              <p className="text-foreground font-semibold">Competitive Programming Club</p>
            </div>
            <div className="h-8 w-px bg-border mx-2" />
            <div className="text-xs space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-foreground font-medium">KAUSHAL PARMAR</span>
                <span className="text-muted-foreground">Convener</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-foreground font-medium">PAYAL MAKWANA</span>
                <span className="text-muted-foreground">Dy. Convener</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-foreground font-medium">ANSH RAYTHATHA</span>
                <span className="text-muted-foreground">General Secretary</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.href || (item.href.startsWith("#") && location.hash === item.href)

              return (
                <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                  {item.type === "link" ? (
                    <Link to={item.href}>
                      <Button variant={isActive ? "default" : "ghost"} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="flex items-center space-x-2"
                      onClick={() => handleSmoothScroll(item.href.substring(1))}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Mobile Menu Button - Hidden on Desktop */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <FiSettings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
