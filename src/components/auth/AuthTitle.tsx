interface AuthTitleProps {
  title: string
}

export default function AuthTitle({ title }: AuthTitleProps) {
  return (
    <h2 className="text-primary-first font-bold text-3xl sm:text-5xl text-center">
      {title}
    </h2>
  )
}
