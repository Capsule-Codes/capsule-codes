import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Por favor ingresa un email válido")
    .min(5, "El email es demasiado corto")
    .max(100, "El email es demasiado largo"),
  company: z
    .string()
    .max(100, "El nombre de la empresa es demasiado largo")
    .optional(),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede exceder 1000 caracteres"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
