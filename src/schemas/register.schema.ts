import { z } from "zod"

const validatePassword =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const registerSchema = z
  .object({
    email: z.email({ error: "Ingresa un correo válido" }),
    username: z.string().min(3, {
      error: "El nombre de usuario debe tener al menos 3 caracteres",
    }),
    password: z.string().regex(validatePassword, {
      error:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
