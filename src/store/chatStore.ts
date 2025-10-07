import { create } from "zustand"
import { apiClient } from "@/libs/apiClient"
import { API_ROUTES } from "@/routes/apiRoutes"

type Chat = {
  id: string
  otherParticipant: {
    id: string
    username: string
    avatar: string | null
  } | null
}

type ChatStore = {
  chats: Chat[]
  loading: boolean
  selectedChatId: string | null
  fetchChats: () => Promise<void>
  setChats: (chats: Chat[]) => void
  selectChat: (chatId: string | null) => void
  deleteChat: (chatId: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  loading: false,
  selectedChatId: null,

  fetchChats: async () => {
    set({ loading: true })
    try {
      const res = await apiClient(API_ROUTES.CHATS.GET_BY_USER_ID)

      if (!res.ok) throw new Error("Error al cargar los chats")

      const data = await res.json()

      set({ chats: data })
    } catch (error) {
      console.error(error)
    } finally {
      set({ loading: false })
    }
  },

  setChats: (chats) => set({ chats }),
  selectChat: (chatId) => set({ selectedChatId: chatId }),
  deleteChat: async (chatId: string) => {
    try {
      const res = await apiClient(`/api/chat/${chatId}`, "DELETE")

      if (!res.ok) throw new Error("Error al eliminar el chat")

      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        selectedChatId:
          state.selectedChatId === chatId ? null : state.selectedChatId,
      }))
    } catch (error) {
      console.error("Error eliminando el chat:", error)
      throw error
    }
  },
}))
