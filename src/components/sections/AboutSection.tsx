"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { clubsData } from "@/data/clubsData"

const AboutSection = () => {
  const navigate = useNavigate()

  const handleClubClick = (clubId: string) => {
    navigate(`/clubs/${clubId}`)
  }

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About ICT Department</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl text-muted-foreground">
              The Information and Communication Technology Department at Marwadi University is a hub of innovation,
              fostering technological excellence and creative problem-solving.
            </p>
            <p className="text-lg text-muted-foreground">
              Our vibrant community of clubs and organizations work together to celebrate Engineer's Day with exciting
              competitions, workshops, and collaborative projects.
            </p>
          </div>
        </motion.div>

        {/* ICT Clubs Grid */}
        <div className="grid grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {clubsData.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClubClick(club.id)}
              className="cursor-pointer"
            >
              <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center mb-4`}
                  >
                    <img
                      src={club.logo || "/placeholder.svg"}
                      alt={`${club.name} logo`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-muted-foreground">{club.description}</p>
                  <div className="text-xs text-primary/60 font-medium">Click to learn more →</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Department Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Students" },
              { number: "4", label: "Active Clubs" }, // Updated from 6+ to 4+ to reflect removed clubs
              { number: "20+", label: "Faculty Members" },
              { number: "50+", label: "Projects/Year" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
