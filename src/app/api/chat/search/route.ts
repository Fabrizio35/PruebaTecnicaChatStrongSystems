import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/libs/db"
import { ERRORS } from "@/constants/errors"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const searchQuery =
      req.nextUrl.searchParams.get("query")?.toLowerCase() || ""

    const chatParticipants = await prisma.chatParticipant.findMany({
      where: {
        userId: session.user.id,
        chat: {
          participants: {
            some: {
              user: {
                username: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
                NOT: { id: session.user.id },
              },
            },
          },
        },
      },
      include: {
        chat: {
          include: {
            participants: {
              include: {
                user: { select: { id: true, username: true, avatar: true } },
              },
            },
            messages: {
              include: {
                author: { select: { id: true, username: true, avatar: true } },
              },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    })

    const result = chatParticipants.map((cp) => {
      const otherParticipant = cp.chat.participants.find(
        (p) => p.user.id !== session.user.id
      )?.user

      return {
        chatId: cp.chatId,
        otherParticipant,
        lastMessage: cp.chat.messages[0] || null,
      }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
