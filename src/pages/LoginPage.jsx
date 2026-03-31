import { LoginForm } from "@/components/auth/LoginForm"
import loginImg from "../assets/ا.jpg"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Full-screen Background Image with Netflix-style Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={loginImg}
          alt="Login Background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Centered Form */}
      <div className="relative z-10 w-full max-w-[450px] px-4 md:px-0">
        <LoginForm />
      </div>
    </div>
  )
}
