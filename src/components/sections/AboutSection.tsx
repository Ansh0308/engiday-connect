import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { FiCode, FiCpu, FiDatabase, FiWifi, FiMonitor, FiUsers } from 'react-icons/fi'

const AboutSection = () => {
  const clubs = [
    {
      name: 'Competitive Programming Club',
      description: 'Master algorithms, data structures, and problem-solving skills',
      icon: FiCode,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Circuitology Club',
      description: 'Explore hardware, circuits, and embedded systems',
      icon: FiCpu,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Data Science Club',
      description: 'Dive into AI, ML, and data analytics',
      icon: FiDatabase,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Network & Security Club',
      description: 'Learn cybersecurity and network technologies',
      icon: FiWifi,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Web Development Club',
      description: 'Build modern web applications and digital solutions',
      icon: FiMonitor,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Innovation Hub',
      description: 'Foster creativity and entrepreneurship in technology',
      icon: FiUsers,
      color: 'from-pink-500 to-pink-600'
    }
  ]

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
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About ICT Department
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-xl text-muted-foreground">
              The Information and Communication Technology Department at Marwadi University is a hub of 
              innovation, fostering technological excellence and creative problem-solving.
            </p>
            <p className="text-lg text-muted-foreground">
              Our vibrant community of clubs and organizations work together to celebrate Engineer's Day 
              with exciting competitions, workshops, and collaborative projects.
            </p>
          </div>
        </motion.div>

        {/* ICT Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {clubs.map((club, index) => {
            const Icon = club.icon
            return (
              <motion.div
                key={club.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {club.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {club.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
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
              { number: '500+', label: 'Students' },
              { number: '6+', label: 'Active Clubs' },
              { number: '50+', label: 'Faculty Members' },
              { number: '100+', label: 'Projects/Year' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection