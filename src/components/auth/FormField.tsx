import { FieldError } from "react-hook-form"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "@/icons"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  showPasswordToggle?: boolean
}

export default function FormField({
  label,
  error,
  showPasswordToggle = false,
  ...inputProps
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleVisibility = () => setShowPassword((prev) => !prev)

  const inputType =
    showPasswordToggle && inputProps.type === "password"
      ? showPassword
        ? "text"
        : "password"
      : inputProps.type

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label
        htmlFor={inputProps.name}
        className="text-primary-first font-medium text-sm sm:text-base"
      >
        {label}
      </label>

      <input
        id={inputProps.name}
        {...inputProps}
        type={inputType}
        className={`bg-primary-third/20 rounded-md px-2 py-1 sm:py-3 border-[1px] border-primary-third w-full text-primary-first text-base sm:text-lg placeholder:text-primary-second/40 outline-primary-first ${
          inputProps.className ?? ""
        }`}
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2 top-[2.3rem] sm:top-[2.7rem] cursor-pointer text-primary-second"
        >
          {showPassword ? (
            <EyeOffIcon className="size-6" />
          ) : (
            <EyeIcon className="size-6" />
          )}
        </button>
      )}

      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  )
}
