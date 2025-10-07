export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },
  CHAT_REQUESTS: {
    RESPOND: "/api/chat-requests/respond",
    SEND: "/api/chat-requests/send",
    RECEIVED: "/api/chat-requests/received",
  },
  USERS: {
    SEARCH_ID_BY_USERNAME_OR_EMAIL: "/api/users/search-id-by-username-or-email",
    UPLOAD_AVATAR: "/api/users/upload-avatar",
    DELETE_AVATAR: "/api/users/delete-avatar",
  },
  CHATS: {
    GET_BY_USER_ID: "/api/chat/get-by-userId",
  },
} as const
