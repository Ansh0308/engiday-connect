"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 mb-6 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {event.image_url && (
            <div className="h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
              <img
                src={event.image_url || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">Organized by {event.organizer}</p>
              </div>
            </div>
          )}

          {!event.image_url && (
            <div className="h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg opacity-90">Organized by {event.organizer}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>

              {event.requirements && (
                <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3">Requirements</h3>
                  <p className="text-amber-700 whitespace-pre-wrap">{event.requirements}</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Info Sidebar */}
          <div className="space-y-6">
            {/* Date & Time */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Date & Time
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Location
              </h3>
              <p className="text-gray-700">{event.location}</p>
            </div>

            {/* Capacity */}
            {event.capacity && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  Capacity
                </h3>
                <p className="text-gray-700">{event.capacity} participants</p>
              </div>
            )}

            {/* Registration */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration</h3>
              {event.registration_link ? (
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register Now
                </a>
              ) : (
                <p className="text-gray-500 text-center py-3">Registration details coming soon</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
