"use client"
import { useState, useEffect, ChangeEvent } from "react"
import { useSession } from "next-auth/react"
import { API_ROUTES } from "@/routes/apiRoutes"
import { apiClient } from "@/libs/apiClient"
import toast from "react-hot-toast"
import Image from "next/image"
import LogoutButton from "./LogoutButton"

export default function Profile() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { data: session } = useSession()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const res = await fetch(API_ROUTES.USERS.UPLOAD_AVATAR, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Error subiendo avatar")

      toast.success("Avatar actualizado correctamente")
      setAvatarPreview(data.avatarUrl)
    } catch (error) {
      if (error instanceof Error)
        toast.error(error?.message || "Error subiendo avatar")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    if (!avatarPreview) return
    const confirmed = confirm("¿Seguro que quieres eliminar tu foto de perfil?")
    if (!confirmed) return

    setUploading(true)
    try {
      const res = await apiClient(API_ROUTES.USERS.DELETE_AVATAR, "DELETE")

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error eliminando avatar")

      toast.success("Avatar eliminado correctamente")
      setAvatarPreview(null)
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message || "Error eliminando avatar")
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarPreview(session.user.avatar)
    }
  }, [session])

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-white">
        ¡Bienvenido <strong>{session?.user.username}</strong>!
      </span>

      <label className="relative cursor-pointer w-32 h-32 rounded-full overflow-hidden border-2 border-white">
        {avatarPreview ? (
          <Image
            src={avatarPreview}
            alt="Avatar"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
            Sin avatar
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {avatarPreview && !uploading && (
        <button
          onClick={handleDeleteAvatar}
          className="bg-red-400 text-white px-4 py-1 rounded cursor-pointer hover:bg-red-500 transition-colors duration-200"
        >
          Eliminar avatar
        </button>
      )}

      <LogoutButton />
    </div>
  )
}
