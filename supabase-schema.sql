-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{
    "en": {"title": "", "description": ""},
    "es": {"title": "", "description": ""},
    "it": {"title": "", "description": ""}
  }',
  image TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('web', 'mobile', 'fullstack')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technologies table
CREATE TABLE IF NOT EXISTS technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'mobile', 'database', 'deployment')),
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{
    "en": {"name": "", "description": ""},
    "es": {"name": "", "description": ""},
    "it": {"name": "", "description": ""}
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{
    "en": {"text": "", "author": "", "company": "", "position": ""},
    "es": {"text": "", "author": "", "company": "", "position": ""},
    "it": {"text": "", "author": "", "company": "", "position": ""}
  }',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO projects (title, description, translations, image, technologies, live_url, github_url, category) VALUES
(
  'E-commerce Platform',
  'Full-stack e-commerce solution with React, Node.js, and MongoDB',
  '{
    "en": {
      "title": "E-commerce Platform",
      "description": "Full-stack e-commerce solution with React, Node.js, and MongoDB"
    },
    "es": {
      "title": "Plataforma de E-commerce",
      "description": "Solución completa de comercio electrónico con React, Node.js y MongoDB"
    },
    "it": {
      "title": "Piattaforma E-commerce",
      "description": "Soluzione e-commerce full-stack con React, Node.js e MongoDB"
    }
  }',
  '/modern-ecommerce-platform.jpg',
  ARRAY['React', 'Node.js', 'MongoDB', 'Express'],
  'https://example.com',
  'https://github.com/example',
  'fullstack'
),
(
  'Mobile Fitness App',
  'React Native fitness tracking app with real-time analytics',
  '{
    "en": {
      "title": "Mobile Fitness App",
      "description": "React Native fitness tracking app with real-time analytics"
    },
    "es": {
      "title": "App de Fitness Móvil",
      "description": "Aplicación móvil de seguimiento fitness con React Native y análisis en tiempo real"
    },
    "it": {
      "title": "App Fitness Mobile",
      "description": "App mobile per il tracking del fitness con React Native e analytics in tempo reale"
    }
  }',
  '/fitness-mobile-app-interface.png',
  ARRAY['React Native', 'Expo', 'Firebase'],
  'https://apps.apple.com/example',
  NULL,
  'mobile'
);

INSERT INTO technologies (name, category, icon, description) VALUES
('React.js', 'frontend', '⚛️', 'A JavaScript library for building user interfaces'),
('Next.js', 'frontend', '▲', 'The React Framework for Production'),
('Node.js', 'backend', '🟢', 'JavaScript runtime built on Chrome''s V8 JavaScript engine'),
('PostgreSQL', 'database', '🐘', 'Advanced open source database');

INSERT INTO reviews (text, author, company, position, translations, rating, avatar, date) VALUES
(
  'Capsule Codes delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is outstanding.',
  'Sarah Johnson',
  'TechCorp Solutions',
  'CEO',
  '{
    "en": {
      "text": "Capsule Codes delivered an exceptional web application that exceeded our expectations. Their attention to detail and technical expertise is outstanding.",
      "author": "Sarah Johnson",
      "company": "TechCorp Solutions",
      "position": "CEO"
    },
    "es": {
      "text": "Capsule Codes entregó una aplicación web excepcional que superó nuestras expectativas. Su atención al detalle y experiencia técnica es sobresaliente.",
      "author": "Sarah Johnson",
      "company": "TechCorp Solutions",
      "position": "CEO"
    },
    "it": {
      "text": "Capsule Codes ha consegnato un''applicazione web eccezionale che ha superato le nostre aspettative. La loro attenzione ai dettagli e competenza tecnica è eccezionale.",
      "author": "Sarah Johnson",
      "company": "TechCorp Solutions",
      "position": "CEO"
    }
  }',
  5,
  '/placeholder-user.jpg',
  '2024-01-15'
),
(
  'Working with Capsule Codes was a game-changer for our business. They transformed our ideas into a powerful digital solution.',
  'Michael Chen',
  'InnovateLab',
  'CTO',
  '{
    "en": {
      "text": "Working with Capsule Codes was a game-changer for our business. They transformed our ideas into a powerful digital solution.",
      "author": "Michael Chen",
      "company": "InnovateLab",
      "position": "CTO"
    },
    "es": {
      "text": "Trabajar con Capsule Codes fue un cambio radical para nuestro negocio. Transformaron nuestras ideas en una solución digital poderosa.",
      "author": "Michael Chen",
      "company": "InnovateLab",
      "position": "CTO"
    },
    "it": {
      "text": "Lavorare con Capsule Codes è stato un punto di svolta per la nostra azienda. Hanno trasformato le nostre idee in una potente soluzione digitale.",
      "author": "Michael Chen",
      "company": "InnovateLab",
      "position": "CTO"
    }
  }',
  5,
  '/placeholder-user.jpg',
  '2024-02-20'
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON reviews FOR SELECT USING (true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Allow authenticated users to manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage technologies" ON technologies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
