"use client"
import { useState } from "react"
import ChatList from "../chats/ChatList"
import Profile from "../Profile/Profile"
import ReceivedChatRequestsList from "../ReceivedChatRequestsList"
import SendChatRequestForm from "../SendChatRequestForm"
import SidebarHeader from "./SidebarHeader"

export default function Sidebar() {
  const [section, setSection] = useState<"chats" | "requests" | "profile">(
    "chats"
  )

  return (
    <aside className="w-1/4 bg-primary-first h-full p-5 flex flex-col gap-5">
      <SidebarHeader section={section} setSection={setSection} />

      <h2 className="text-white font-semibold text-3xl">
        {section === "chats"
          ? "Chats"
          : section === "requests"
            ? "Solicitudes"
            : "Perfil"}
      </h2>

      {section === "chats" && <ChatList />}
      {section === "requests" && (
        <div>
          <SendChatRequestForm />
          <ReceivedChatRequestsList />
        </div>
      )}
      {section === "profile" && <Profile />}
    </aside>
  )
}
