export type Language = "en" | "es" | "it";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    services: string;
    technologies: string;
    projects: string;
    reviews: string;
    contact: string;
  };
  // Hero Section
  hero: {
    badge: string;
    title: {
      transform: string;
      ideas: string;
      into: string;
      reality: string;
    };
    subtitle: string;
    stats: {
      projects: string;
      satisfaction: string;
      support: string;
    };
    cta: {
      viewProjects: string;
      learnMore: string;
    };
  };
  // About Section
  about: {
    title: string;
    subtitle: string;
    mission: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    values: {
      precision: {
        title: string;
        description: string;
      };
      innovation: {
        title: string;
        description: string;
      };
      speed: {
        title: string;
        description: string;
      };
      collaboration: {
        title: string;
        description: string;
      };
    };
  };
  // Technologies Section
  technologies: {
    title: string;
    subtitle: string;
    powerLevel: string;
    categories: {
      frontend: string;
      mobile: string;
      backend: string;
      database: string;
      deployment: string;
    };
  };
  // Projects Section
  projects: {
    title: string;
    subtitle: string;
    viewAll: string;
    viewDemo: string;
    viewLive: string;
    backToHome: string;
    projectTitles: {
      ecommerce: string;
      fitness: string;
      dashboard: string;
      education: string;
      delivery: string;
      crm: string;
    };
    projectDescriptions: {
      ecommerce: string;
      fitness: string;
      dashboard: string;
      education: string;
      delivery: string;
      crm: string;
    };
    categories: {
      webApp: string;
      mobileApp: string;
      webPlatform: string;
      enterprise: string;
    };
  };
  // Contact Section
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      email: string;
      company: string;
      message: string;
      messagePlaceholder: string;
      send: string;
    };
    info: {
      title: string;
      description: string;
      email: string;
      phone: string;
      location: string;
    };
    dragon: {
      title: string;
      description: string;
    };
  };
  // Services Section
  services: {
    title: string;
    subtitle: string;
    web: {
      title: string;
      description: string;
    };
    mobile: {
      title: string;
      description: string;
    };
    backend: {
      title: string;
      description: string;
    };
    cloud: {
      title: string;
      description: string;
    };
    design: {
      title: string;
      description: string;
    };
    consulting: {
      title: string;
      description: string;
    };
    maintenance: {
      title: string;
      description: string;
    };
    startProject: string;
    learnMore: string;
  };
  // Footer
  footer: {
    description: string;
    quickLinks: string;
    services: string;
    contact: string;
    followUs: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      technologies: "Technologies",
      projects: "Projects",
      reviews: "Reviews",
      contact: "Contact",
    },
    hero: {
      badge: "Next-Generation Software Development",
      title: {
        transform: "We Transform",
        ideas: "Ideas",
        into: "into",
        reality: "Digital Reality",
      },
      subtitle:
        "We are Capsule Codes, specialists in web and mobile development with cutting-edge technologies. We create solutions that drive your business future.",
      stats: {
        projects: "Completed Projects",
        satisfaction: "Client Satisfaction",
        support: "Technical Support",
      },
      cta: {
        viewProjects: "View Our Projects",
        learnMore: "Learn More",
      },
    },
    about: {
      title: "About Capsule Codes",
      subtitle:
        "Inspired by the innovation and excellence of Capsule Corporation, we are a team of developers passionate about creating technology that transforms businesses and improves lives.",
      mission: {
        title: "Our Mission",
        paragraph1:
          "At Capsule Codes, we believe technology should be accessible, powerful, and transformative. We specialize in web and mobile development, using the most advanced tools from the React and Node.js ecosystem to create exceptional digital experiences.",
        paragraph2:
          "Each project is a new adventure where we combine creativity, technique, and passion to deliver solutions that not only meet but exceed our clients' expectations.",
      },
      values: {
        precision: {
          title: "Precision",
          description:
            "Like Capsule Corporation capsules, each project is designed with millimetric precision.",
        },
        innovation: {
          title: "Innovation",
          description:
            "We use the most advanced technologies to create solutions that exceed expectations.",
        },
        speed: {
          title: "Speed",
          description:
            "Agile development and fast deliveries without compromising the quality of the final product.",
        },
        collaboration: {
          title: "Collaboration",
          description:
            "We work as a united team, combining our skills to achieve extraordinary results.",
        },
      },
    },
    technologies: {
      title: "Our Technology Stack",
      subtitle:
        "We use the most modern and proven technologies to ensure your project is scalable, maintainable, and future-ready.",
      powerLevel: "Technological Power Level: OVER 9000! 🐉",
      categories: {
        frontend: "Frontend",
        mobile: "Mobile",
        backend: "Backend",
        database: "Database",
        deployment: "Deployment",
      },
    },
    projects: {
      title: "Our Projects",
      subtitle:
        "Each project is a new adventure where we apply our experience and passion to create digital solutions that transform businesses.",
      viewAll: "View All Projects",
      viewDemo: "View Demo",
      viewLive: "View Live",
      backToHome: "Back to Home",
      projectTitles: {
        ecommerce: "Futuristic E-Commerce",
        fitness: "Social Fitness App",
        dashboard: "Business Dashboard",
        education: "Educational Platform",
        delivery: "Delivery App",
        crm: "Intelligent CRM",
      },
      projectDescriptions: {
        ecommerce:
          "E-commerce platform with integrated AI for personalized recommendations.",
        fitness:
          "Mobile app for exercise tracking with social features and gamification.",
        dashboard:
          "Advanced control panel for business management with real-time analytics.",
        education:
          "Learning management system with video conferencing and automatic evaluations.",
        delivery:
          "Delivery app with real-time tracking and integrated payments.",
        crm: "CRM system with process automation and predictive analysis.",
      },
      categories: {
        webApp: "Web App",
        mobileApp: "Mobile App",
        webPlatform: "Web Platform",
        enterprise: "Enterprise",
      },
    },
    contact: {
      title: "Ready to Start?",
      subtitle:
        "Tell us about your project and discover how we can help you transform your vision into an extraordinary digital reality.",
      form: {
        title: "Send us a Message",
        name: "Name",
        email: "Email",
        company: "Company",
        message: "Message",
        messagePlaceholder: "Tell us about your project...",
        send: "Send Message",
      },
      info: {
        title: "Contact Information",
        description:
          "We are here to help you take your project to the next level. Don't hesitate to contact us for a free consultation.",
        email: "Email",
        phone: "Phone",
        location: "Location",
      },
      dragon: {
        title: "Summon the Innovation Dragon!",
        description:
          "Each project is an opportunity to create something extraordinary. What will be your technological wish?",
      },
    },
    services: {
      title: "Our Services",
      subtitle:
        "We offer comprehensive solutions for all your technological needs, from conception to deployment and maintenance.",
      web: {
        title: "Web Development",
        description:
          "Modern and responsive web applications with the latest technologies.",
      },
      mobile: {
        title: "Mobile Development",
        description:
          "Native and cross-platform mobile apps for iOS and Android.",
      },
      backend: {
        title: "Backend & APIs",
        description:
          "Robust backend services and scalable APIs with Node.js and Express.",
      },
      cloud: {
        title: "Cloud & DevOps",
        description:
          "Cloud infrastructure and automated deployment for maximum performance.",
      },
      design: {
        title: "UI/UX Design",
        description:
          "Intuitive and attractive designs that enhance user experience.",
      },
      consulting: {
        title: "Technical Consulting",
        description:
          "Strategic advice to optimize your technological infrastructure.",
      },
      maintenance: {
        title: "Maintenance & Support",
        description:
          "Continuous support to keep your applications running optimally.",
      },
      startProject: "Start Project",
      learnMore: "Learn More",
    },
    footer: {
      description:
        "Transforming ideas into digital reality with cutting-edge technology.",
      quickLinks: "Quick Links",
      services: "Services",
      contact: "Contact",
      followUs: "Follow Us",
      rights: "All rights reserved.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Nosotros",
      services: "Servicios",
      technologies: "Tecnologías",
      projects: "Proyectos",
      reviews: "Reseñas",
      contact: "Contacto",
    },
    hero: {
      badge: "Desarrollo de Software de Próxima Generación",
      title: {
        transform: "Transformamos",
        ideas: "Ideas",
        into: "en",
        reality: "Realidad Digital",
      },
      subtitle:
        "Somos Capsule Codes, especialistas en desarrollo web y móvil con tecnologías de vanguardia. Creamos soluciones que impulsan el futuro de tu negocio.",
      stats: {
        projects: "Proyectos Completados",
        satisfaction: "Satisfacción del Cliente",
        support: "Soporte Técnico",
      },
      cta: {
        viewProjects: "Ver Nuestros Proyectos",
        learnMore: "Conocer Más",
      },
    },
    about: {
      title: "Sobre Capsule Codes",
      subtitle:
        "Inspirados en la innovación y la excelencia de la Corporación Cápsula, somos un equipo de desarrolladores apasionados por crear tecnología que transforma negocios y mejora vidas.",
      mission: {
        title: "Nuestra Misión",
        paragraph1:
          "En Capsule Codes, creemos que la tecnología debe ser accesible, potente y transformadora. Nos especializamos en desarrollo web y móvil, utilizando las herramientas más avanzadas del ecosistema React y Node.js para crear experiencias digitales excepcionales.",
        paragraph2:
          "Cada proyecto es una nueva aventura donde combinamos creatividad, técnica y pasión para entregar soluciones que no solo cumplen, sino que superan las expectativas de nuestros clientes.",
      },
      values: {
        precision: {
          title: "Precisión",
          description:
            "Como las cápsulas de la Corporación Cápsula, cada proyecto es diseñado con precisión milimétrica.",
        },
        innovation: {
          title: "Innovación",
          description:
            "Utilizamos las tecnologías más avanzadas para crear soluciones que superan las expectativas.",
        },
        speed: {
          title: "Velocidad",
          description:
            "Desarrollo ágil y entregas rápidas sin comprometer la calidad del producto final.",
        },
        collaboration: {
          title: "Colaboración",
          description:
            "Trabajamos como un equipo unido, combinando nuestras habilidades para lograr resultados extraordinarios.",
        },
      },
    },
    technologies: {
      title: "Nuestro Stack Tecnológico",
      subtitle:
        "Utilizamos las tecnologías más modernas y probadas para garantizar que tu proyecto sea escalable, mantenible y esté preparado para el futuro.",
      powerLevel: "Nivel de Poder Tecnológico: ¡MÁS DE 9000! 🐉",
      categories: {
        frontend: "Frontend",
        mobile: "Mobile",
        backend: "Backend",
        database: "Base de Datos",
        deployment: "Despliegue",
      },
    },
    projects: {
      title: "Nuestros Proyectos",
      subtitle:
        "Cada proyecto es una nueva aventura donde aplicamos nuestra experiencia y pasión para crear soluciones digitales que transforman negocios.",
      viewAll: "Ver Todos los Proyectos",
      viewDemo: "Ver Demo",
      viewLive: "Ver en Vivo",
      backToHome: "Volver al Inicio",
      projectTitles: {
        ecommerce: "E-Commerce Futurista",
        fitness: "App de Fitness Social",
        dashboard: "Dashboard Empresarial",
        education: "Plataforma Educativa",
        delivery: "App de Delivery",
        crm: "CRM Inteligente",
      },
      projectDescriptions: {
        ecommerce:
          "Plataforma de comercio electrónico con IA integrada para recomendaciones personalizadas.",
        fitness:
          "Aplicación móvil para tracking de ejercicios con funciones sociales y gamificación.",
        dashboard:
          "Panel de control avanzado para gestión empresarial con analytics en tiempo real.",
        education:
          "Sistema de gestión de aprendizaje con videoconferencias y evaluaciones automáticas.",
        delivery:
          "Aplicación de delivery con tracking en tiempo real y pagos integrados.",
        crm: "Sistema CRM con automatización de procesos y análisis predictivo.",
      },
      categories: {
        webApp: "Web App",
        mobileApp: "Mobile App",
        webPlatform: "Plataforma Web",
        enterprise: "Empresarial",
      },
    },
    contact: {
      title: "¿Listo para Comenzar?",
      subtitle:
        "Cuéntanos sobre tu proyecto y descubre cómo podemos ayudarte a transformar tu visión en una realidad digital extraordinaria.",
      form: {
        title: "Envíanos un Mensaje",
        name: "Nombre",
        email: "Email",
        company: "Empresa",
        message: "Mensaje",
        messagePlaceholder: "Cuéntanos sobre tu proyecto...",
        send: "Enviar Mensaje",
      },
      info: {
        title: "Información de Contacto",
        description:
          "Estamos aquí para ayudarte a llevar tu proyecto al siguiente nivel. No dudes en contactarnos para una consulta gratuita.",
        email: "Email",
        phone: "Teléfono",
        location: "Ubicación",
      },
      dragon: {
        title: "¡Invoca al Dragón de la Innovación!",
        description:
          "Cada proyecto es una oportunidad de crear algo extraordinario. ¿Cuál será tu deseo tecnológico?",
      },
    },
    services: {
      title: "Nuestros Servicios",
      subtitle:
        "Ofrecemos soluciones integrales para todas tus necesidades tecnológicas, desde la concepción hasta el despliegue y mantenimiento.",
      web: {
        title: "Desarrollo Web",
        description:
          "Aplicaciones web modernas y responsivas con las últimas tecnologías.",
      },
      mobile: {
        title: "Desarrollo Móvil",
        description:
          "Apps móviles nativas y multiplataforma para iOS y Android.",
      },
      backend: {
        title: "Backend y APIs",
        description:
          "Servicios backend robustos y APIs escalables con Node.js y Express.",
      },
      cloud: {
        title: "Cloud y DevOps",
        description:
          "Infraestructura en la nube y despliegue automatizado para máximo rendimiento.",
      },
      design: {
        title: "Diseño UI/UX",
        description:
          "Diseños intuitivos y atractivos que mejoran la experiencia del usuario.",
      },
      consulting: {
        title: "Consultoría Técnica",
        description:
          "Asesoramiento estratégico para optimizar tu infraestructura tecnológica.",
      },
      maintenance: {
        title: "Mantenimiento y Soporte",
        description:
          "Soporte continuo para mantener tus aplicaciones funcionando de manera óptima.",
      },
      startProject: "Comenzar Proyecto",
      learnMore: "Saber Más",
    },
    footer: {
      description:
        "Transformando ideas en realidad digital con tecnología de vanguardia.",
      quickLinks: "Enlaces Rápidos",
      services: "Servicios",
      contact: "Contacto",
      followUs: "Síguenos",
      rights: "Todos los derechos reservados.",
    },
  },
  it: {
    nav: {
      home: "Home",
      about: "Chi Siamo",
      services: "Servizi",
      technologies: "Tecnologie",
      projects: "Progetti",
      reviews: "Recensioni",
      contact: "Contatti",
    },
    hero: {
      badge: "Sviluppo Software di Nuova Generazione",
      title: {
        transform: "Trasformiamo",
        ideas: "Idee",
        into: "in",
        reality: "Realtà Digitale",
      },
      subtitle:
        "Siamo Capsule Codes, specialisti nello sviluppo web e mobile con tecnologie all'avanguardia. Creiamo soluzioni che guidano il futuro del tuo business.",
      stats: {
        projects: "Progetti Completati",
        satisfaction: "Soddisfazione Cliente",
        support: "Supporto Tecnico",
      },
      cta: {
        viewProjects: "Vedi i Nostri Progetti",
        learnMore: "Scopri di Più",
      },
    },
    about: {
      title: "Su Capsule Codes",
      subtitle:
        "Ispirati dall'innovazione e dall'eccellenza della Capsule Corporation, siamo un team di sviluppatori appassionati nel creare tecnologia che trasforma i business e migliora le vite.",
      mission: {
        title: "La Nostra Missione",
        paragraph1:
          "In Capsule Codes, crediamo che la tecnologia debba essere accessibile, potente e trasformativa. Ci specializziamo nello sviluppo web e mobile, utilizzando gli strumenti più avanzati dell'ecosistema React e Node.js per creare esperienze digitali eccezionali.",
        paragraph2:
          "Ogni progetto è una nuova avventura dove combiniamo creatività, tecnica e passione per consegnare soluzioni che non solo soddisfano, ma superano le aspettative dei nostri clienti.",
      },
      values: {
        precision: {
          title: "Precisione",
          description:
            "Come le capsule della Capsule Corporation, ogni progetto è progettato con precisione millimetrica.",
        },
        innovation: {
          title: "Innovazione",
          description:
            "Utilizziamo le tecnologie più avanzate per creare soluzioni che superano le aspettative.",
        },
        speed: {
          title: "Velocità",
          description:
            "Sviluppo agile e consegne rapide senza compromettere la qualità del prodotto finale.",
        },
        collaboration: {
          title: "Collaborazione",
          description:
            "Lavoriamo come un team unito, combinando le nostre competenze per raggiungere risultati straordinari.",
        },
      },
    },
    technologies: {
      title: "Il Nostro Stack Tecnologico",
      subtitle:
        "Utilizziamo le tecnologie più moderne e collaudate per garantire che il tuo progetto sia scalabile, manutenibile e pronto per il futuro.",
      powerLevel: "Livello di Potenza Tecnologica: OLTRE 9000! 🐉",
      categories: {
        frontend: "Frontend",
        mobile: "Mobile",
        backend: "Backend",
        database: "Database",
        deployment: "Deployment",
      },
    },
    projects: {
      title: "I Nostri Progetti",
      subtitle:
        "Ogni progetto è una nuova avventura dove applichiamo la nostra esperienza e passione per creare soluzioni digitali che trasformano i business.",
      viewAll: "Vedi Tutti i Progetti",
      viewDemo: "Vedi Demo",
      viewLive: "Vedi Live",
      backToHome: "Torna alla Home",
      projectTitles: {
        ecommerce: "E-Commerce Futuristico",
        fitness: "App Fitness Sociale",
        dashboard: "Dashboard Aziendale",
        education: "Piattaforma Educativa",
        delivery: "App di Consegna",
        crm: "CRM Intelligente",
      },
      projectDescriptions: {
        ecommerce:
          "Piattaforma e-commerce con IA integrata per raccomandazioni personalizzate.",
        fitness:
          "App mobile per il tracking degli esercizi con funzioni sociali e gamification.",
        dashboard:
          "Pannello di controllo avanzato per la gestione aziendale con analytics in tempo reale.",
        education:
          "Sistema di gestione dell'apprendimento con videoconferenze e valutazioni automatiche.",
        delivery:
          "App di consegna con tracking in tempo reale e pagamenti integrati.",
        crm: "Sistema CRM con automazione dei processi e analisi predittiva.",
      },
      categories: {
        webApp: "Web App",
        mobileApp: "Mobile App",
        webPlatform: "Piattaforma Web",
        enterprise: "Enterprise",
      },
    },
    contact: {
      title: "Pronto per Iniziare?",
      subtitle:
        "Raccontaci del tuo progetto e scopri come possiamo aiutarti a trasformare la tua visione in una straordinaria realtà digitale.",
      form: {
        title: "Inviaci un Messaggio",
        name: "Nome",
        email: "Email",
        company: "Azienda",
        message: "Messaggio",
        messagePlaceholder: "Raccontaci del tuo progetto...",
        send: "Invia Messaggio",
      },
      info: {
        title: "Informazioni di Contatto",
        description:
          "Siamo qui per aiutarti a portare il tuo progetto al livello successivo. Non esitare a contattarci per una consulenza gratuita.",
        email: "Email",
        phone: "Telefono",
        location: "Posizione",
      },
      dragon: {
        title: "Evoca il Drago dell'Innovazione!",
        description:
          "Ogni progetto è un'opportunità per creare qualcosa di straordinario. Quale sarà il tuo desiderio tecnologico?",
      },
    },
    services: {
      title: "I Nostri Servizi",
      subtitle:
        "Offriamo soluzioni complete per tutte le tue esigenze tecnologiche, dalla concezione al deployment e manutenzione.",
      web: {
        title: "Sviluppo Web",
        description:
          "Applicazioni web moderne e responsive con le ultime tecnologie.",
      },
      mobile: {
        title: "Sviluppo Mobile",
        description: "App mobile native e cross-platform per iOS e Android.",
      },
      backend: {
        title: "Backend e API",
        description:
          "Servizi backend robusti e API scalabili con Node.js ed Express.",
      },
      cloud: {
        title: "Cloud e DevOps",
        description:
          "Infrastruttura cloud e deployment automatizzato per massime prestazioni.",
      },
      design: {
        title: "Design UI/UX",
        description:
          "Design intuitivi e attraenti che migliorano l'esperienza utente.",
      },
      consulting: {
        title: "Consulenza Tecnica",
        description:
          "Consulenza strategica per ottimizzare la tua infrastruttura tecnologica.",
      },
      maintenance: {
        title: "Manutenzione e Supporto",
        description:
          "Supporto continuo per mantenere le tue applicazioni funzionanti in modo ottimale.",
      },
      startProject: "Inizia Progetto",
      learnMore: "Scopri di Più",
    },
    footer: {
      description:
        "Trasformiamo idee in realtà digitale con tecnologia all'avanguardia.",
      quickLinks: "Link Rapidi",
      services: "Servizi",
      contact: "Contatti",
      followUs: "Seguici",
      rights: "Tutti i diritti riservati.",
    },
  },
};

export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};
