import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Event, TeamMember } from '@/lib/supabase'
import { FiPlus, FiTrash2, FiUsers, FiMail } from 'react-icons/fi'

interface RegistrationModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

const RegistrationModal = ({ event, isOpen, onClose }: RegistrationModalProps) => {
  const [teamLeader, setTeamLeader] = useState({
    name: '',
    enrollment: '',
    email: '',
    department: 'ICT',
    program: '',
    semester: 1
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const isTeamEvent = event.max_team_size > 1
  const currentTeamSize = 1 + teamMembers.length

  const validateEmail = (email: string) => {
    return email.endsWith('@marwadiuniversity.ac.in')
  }

  const addTeamMember = () => {
    if (currentTeamSize < event.max_team_size) {
      setTeamMembers([...teamMembers, {
        name: '',
        enrollment: '',
        email: '',
        department: 'ICT',
        program: '',
        semester: 1,
        verified: false
      }])
    }
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], [field]: value }
    setTeamMembers(updated)
  }

  const validateForm = () => {
    // Validate team leader
    if (!teamLeader.name || !teamLeader.enrollment || !teamLeader.email || 
        !teamLeader.program) {
      toast({
        title: "Validation Error",
        description: "Please fill all team leader details.",
        variant: "destructive",
      })
      return false
    }

    if (!validateEmail(teamLeader.email)) {
      toast({
        title: "Invalid Email",
        description: "Email must end with @marwadiuniversity.ac.in",
        variant: "destructive",
      })
      return false
    }

    // Check team size requirements
    if (currentTeamSize < event.min_team_size) {
      toast({
        title: "Team Size Error",
        description: `Minimum team size is ${event.min_team_size} members.`,
        variant: "destructive",
      })
      return false
    }

    // Validate team members if any
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i]
      if (!member.name || !member.enrollment || !member.email || !member.program) {
        toast({
          title: "Validation Error",
          description: `Please fill all details for team member ${i + 1}.`,
          variant: "destructive",
        })
        return false
      }

      if (!validateEmail(member.email)) {
        toast({
          title: "Invalid Email",
          description: `Team member ${i + 1} email must end with @marwadiuniversity.ac.in`,
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Check if team leader is already registered for this event
      const { data: existingRegistration } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('team_leader_email', teamLeader.email)
        .single()

      if (existingRegistration) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create registration
      const registrationData = {
        event_id: event.id,
        team_leader_name: teamLeader.name,
        team_leader_enrollment: teamLeader.enrollment,
        team_leader_email: teamLeader.email,
        team_leader_department: teamLeader.department,
        team_leader_program: teamLeader.program,
        team_leader_semester: teamLeader.semester,
        team_members: teamMembers as any,
        verified: !isTeamEvent // Individual registrations are auto-verified
      }

      const { error } = await supabase
        .from('registrations')
        .insert([registrationData])

      if (error) throw error

      toast({
        title: "Registration Successful!",
        description: "Thank you for registering! Further details for Engineer's Day will be shared on your Marwadi University email.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Register for {event.name}
          </DialogTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="secondary">{event.club_name}</Badge>
            <Badge variant="outline">
              <FiUsers className="w-3 h-3 mr-1" />
              {event.min_team_size === event.max_team_size
                ? `${event.min_team_size} ${event.min_team_size === 1 ? 'member' : 'members'}`
                : `${event.min_team_size}-${event.max_team_size} members`}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Leader Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isTeamEvent ? 'Team Leader Details' : 'Your Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leader-name">Full Name *</Label>
                  <Input
                    id="leader-name"
                    value={teamLeader.name}
                    onChange={(e) => setTeamLeader({...teamLeader, name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="leader-enrollment">Enrollment Number *</Label>
                  <Input
                    id="leader-enrollment"
                    value={teamLeader.enrollment}
                    onChange={(e) => setTeamLeader({...teamLeader, enrollment: e.target.value})}
                    placeholder="Enter enrollment number"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="leader-email">College Email *</Label>
                <Input
                  id="leader-email"
                  type="email"
                  value={teamLeader.email}
                  onChange={(e) => setTeamLeader({...teamLeader, email: e.target.value})}
                  placeholder="Enter email ending with @marwadiuniversity.ac.in"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="leader-department">Department</Label>
                  <Input
                    id="leader-department"
                    value={teamLeader.department}
                    onChange={(e) => setTeamLeader({...teamLeader, department: e.target.value})}
                    placeholder="Department"
                  />
                </div>
                <div>
                  <Label htmlFor="leader-program">Program *</Label>
                  <Select
                    value={teamLeader.program}
                    onValueChange={(value) => setTeamLeader({...teamLeader, program: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                      <SelectItem value="BSc">BSc</SelectItem>
                      <SelectItem value="MSc">MSc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leader-semester">Semester *</Label>
                  <Select
                    value={teamLeader.semester.toString()}
                    onValueChange={(value) => setTeamLeader({...teamLeader, semester: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(8)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Section */}
          {isTeamEvent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {currentTeamSize}/{event.max_team_size} members
                    </Badge>
                    {currentTeamSize < event.max_team_size && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTeamMember}
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Member
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Team Member {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Enrollment Number"
                          value={member.enrollment}
                          onChange={(e) => updateTeamMember(index, 'enrollment', e.target.value)}
                        />
                      </div>

                      <Input
                        placeholder="Email (@marwadiuniversity.ac.in)"
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Department"
                          value={member.department}
                          onChange={(e) => updateTeamMember(index, 'department', e.target.value)}
                        />
                        <Select
                          value={member.program}
                          onValueChange={(value) => updateTeamMember(index, 'program', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Program" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="B.Tech">B.Tech</SelectItem>
                            <SelectItem value="M.Tech">M.Tech</SelectItem>
                            <SelectItem value="BCA">BCA</SelectItem>
                            <SelectItem value="MCA">MCA</SelectItem>
                            <SelectItem value="BSc">BSc</SelectItem>
                            <SelectItem value="MSc">MSc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={member.semester.toString()}
                          onValueChange={(value) => updateTeamMember(index, 'semester', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(8)].map((_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {teamMembers.length === 0 && isTeamEvent && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FiUsers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No team members added yet</p>
                    <p className="text-sm">Click "Add Member" to start building your team</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Email Verification Notice */}
          {isTeamEvent && teamMembers.length > 0 && (
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <FiMail className="w-5 h-5 text-accent-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium text-accent-foreground mb-1">Email Verification Required</h4>
                    <p className="text-sm text-accent-foreground/80">
                      All team members will receive verification emails. Registration will be complete only after all members verify their emails.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || currentTeamSize < event.min_team_size}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Registering...' : 'Register for Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RegistrationModal