"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FiUsers, FiCalendar, FiMapPin, FiArrowLeft, FiClock } from "react-icons/fi"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/lib/supabase"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return

      try {
        const { data, error } = await supabase.from("events").select("*").eq("id", params.id).single()

        if (error) {
          console.error("Error fetching event:", error)
          return
        }

        setEvent(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const handleRegister = (event: Event) => {
    // Navigate to registration page or handle registration logic
    console.log("Register for event:", event.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <Button onClick={() => router.back()} variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const teamSizeDisplay =
    event.min_team_size === event.max_team_size
      ? `${event.min_team_size} ${event.min_team_size === 1 ? "member" : "members"}`
      : `${event.min_team_size}-${event.max_team_size} members`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button onClick={() => router.back()} variant="ghost" className="mb-2 hover:bg-gray-100">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Event Poster */}
          <div className="relative h-80 md:h-96">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${event.poster_url || "/event-poster.png"})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Event Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              >
                {event.name}
              </motion.h1>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Badge variant="secondary" className="bg-white/90 text-gray-800 text-sm">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {event.club_name}
                </Badge>
              </motion.div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6 md:p-8">
            {/* Event Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Team Size</p>
                <p className="font-semibold text-gray-800">{teamSizeDisplay}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <FiCalendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-semibold text-gray-800">{new Date(event.created_at).toLocaleDateString()}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <FiClock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-800">{new Date(event.updated_at).toLocaleDateString()}</p>
              </div>
            </motion.div>

            {/* Event Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {event.description || "No description available for this event."}
                </p>
              </div>
            </motion.div>

            {/* Registration Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => handleRegister(event)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <FiCalendar className="w-5 h-5 mr-2" />
                Register for Event
              </Button>

              <Button onClick={() => router.back()} variant="outline" size="lg" className="px-8 py-3 text-lg">
                Back to Events
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
