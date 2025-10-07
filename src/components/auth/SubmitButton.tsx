import { CLIENT_ROUTES } from "@/routes/clientRoutes"
import { usePathname } from "next/navigation"

interface SubmitButtonProps {
  isValid: boolean
  isSubmitting: boolean
}

export default function SubmitButton({
  isSubmitting,
  isValid,
}: SubmitButtonProps) {
  const pathname = usePathname()

  const isLoginPage = pathname === CLIENT_ROUTES.AUTH.LOGIN

  return (
    <button
      disabled={!isValid || isSubmitting}
      className="bg-primary-second text-white font-semibold text-base sm:text-lg py-1 sm:py-3 rounded-sm cursor-pointer w-full hover:bg-primary-third transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isSubmitting
        ? "Procesando..."
        : isLoginPage
          ? "Iniciar sesión"
          : "Registrarse"}
    </button>
  )
}
