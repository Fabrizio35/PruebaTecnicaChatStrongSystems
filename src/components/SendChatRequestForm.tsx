"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { apiClient } from "@/libs/apiClient"
import { API_ROUTES } from "@/routes/apiRoutes"
import toast from "react-hot-toast"

type FormData = {
  identifier: string
}

export default function SendChatRequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>()

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async ({ identifier }: FormData) => {
    setLoading(true)

    try {
      const userRes = await apiClient(
        API_ROUTES.USERS.SEARCH_ID_BY_USERNAME_OR_EMAIL,
        "POST",
        {
          identifier,
        }
      )

      if (!userRes.ok) {
        const data = await userRes.json()
        throw new Error(data.message || "User not found")
      }

      const user = await userRes.json()

      const requestRes = await apiClient(
        API_ROUTES.CHAT_REQUESTS.SEND,
        "POST",
        {
          receiverId: user.id,
        }
      )

      if (!requestRes.ok) {
        const data = await requestRes.json()
        if (data.message === "Request already sent")
          throw new Error("La solicitud ya fue enviada")
        throw new Error(data.message || "Error sending request")
      }

      toast.success("Solicitud enviada correctamente")
      reset()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <h3 className="text-white font-semibold text-lg">
        Enviar solicitud de chat
      </h3>

      <input
        type="text"
        className="w-full p-2 border-2 border-primary-third rounded text-white outline-primary-second"
        placeholder="Nombre de usuario o email"
        {...register("identifier", { required: "Este campo es requerido" })}
      />
      {errors.identifier && (
        <p className="text-red-200 text-sm mb-2">{errors.identifier.message}</p>
      )}

      <button
        type="submit"
        className="bg-white text-primary-first font-semibold py-2 rounded-md w-full cursor-pointer disabled:opacity-50"
        disabled={loading || !isValid}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  )
}
