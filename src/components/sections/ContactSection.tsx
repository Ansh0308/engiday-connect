"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FiMapPin, FiGlobe } from "react-icons/fi"

const ContactSection = () => {
  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Address",
      content: "ICT Department, Marwadi University, Rajkot, Gujarat, India",
      link: "https://maps.google.com/?q=Marwadi+University+Rajkot",
    },
    {
      icon: FiGlobe,
      title: "Website",
      content: "www.marwadiuniversity.ac.in",
      link: "https://www.marwadiuniversity.ac.in",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about Engineer's Day events? Need more information? Contact the ICT Department at Marwadi
            University.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {contactInfo.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <a
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm break-words">{item.content}</p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* University Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-card backdrop-blur-sm border border-border/50">
            <CardContent className="p-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-card-foreground">Marwadi University</h3>
                <p className="text-muted-foreground">
                  A leading educational institution committed to excellence in engineering, technology, and innovation.
                  Join us in celebrating the spirit of engineering and technological advancement.
                </p>
                <div className="flex justify-center space-x-4 pt-4">
                  <motion.a
                    href="https://www.marwadiuniversity.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <FiGlobe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </motion.a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection
