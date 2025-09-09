"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FiUsers, FiCalendar, FiMapPin, FiInfo, FiArrowLeft } from "react-icons/fi"
import { useState } from "react"
import type { Event } from "@/lib/supabase"

interface EventFlipCardProps {
  event: Event
  onRegister: (event: Event) => void
}

export default function EventFlipCard({ event, onRegister }: EventFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const teamSizeDisplay =
    event.min_team_size === event.max_team_size
      ? `${event.min_team_size} ${event.min_team_size === 1 ? "member" : "members"}`
      : `${event.min_team_size}-${event.max_team_size} members`

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flip-card-container"
    >
      <div className="flip-card">
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          {/* Front Side */}
          <div
            className="flip-card-front"
            style={{
              backgroundImage: `url(${event.poster_url || "/event-poster.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>

            <div className="relative z-10 mt-auto p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
              <div>
                <h3 className="font-bold text-xl mb-2 text-white line-clamp-2">{event.name}</h3>
                <div className="mb-3">
                  <Badge variant="secondary" className="w-fit bg-white/90 text-gray-800">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    {event.club_name}
                  </Badge>
                </div>
                <div className="flex items-center text-white/90 text-sm mb-4">
                  <FiUsers className="w-4 h-4 mr-1" />
                  <span>{teamSizeDisplay}</span>
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setIsFlipped(true)}
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <FiInfo className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="flip-card-back">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-white">Event Description</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFlipped(false)}
                  className="text-white hover:bg-white/20"
                >
                  <FiArrowLeft className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <p className="text-white text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="register-button-container">
        <Button onClick={() => onRegister(event)} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <FiCalendar className="w-4 h-4 mr-2" />
          Register Now
        </Button>
      </div>

      <style>{`
        .flip-card-container {
          width: 350px;
          height: 520px;
          position: relative;
          font-family: inherit;
          transform-origin: center center;
        }

        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 470px;
          perspective: 1000px;
          transform-origin: center center;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          transform-origin: center center;
        }

        .flip-card-inner.flipped {
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
          position: relative;
        }

        .flip-card-back {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          transform: rotateY(180deg);
        }

        .register-button-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 0 0 0.75rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-top: none;
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
