export const portfolioData = {
  hero: {
    name: "VIRAJ THAKUR",
    tagline: "Python Developer | Backend · APIs · GenAI · Docker",
  },
  about: {
    bio: "Python Developer with hands-on experience building production-ready backend systems, REST APIs, async pipelines, and GenAI integrations. Proficient in LangChain, LangGraph, PostgreSQL, Docker, and JWT-based authentication. Practises vibe coding to prototype and ship fast.",
    skills: [
      "Python", "Django", "FastAPI", "Flask", "LangChain", "RAG", 
      "Docker", "PostgreSQL", "Redis", "AWS", "WebSockets", "GenAI"
    ],
    verticalWords: ["python", "backend", "genai", "docker"]
  },
  projects: [
    {
      id: "lielens",
      title: "LieLens AI",
      category: "AI / NLP",
      tags: ["Django", "Celery", "Redis", "NLP", "Docker"],
      description: "A full-stack AI SaaS platform scoring writing credibility across 5 NLP+ML dimensions with token-level heatmap visualization. Built async processing pipeline using Celery + Redis.",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "skillo",
      title: "Skillo",
      category: "Backend / WebSockets",
      tags: ["Flask", "PostgreSQL", "Redis", "Socket.IO"],
      description: "A multi-role marketplace with JWT role-based authentication, REST API endpoints, and real-time booking notifications via Socket.IO + Redis pub/sub.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "speech-er",
      title: "Speech Emotion Recognition",
      category: "Machine Learning",
      tags: ["Python", "Scikit-learn", "Librosa", "SVM"],
      description: "End-to-end ML pipeline classifying 6 emotions from raw speech on RAVDESS dataset. Achieved 82% accuracy by engineering 40-dim MFCC features.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
    }
  ],
  experience: [
    {
      id: "stage-1",
      title: "B.E. Computer Engineering",
      company: "Sindhudurg Shiksha Prasarak Mandal",
      date: "2021 - 2025",
      description: "Pursuing Bachelor of Engineering with a CGPA of 8.20. Also completed B.Sc. Mathematics at Balasaheb Khardekar College (2020 - 2021)."
    },
    {
      id: "stage-2",
      title: "Certifications & Upskilling",
      company: "Besant Technologies / NXT Wave / Forage",
      date: "2024",
      description: "Completed certifications in Programming in Python, Generative AI & Model Lifecycle, SQL (DDL/DML/Joins), and AWS Solution Architecture Job Simulation."
    },
    {
      id: "stage-3",
      title: "Independent Developer",
      company: "Personal Projects & Open Source",
      date: "Present",
      description: "Shipped LieLens—a full-stack AI SaaS with async architecture, billing scaffold, and explainable AI. Active contributor to National Digital Library Program."
    }
  ],
  contact: {
    email: "virajthakur987.vt@gmail.com",
    linkedin: "https://linkedin.com/in/virajthakur003",
    github: "https://github.com/VirajThakur03",
    resume: "resume.pdf",
    leetcode: "https://leetcode.com/u/VirajThakur003/"
  }
};
