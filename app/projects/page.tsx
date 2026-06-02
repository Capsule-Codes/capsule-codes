import { redirect } from "next/navigation"

// La página standalone de listado (grid) quedó parkeada en ./_disabled hasta que
// tengamos suficientes proyectos para justificar una página dedicada con grid +
// filtros. Por ahora /projects redirige a la sección de la landing.
// Para reactivarla: restaurar el contenido de _disabled/page.tsx acá.
export default function ProjectsPage() {
  redirect("/#projects")
}
