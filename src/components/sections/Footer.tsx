import { motion } from 'framer-motion'
import { FiHeart, FiCode } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          {/* Main Footer Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Engineer's Day 2025</h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Celebrating innovation, creativity, and technological excellence at the 
              ICT Department, Marwadi University. Join us in shaping the future of engineering.
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />

          {/* Credits */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-primary-foreground/80">
            <div className="flex items-center space-x-2">
            </div>
            <div className="hidden md:block w-1 h-1 bg-primary-foreground/40 rounded-full" />
            <div className="flex items-center space-x-2">
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 Competitive Programming Club ICT Department, Marwadi University. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer