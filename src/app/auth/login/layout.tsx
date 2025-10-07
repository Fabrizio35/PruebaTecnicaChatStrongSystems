import AuthSide from "@/components/auth/AuthSide"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inicio de sesión | Chat Strong Systems",
  description: "Inicia sesión para usar el Chat Strong Systems",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AuthSide />
      <div className="w-full lg:w-1/2 my-auto">{children}</div>
    </div>
  )
}
