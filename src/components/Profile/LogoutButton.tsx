import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-primary-second text-red-200 px-4 py-2 rounded cursor-pointer hover:bg-primary-third hover:text-red-700 transition-colors duration-200"
    >
      Cerrar sesión
    </button>
  )
}
