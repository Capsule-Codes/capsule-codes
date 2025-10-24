"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    servicios: [
      { name: t.services.web.title, href: "#services" },
      { name: t.services.mobile.title, href: "#services" },
      { name: "Backend & APIs", href: "#services" },
      { name: t.services.consulting.title, href: "#services" },
    ],
    tecnologias: [
      { name: "React & Next.js", href: "#technologies" },
      { name: "React Native", href: "#technologies" },
      { name: "Node.js", href: "#technologies" },
      { name: "Supabase", href: "#technologies" },
    ],
    empresa: [
      { name: t.nav.about, href: "#about" },
      { name: t.nav.projects, href: "#projects" },
      { name: t.nav.contact, href: "#contact" },
      { name: "Blog", href: "#" },
    ],
  }

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hola@capsulecodes.com", label: "Email" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <Image src="/logo.svg" alt="Capsule Codes" width={40} height={40} />
              <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Capsule Codes
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">{t.footer.description}</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{t.footer.services}</h3>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tecnologías</h3>
            <ul className="space-y-3">
              {footerLinks.tecnologias.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Capsule Codes. {t.footer.rights}
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors duration-200">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-primary transition-colors duration-200">
                Términos de Servicio
              </Link>
            </div>
          </div>

          {/* Dragon Ball Easter Egg */}
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground/70">
              "El poder viene en respuesta a una necesidad, no a un deseo." - Goku 🐉
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
