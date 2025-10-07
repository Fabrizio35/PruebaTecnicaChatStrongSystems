import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/libs/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { v2 as cloudinary } from "cloudinary"
import { ERRORS } from "@/constants/errors"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { avatar: true },
    })

    if (!user?.avatar) {
      return NextResponse.json(
        { message: "El usuario no tiene avatar para eliminar" },
        { status: 400 }
      )
    }

    // Obtener public_id del avatar en Cloudinary
    const urlParts = user.avatar.split("/")
    const filename = urlParts[urlParts.length - 1]
    const publicId = `avatars/${filename.split(".")[0]}`

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(publicId)

    // Eliminar de base de datos
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null },
    })

    return NextResponse.json(
      { message: "Avatar eliminado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error eliminando avatar:", error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
