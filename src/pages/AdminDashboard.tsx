import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Event = Database['public']['Tables']['events']['Row']
type RegistrationRow = Database['public']['Tables']['registrations']['Row']

interface TeamMember {
  name: string
  enrollment: string
  email: string
  department: string
  program: string
  semester: number
  verified: boolean
}

interface Registration extends Omit<RegistrationRow, 'team_members'> {
  team_members: TeamMember[]
}
import EventManagement from '@/components/admin/EventManagement'
import RegistrationManagement from '@/components/admin/RegistrationManagement'
import { ExcelUpload } from '@/components/admin/ExcelUpload'
import { FiLogOut, FiCalendar, FiUsers, FiTrendingUp, FiSettings } from 'react-icons/fi'

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      navigate('/admin')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [eventsResponse, registrationsResponse] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('registrations').select('*').order('created_at', { ascending: false })
      ])

      if (eventsResponse.error) throw eventsResponse.error
      if (registrationsResponse.error) throw registrationsResponse.error

      setEvents(eventsResponse.data || [])
      // Transform team_members from JSON to TeamMember[]
      const transformedRegistrations = (registrationsResponse.data || []).map(reg => ({
        ...reg,
        team_members: Array.isArray(reg.team_members) 
          ? (reg.team_members as unknown as TeamMember[]) 
          : []
      }))
      setRegistrations(transformedRegistrations)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    navigate('/admin')
  }

  const stats = {
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    verifiedRegistrations: registrations.filter(r => r.verified).length,
    pendingVerifications: registrations.filter(r => !r.verified).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Engineer's Day Registration Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                View Portal
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: 'Total Events',
              value: stats.totalEvents,
              icon: FiCalendar,
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: 'Total Registrations',
              value: stats.totalRegistrations,
              icon: FiUsers,
              color: 'from-green-500 to-green-600'
            },
            {
              title: 'Verified',
              value: stats.verifiedRegistrations,
              icon: FiTrendingUp,
              color: 'from-purple-500 to-purple-600'
            },
            {
              title: 'Pending',
              value: stats.pendingVerifications,
              icon: FiSettings,
              color: 'from-orange-500 to-orange-600'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students" className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4" />
                <span>Student Data</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>Event Management</span>
              </TabsTrigger>
              <TabsTrigger value="registrations" className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4" />
                <span>Registration Management</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="students">
            <ExcelUpload onUploadComplete={fetchData} />
          </TabsContent>
          
          <TabsContent value="events">
            <EventManagement 
              events={events} 
              onEventsUpdate={fetchData}
            />
          </TabsContent>

            <TabsContent value="registrations">
              <RegistrationManagement 
                registrations={registrations}
                events={events}
                onRegistrationsUpdate={fetchData}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard