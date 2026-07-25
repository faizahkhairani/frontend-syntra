import SignInForm from "@/components/auth/sign-form"
import { useAuthStore } from "@/store/authStore"
import { Navigate } from "react-router-dom"
import LoginHero from "@/assets/hero-cat.jpg"
import DemoLoginButtons from "@/components/auth/button-demo"
const LoginPage = () => {

  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)

  if (token) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/beranda" replace />
  }



  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Kiri — Form */}
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <SignInForm />
        <DemoLoginButtons />
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        {/* Foto fullcover */}
        <img
          src={LoginHero}
          alt="Petshop cat"
          className="w-full h-full object-cover object-top"
        />

        {/* Overlay gradient bawah */}
        <div className="absolute inset-0 bg-liner-to-t from-blue-900/60 via-transparent to-transparent" />

        {/* Text di atas foto */}
        <div className="absolute bottom-10 left-8 right-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Petshop Alit Vet</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Sistem manajemen absensi dan jadwal karyawan
          </p>
        </div>
      </div>

    </div>
  )
}

export default LoginPage