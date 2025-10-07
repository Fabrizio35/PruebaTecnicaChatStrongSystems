import { BrandLineIcon } from "@/icons"

export default function AuthSide() {
  return (
    <aside className="w-full lg:w-1/2 bg-primary-first min-h-full flex items-center justify-center gap-2 lg:gap-10 px-3 py-2 lg:py-0">
      <h1 className="flex flex-col gap-0 lg:gap-2 items-center text-white font-semibold">
        <span className="text-3xl lg:text-8xl">strong</span>
        <span className="text-sm lg:text-3xl">SYSTEMS</span>
        <span className="text-3xl lg:text-8xl">CHAT</span>
      </h1>

      <BrandLineIcon className="text-white size-20 lg:size-48" />
    </aside>
  )
}
