import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiUsers, FiCalendar, FiMapPin } from 'react-icons/fi'
import { Event } from '@/lib/supabase'

interface EventCardProps {
  event: Event
  onRegister: (event: Event) => void
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-card backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        {/* Event Poster */}
        {event.poster_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.poster_url}
              alt={event.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-card-foreground line-clamp-2">
                {event.name}
              </CardTitle>
              <Badge variant="secondary" className="w-fit">
                <FiMapPin className="w-3 h-3 mr-1" />
                {event.club_name}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-muted-foreground line-clamp-3">
            {event.description}
          </CardDescription>

          {/* Team Size Info */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <FiUsers className="w-4 h-4" />
            <span>
              {event.min_team_size === event.max_team_size
                ? `${event.min_team_size} ${event.min_team_size === 1 ? 'member' : 'members'}`
                : `${event.min_team_size}-${event.max_team_size} members`}
            </span>
          </div>

          {/* Register Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-2"
          >
            <Button
              onClick={() => onRegister(event)}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all duration-300"
            >
              <FiCalendar className="w-4 h-4 mr-2" />
              Register Now
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default EventCard