import { createServer } from "http"
import { Server } from "socket.io"
import { prisma } from "../src/libs/db"
import dotenv from "dotenv"

interface ServerToClientEvents {
  newMessage: (data: {
    id: string
    chatId: string
    authorId: string
    content: string
    type: "TEXT" | "IMAGE" | "FILE"
    createdAt: Date
    updatedAt: Date
    username: string
  }) => void
}

interface ClientToServerEvents {
  joinChat: (chatId: string) => void
  sendMessage: (payload: {
    chatId: string
    senderId: string
    content: string
    type: "TEXT" | "IMAGE" | "FILE"
  }) => void
}

dotenv.config()

const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || 3001
const httpServer = createServer()

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    credentials: true,
  },
})

io.on("connection", (socket) => {
  console.log("Usuario conectado", socket.id)

  socket.on("joinChat", (chatId) => {
    if (!chatId) return
    socket.join(chatId)
    console.log(`Usuario ${socket.id} se unió al chat ${chatId}`)
  })

  socket.on("sendMessage", async ({ chatId, senderId, content, type }) => {
    try {
      if (!chatId || !senderId || !content.trim()) return

      const message = await prisma.message.create({
        data: {
          chatId,
          authorId: senderId,
          content,
          type,
        },
      })

      const user = await prisma.user.findUnique({
        where: { id: senderId },
        select: { username: true },
      })

      io.to(chatId).emit("newMessage", {
        id: message.id,
        chatId: message.chatId,
        authorId: message.authorId,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        username: user?.username || "Desconocido",
      })

      console.log(`Mensaje enviado en chat ${chatId} por ${user?.username}`)
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
    }
  })

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

process.on("SIGINT", async () => {
  console.log("Cerrando servidor y desconectando Prisma...")
  await prisma.$disconnect()
  process.exit(0)
})
