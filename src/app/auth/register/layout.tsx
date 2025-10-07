import AuthSide from "@/components/auth/AuthSide"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro | Chat Strong Systems",
  description: "Regístrate para empezar a usar el Chat Strong Systems",
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2 my-auto">{children}</div>
      <AuthSide />
    </div>
  )
}
