import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import type { Event } from '@/lib/supabase'

interface GRRegistrationModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

interface StudentDetails {
  gr_number: string
  name: string
  email: string
  class: string
  semester: number
}

interface TeamMember {
  grNumber: string
  studentDetails: StudentDetails | null
  otpSent: boolean
  otpVerified: boolean
  otp: string
}

export function GRRegistrationModal({ event, isOpen, onClose }: GRRegistrationModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<'gr-input' | 'otp-verification' | 'success'>('gr-input')
  const [teamLeader, setTeamLeader] = useState<TeamMember>({
    grNumber: '',
    studentDetails: null,
    otpSent: false,
    otpVerified: false,
    otp: ''
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationId, setRegistrationId] = useState<string>('')

  const addTeamMember = () => {
    if (teamMembers.length < event.max_team_size - 1) {
      setTeamMembers([...teamMembers, {
        grNumber: '',
        studentDetails: null,
        otpSent: false,
        otpVerified: false,
        otp: ''
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

  const fetchStudentDetails = async (grNumber: string): Promise<StudentDetails | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('gr_number', grNumber)
        .single()

      if (error || !data) {
        toast({
          title: "Student Not Found",
          description: `No student found with GR Number: ${grNumber}`,
          variant: "destructive",
        })
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching student:', error)
      return null
    }
  }

  const checkExistingRegistration = async (grNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .or(`team_leader_gr.eq.${grNumber},team_member_grs.cs.{${grNumber}}`)
        .eq('registration_status', 'confirmed')

      if (error) {
        console.error('Error checking existing registration:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Error checking existing registration:', error)
      return false
    }
  }

  const handleGRSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Validate team size
      const totalMembers = 1 + teamMembers.filter(m => m.grNumber.trim()).length
      if (totalMembers < event.min_team_size || totalMembers > event.max_team_size) {
        toast({
          title: "Invalid Team Size",
          description: `Team must have between ${event.min_team_size} and ${event.max_team_size} members`,
          variant: "destructive",
        })
        return
      }

      // Check if team leader GR is provided
      if (!teamLeader.grNumber.trim()) {
        toast({
          title: "GR Number Required",
          description: "Please enter the team leader's GR number",
          variant: "destructive",
        })
        return
      }

      // Check for existing registrations
      const allGRNumbers = [teamLeader.grNumber, ...teamMembers.map(m => m.grNumber)].filter(gr => gr.trim())
      
      for (const grNumber of allGRNumbers) {
        const hasExistingRegistration = await checkExistingRegistration(grNumber)
        if (hasExistingRegistration) {
          toast({
            title: "Already Registered",
            description: `Student with GR ${grNumber} has already registered for an event`,
            variant: "destructive",
          })
          return
        }
      }

      // Fetch student details for team leader
      const leaderDetails = await fetchStudentDetails(teamLeader.grNumber)
      if (!leaderDetails) return

      setTeamLeader(prev => ({ ...prev, studentDetails: leaderDetails }))

      // Fetch student details for team members
      const membersWithDetails = []
      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i]
        if (member.grNumber.trim()) {
          const details = await fetchStudentDetails(member.grNumber)
          if (!details) return
          membersWithDetails.push({ ...member, studentDetails: details })
        }
      }
      setTeamMembers(membersWithDetails)

      // Create registration record
      const memberGRs = membersWithDetails.map(m => m.grNumber)
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          team_leader_gr: teamLeader.grNumber,
          team_member_grs: memberGRs,
          team_leader_name: leaderDetails.name,
          team_leader_enrollment: teamLeader.grNumber,
          team_leader_email: leaderDetails.email,
          team_leader_department: leaderDetails.class,
          team_leader_program: 'Engineering',
          team_leader_semester: leaderDetails.semester,
          team_members: membersWithDetails.map(m => ({
            name: m.studentDetails?.name || '',
            enrollment: m.grNumber,
            email: m.studentDetails?.email || '',
            department: m.studentDetails?.class || '',
            program: 'Engineering',
            semester: m.studentDetails?.semester || 1,
            verified: false
          })),
          registration_status: 'pending'
        })
        .select()
        .single()

      if (regError) {
        console.error('Registration error:', regError)
        toast({
          title: "Registration Failed",
          description: "Failed to create registration",
          variant: "destructive",
        })
        return
      }

      setRegistrationId(registration.id)

      // Send OTPs to all team members
      const otpPromises = allGRNumbers.map(grNumber => 
        supabase.functions.invoke('send-otp', {
          body: { grNumber, registrationId: registration.id }
        })
      )

      await Promise.all(otpPromises)

      // Mark OTPs as sent
      setTeamLeader(prev => ({ ...prev, otpSent: true }))
      setTeamMembers(prev => prev.map(m => ({ ...m, otpSent: true })))

      toast({
        title: "OTPs Sent",
        description: "Verification codes have been sent to all team members' email addresses",
      })

      setStep('otp-verification')
    } catch (error) {
      console.error('Error in GR submission:', error)
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyOTP = async (grNumber: string, otp: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { grNumber, registrationId, otpCode: otp }
      })

      if (error || !data.success) {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is invalid or expired",
          variant: "destructive",
        })
        return false
      }

      return data.isRegistrationComplete
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast({
        title: "Verification Failed",
        description: "Failed to verify OTP",
        variant: "destructive",
      })
      return false
    }
  }

  const handleOTPVerification = async () => {
    try {
      // Verify team leader OTP
      if (!teamLeader.otpVerified && teamLeader.otp) {
        const isComplete = await verifyOTP(teamLeader.grNumber, teamLeader.otp)
        setTeamLeader(prev => ({ ...prev, otpVerified: true }))
        
        if (isComplete) {
          setStep('success')
          return
        }
      }

      // Verify team members OTPs
      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i]
        if (!member.otpVerified && member.otp) {
          const isComplete = await verifyOTP(member.grNumber, member.otp)
          updateTeamMember(i, 'otpVerified', true)
          
          if (isComplete) {
            setStep('success')
            return
          }
        }
      }

      toast({
        title: "Verification in Progress",
        description: "Please ensure all team members verify their OTPs",
      })
    } catch (error) {
      console.error('Error in OTP verification:', error)
    }
  }

  const resetModal = () => {
    setStep('gr-input')
    setTeamLeader({
      grNumber: '',
      studentDetails: null,
      otpSent: false,
      otpVerified: false,
      otp: ''
    })
    setTeamMembers([])
    setRegistrationId('')
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {event.name}</DialogTitle>
          <DialogDescription>
            {step === 'gr-input' && 'Enter GR numbers to register for this event'}
            {step === 'otp-verification' && 'Verify OTPs sent to registered email addresses'}
            {step === 'success' && 'Registration completed successfully'}
          </DialogDescription>
        </DialogHeader>

        {step === 'gr-input' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Leader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="leader-gr">GR Number</Label>
                  <Input
                    id="leader-gr"
                    value={teamLeader.grNumber}
                    onChange={(e) => setTeamLeader(prev => ({ ...prev, grNumber: e.target.value }))}
                    placeholder="Enter GR number"
                  />
                </div>
                {teamLeader.studentDetails && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Name:</strong> {teamLeader.studentDetails.name}</p>
                    <p><strong>Email:</strong> {teamLeader.studentDetails.email}</p>
                    <p><strong>Class:</strong> {teamLeader.studentDetails.class}</p>
                    <p><strong>Semester:</strong> {teamLeader.studentDetails.semester}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {event.max_team_size > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="border p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Label>Member {index + 1} GR Number</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        value={member.grNumber}
                        onChange={(e) => updateTeamMember(index, 'grNumber', e.target.value)}
                        placeholder="Enter GR number"
                      />
                      {member.studentDetails && (
                        <div className="bg-gray-50 p-3 rounded-lg mt-2">
                          <p><strong>Name:</strong> {member.studentDetails.name}</p>
                          <p><strong>Email:</strong> {member.studentDetails.email}</p>
                          <p><strong>Class:</strong> {member.studentDetails.class}</p>
                          <p><strong>Semester:</strong> {member.studentDetails.semester}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {teamMembers.length < event.max_team_size - 1 && (
                    <Button type="button" variant="outline" onClick={addTeamMember}>
                      Add Team Member
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleGRSubmit} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Send OTP for Verification'}
            </Button>
          </div>
        )}

        {step === 'otp-verification' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Leader OTP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {teamLeader.studentDetails?.name}</p>
                  <p><strong>Email:</strong> {teamLeader.studentDetails?.email}</p>
                  <Label htmlFor="leader-otp">Enter OTP</Label>
                  <Input
                    id="leader-otp"
                    value={teamLeader.otp}
                    onChange={(e) => setTeamLeader(prev => ({ ...prev, otp: e.target.value }))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    disabled={teamLeader.otpVerified}
                  />
                  {teamLeader.otpVerified && (
                    <p className="text-green-600">✓ Verified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Member {index + 1} OTP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {member.studentDetails?.name}</p>
                    <p><strong>Email:</strong> {member.studentDetails?.email}</p>
                    <Label htmlFor={`member-otp-${index}`}>Enter OTP</Label>
                    <Input
                      id={`member-otp-${index}`}
                      value={member.otp}
                      onChange={(e) => updateTeamMember(index, 'otp', e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      disabled={member.otpVerified}
                    />
                    {member.otpVerified && (
                      <p className="text-green-600">✓ Verified</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={handleOTPVerification} className="w-full">
              Verify OTPs
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-6xl">✓</div>
            <h3 className="text-2xl font-bold">Registration Confirmed!</h3>
            <p className="text-gray-600">
              Your registration for Engineer's Day has been confirmed. 
              Further details will be sent to your Marwadi University email.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}