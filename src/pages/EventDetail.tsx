"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/integrations/supabase/types"

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

        if (error) throw error
        setEvent(data)
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 mb-8 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Event Content */}
        <div className="space-y-8">
          {/* Event Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-xl text-gray-600">Organized by {event.organizer}</p>
          </div>

          {/* Event Image */}
          {event.image_url && (
            <div className="w-full max-w-2xl mx-auto">
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Event Details</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </div>

            {/* Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
                <p className="text-gray-700">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-700">{event.time}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-700">{event.location}</p>
              </div>

              {event.capacity && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Capacity</h3>
                  <p className="text-gray-700">{event.capacity} participants</p>
                </div>
              )}

              {event.registration_link && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Registration</h3>
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Register Now
                  </a>
                </div>
              )}
            </div>

            {/* Requirements */}
            {event.requirements && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.requirements}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
