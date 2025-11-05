-- Seed script para llenar la tabla de tecnologías con datos completos y traducciones
-- Ejecutar en el SQL Editor de Supabase

-- Limpiar datos existentes (opcional)
-- DELETE FROM technologies;

-- Insertar tecnologías completas con traducciones
INSERT INTO technologies (name, category, icon, description, translations) VALUES
-- Frontend
('React.js', 'frontend', '⚛️', 'A JavaScript library for building user interfaces', '{
  "en": {"name": "React.js", "description": "A JavaScript library for building user interfaces"},
  "es": {"name": "React.js", "description": "Una biblioteca de JavaScript para construir interfaces de usuario"},
  "it": {"name": "React.js", "description": "Una libreria JavaScript per costruire interfacce utente"}
}'),
('Next.js', 'frontend', '▲', 'The React Framework for Production', '{
  "en": {"name": "Next.js", "description": "The React Framework for Production"},
  "es": {"name": "Next.js", "description": "El Framework de React para Producción"},
  "it": {"name": "Next.js", "description": "Il Framework React per la Produzione"}
}'),
('Astro', 'frontend', '🚀', 'Static site generator', '{
  "en": {"name": "Astro", "description": "Static site generator"},
  "es": {"name": "Astro", "description": "Generador de sitios estáticos"},
  "it": {"name": "Astro", "description": "Generatore di siti statici"}
}'),
('Tailwind CSS', 'frontend', '🎨', 'Utility-first CSS framework', '{
  "en": {"name": "Tailwind CSS", "description": "Utility-first CSS framework"},
  "es": {"name": "Tailwind CSS", "description": "Framework CSS utility-first"},
  "it": {"name": "Tailwind CSS", "description": "Framework CSS utility-first"}
}'),
('TypeScript', 'frontend', '🔷', 'Typed JavaScript superset', '{
  "en": {"name": "TypeScript", "description": "Typed JavaScript superset"},
  "es": {"name": "TypeScript", "description": "Superset tipado de JavaScript"},
  "it": {"name": "TypeScript", "description": "Superset tipizzato di JavaScript"}
}'),
('Vue.js', 'frontend', '💚', 'Progressive JavaScript framework', '{
  "en": {"name": "Vue.js", "description": "Progressive JavaScript framework"},
  "es": {"name": "Vue.js", "description": "Framework JavaScript progresivo"},
  "it": {"name": "Vue.js", "description": "Framework JavaScript progressivo"}
}'),
('D3.js', 'frontend', '📊', 'Data visualization library', '{
  "en": {"name": "D3.js", "description": "Data visualization library"},
  "es": {"name": "D3.js", "description": "Biblioteca de visualización de datos"},
  "it": {"name": "D3.js", "description": "Libreria per la visualizzazione dei dati"}
}'),
('Three.js', 'frontend', '🎮', '3D graphics library', '{
  "en": {"name": "Three.js", "description": "3D graphics library"},
  "es": {"name": "Three.js", "description": "Biblioteca de gráficos 3D"},
  "it": {"name": "Three.js", "description": "Libreria di grafica 3D"}
}'),

-- Backend
('Node.js', 'backend', '🟢', 'JavaScript runtime built on Chrome''s V8 JavaScript engine', '{
  "en": {"name": "Node.js", "description": "JavaScript runtime built on Chrome''s V8 JavaScript engine"},
  "es": {"name": "Node.js", "description": "Runtime de JavaScript construido en el motor V8 de Chrome"},
  "it": {"name": "Node.js", "description": "Runtime JavaScript costruito sul motore V8 di Chrome"}
}'),
('Express.js', 'backend', '🚂', 'Web framework for Node.js', '{
  "en": {"name": "Express.js", "description": "Web framework for Node.js"},
  "es": {"name": "Express.js", "description": "Framework web para Node.js"},
  "it": {"name": "Express.js", "description": "Framework web per Node.js"}
}'),
('OpenAI API', 'backend', '🤖', 'Artificial Intelligence API', '{
  "en": {"name": "OpenAI API", "description": "Artificial Intelligence API"},
  "es": {"name": "OpenAI API", "description": "API de Inteligencia Artificial"},
  "it": {"name": "OpenAI API", "description": "API di Intelligenza Artificiale"}
}'),
('Stripe', 'backend', '💳', 'Payment processing platform', '{
  "en": {"name": "Stripe", "description": "Payment processing platform"},
  "es": {"name": "Stripe", "description": "Plataforma de procesamiento de pagos"},
  "it": {"name": "Stripe", "description": "Piattaforma di elaborazione pagamenti"}
}'),

-- Mobile
('React Native', 'mobile', '📱', 'Cross-platform mobile development', '{
  "en": {"name": "React Native", "description": "Cross-platform mobile development"},
  "es": {"name": "React Native", "description": "Desarrollo móvil multiplataforma"},
  "it": {"name": "React Native", "description": "Sviluppo mobile multipiattaforma"}
}'),
('Expo', 'mobile', '⚡', 'React Native development platform', '{
  "en": {"name": "Expo", "description": "React Native development platform"},
  "es": {"name": "Expo", "description": "Plataforma de desarrollo React Native"},
  "it": {"name": "Expo", "description": "Piattaforma di sviluppo React Native"}
}'),

-- Database
('MongoDB', 'database', '🍃', 'NoSQL database', '{
  "en": {"name": "MongoDB", "description": "NoSQL database"},
  "es": {"name": "MongoDB", "description": "Base de datos NoSQL"},
  "it": {"name": "MongoDB", "description": "Database NoSQL"}
}'),
('Supabase', 'database', '⚡', 'Open source Firebase alternative', '{
  "en": {"name": "Supabase", "description": "Open source Firebase alternative"},
  "es": {"name": "Supabase", "description": "Alternativa open source a Firebase"},
  "it": {"name": "Supabase", "description": "Alternativa open source a Firebase"}
}'),
('Firebase', 'database', '🔥', 'Google cloud platform', '{
  "en": {"name": "Firebase", "description": "Google cloud platform"},
  "es": {"name": "Firebase", "description": "Plataforma en la nube de Google"},
  "it": {"name": "Firebase", "description": "Piattaforma cloud di Google"}
}'),
('Prisma', 'database', '🔮', 'Next-generation ORM', '{
  "en": {"name": "Prisma", "description": "Next-generation ORM"},
  "es": {"name": "Prisma", "description": "ORM de próxima generación"},
  "it": {"name": "Prisma", "description": "ORM di prossima generazione"}
}'),
('PostgreSQL', 'database', '🐘', 'Advanced open source database', '{
  "en": {"name": "PostgreSQL", "description": "Advanced open source database"},
  "es": {"name": "PostgreSQL", "description": "Base de datos open source avanzada"},
  "it": {"name": "PostgreSQL", "description": "Database open source avanzato"}
}'),
('SQLite', 'database', '🗃️', 'Lightweight embedded database', '{
  "en": {"name": "SQLite", "description": "Lightweight embedded database"},
  "es": {"name": "SQLite", "description": "Base de datos embebida ligera"},
  "it": {"name": "SQLite", "description": "Database embedded leggero"}
}'),

-- Deployment
('Vercel', 'deployment', '▲', 'Frontend deployment platform', '{
  "en": {"name": "Vercel", "description": "Frontend deployment platform"},
  "es": {"name": "Vercel", "description": "Plataforma de despliegue frontend"},
  "it": {"name": "Vercel", "description": "Piattaforma di deployment frontend"}
}'),
('App Store', 'deployment', '🍎', 'iOS app distribution', '{
  "en": {"name": "App Store", "description": "iOS app distribution"},
  "es": {"name": "App Store", "description": "Distribución de aplicaciones iOS"},
  "it": {"name": "App Store", "description": "Distribuzione app iOS"}
}'),
('Play Store', 'deployment', '🤖', 'Android app distribution', '{
  "en": {"name": "Play Store", "description": "Android app distribution"},
  "es": {"name": "Play Store", "description": "Distribución de aplicaciones Android"},
  "it": {"name": "Play Store", "description": "Distribuzione app Android"}
}');