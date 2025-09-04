import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase, Event } from '@/lib/supabase'
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiCalendar } from 'react-icons/fi'

interface EventManagementProps {
  events: Event[]
  onEventsUpdate: () => void
}

const EventManagement = ({ events, onEventsUpdate }: EventManagementProps) => {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    club_name: '',
    description: '',
    poster_url: '',
    min_team_size: 1,
    max_team_size: 1
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: '',
      club_name: '',
      description: '',
      poster_url: '',
      min_team_size: 1,
      max_team_size: 1
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const openEditForm = (event: Event) => {
    setFormData({
      name: event.name,
      club_name: event.club_name,
      description: event.description,
      poster_url: event.poster_url || '',
      min_team_size: event.min_team_size,
      max_team_size: event.max_team_size
    })
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id)

        if (error) throw error

        toast({
          title: "Event Updated",
          description: "Event has been successfully updated.",
        })
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([formData])

        if (error) throw error

        toast({
          title: "Event Created",
          description: "New event has been successfully created.",
        })
      }

      resetForm()
      onEventsUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted.",
      })

      onEventsUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Management</h2>
          <p className="text-muted-foreground">Create and manage Engineer's Day events</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full">
                {event.poster_url && (
                  <div className="h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={event.poster_url}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {event.name}
                      </CardTitle>
                      <Badge variant="secondary">
                        {event.club_name}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(event)}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FiUsers className="w-4 h-4" />
                    <span>
                      {event.min_team_size === event.max_team_size
                        ? `${event.min_team_size} ${event.min_team_size === 1 ? 'member' : 'members'}`
                        : `${event.min_team_size}-${event.max_team_size} members`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FiCalendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Events Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first event to get started
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      <Dialog open={showForm} onOpenChange={resetForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="club_name">Hosting Club *</Label>
                <Input
                  id="club_name"
                  value={formData.club_name}
                  onChange={(e) => setFormData({...formData, club_name: e.target.value})}
                  placeholder="Enter club name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Event Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter event description"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="poster_url">Event Poster URL</Label>
              <Input
                id="poster_url"
                value={formData.poster_url}
                onChange={(e) => setFormData({...formData, poster_url: e.target.value})}
                placeholder="Enter poster image URL"
                type="url"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_team_size">Minimum Team Size *</Label>
                <Input
                  id="min_team_size"
                  type="number"
                  min="1"
                  value={formData.min_team_size}
                  onChange={(e) => setFormData({...formData, min_team_size: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_team_size">Maximum Team Size *</Label>
                <Input
                  id="max_team_size"
                  type="number"
                  min="1"
                  value={formData.max_team_size}
                  onChange={(e) => setFormData({...formData, max_team_size: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventManagement