"use client"
import { useEffect, useState, useRef } from "react"
import { useSocket } from "@/contexts/SocketContext"
import { apiClient } from "@/libs/apiClient"
import { SendIcon, TrashIcon, PaperClipIcon } from "@/icons"
import { useChatStore } from "@/store/chatStore"
import toast from "react-hot-toast"
import Message from "./Message"
import Image from "next/image"

interface MessageType {
  id: string
  chatId: string
  authorId: string
  content: string
  type: "TEXT" | "IMAGE" | "FILE"
  createdAt: string
  updatedAt: string
}

interface ChatRoomProps {
  userId: string
  chatId: string
}

interface OtherParticipant {
  id: string
  username: string
  avatar?: string
}

interface Chat {
  id: string
  otherParticipant: OtherParticipant | null
  messages: MessageType[]
}

export default function ChatRoom({ userId, chatId }: ChatRoomProps) {
  const [chat, setChat] = useState<Chat>()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const socket = useSocket()

  const { deleteChat } = useChatStore((state) => state)

  const handleSend = () => {
    if (newMessage.trim() === "") return

    setError(null)

    socket.emit(
      "sendMessage",
      {
        chatId,
        senderId: userId,
        content: newMessage,
      },
      (error: string | null) => {
        if (error) setError("Error al enviar el mensaje. Intenta de nuevo.")
        else setNewMessage("")
      }
    )

    setNewMessage("")
  }

  const handleClipClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/chat/upload-file", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Error al subir el archivo")

      const data = await res.json()
      const type = data.type === "image" ? "IMAGE" : "FILE"

      socket.emit(
        "sendMessage",
        {
          chatId,
          senderId: userId,
          content: data.url,
          type,
        },
        (error: string | null) => {
          if (error) setError("Error al enviar el archivo")
        }
      )
    } catch (err) {
      console.error(err)
      toast.error("Error al subir el archivo")
    }
  }

  const handleDeleteChat = async () => {
    const confirmDelete = confirm("¿Seguro que deseas eliminar este chat?")
    if (!confirmDelete) return

    try {
      await deleteChat(chatId)
      toast.success("Chat eliminado con éxito")
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar el chat")
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)
        const res = await apiClient(`/api/chat/${chatId}`)

        if (!res.ok) {
          throw new Error("Error al cargar los mensajes. Intenta de nuevo.")
        }

        const chat = await res.json()

        setChat(chat)
        setMessages(chat.messages || [])
      } catch (error) {
        if (error instanceof Error) toast.error(error.message)
        else toast.error("No se pudieron cargar las solicitudes")
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [chatId])

  useEffect(() => {
    socket.emit("joinChat", chatId)

    socket.on("newMessage", (message: MessageType) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off("newMessage")
    }
  }, [chatId, socket])

  return (
    <div className="flex flex-col h-full">
      <div className="w-full flex items-center justify-between bg-primary-first px-2 py-4">
        <div className="flex items-center gap-2 select-none">
          {chat ? (
            <>
              {chat.otherParticipant?.avatar ? (
                <Image
                  src={chat.otherParticipant.avatar}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full size-8"
                />
              ) : (
                <div className="size-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                  {chat.otherParticipant?.username?.[0] || "?"}
                </div>
              )}
              <h3 className="text-white font-semibold text-xl">
                {chat.otherParticipant?.username || "Chat sin nombre"}
              </h3>
            </>
          ) : (
            <h3 className="text-white font-semibold text-xl">
              Cargando chat...
            </h3>
          )}
        </div>

        <button
          type="button"
          onClick={handleDeleteChat}
          className="text-red-300 hover:text-red-500 cursor-pointer transition-colors duration-200"
          title="Eliminar chat"
        >
          <TrashIcon className="size-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Cargando mensajes...
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg.id} message={msg} userId={userId} />
          ))
        )}
      </div>

      <div className="px-4 flex items-center mb-5 relative">
        <input
          value={newMessage}
          placeholder="Escribe un mensaje..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSend()
            }
          }}
          className="flex-1 px-3 py-4 border-secondary border-[1px] w-full rounded-md outline-primary-second text-lg"
        />

        <button
          type="button"
          onClick={handleClipClick}
          className="absolute right-20 top-[18px] cursor-pointer text-primary-first hover:text-primary-third transition-colors duration-200"
        >
          <PaperClipIcon className="size-7" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        <button
          type="button"
          className="absolute right-8 top-[18px] cursor-pointer text-primary-first hover:text-primary-third transition-colors duration-200"
          onClick={handleSend}
        >
          <SendIcon className="size-7" />
        </button>
      </div>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}
