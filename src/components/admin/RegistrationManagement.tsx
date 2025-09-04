import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useToast } from '@/hooks/use-toast'
import { Event, Registration } from '@/lib/supabase'
import { FiDownload, FiUsers, FiMail, FiSearch, FiFilter } from 'react-icons/fi'

interface RegistrationManagementProps {
  registrations: Registration[]
  events: Event[]
  onRegistrationsUpdate: () => void
}

const RegistrationManagement = ({ registrations, events, onRegistrationsUpdate }: RegistrationManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEvent, setFilterEvent] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const { toast } = useToast()

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = searchTerm === '' || 
      registration.team_leader_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.team_leader_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.team_leader_enrollment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEvent = filterEvent === 'all' || registration.event_id === filterEvent

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'verified' && registration.verified) ||
      (filterStatus === 'pending' && !registration.verified)

    return matchesSearch && matchesEvent && matchesStatus
  })

  // Group registrations by event
  const registrationsByEvent = events.map(event => ({
    event,
    registrations: filteredRegistrations.filter(reg => reg.event_id === event.id)
  })).filter(group => group.registrations.length > 0)

  const exportToExcel = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId)
      if (!event) return

      const eventRegistrations = registrations.filter(reg => reg.event_id === eventId)
      
      // Create CSV content
      const headers = [
        'Registration ID',
        'Team Leader Name',
        'Team Leader Enrollment',
        'Team Leader Email',
        'Team Leader Department',
        'Team Leader Program',
        'Team Leader Semester',
        'Team Members Count',
        'Team Members Details',
        'Verified',
        'Registration Date'
      ]

      const csvContent = [
        headers.join(','),
        ...eventRegistrations.map(reg => [
          reg.id,
          reg.team_leader_name,
          reg.team_leader_enrollment,
          reg.team_leader_email,
          reg.team_leader_department,
          reg.team_leader_program,
          reg.team_leader_semester,
          reg.team_members.length,
          reg.team_members.map(member => 
            `${member.name} (${member.enrollment}) - ${member.email}`
          ).join(' | '),
          reg.verified ? 'Yes' : 'No',
          new Date(reg.created_at).toLocaleDateString()
        ].map(field => `"${field}"`).join(','))
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${event.club_name} - ${event.name}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `Registrations for "${event.name}" have been exported.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export registrations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportAllEvents = async () => {
    try {
      // Create a comprehensive CSV with all registrations
      const headers = [
        'Event Name',
        'Club Name',
        'Registration ID',
        'Team Leader Name',
        'Team Leader Enrollment',
        'Team Leader Email',
        'Team Leader Department',
        'Team Leader Program',
        'Team Leader Semester',
        'Team Members Count',
        'Team Members Details',
        'Verified',
        'Registration Date'
      ]

      const csvContent = [
        headers.join(','),
        ...registrations.map(reg => {
          const event = events.find(e => e.id === reg.event_id)
          return [
            event?.name || 'Unknown Event',
            event?.club_name || 'Unknown Club',
            reg.id,
            reg.team_leader_name,
            reg.team_leader_enrollment,
            reg.team_leader_email,
            reg.team_leader_department,
            reg.team_leader_program,
            reg.team_leader_semester,
            reg.team_members.length,
            reg.team_members.map(member => 
              `${member.name} (${member.enrollment}) - ${member.email}`
            ).join(' | '),
            reg.verified ? 'Yes' : 'No',
            new Date(reg.created_at).toLocaleDateString()
          ].map(field => `"${field}"`).join(',')
        })
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Engineer's Day - All Registrations.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "All registrations have been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export registrations. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Registration Management</h2>
          <p className="text-muted-foreground">View and export event registrations</p>
        </div>
        <Button
          onClick={exportAllEvents}
          className="bg-gradient-secondary hover:opacity-90"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Export All Registrations
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or enrollment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Event</label>
              <Select value={filterEvent} onValueChange={setFilterEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {filteredRegistrations.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Registrations
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {filteredRegistrations.filter(r => r.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Verified
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {filteredRegistrations.filter(r => !r.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Pending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations by Event */}
      {registrationsByEvent.length > 0 ? (
        <Accordion type="multiple" className="space-y-4">
          {registrationsByEvent.map(({ event, registrations: eventRegs }) => (
            <AccordionItem key={event.id} value={event.id}>
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full text-left">
                    <div>
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">{event.club_name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        {eventRegs.length} registrations
                      </Badge>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          exportToExcel(event.id)
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <FiDownload className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-4 space-y-4">
                    {eventRegs.map((registration, index) => (
                      <motion.div
                        key={registration.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  {registration.team_leader_name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {registration.team_leader_enrollment} • {registration.team_leader_email}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={registration.verified ? "default" : "secondary"}>
                                  {registration.verified ? "Verified" : "Pending"}
                                </Badge>
                                {registration.team_members.length > 0 && (
                                  <Badge variant="outline">
                                    <FiUsers className="w-3 h-3 mr-1" />
                                    Team of {registration.team_members.length + 1}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                              <div>Program: {registration.team_leader_program}</div>
                              <div>Semester: {registration.team_leader_semester}</div>
                              <div>Department: {registration.team_leader_department}</div>
                            </div>

                            {registration.team_members.length > 0 && (
                              <div className="border-t pt-3">
                                <h5 className="font-medium text-foreground mb-2">Team Members:</h5>
                                <div className="space-y-2">
                                  {registration.team_members.map((member, idx) => (
                                    <div key={idx} className="text-sm text-muted-foreground">
                                      <span className="font-medium">{member.name}</span> • 
                                      {member.enrollment} • {member.email} • 
                                      {member.program} Sem {member.semester}
                                      <Badge 
                                        variant={member.verified ? "default" : "secondary"}
                                        className="ml-2 text-xs"
                                      >
                                        {member.verified ? "Verified" : "Pending"}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                              Registered on {new Date(registration.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FiUsers className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No Registrations Found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterEvent !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Registrations will appear here once students start registering for events.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RegistrationManagement