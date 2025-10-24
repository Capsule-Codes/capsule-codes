"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#technologies", label: t.nav.technologies },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ]

  const handleNavClick = (href: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`
      return
    }

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleStartProject = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/#contact"
      return
    }

    const contactElement = document.querySelector("#contact")
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Capsule Codes"
              width={50}
              height={50}
              className="animate-pulse"
            />
            <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Capsule Codes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/projects"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              {t.projects.viewAll}
            </Link>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Admin
            </Link>
          </nav>

          {/* CTA Button and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <Button
              onClick={handleStartProject}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {t.services.startProject}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-left cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/projects"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.projects.viewAll}
              </Link>
              <Link
                href="/admin"
                className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher />
                <Button
                  onClick={handleStartProject}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 ml-4"
                >
                  {t.services.startProject}
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
