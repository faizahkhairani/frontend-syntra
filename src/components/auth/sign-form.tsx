import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PawPrint } from "lucide-react"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useLogin } from "@/hooks/useLogin"

const SignInForm = () => {

  const loginSchema = z.object({
    email: z.string().email("email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter")
  })

  type LoginForm = z.infer<typeof loginSchema>

  const { login, isLoading } = useLogin()

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password)
  }


  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">
          Syntra
        </span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          Selamat datang
        </h1>
        <p className="text-slate-500 text-sm">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11 border-slate-200 focus-visible:ring-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-700 font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 border-slate-200 focus-visible:ring-primary"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary text-white font-medium mt-2"
        >
          {isLoading ? (
             <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )
        }
        </Button>
      </form>
    </div>
  )
}

export default SignInForm