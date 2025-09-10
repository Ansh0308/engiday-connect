"use client"

import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getClubById } from "@/data/clubsData"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Event } from "@/lib/supabase"
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiUsers, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi"

const ClubDetail = () => {
  const { clubId } = useParams<{ clubId: string }>()
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const club = clubId ? getClubById(clubId) : null

  useEffect(() => {
    if (club) {
      fetchEvents()
    }
  }, [club])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("club_name", club!.name)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Club Not Found</h1>
          <p className="text-muted-foreground mb-6">The club you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="flex items-center space-x-2">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    )
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return FiInstagram
      case "linkedin":
        return FiLinkedin
      case "github":
        return FiGithub
      default:
        return FiMail
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-muted/30 to-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 flex items-center space-x-2">
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div
                className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${club.color} flex items-center justify-center flex-shrink-0`}
              >
                <img
                  src={club.logo || "/placeholder.svg"}
                  alt={`${club.name} logo`}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{club.name}</h1>
                <p className="text-xl text-muted-foreground mb-6 max-w-2xl">{club.description}</p>
                {club.socialMedia && (
                  <div className="flex justify-center md:justify-start space-x-4">
                    {Object.entries(club.socialMedia).map(([platform, url]) => {
                      const Icon = getSocialIcon(platform)
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vision & Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="bg-gradient-card backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{club.vision}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{club.mission}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Core Committee */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-gradient-card backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Core Committee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={
                        club.committeePosterUrl || "/placeholder.svg?height=400&width=600&query=Core Committee Poster"
                      }
                      alt={`${club.name} Core Committee`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="bg-gradient-card backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Engineer's Day Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : events.length > 0 ? (
                    <div className="space-y-6">
                      {events.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          className="border border-border/50 rounded-lg p-6 bg-background/50"
                        >
                          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            {event.poster_url && (
                              <div className="w-full md:w-64 h-40 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={event.poster_url || "/placeholder.svg?height=160&width=256&query=Event Poster"}
                                  alt={event.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-foreground mb-2">{event.name}</h3>
                              <p className="text-muted-foreground mb-4">{event.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <FiMapPin className="w-4 h-4" />
                                  <span>{event.club_name}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <FiUsers className="w-4 h-4" />
                                  <span>
                                    {event.min_team_size === event.max_team_size
                                      ? `${event.min_team_size} member${event.min_team_size > 1 ? "s" : ""}`
                                      : `${event.min_team_size}-${event.max_team_size} members`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No events found for this club yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="bg-gradient-card backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-card-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {club.contacts.map((contact, index) => (
                      <div key={index} className="border-b border-border/30 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{contact.name}</h4>
                          <Badge variant="secondary">{contact.role}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <FiMail className="w-4 h-4" />
                            <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <FiPhone className="w-4 h-4" />
                            <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDetail
