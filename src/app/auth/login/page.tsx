"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginFormData } from "@/schemas/login.schema"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { CLIENT_ROUTES } from "@/routes/clientRoutes"
import toast from "react-hot-toast"
import AuthTitle from "@/components/auth/AuthTitle"
import FormField from "@/components/auth/FormField"
import SubmitButton from "@/components/auth/SubmitButton"
import AuthSwitchLink from "@/components/auth/AuthSwitchLink"

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const response = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        if (response.error === "No user found")
          toast.error(
            "No se encuentra un usuario con ese email o nombre de usuario"
          )

        if (response.error === "Incorrect password")
          toast.error("Contraseña incorrecta")
      } else {
        toast.success("Bienvenido")
        router.push(CLIENT_ROUTES.HOME)
      }
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error de conexión, intenta nuevamente")
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 items-center mt-5 max-w-md mx-auto"
      >
        <AuthTitle title="Iniciar sesión" />

        <FormField
          label="Correo o nombre de usuario"
          type="text"
          placeholder="example@email.com"
          autoComplete="username"
          {...register("identifier")}
          error={errors.identifier}
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="********"
          autoComplete="current-password"
          showPasswordToggle
          {...register("password")}
          error={errors.password}
        />

        <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
      </form>

      <AuthSwitchLink />
    </div>
  )
}
