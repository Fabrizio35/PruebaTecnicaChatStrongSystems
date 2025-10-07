import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/libs/db"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email o nombre de usuario",
          type: "text",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, _req) {
        const userFound = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          },
        })

        if (!userFound) throw new Error("No user found")

        const matchPassword = await bcrypt.compare(
          credentials?.password as string,
          userFound.password
        )

        if (!matchPassword) throw new Error("Incorrect password")

        return {
          id: userFound.id,
          email: userFound.email,
          username: userFound.username,
          avatar: userFound.avatar ?? undefined,
          createdAt: userFound.createdAt.toISOString(),
          updatedAt: userFound.updatedAt.toISOString(),
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.avatar = user.avatar
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id },
        })

        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
          avatar: userFromDb?.avatar ?? undefined,
          createdAt: token.createdAt,
          updatedAt: token.updatedAt,
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
