"use client"
import { useChatStore } from "@/store/chatStore"
import ChatRoom from "./ChatRoom"
import { BrandLineFilledIcon } from "@/icons"

interface ChatRoomWrapperProps {
  userId: string
}

export default function ChatRoomWrapper({ userId }: ChatRoomWrapperProps) {
  const { selectedChatId } = useChatStore()

  return (
    <div className="h-full">
      {selectedChatId ? (
        <ChatRoom chatId={selectedChatId} userId={userId || ""} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-10 h-full text-primary-first font-bold text-2xl">
          <div className="flex items-center gap-2 text-primary-first">
            <h1 className="flex flex-col gap-0 lg:gap-2 items-center font-semibold">
              <span className="text-7xl">strong</span>
              <span className="text-2xl">SYSTEMS</span>
              <span className="text-7xl">CHAT</span>
            </h1>

            <BrandLineFilledIcon className="size-32" />
          </div>
          Selecciona un chat para comenzar
        </div>
      )}
    </div>
  )
}
