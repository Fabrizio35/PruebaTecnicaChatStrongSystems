import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/libs/db"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/schemas/register.schema"
import { ERRORS } from "@/constants/errors"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { email, username, password } = data

    // Chequeamos que no falte información
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: ERRORS.MISSING_DATA },
        { status: 400 }
      )
    }

    // Chequeamos que la información sea acorde al esquema
    const parsedData = registerSchema.safeParse(data)

    if (!parsedData.success) {
      return NextResponse.json(
        { message: ERRORS.INVALID_DATA, errors: parsedData.error.format() },
        { status: 400 }
      )
    }

    // Hasheamos la contraseña por seguridad
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buscamos al usuario que coincida con el email o el nombre de usuario ya que son únicos.
    const userFound = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (userFound) {
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 400 }
      )
    }

    // Creamos al usuario si todo está correcto
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })

    // Retornamos el usuarios sin su contraseña por seguridad
    const { password: _, ...user } = newUser

    return NextResponse.json(
      { newUser: user, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    )
  }
}
