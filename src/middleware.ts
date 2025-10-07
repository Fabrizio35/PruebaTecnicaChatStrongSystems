import { withAuth } from "next-auth/middleware"
import { CLIENT_ROUTES } from "./routes/clientRoutes"

export default withAuth({
  pages: {
    signIn: CLIENT_ROUTES.AUTH.LOGIN,
  },
})

export const config = {
  matcher: ["/"],
}
