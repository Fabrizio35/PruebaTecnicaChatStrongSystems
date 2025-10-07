import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/libs/db"
import { ERRORS } from "@/constants/errors"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    const mappedChats = chats.map((chat) => {
      const otherParticipant =
        chat.participants.find((p) => p.user.id !== userId)?.user || null

      return {
        id: chat.id,
        otherParticipant,
      }
    })

    return NextResponse.json(mappedChats, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
