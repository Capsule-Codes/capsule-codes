"use client"

import type React from "react"

import { useData } from "@/lib/data-context"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Settings, FolderOpen, Code } from "lucide-react"
import type { Project, Technology } from "@/lib/data-context"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  // Admin credentials (in production, use proper authentication)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "capsule2024",
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.username === ADMIN_CREDENTIALS.username && loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Credenciales incorrectas")
    }
  }

  const {
    projects,
    technologies,
    addProject,
    updateProject,
    deleteProject,
    addTechnology,
    updateTechnology,
    deleteTechnology,
  } = useData()

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isTechDialogOpen, setIsTechDialogOpen] = useState(false)

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    category: "web" as "web" | "mobile" | "fullstack",
    liveUrl: "",
    githubUrl: "",
  })

  // Technology form state
  const [techForm, setTechForm] = useState({
    name: "",
    icon: "",
    category: "frontend" as "frontend" | "backend" | "mobile" | "database" | "deployment",
    description: "",
  })

  const categories = ["web", "mobile", "fullstack"]
  const techCategories = ["frontend", "backend", "mobile", "database", "deployment"]

  // Project handlers
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies.join(", "),
      category: project.category,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
    })
    setIsProjectDialogOpen(true)
  }

  const handleSaveProject = () => {
    const projectData = {
      title: projectForm.title,
      description: projectForm.description,
      image: projectForm.image,
      technologies: projectForm.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech),
      category: projectForm.category,
      liveUrl: projectForm.liveUrl,
      githubUrl: projectForm.githubUrl,
    }

    if (editingProject) {
      updateProject(editingProject.id, projectData)
    } else {
      addProject(projectData)
    }

    resetProjectForm()
  }

  const handleDeleteProject = (id: string) => {
    deleteProject(id)
  }

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      image: "",
      technologies: "",
      category: "web",
      liveUrl: "",
      githubUrl: "",
    })
    setEditingProject(null)
    setIsProjectDialogOpen(false)
  }

  // Technology handlers
  const handleEditTechnology = (tech: Technology) => {
    setEditingTechnology(tech)
    setTechForm({
      name: tech.name,
      icon: tech.icon,
      category: tech.category,
      description: tech.description,
    })
    setIsTechDialogOpen(true)
  }

  const handleSaveTechnology = () => {
    const techData = {
      name: techForm.name,
      icon: techForm.icon,
      category: techForm.category,
      description: techForm.description,
    }

    if (editingTechnology) {
      updateTechnology(editingTechnology.id, techData)
    } else {
      addTechnology(techData)
    }

    resetTechForm()
  }

  const handleDeleteTechnology = (id: string) => {
    deleteTechnology(id)
  }

  const resetTechForm = () => {
    setTechForm({
      name: "",
      icon: "",
      category: "frontend",
      description: "",
    })
    setEditingTechnology(null)
    setIsTechDialogOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Settings className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                Iniciar Sesión
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Credenciales de prueba:</strong>
                <br />
                Usuario: admin
                <br />
                Contraseña: capsule2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="md:text-2xl text-xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">Gestiona proyectos y tecnologías</p>
              </div>
            </div>
            <div className="flex gap-2 md:flex-row flex-col">
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Ver Sitio Web
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="technologies" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Tecnologías
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Gestión de Proyectos</h2>
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingProject(null)}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="Nombre del proyecto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Descripción del proyecto"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoría</Label>
                      <Select
                        value={projectForm.category}
                        onValueChange={(value: "web" | "mobile" | "fullstack") =>
                          setProjectForm({ ...projectForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="fullstack">Full Stack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">URL de Imagen</Label>
                      <Input
                        id="image"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="/path/to/image.png"
                      />
                    </div>
                    <div>
                      <Label htmlFor="technologies">Tecnologías (separadas por comas)</Label>
                      <Input
                        id="technologies"
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        placeholder="React, Next.js, TypeScript"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="liveUrl">URL Demo (opcional)</Label>
                        <Input
                          id="liveUrl"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          placeholder="https://demo.example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="githubUrl">URL GitHub (opcional)</Label>
                        <Input
                          id="githubUrl"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                          placeholder="https://github.com/user/repo"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetProjectForm}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveProject} className="bg-gradient-to-r from-primary to-secondary">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-background/90 capitalize">{project.category}</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProject(project)} className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Technologies Tab */}
          <TabsContent value="technologies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Gestión de Tecnologías</h2>
              <Dialog open={isTechDialogOpen} onOpenChange={setIsTechDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingTechnology(null)}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Tecnología
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingTechnology ? "Editar Tecnología" : "Nueva Tecnología"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="techName">Nombre</Label>
                      <Input
                        id="techName"
                        value={techForm.name}
                        onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                        placeholder="React"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techIcon">Icono (emoji)</Label>
                      <Input
                        id="techIcon"
                        value={techForm.icon}
                        onChange={(e) => setTechForm({ ...techForm, icon: e.target.value })}
                        placeholder="⚛️"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techDescription">Descripción</Label>
                      <Input
                        id="techDescription"
                        value={techForm.description}
                        onChange={(e) => setTechForm({ ...techForm, description: e.target.value })}
                        placeholder="Modern UI library"
                      />
                    </div>
                    <div>
                      <Label htmlFor="techCategory">Categoría</Label>
                      <Select
                        value={techForm.category}
                        onValueChange={(value: "frontend" | "backend" | "mobile" | "database" | "deployment") =>
                          setTechForm({ ...techForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="deployment">Deployment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={resetTechForm}>
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveTechnology} className="bg-gradient-to-r from-primary to-secondary">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {techCategories.map((category) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {technologies
                      .filter((tech) => tech.category === category)
                      .map((tech) => (
                        <div key={tech.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{tech.icon}</span>
                            <span className="text-sm font-medium">{tech.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTechnology(tech)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTechnology(tech.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
