"use client"
import { useCallback, useEffect, useState } from "react"
import { useChatStore } from "@/store/chatStore"
import { MoodSadSquintIcon } from "@/icons"
import Image from "next/image"
import Spinner from "../Spinner"

type Chat = {
  id: string
  otherParticipant: {
    id: string
    username: string
    avatar: string | null
  } | null
}

export default function ChatList() {
  const { chats, fetchChats, loading, selectChat, selectedChatId } =
    useChatStore()
  const [search, setSearch] = useState<string>("")
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats)
  const [searching, setSearching] = useState<boolean>(false)

  const openChat = (chatId: string) => {
    selectChat(chatId)
  }

  const handleSearch = useCallback(
    async (query: string) => {
      setSearch(query)

      if (query.trim() === "") {
        setFilteredChats(chats)
        return
      }

      try {
        setSearching(true)
        const res = await fetch(
          `/api/chat/search?query=${encodeURIComponent(query)}`
        )
        if (!res.ok) throw new Error("Error al buscar chats")

        const data: Chat[] = await res.json()

        const normalizedChats = data.map((chat, index) => ({
          id: chat.id ?? `chat-${index}`,
          otherParticipant: chat.otherParticipant || null,
        }))

        setFilteredChats(normalizedChats)
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    },
    [chats]
  )

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  useEffect(() => {
    setFilteredChats(
      chats.map((chat) => ({
        id: chat.id,
        otherParticipant: chat.otherParticipant || null,
      }))
    )
  }, [chats])

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar chats..."
        className="w-full p-2 border-2 border-primary-third rounded text-white outline-primary-second mb-4"
      />

      {loading || searching ? (
        <Spinner />
      ) : filteredChats.length === 0 ? (
        <div className="text-white flex items-center gap-2">
          <span>No tienes ningún chat aún</span>
          <MoodSadSquintIcon className="size-7" />
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <li
              key={chat.id ?? `chat-${index}`}
              onClick={() => openChat(chat.id)}
              className={`w-full hover:bg-primary-second transition-colors duration-100 cursor-pointer px-2 py-3 rounded ${selectedChatId === chat.id && "bg-primary-second"}`}
            >
              <div className="flex items-center gap-2">
                {chat.otherParticipant?.avatar ? (
                  <Image
                    src={chat.otherParticipant.avatar}
                    alt={chat.otherParticipant.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover size-10"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    {chat.otherParticipant?.username?.[0] || "?"}
                  </div>
                )}
                <span className="font-medium text-white text-lg">
                  {chat.otherParticipant?.username ||
                    "Chat sin otros participantes"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
