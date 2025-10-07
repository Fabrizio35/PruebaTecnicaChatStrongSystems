# 💬 Strong SYSTEMS CHAT

**Strong SYSTEMS CHAT** es una aplicación de chat en tiempo real desarrollada con **Next.js** y **Socket.IO**, que permite a los usuarios comunicarse de forma fluida y moderna.  
Incluye funcionalidades como envío de mensajes, imágenes y archivos, gestión de chats, búsqueda de usuarios y personalización de avatar.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **Next.js** – Framework React fullstack (App Router)
- 🟦 **TypeScript** – Tipado estático para mayor robustez
- 🎨 **Tailwind CSS** – Estilos rápidos y responsivos
- 💬 **Socket.IO** – Comunicación en tiempo real
- 🧠 **Zustand** – Manejo de estado global simple y eficiente
- 🗄️ **Prisma ORM** – Acceso y modelado de base de datos
- 🐘 **PostgreSQL** – Base de datos relacional
- 🔐 **bcryptjs** – Hashing seguro de contraseñas
- 🧰 **NextAuth** – Autenticación segura
- ☁️ **Cloudinary** – Almacenamiento de imágenes y archivos
- 🧹 **Prettier** – Formateo consistente del código
- 🔁 **nodemon** – Recarga automática del servidor Socket.IO en desarrollo

---

## ⚙️ Funcionalidades principales

✅ **Autenticación segura** (registro, login y logout)  
✅ **Chats privados** entre usuarios  
✅ **Envío de mensajes en tiempo real** con Socket.IO  
✅ **Envío de imágenes y archivos** (PDF, Word, imágenes, etc.)  
✅ **Subida de avatar personalizada** (almacenado en Cloudinary)  
✅ **Búsqueda de chats por nombre de usuario**  
✅ **Creación y eliminación de chats**  
✅ **Interfaz moderna y responsive con Tailwind CSS**

---

## 🧩 Estructura general del proyecto

```
├── app/
│   ├── api/
│   ├── chat/
│   ├── auth/
│   └── ...
├── components/
│   ├── chats/
├── server/
│   └── socket-server.ts
├── prisma/
│   └── schema.prisma
├── store/
│   └── chatStore.ts
├── libs/
│   ├── apiClient.ts
│   └── db.ts
├── public/
│   └── ...
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/chatssdb

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Socket.IO
NEXT_PUBLIC_SOCKET_PORT=3001
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🛠️ Instalación y configuración

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/Fabrizio35/PruebaTecnicaChatStrongSystems.git
   cd PruebaTecnicaChatStrongSystems
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura la base de datos y Prisma:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Configura las variables de entorno** en `.env` (ver sección anterior).

---

## 🧪 Scripts disponibles

| Script | Descripción |
|--------|--------------|
| `npm run dev` | Inicia el servidor de desarrollo de Next.js |
| `npm run dev:sockets` | Inicia el servidor de Socket.IO con Nodemon |
| `npm run dev:all` | Ejecuta Next.js y Socket.IO en paralelo |
| `npm run start:sockets` | Inicia el servidor de Socket.IO en producción |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia la aplicación compilada |
| `npm run lint` | Ejecuta ESLint para análisis estático |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato del código sin modificar archivos |

---

## 💡 Desarrollo

Durante el desarrollo, podés ejecutar ambos servidores en paralelo con:

```bash
npm run dev:all
```

Esto iniciará:
- El servidor **Next.js** (frontend y API)
- El servidor **Socket.IO** (`server/socket-server.ts`) con **Nodemon**

---

## 📡 Socket.IO Server

El servidor de sockets se ejecuta en un proceso separado usando:

```bash
npm run start:sockets
```

Archivo principal:  
`server/socket-server.ts`

Responsabilidades:
- Manejo de salas de chat (`chatId`)
- Envío y recepción de mensajes
- Emisión de eventos en tiempo real
- Sincronización con la base de datos mediante Prisma

---

## 📷 Subida de archivos y avatares

- Las imágenes y archivos se suben a **Cloudinary** mediante sus credenciales API.
- Cada usuario puede actualizar su avatar desde el frontend.
- Los mensajes con tipo `IMAGE` o `FILE` muestran vistas previas o íconos según el formato (PDF, Word, etc.).

---

## 🧠 Estado global

El estado de los chats y mensajes se maneja con **Zustand**, permitiendo:
- Seleccionar chat actual
- Sincronizar mensajes en tiempo real
- Eliminar y actualizar chats sin recargar

---

## 📘 Estilo de código

El proyecto utiliza **Prettier** y **ESLint** para mantener un código limpio y consistente:

```bash
npm run format
npm run lint
```

---

## 🧑‍💻 Autor

**Fabrizio Ossola**  
📧 [ossolafabrizio@gmail.com]  
🌐 [https://github.com/Fabrizio35](https://github.com/Fabrizio35)

---

## 🪶 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.

---

> 💬 “Strong SYSTEMS CHAT” fue desarrollado con el objetivo de ofrecer una experiencia de mensajería moderna, rápida y segura, combinando las mejores herramientas del ecosistema web actual, para presentar como Prueba Técnica para el puesto de Desarrollador FullStack.
