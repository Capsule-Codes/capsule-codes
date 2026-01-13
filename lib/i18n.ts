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
    backToProjects: string;
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
  // Reviews Section
  reviews: {
    title: string;
    subtitle: string;
  };
  // Contact Section
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      company: string;
      companyPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      successMessage: string;
      errorMessage: string;
    };
    info: {
      title: string;
      description: string;
      email: string;
      phone: string;
      location: string;
    };
    hours: {
      title: string;
      weekdays: string;
      weekend: string;
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
      features: string[];
    };
    mobile: {
      title: string;
      description: string;
      features: string[];
    };
    backend: {
      title: string;
      description: string;
      features: string[];
    };
    cloud: {
      title: string;
      description: string;
      features: string[];
    };
    design: {
      title: string;
      description: string;
      features: string[];
    };
    consulting: {
      title: string;
      description: string;
      features: string[];
    };
    maintenance: {
      title: string;
      description: string;
      features: string[];
    };
    startProject: string;
    learnMore: string;
  };
  // Footer
  footer: {
    description: string;
    quickLinks: string;
    services: string;
    technologies: string;
    company: string;
    blog: string;
    contact: string;
    followUs: string;
    rights: string;
    privacyPolicy: string;
    termsOfService: string;
    quote: string;
  };
  // Legal Pages
  legal: {
    privacyPolicy: {
      title: string;
      lastUpdated: string;
      sections: {
        introduction: string;
        dataCollection: string;
        dataUsage: string;
        dataProtection: string;
        cookies: string;
        thirdParty: string;
        rights: string;
        changes: string;
        contact: string;
      };
    };
    termsOfService: {
      title: string;
      lastUpdated: string;
      sections: {
        introduction: string;
        services: string;
        userObligations: string;
        intellectualProperty: string;
        payment: string;
        liability: string;
        termination: string;
        changes: string;
        contact: string;
      };
    };
  };
  // Admin Panel
  admin: {
    common: {
      save: string;
      saving: string;
      cancel: string;
      edit: string;
      delete: string;
      add: string;
    };
    technologies: {
      title: string;
      newTechnology: string;
      editTechnology: string;
      name: string;
      icon: string;
      category: string;
      selectCategory: string;
      requiredFields: string;
      deleteConfirm: string;
      saveError: string;
      deleteError: string;
    };
    reviews: {
      title: string;
      newReview: string;
      editReview: string;
      author: string;
      company: string;
      position: string;
      rating: string;
      ratingRange: string;
      avatar: string;
      date: string;
      text: string;
      invalidRating: string;
      deleteConfirm: string;
      saveError: string;
      deleteError: string;
    };
    contactMessages: {
      title: string;
      messages: string;
      noMessages: string;
      messageFrom: string;
      email: string;
      company: string;
      message: string;
      status: string;
      deleteConfirm: string;
      statuses: {
        unread: string;
        read: string;
        replied: string;
        archived: string;
      };
    };
    contactInfo: {
      title: string;
      contactDetails: string;
      email: string;
      phone: string;
      location: string;
      locationDefault: string;
      multilingualLocation: string;
      saveChanges: string;
      updated: string;
      updateError: string;
    };
    projects: {
      images: string;
      imageDescription: string;
      selectedImages: string;
      currentImages: string;
      maxImages: string;
    };
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
      backToProjects: "Back to Projects",
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
    reviews: {
      title: "What Our Clients Say",
      subtitle:
        "Don't just take our word for it - hear from the businesses we've helped transform",
    },
    contact: {
      title: "Ready to Start?",
      subtitle:
        "Tell us about your project and discover how we can help you transform your vision into an extraordinary digital reality.",
      form: {
        title: "Send us a Message",
        name: "Name",
        namePlaceholder: "Your full name",
        email: "Email",
        emailPlaceholder: "your@email.com",
        company: "Company",
        companyPlaceholder: "Your company (optional)",
        message: "Message",
        messagePlaceholder: "Tell us about your project...",
        send: "Send Message",
        sending: "Sending...",
        successMessage: "Message sent successfully! We'll get back to you soon.",
        errorMessage: "There was an error sending the message. Please try again.",
      },
      info: {
        title: "Contact Information",
        description:
          "We are here to help you take your project to the next level. Don't hesitate to contact us for a free consultation.",
        email: "Email",
        phone: "Phone",
        location: "Location",
      },
      hours: {
        title: "Business Hours",
        weekdays: "Monday to Friday: 9:00 AM - 6:00 PM",
        weekend: "Saturday: 10:00 AM - 2:00 PM",
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
        features: ["React & Next.js", "Astro", "TypeScript", "Tailwind CSS"],
      },
      mobile: {
        title: "Mobile Development",
        description:
          "Native and cross-platform mobile apps for iOS and Android.",
        features: ["React Native", "Expo", "Cross-platform", "Native Performance"],
      },
      backend: {
        title: "Backend & APIs",
        description:
          "Robust backend services and scalable APIs with Node.js and Express.",
        features: ["Node.js", "Express.js", "MongoDB", "RESTful APIs"],
      },
      cloud: {
        title: "Cloud & DevOps",
        description:
          "Cloud infrastructure and automated deployment for maximum performance.",
        features: ["Supabase", "Firebase", "Vercel", "CI/CD"],
      },
      design: {
        title: "UI/UX Design",
        description:
          "Intuitive and attractive designs that enhance user experience.",
        features: ["Figma", "Responsive Design", "User Research", "Prototyping"],
      },
      consulting: {
        title: "Technical Consulting",
        description:
          "Strategic advice to optimize your technological infrastructure.",
        features: ["Architecture Review", "Performance Audit", "Tech Strategy", "Code Review"],
      },
      maintenance: {
        title: "Maintenance & Support",
        description:
          "Continuous support to keep your applications running optimally.",
        features: ["24/7 Monitoring", "Bug Fixes", "Updates", "Performance Optimization"],
      },
      startProject: "Start Project",
      learnMore: "Learn More",
    },
    footer: {
      description:
        "Transforming ideas into digital reality with cutting-edge technology.",
      quickLinks: "Quick Links",
      services: "Services",
      technologies: "Technologies",
      company: "Company",
      blog: "Blog",
      contact: "Contact",
      followUs: "Follow Us",
      rights: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
    legal: {
      privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: January 2024",
        sections: {
          introduction: "At Capsule Codes, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.",
          dataCollection: "We collect information that you provide directly to us, such as when you fill out our contact form, including your name, email address, company name, and any messages you send us.",
          dataUsage: "We use the information we collect to respond to your inquiries, provide our services, improve our website, and communicate with you about our services and updates.",
          dataProtection: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
          cookies: "Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect website functionality.",
          thirdParty: "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website and conducting our business.",
          rights: "You have the right to access, correct, or delete your personal information at any time. Please contact us if you wish to exercise these rights.",
          changes: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
          contact: "If you have any questions about this Privacy Policy, please contact us at info@capsulecodes.com.",
        },
      },
      termsOfService: {
        title: "Terms of Service",
        lastUpdated: "Last updated: January 2024",
        sections: {
          introduction: "These Terms of Service govern your access to and use of Capsule Codes' website and services. By accessing or using our services, you agree to be bound by these Terms.",
          services: "Capsule Codes provides web and mobile development services, technical consulting, and related services as described on our website. All services are subject to availability and our acceptance of your project.",
          userObligations: "You agree to provide accurate information when using our services and to use our services only for lawful purposes. You are responsible for maintaining the confidentiality of any account credentials.",
          intellectualProperty: "All content on this website, including but not limited to text, graphics, logos, and software, is the property of Capsule Codes and is protected by intellectual property laws.",
          payment: "Payment terms will be agreed upon in writing before the commencement of any project. All fees are non-refundable unless otherwise stated in your specific service agreement.",
          liability: "Capsule Codes provides services 'as is' and makes no warranties, expressed or implied. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.",
          termination: "We reserve the right to terminate or suspend access to our services at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.",
          changes: "We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page.",
          contact: "If you have any questions about these Terms of Service, please contact us at info@capsulecodes.com.",
        },
      },
    },
      quote: "Power comes in response to a need, not a desire. - Goku 🐉",
    },
    admin: {
      common: {
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        add: "Add",
      },
      technologies: {
        title: "Technology Management",
        newTechnology: "New Technology",
        editTechnology: "Edit Technology",
        name: "Name",
        icon: "Icon (emoji)",
        category: "Category",
        selectCategory: "Select category",
        requiredFields: "Please fill all required fields",
        deleteConfirm: "Are you sure you want to delete this technology?",
        saveError: "Error saving",
        deleteError: "Error deleting technology",
      },
      reviews: {
        title: "Review Management",
        newReview: "Add Review",
        editReview: "Edit Review",
        author: "Author",
        company: "Company",
        position: "Position",
        rating: "Rating (1-5)",
        ratingRange: "Rating must be between 1 and 5",
        avatar: "Avatar URL",
        date: "Date",
        text: "Review Text",
        invalidRating: "Rating must be between 1 and 5",
        deleteConfirm: "Are you sure you want to delete this review?",
        saveError: "Error saving review",
        deleteError: "Error deleting review",
      },
      contactMessages: {
        title: "Contact Messages",
        messages: "messages",
        noMessages: "No messages yet",
        messageFrom: "Message from",
        email: "Email",
        company: "Company",
        message: "Message",
        status: "Status",
        deleteConfirm: "Delete this message?",
        statuses: {
          unread: "Unread",
          read: "Read",
          replied: "Replied",
          archived: "Archived",
        },
      },
      contactInfo: {
        title: "Contact Information",
        contactDetails: "Contact Details",
        email: "Email",
        phone: "Phone",
        location: "Location",
        locationDefault: "Location (default)",
        multilingualLocation: "Multilingual Location",
        saveChanges: "Save Changes",
        updated: "Information updated",
        updateError: "Error updating",
      },
      projects: {
        images: "Project Images (Azure)",
        imageDescription: "Max 10 images. Will be automatically converted to WebP.",
        selectedImages: "selected",
        currentImages: "Current Images",
        maxImages: "Maximum 10 images allowed",
      },
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
      backToProjects: "Volver a Proyectos",
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
    reviews: {
      title: "Lo Que Dicen Nuestros Clientes",
      subtitle:
        "No solo tomes nuestra palabra - escucha a las empresas que hemos ayudado a transformar",
    },
    contact: {
      title: "¿Listo para Comenzar?",
      subtitle:
        "Cuéntanos sobre tu proyecto y descubre cómo podemos ayudarte a transformar tu visión en una realidad digital extraordinaria.",
      form: {
        title: "Envíanos un Mensaje",
        name: "Nombre",
        namePlaceholder: "Tu nombre completo",
        email: "Email",
        emailPlaceholder: "tu@email.com",
        company: "Empresa",
        companyPlaceholder: "Tu empresa (opcional)",
        message: "Mensaje",
        messagePlaceholder: "Cuéntanos sobre tu proyecto...",
        send: "Enviar Mensaje",
        sending: "Enviando...",
        successMessage: "¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.",
        errorMessage: "Hubo un error al enviar el mensaje. Por favor intenta nuevamente.",
      },
      info: {
        title: "Información de Contacto",
        description:
          "Estamos aquí para ayudarte a llevar tu proyecto al siguiente nivel. No dudes en contactarnos para una consulta gratuita.",
        email: "Email",
        phone: "Teléfono",
        location: "Ubicación",
      },
      hours: {
        title: "Horario de Atención",
        weekdays: "Lunes a Viernes: 9:00 AM - 6:00 PM",
        weekend: "Sábados: 10:00 AM - 2:00 PM",
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
        features: ["React & Next.js", "Astro", "TypeScript", "Tailwind CSS"],
      },
      mobile: {
        title: "Desarrollo Móvil",
        description:
          "Apps móviles nativas y multiplataforma para iOS y Android.",
        features: ["React Native", "Expo", "Multiplataforma", "Rendimiento Nativo"],
      },
      backend: {
        title: "Backend y APIs",
        description:
          "Servicios backend robustos y APIs escalables con Node.js y Express.",
        features: ["Node.js", "Express.js", "MongoDB", "APIs RESTful"],
      },
      cloud: {
        title: "Cloud y DevOps",
        description:
          "Infraestructura en la nube y despliegue automatizado para máximo rendimiento.",
        features: ["Supabase", "Firebase", "Vercel", "CI/CD"],
      },
      design: {
        title: "Diseño UI/UX",
        description:
          "Diseños intuitivos y atractivos que mejoran la experiencia del usuario.",
        features: ["Figma", "Diseño Responsivo", "Investigación de Usuarios", "Prototipado"],
      },
      consulting: {
        title: "Consultoría Técnica",
        description:
          "Asesoramiento estratégico para optimizar tu infraestructura tecnológica.",
        features: ["Revisión de Arquitectura", "Auditoría de Rendimiento", "Estrategia Tech", "Revisión de Código"],
      },
      maintenance: {
        title: "Mantenimiento y Soporte",
        description:
          "Soporte continuo para mantener tus aplicaciones funcionando de manera óptima.",
        features: ["Monitoreo 24/7", "Corrección de Bugs", "Actualizaciones", "Optimización de Rendimiento"],
      },
      startProject: "Comenzar Proyecto",
      learnMore: "Saber Más",
    },
    footer: {
      description:
        "Transformando ideas en realidad digital con tecnología de vanguardia.",
      quickLinks: "Enlaces Rápidos",
      services: "Servicios",
      technologies: "Tecnologías",
      company: "Empresa",
      blog: "Blog",
      contact: "Contacto",
      followUs: "Síguenos",
      rights: "Todos los derechos reservados.",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
    },
    legal: {
      privacyPolicy: {
        title: "Política de Privacidad",
        lastUpdated: "Última actualización: Enero 2024",
        sections: {
          introduction: "En Capsule Codes, nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información personal cuando visita nuestro sitio web o utiliza nuestros servicios.",
          dataCollection: "Recopilamos información que nos proporciona directamente, como cuando completa nuestro formulario de contacto, incluyendo su nombre, dirección de correo electrónico, nombre de la empresa y cualquier mensaje que nos envíe.",
          dataUsage: "Utilizamos la información que recopilamos para responder a sus consultas, proporcionar nuestros servicios, mejorar nuestro sitio web y comunicarnos con usted sobre nuestros servicios y actualizaciones.",
          dataProtection: "Implementamos medidas técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.",
          cookies: "Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Puede elegir deshabilitar las cookies a través de la configuración de su navegador, aunque esto puede afectar la funcionalidad del sitio web.",
          thirdParty: "No vendemos, intercambiamos ni alquilamos su información personal a terceros. Podemos compartir información con proveedores de servicios de confianza que nos ayudan a operar nuestro sitio web y realizar nuestro negocio.",
          rights: "Usted tiene derecho a acceder, corregir o eliminar su información personal en cualquier momento. Por favor contáctenos si desea ejercer estos derechos.",
          changes: "Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.",
          contact: "Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en info@capsulecodes.com.",
        },
      },
      termsOfService: {
        title: "Términos de Servicio",
        lastUpdated: "Última actualización: Enero 2024",
        sections: {
          introduction: "Estos Términos de Servicio rigen su acceso y uso del sitio web y servicios de Capsule Codes. Al acceder o utilizar nuestros servicios, usted acepta estar sujeto a estos Términos.",
          services: "Capsule Codes proporciona servicios de desarrollo web y móvil, consultoría técnica y servicios relacionados según se describe en nuestro sitio web. Todos los servicios están sujetos a disponibilidad y nuestra aceptación de su proyecto.",
          userObligations: "Usted acepta proporcionar información precisa al usar nuestros servicios y usar nuestros servicios solo para fines legales. Usted es responsable de mantener la confidencialidad de cualquier credencial de cuenta.",
          intellectualProperty: "Todo el contenido en este sitio web, incluyendo pero no limitado a texto, gráficos, logotipos y software, es propiedad de Capsule Codes y está protegido por las leyes de propiedad intelectual.",
          payment: "Los términos de pago se acordarán por escrito antes del inicio de cualquier proyecto. Todas las tarifas no son reembolsables a menos que se indique lo contrario en su acuerdo de servicio específico.",
          liability: "Capsule Codes proporciona servicios 'tal como están' y no otorga garantías, expresas o implícitas. No somos responsables de ningún daño indirecto, incidental o consecuente que surja del uso de nuestros servicios.",
          termination: "Nos reservamos el derecho de terminar o suspender el acceso a nuestros servicios en cualquier momento, sin previo aviso, por conducta que creemos que viola estos Términos o es perjudicial para otros usuarios.",
          changes: "Nos reservamos el derecho de modificar estos Términos en cualquier momento. Notificaremos a los usuarios de cualquier cambio material publicando los Términos actualizados en esta página.",
          contact: "Si tiene alguna pregunta sobre estos Términos de Servicio, por favor contáctenos en info@capsulecodes.com.",
        },
      },
    },
      quote: "El poder viene en respuesta a una necesidad, no a un deseo. - Goku 🐉",
    },
    admin: {
      common: {
        save: "Guardar",
        saving: "Guardando...",
        cancel: "Cancelar",
        edit: "Editar",
        delete: "Eliminar",
        add: "Agregar",
      },
      technologies: {
        title: "Gestión de Tecnologías",
        newTechnology: "Nueva Tecnología",
        editTechnology: "Editar Tecnología",
        name: "Nombre",
        icon: "Icono (emoji)",
        category: "Categoría",
        selectCategory: "Seleccionar categoría",
        requiredFields: "Por favor completa todos los campos requeridos",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta tecnología?",
        saveError: "Error al guardar",
        deleteError: "Error al eliminar la tecnología",
      },
      reviews: {
        title: "Gestión de Reseñas",
        newReview: "Agregar Reseña",
        editReview: "Editar Reseña",
        author: "Autor",
        company: "Empresa",
        position: "Cargo",
        rating: "Calificación (1-5)",
        ratingRange: "La calificación debe estar entre 1 y 5",
        avatar: "URL del Avatar",
        date: "Fecha",
        text: "Texto de la Reseña",
        invalidRating: "La calificación debe ser entre 1 y 5",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta reseña?",
        saveError: "Error al guardar la reseña",
        deleteError: "Error al eliminar la reseña",
      },
      contactMessages: {
        title: "Mensajes de Contacto",
        messages: "mensajes",
        noMessages: "No hay mensajes aún",
        messageFrom: "Mensaje de",
        email: "Email",
        company: "Empresa",
        message: "Mensaje",
        status: "Estado",
        deleteConfirm: "¿Eliminar este mensaje?",
        statuses: {
          unread: "No leído",
          read: "Leído",
          replied: "Respondido",
          archived: "Archivado",
        },
      },
      contactInfo: {
        title: "Información de Contacto",
        contactDetails: "Datos de Contacto",
        email: "Email",
        phone: "Teléfono",
        location: "Ubicación",
        locationDefault: "Ubicación (por defecto)",
        multilingualLocation: "Ubicación Multilingüe",
        saveChanges: "Guardar Cambios",
        updated: "Información actualizada",
        updateError: "Error al actualizar",
      },
      projects: {
        images: "Imágenes del Proyecto (Azure)",
        imageDescription: "Máximo 10 imágenes. Se convertirán a WebP automáticamente.",
        selectedImages: "seleccionadas",
        currentImages: "Imágenes Actuales",
        maxImages: "Máximo 10 imágenes permitidas",
      },
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
      backToProjects: "Torna ai Progetti",
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
    reviews: {
      title: "Cosa Dicono I Nostri Clienti",
      subtitle:
        "Non prendere solo la nostra parola - ascolta le aziende che abbiamo aiutato a trasformare",
    },
    contact: {
      title: "Pronto per Iniziare?",
      subtitle:
        "Raccontaci del tuo progetto e scopri come possiamo aiutarti a trasformare la tua visione in una straordinaria realtà digitale.",
      form: {
        title: "Inviaci un Messaggio",
        name: "Nome",
        namePlaceholder: "Il tuo nome completo",
        email: "Email",
        emailPlaceholder: "tua@email.com",
        company: "Azienda",
        companyPlaceholder: "La tua azienda (opzionale)",
        message: "Messaggio",
        messagePlaceholder: "Raccontaci del tuo progetto...",
        send: "Invia Messaggio",
        sending: "Invio in corso...",
        successMessage: "Messaggio inviato con successo! Ti ricontatteremo presto.",
        errorMessage: "Si è verificato un errore nell'invio del messaggio. Riprova per favore.",
      },
      info: {
        title: "Informazioni di Contatto",
        description:
          "Siamo qui per aiutarti a portare il tuo progetto al livello successivo. Non esitare a contattarci per una consulenza gratuita.",
        email: "Email",
        phone: "Telefono",
        location: "Posizione",
      },
      hours: {
        title: "Orari di Apertura",
        weekdays: "Lunedì a Venerdì: 9:00 - 18:00",
        weekend: "Sabato: 10:00 - 14:00",
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
        features: ["React & Next.js", "Astro", "TypeScript", "Tailwind CSS"],
      },
      mobile: {
        title: "Sviluppo Mobile",
        description: "App mobile native e cross-platform per iOS e Android.",
        features: ["React Native", "Expo", "Cross-platform", "Performance Nativa"],
      },
      backend: {
        title: "Backend e API",
        description:
          "Servizi backend robusti e API scalabili con Node.js ed Express.",
        features: ["Node.js", "Express.js", "MongoDB", "API RESTful"],
      },
      cloud: {
        title: "Cloud e DevOps",
        description:
          "Infrastruttura cloud e deployment automatizzato per massime prestazioni.",
        features: ["Supabase", "Firebase", "Vercel", "CI/CD"],
      },
      design: {
        title: "Design UI/UX",
        description:
          "Design intuitivi e attraenti che migliorano l'esperienza utente.",
        features: ["Figma", "Design Responsive", "Ricerca Utenti", "Prototipazione"],
      },
      consulting: {
        title: "Consulenza Tecnica",
        description:
          "Consulenza strategica per ottimizzare la tua infrastruttura tecnologica.",
        features: ["Revisione Architettura", "Audit Performance", "Strategia Tech", "Revisione Codice"],
      },
      maintenance: {
        title: "Manutenzione e Supporto",
        description:
          "Supporto continuo per mantenere le tue applicazioni funzionanti in modo ottimale.",
        features: ["Monitoraggio 24/7", "Correzione Bug", "Aggiornamenti", "Ottimizzazione Performance"],
      },
      startProject: "Inizia Progetto",
      learnMore: "Scopri di Più",
    },
    footer: {
      description:
        "Trasformiamo idee in realtà digitale con tecnologia all'avanguardia.",
      quickLinks: "Link Rapidi",
      services: "Servizi",
      technologies: "Tecnologie",
      company: "Azienda",
      blog: "Blog",
      contact: "Contatti",
      followUs: "Seguici",
      rights: "Tutti i diritti riservati.",
      privacyPolicy: "Informativa sulla Privacy",
      termsOfService: "Termini di Servizio",
    },
    legal: {
      privacyPolicy: {
        title: "Informativa sulla Privacy",
        lastUpdated: "Ultimo aggiornamento: Gennaio 2024",
        sections: {
          introduction: "In Capsule Codes, ci impegniamo a proteggere la tua privacy. Questa Informativa sulla Privacy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali quando visiti il nostro sito web o utilizzi i nostri servizi.",
          dataCollection: "Raccogliamo informazioni che ci fornisci direttamente, come quando compili il nostro modulo di contatto, incluso il tuo nome, indirizzo email, nome dell'azienda e qualsiasi messaggio che ci invii.",
          dataUsage: "Utilizziamo le informazioni che raccogliamo per rispondere alle tue richieste, fornire i nostri servizi, migliorare il nostro sito web e comunicare con te riguardo ai nostri servizi e aggiornamenti.",
          dataProtection: "Implementiamo misure tecniche e organizzative appropriate per proteggere le tue informazioni personali da accesso non autorizzato, alterazione, divulgazione o distruzione.",
          cookies: "Il nostro sito web utilizza cookie per migliorare la tua esperienza di navigazione. Puoi scegliere di disabilitare i cookie attraverso le impostazioni del tuo browser, sebbene ciò possa influenzare la funzionalità del sito web.",
          thirdParty: "Non vendiamo, scambiamo o affittiamo le tue informazioni personali a terze parti. Potremmo condividere informazioni con fornitori di servizi fidati che ci assistono nell'operare il nostro sito web e condurre la nostra attività.",
          rights: "Hai il diritto di accedere, correggere o eliminare le tue informazioni personali in qualsiasi momento. Per favore contattaci se desideri esercitare questi diritti.",
          changes: "Potremmo aggiornare questa Informativa sulla Privacy di tanto in tanto. Ti notificheremo eventuali modifiche pubblicando la nuova Informativa sulla Privacy su questa pagina.",
          contact: "Se hai domande su questa Informativa sulla Privacy, per favore contattaci a info@capsulecodes.com.",
        },
      },
      termsOfService: {
        title: "Termini di Servizio",
        lastUpdated: "Ultimo aggiornamento: Gennaio 2024",
        sections: {
          introduction: "Questi Termini di Servizio disciplinano il tuo accesso e utilizzo del sito web e dei servizi di Capsule Codes. Accedendo o utilizzando i nostri servizi, accetti di essere vincolato da questi Termini.",
          services: "Capsule Codes fornisce servizi di sviluppo web e mobile, consulenza tecnica e servizi correlati come descritto sul nostro sito web. Tutti i servizi sono soggetti a disponibilità e alla nostra accettazione del tuo progetto.",
          userObligations: "Accetti di fornire informazioni accurate quando utilizzi i nostri servizi e di utilizzare i nostri servizi solo per scopi legali. Sei responsabile di mantenere la riservatezza di eventuali credenziali dell'account.",
          intellectualProperty: "Tutto il contenuto su questo sito web, inclusi ma non limitati a testo, grafica, loghi e software, è di proprietà di Capsule Codes ed è protetto dalle leggi sulla proprietà intellettuale.",
          payment: "I termini di pagamento saranno concordati per iscritto prima dell'inizio di qualsiasi progetto. Tutte le tariffe non sono rimborsabili a meno che non sia diversamente indicato nel tuo accordo di servizio specifico.",
          liability: "Capsule Codes fornisce servizi 'così come sono' e non fornisce garanzie, espresse o implicite. Non siamo responsabili per eventuali danni indiretti, incidentali o consequenziali derivanti dal tuo utilizzo dei nostri servizi.",
          termination: "Ci riserviamo il diritto di terminare o sospendere l'accesso ai nostri servizi in qualsiasi momento, senza preavviso, per condotta che riteniamo violi questi Termini o sia dannosa per altri utenti.",
          changes: "Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Notificheremo gli utenti di eventuali modifiche materiali pubblicando i Termini aggiornati su questa pagina.",
          contact: "Se hai domande su questi Termini di Servizio, per favore contattaci a info@capsulecodes.com.",
        },
      },
    },
      quote: "Il potere viene in risposta a un bisogno, non a un desiderio. - Goku 🐉",
    },
    admin: {
      common: {
        save: "Salva",
        saving: "Salvataggio...",
        cancel: "Annulla",
        edit: "Modifica",
        delete: "Elimina",
        add: "Aggiungi",
      },
      technologies: {
        title: "Gestione Tecnologie",
        newTechnology: "Nuova Tecnologia",
        editTechnology: "Modifica Tecnologia",
        name: "Nome",
        icon: "Icona (emoji)",
        category: "Categoria",
        selectCategory: "Seleziona categoria",
        requiredFields: "Compila tutti i campi obbligatori",
        deleteConfirm: "Sei sicuro di voler eliminare questa tecnologia?",
        saveError: "Errore nel salvataggio",
        deleteError: "Errore nell'eliminazione della tecnologia",
      },
      reviews: {
        title: "Gestione Recensioni",
        newReview: "Aggiungi Recensione",
        editReview: "Modifica Recensione",
        author: "Autore",
        company: "Azienda",
        position: "Posizione",
        rating: "Valutazione (1-5)",
        ratingRange: "La valutazione deve essere tra 1 e 5",
        avatar: "URL Avatar",
        date: "Data",
        text: "Testo della Recensione",
        invalidRating: "La valutazione deve essere tra 1 e 5",
        deleteConfirm: "Sei sicuro di voler eliminare questa recensione?",
        saveError: "Errore nel salvataggio della recensione",
        deleteError: "Errore nell'eliminazione della recensione",
      },
      contactMessages: {
        title: "Messaggi di Contatto",
        messages: "messaggi",
        noMessages: "Nessun messaggio ancora",
        messageFrom: "Messaggio da",
        email: "Email",
        company: "Azienda",
        message: "Messaggio",
        status: "Stato",
        deleteConfirm: "Eliminare questo messaggio?",
        statuses: {
          unread: "Non letto",
          read: "Letto",
          replied: "Risposto",
          archived: "Archiviato",
        },
      },
      contactInfo: {
        title: "Informazioni di Contatto",
        contactDetails: "Dati di Contatto",
        email: "Email",
        phone: "Telefono",
        location: "Posizione",
        locationDefault: "Posizione (predefinita)",
        multilingualLocation: "Posizione Multilingue",
        saveChanges: "Salva Modifiche",
        updated: "Informazioni aggiornate",
        updateError: "Errore nell'aggiornamento",
      },
      projects: {
        images: "Immagini del Progetto (Azure)",
        imageDescription: "Massimo 10 immagini. Saranno convertite in WebP automaticamente.",
        selectedImages: "selezionate",
        currentImages: "Immagini Attuali",
        maxImages: "Massimo 10 immagini consentite",
      },
    },
  },
};

export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};
