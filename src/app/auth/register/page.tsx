"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterFormData } from "@/schemas/register.schema"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CLIENT_ROUTES } from "@/routes/clientRoutes"
import { API_ROUTES } from "@/routes/apiRoutes"
import { apiClient } from "@/libs/apiClient"
import toast from "react-hot-toast"
import SubmitButton from "@/components/auth/SubmitButton"
import FormField from "@/components/auth/FormField"
import AuthTitle from "@/components/auth/AuthTitle"
import AuthSwitchLink from "@/components/auth/AuthSwitchLink"

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)

    try {
      const response = await apiClient(API_ROUTES.AUTH.REGISTER, "POST", data)

      const responseJSON = await response.json()

      if (response.ok && response.status === 201) {
        reset()
        toast.success("Usuario creado correctamente")
        router.push(CLIENT_ROUTES.AUTH.LOGIN)
      } else {
        if (responseJSON.message === "Email or username already exists")
          toast.error("El email o el nombre de usuario ya están registrados")
        else toast.error("Error al registrar usuario")
      }
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error de conexión, intenta nuevamente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-5 my-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 items-center mt-5 max-w-md mx-auto"
      >
        <AuthTitle title="Crear cuenta" />

        <FormField
          label="Nombre de usuario"
          type="text"
          placeholder="miUsuario123"
          autoComplete="username"
          {...register("username")}
          error={errors.username}
        />

        <FormField
          label="Correo"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email}
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="********"
          autoComplete="new-password"
          showPasswordToggle
          {...register("password")}
          error={errors.password}
        />

        <FormField
          label="Confirmar contraseña"
          type="password"
          placeholder="********"
          autoComplete="new-password"
          showPasswordToggle
          {...register("confirmPassword")}
          error={errors.confirmPassword}
        />

        <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
      </form>

      <AuthSwitchLink />
    </div>
  )
}
