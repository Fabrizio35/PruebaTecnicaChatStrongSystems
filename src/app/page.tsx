import { authOptions } from "./api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import ChatRoomWrapper from "@/components/chats/ChatRoomWrapper"
import Sidebar from "@/components/Sidebar/Sidebar"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="w-3/4">
        <ChatRoomWrapper userId={session?.user?.id || ""} />
      </div>
    </div>
  )
}
