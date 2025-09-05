import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Event {
  id: string
  name: string
  club_name: string
  description: string
  poster_url?: string
  min_team_size: number
  max_team_size: number
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  event_id: string
  team_leader_name: string
  team_leader_enrollment: string
  team_leader_email: string
  team_leader_department: string
  team_leader_program: string
  team_leader_semester: number
  team_members: TeamMember[]
  verified: boolean
  created_at: string
}

export interface TeamMember {
  name: string
  enrollment: string
  email: string
  department: string
  program: string
  semester: number
  verified: boolean
}

export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at: string
}