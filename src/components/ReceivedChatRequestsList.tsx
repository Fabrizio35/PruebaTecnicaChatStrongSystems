"use client"
import { useState, useEffect } from "react"
import { apiClient } from "@/libs/apiClient"
import { API_ROUTES } from "@/routes/apiRoutes"
import { useChatStore } from "@/store/chatStore"
import { CircleCheckIcon, CircleXIcon } from "@/icons"
import toast from "react-hot-toast"
import Spinner from "./Spinner"

type ChatRequest = {
  id: string
  sender: {
    id: string
    username: string
    email: string
  }
  createdAt: string
}

export default function ReceivedChatRequestsList() {
  const [requests, setRequests] = useState<ChatRequest[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { fetchChats } = useChatStore()

  const fetchRequests = async () => {
    setLoading(true)

    try {
      const res = await apiClient(API_ROUTES.CHAT_REQUESTS.RECEIVED, "GET")

      if (!res.ok) throw new Error("Error al cargar las solicitudes")

      const data = await res.json()

      setRequests(data)
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("No se pudieron cargar las solicitudes")
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const res = await apiClient(API_ROUTES.CHAT_REQUESTS.RESPOND, "POST", {
        requestId,
        action,
      })

      if (!res.ok) throw new Error("Error al responder la solicitud")

      const msg =
        action === "accept" ? "Solicitud aceptada" : "Solicitud rechazada"

      toast.success(msg)

      fetchRequests()

      if (action === "accept") {
        await fetchChats()
      }
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Error al procesar la solicitud")
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="mt-10">
      <h3 className="text-white font-semibold text-lg mb-3">
        Solicitudes recibidas
      </h3>
      {loading ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <span className="text-gray-300">No tienes solicitudes pendientes.</span>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-3 rounded-md flex justify-between items-center bg-primary-second"
            >
              <div>
                <p className="text-white font-semibold">
                  {req.sender.username}
                </p>
                <p className="text-sm text-gray-300">{req.sender.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => respondToRequest(req.id, "accept")}
                  className="bg-green-600 text-white p-1.5 cursor-pointer rounded-full hover:bg-green-400 transition-colors duration-200"
                >
                  <CircleCheckIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => respondToRequest(req.id, "reject")}
                  className="bg-red-600 text-white p-1.5 cursor-pointer rounded-full hover:bg-red-400 transition-colors duration-200"
                >
                  <CircleXIcon className="size-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
