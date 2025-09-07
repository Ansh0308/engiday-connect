"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FiUsers, FiCalendar, FiMapPin } from "react-icons/fi"
import type { Event } from "@/lib/supabase"

interface EventFlipCardProps {
  event: Event
  onRegister: (event: Event) => void
}

export default function EventFlipCard({ event, onRegister }: EventFlipCardProps) {
  const teamSizeDisplay =
    event.min_team_size === event.max_team_size
      ? `${event.min_team_size} ${event.min_team_size === 1 ? "member" : "members"}`
      : `${event.min_team_size}-${event.max_team_size} members`

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flip-card"
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="event-poster">
            <img
              src={event.poster_url || "/placeholder.svg?height=128&width=300&query=event poster"}
              alt={event.name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{event.name}</h3>
              <div className="mb-3">
                <Badge variant="secondary" className="w-fit">
                  <FiMapPin className="w-3 h-3 mr-1" />
                  {event.club_name}
                </Badge>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <FiUsers className="w-4 h-4 mr-1" />
                <span>{teamSizeDisplay}</span>
              </div>
            </div>
            <Button onClick={() => onRegister(event)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <FiCalendar className="w-4 h-4 mr-2" />
              Register Now
            </Button>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="p-4 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-3 text-white">Event Description</h3>
            <div className="flex-1 overflow-y-auto">
              <p className="text-white text-sm leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-card {
          background-color: transparent;
          width: 300px;
          height: 400px;
          perspective: 1000px;
          font-family: inherit;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
          position: absolute;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .flip-card-front {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }

        .flip-card-back {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          transform: rotateY(180deg);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  )
}
