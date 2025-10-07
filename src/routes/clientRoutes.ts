export const CLIENT_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },
  CHATS: {
    CHAT_BY_ID: "/chat/:id",
  },
  HOME: "/",
} as const
