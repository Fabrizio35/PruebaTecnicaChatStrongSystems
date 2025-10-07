import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/libs/db"
import { ERRORS } from "@/constants/errors"

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const { id: chatId } = await context.params

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
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
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!chat) {
      return NextResponse.json(
        { message: `Chat ${ERRORS.NOT_FOUND}` },
        { status: 404 }
      )
    }

    const isParticipant = chat.participants.some(
      (p) => p.user.id === session.user.id
    )

    if (!isParticipant) {
      return NextResponse.json({ message: ERRORS.FORDBIDDEN }, { status: 403 })
    }

    const otherParticipant = chat.participants.find(
      (p) => p.user.id !== session.user.id
    )?.user

    return NextResponse.json(
      {
        id: chat.id,
        otherParticipant,
        messages: chat.messages,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const { id: chatId } = await context.params

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    })

    if (!chat) {
      return NextResponse.json(
        { message: `Chat ${ERRORS.NOT_FOUND}` },
        { status: 404 }
      )
    }

    const isParticipant = chat.participants.some(
      (p) => p.userId === session.user.id
    )

    if (!isParticipant) {
      return NextResponse.json({ message: ERRORS.FORDBIDDEN }, { status: 403 })
    }

    await prisma.message.deleteMany({ where: { chatId } })
    await prisma.chatParticipant.deleteMany({ where: { chatId } })
    await prisma.chat.delete({ where: { id: chatId } })

    return NextResponse.json(
      { message: "Chat eliminado con éxito" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
