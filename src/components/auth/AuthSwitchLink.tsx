import { CLIENT_ROUTES } from "@/routes/clientRoutes"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function AuthSwitchLink() {
  const pathname = usePathname()

  const isLoginPage = pathname === CLIENT_ROUTES.AUTH.LOGIN

  return (
    <div className="flex items-center gap-1 mx-auto mt-2 w-fit text-sm sm:text-base">
      <span className="text-primary-first">
        {isLoginPage ? "¿Aún no tienes una cuenta?" : "¿Ya tienes una cuenta?"}
      </span>
      <Link
        href={
          isLoginPage ? CLIENT_ROUTES.AUTH.REGISTER : CLIENT_ROUTES.AUTH.LOGIN
        }
        className="text-primary-second font-semibold"
      >
        {isLoginPage ? "Registrarse" : "Iniciar sesión"}
      </Link>
    </div>
  )
}
