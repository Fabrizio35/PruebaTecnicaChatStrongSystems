import {
  BrandLineFilledIcon,
  BrandLineIcon,
  UserCircleIcon,
  UsersPlusFilledIcon,
  UsersPlusIcon,
} from "@/icons"

interface SidebarHeaderProps {
  section: "chats" | "requests" | "profile"
  setSection: (section: "chats" | "requests" | "profile") => void
}

export default function SidebarHeader({
  section,
  setSection,
}: SidebarHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <button
        type="button"
        className={`cursor-pointer text-white transition-colors duration-200 ${section === "chats" ? "p-2 bg-primary-third rounded-full" : "hover:text-primary-third"}`}
        onClick={() => setSection("chats")}
      >
        {section === "chats" ? (
          <BrandLineFilledIcon className="size-7" />
        ) : (
          <BrandLineIcon className="size-7" />
        )}
      </button>
      <button
        type="button"
        className={`cursor-pointer text-white transition-colors duration-200 ${section === "requests" ? "p-2 bg-primary-third rounded-full" : "hover:text-primary-third"}`}
        onClick={() => setSection("requests")}
      >
        {section === "requests" ? (
          <UsersPlusFilledIcon className="size-7" />
        ) : (
          <UsersPlusIcon className="size-7" />
        )}
      </button>
      <button
        type="button"
        className={`cursor-pointer text-white transition-colors duration-200 ${section === "profile" ? "p-2 bg-primary-third rounded-full" : "hover:text-primary-third"}`}
        onClick={() => setSection("profile")}
      >
        <UserCircleIcon className="size-8" />
      </button>
    </div>
  )
}
