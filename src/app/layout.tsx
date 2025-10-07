import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import "./globals.css"
import { Providers } from "@/providers/providers"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Chat Strong Systems",
  description:
    "Chat Strong Systems - Conéctate y chatea con tus amigos, familiares y conocidos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <Toaster position="bottom-left" toastOptions={{ duration: 4000 }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
