import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/integrations/supabase/client'
import { Event } from '@/lib/supabase'
import EventCard from './EventCard'
import RegistrationModal from './RegistrationModal'
import { useToast } from '@/hooks/use-toast'

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = (event: Event) => {
    setSelectedEvent(event)
  }

  const closeModal = () => {
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <section id="events" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Loading Events...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="events" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exciting Events & Competitions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our ICT clubs in celebrating Engineer's Day with innovative competitions and events
            </p>
          </motion.div>

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} onRegister={handleRegister} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
                No Events Available
              </h3>
              <p className="text-muted-foreground">
                Events will be announced soon. Stay tuned!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={closeModal}
        />
      )}
    </>
  )
}

export default EventsSection