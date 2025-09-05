export interface ClubContact {
    name: string
    role: "Convener" | "Dy. Convener" | "Faculty"
    email: string
    phone: string
  }
  
  export interface ClubEvent {
    id: string
    name: string
    description: string
    date: string
    time: string
    venue: string
    maxTeamSize: number
    minTeamSize: number
    posterUrl?: string
  }
  
  export interface Club {
    id: string
    name: string
    shortName: string
    description: string
    logo: string
    color: string
    vision: string
    mission: string
    committeePosterUrl: string
    events: ClubEvent[]
    contacts: ClubContact[]
    socialMedia?: {
      instagram?: string
      linkedin?: string
      github?: string
    }
  }
  
  export const clubsData: Club[] = [
    {
      id: "competitive-programming",
      name: "Competitive Programming Club",
      shortName: "CP Club",
      description: "Master algorithms, data structures, and problem-solving skills",
      logo: "/images/CPclub.png",
      color: "from-blue-500 to-blue-600",
      vision:
        "To foster a culture of algorithmic thinking and competitive programming excellence among students, preparing them for global coding competitions and technical interviews.",
      mission:
        "We aim to develop problem-solving skills, enhance logical thinking, and create a community of passionate programmers who can tackle complex computational challenges with confidence and creativity.",
      committeePosterUrl: "/images/committees/cp-committee.jpeg",
      events: [
        {
          id: "cp-contest-1",
          name: "Algorithm Arena",
          description: "A competitive programming contest featuring algorithmic challenges and data structure problems",
          date: "2024-09-15",
          time: "10:00 AM - 1:00 PM",
          venue: "MA 115",
          maxTeamSize: 2,
          minTeamSize: 1,
          posterUrl: "/images/events/algorithm-arena.jpg",
        },
        {
          id: "cp-workshop-1",
          name: "Dynamic Programming Workshop",
          description: "Hands-on workshop covering advanced dynamic programming techniques and optimization strategies",
          date: "2024-09-15",
          time: "2:00 PM - 4:00 PM",
          venue: "Seminar Hall A",
          maxTeamSize: 1,
          minTeamSize: 1,
          posterUrl: "/images/events/dp-workshop.jpg",
        },
      ],
      contacts: [
        {
          name: "Kaushal Parmar",
          role: "Convener",
          email: "kaushalparmar120809@marwadiuniversity.ac.in",
          phone: "+91 98765 43210",
        },
        {
          name: "Payal Makwana",
          role: "Dy. Convener",
          email: "payalmakwana.122820@marwadiuniversity.ac.in",
          phone: "+91 98765 43211",
        },
        {
          name: "Prof. Nishith Kotak",
          role: "Faculty",
          email: "Nishith.kotak@marwadiuniversity.ac.in",
          phone: "+91 98765 43212",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/mu_cpclub",
        linkedin: "https://linkedin.com/company/mu-cp-club",
        github: "https://github.com/mu-cp-club",
      },
    },
    {
      id: "circuitology",
      name: "Circuitology Club",
      shortName: "Circuitology",
      description: "Explore hardware, circuits, and embedded systems",
      logo: "/images/circuitologyclub.png",
      color: "from-green-500 to-green-600",
      vision:
        "To inspire innovation in electronics and embedded systems, bridging the gap between theoretical knowledge and practical implementation in the world of circuits and hardware.",
      mission:
        "We strive to provide hands-on experience with electronic circuits, microcontrollers, and IoT devices, empowering students to design and build cutting-edge hardware solutions for real-world problems.",
      committeePosterUrl: "/images/committees/circuitology-committee.jpg",
      events: [
        {
          id: "circuit-design-1",
          name: "Circuit Design Challenge",
          description: "Design and build innovative electronic circuits to solve real-world problems",
          date: "2024-09-15",
          time: "9:00 AM - 12:00 PM",
          venue: "Electronics Lab",
          maxTeamSize: 3,
          minTeamSize: 2,
          posterUrl: "/images/events/circuit-design.jpg",
        },
        {
          id: "iot-workshop-1",
          name: "IoT Innovation Workshop",
          description: "Learn to build IoT devices and connect them to cloud platforms",
          date: "2024-09-15",
          time: "1:00 PM - 4:00 PM",
          venue: "IoT Lab",
          maxTeamSize: 2,
          minTeamSize: 1,
          posterUrl: "/images/events/iot-workshop.jpg",
        },
      ],
      contacts: [
        {
          name: "Karan Modi",
          role: "Convener",
          email: "karan.modi@marwadiuniversity.ac.in",
          phone: "+91 98765 43213",
        },
        {
          name: "Sneha Joshi",
          role: "Dy. Convener",
          email: "sneha.joshi@marwadiuniversity.ac.in",
          phone: "+91 98765 43214",
        },
        {
          name: "Prof. Amit Desai",
          role: "Faculty",
          email: "amit.desai@marwadiuniversity.ac.in",
          phone: "+91 98765 43215",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/mu_circuitology",
        linkedin: "https://linkedin.com/company/mu-circuitology-club",
      },
    },
    {
      id: "data-science",
      name: "Data Science Club",
      shortName: "DS Club",
      description: "Dive into AI, ML, and data analytics",
      logo: "/images/datascienceclub.png",
      color: "from-purple-500 to-purple-600",
      vision:
        "To cultivate data-driven thinking and advanced analytical skills, preparing students to harness the power of data science and artificial intelligence for innovative solutions.",
      mission:
        "We aim to provide comprehensive training in machine learning, data analysis, and AI technologies, fostering a community of data scientists who can extract meaningful insights from complex datasets.",
      committeePosterUrl: "/images/committees/ds-committee.jpg",
      events: [
        {
          id: "ml-hackathon-1",
          name: "ML Model Marathon",
          description: "Build and deploy machine learning models to solve real-world data challenges",
          date: "2024-09-15",
          time: "10:00 AM - 6:00 PM",
          venue: "Data Science Lab",
          maxTeamSize: 4,
          minTeamSize: 2,
          posterUrl: "/images/events/ml-marathon.jpg",
        },
        {
          id: "data-viz-1",
          name: "Data Visualization Contest",
          description: "Create compelling visualizations and dashboards from complex datasets",
          date: "2024-09-15",
          time: "2:00 PM - 5:00 PM",
          venue: "Computer Lab 2",
          maxTeamSize: 2,
          minTeamSize: 1,
          posterUrl: "/images/events/data-viz.jpg",
        },
      ],
      contacts: [
        {
          name: "Rahul Agarwal",
          role: "Convener",
          email: "rahul.agarwal@marwadiuniversity.ac.in",
          phone: "+91 98765 43216",
        },
        {
          name: "Ananya Singh",
          role: "Dy. Convener",
          email: "ananya.singh@marwadiuniversity.ac.in",
          phone: "+91 98765 43217",
        },
        {
          name: "Dr. Meera Patel",
          role: "Faculty",
          email: "meera.patel@marwadiuniversity.ac.in",
          phone: "+91 98765 43218",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/mu_datascience",
        linkedin: "https://linkedin.com/company/mu-data-science-club",
        github: "https://github.com/mu-data-science",
      },
    },
    {
      id: "cloud-devops",
      name: "Cloud Computing and DevOps Club",
      shortName: "CCDC",
      description: "Learn cybersecurity and network technologies",
      logo: "/images/ccdcClub.jpeg",
      color: "from-red-500 to-red-600",
      vision:
        "To create cloud-native professionals who can architect, deploy, and manage scalable applications in modern cloud environments while ensuring security and operational excellence.",
      mission:
        "We focus on developing expertise in cloud platforms, DevOps practices, containerization, and cybersecurity, preparing students for the evolving landscape of cloud computing and infrastructure management.",
      committeePosterUrl: "/images/committees/ccdc-committee.jpg",
      events: [
        {
          id: "cloud-deploy-1",
          name: "Cloud Deployment Challenge",
          description: "Deploy and scale applications on cloud platforms using modern DevOps practices",
          date: "2024-09-15",
          time: "9:00 AM - 3:00 PM",
          venue: "Cloud Lab",
          maxTeamSize: 3,
          minTeamSize: 2,
          posterUrl: "/images/events/cloud-deploy.jpg",
        },
        {
          id: "security-audit-1",
          name: "Cybersecurity Audit Workshop",
          description: "Learn to identify and mitigate security vulnerabilities in web applications",
          date: "2024-09-15",
          time: "1:00 PM - 4:00 PM",
          venue: "Security Lab",
          maxTeamSize: 2,
          minTeamSize: 1,
          posterUrl: "/images/events/security-audit.jpg",
        },
      ],
      contacts: [
        {
          name: "Vikash Kumar",
          role: "Convener",
          email: "vikash.kumar@marwadiuniversity.ac.in",
          phone: "+91 98765 43219",
        },
        {
          name: "Riya Mehta",
          role: "Dy. Convener",
          email: "riya.mehta@marwadiuniversity.ac.in",
          phone: "+91 98765 43220",
        },
        {
          name: "Prof. Suresh Gupta",
          role: "Faculty",
          email: "suresh.gupta@marwadiuniversity.ac.in",
          phone: "+91 98765 43221",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/mu_ccdc",
        linkedin: "https://linkedin.com/company/mu-ccdc-club",
      },
    },
  ]
  
  // Helper function to get club by ID
  export const getClubById = (id: string): Club | undefined => {
    return clubsData.find((club) => club.id === id)
  }
  
  // Helper function to get all club names for dropdown/selection
  export const getClubNames = (): string[] => {
    return clubsData.map((club) => club.name)
  }
  
  // Helper function to get events by club ID
  export const getEventsByClubId = (clubId: string): ClubEvent[] => {
    const club = getClubById(clubId)
    return club ? club.events : []
  }
  