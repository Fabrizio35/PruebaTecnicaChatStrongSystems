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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { message: ERRORS.UNAUTHORIZED },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("avatar") as Blob

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 400 })
    }

    // Convertimos Blob a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      { folder: "avatars", resource_type: "image" }
    )

    // Guardamos la URL en la base de datos
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: result.secure_url },
    })

    return NextResponse.json({ avatarUrl: result.secure_url }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
