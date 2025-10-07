import { FileIcon } from "@/icons"
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

interface MessageProps {
  message: MessageType
  userId: string | undefined
}

export default function Message({ message, userId }: MessageProps) {
  const isMine = message.authorId === userId

  const hourFormat = () => {
    const hour = new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    return hour
  }

  return (
    <div
      className={`flex items-center gap-2 mb-2 ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-md p-2 rounded-md text-white break-words ${
          isMine ? "bg-primary-second" : "bg-secondary"
        }`}
      >
        {message.type === "TEXT" && <span>{message.content}</span>}

        {message.type === "IMAGE" && (
          <a href={message.content} target="_blank" rel="noopener noreferrer">
            <Image
              src={message.content}
              alt="Imagen"
              width={288}
              height={288}
              className="size-72 object-cover rounded-md"
            />
          </a>
        )}

        {message.type === "FILE" && (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1 bg-primary-third rounded-md hover:bg-primary-third/50 transition-colors duration-200"
          >
            <FileIcon className="size-32 text-white" />
            <span className="text-sm text-white truncate max-w-[150px]">
              Descargar archivo
            </span>
          </a>
        )}

        <span className="text-xs ml-2 text-gray-300">{hourFormat()}</span>
      </div>
    </div>
  )
}
