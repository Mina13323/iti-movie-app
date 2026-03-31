import { RegisterForm } from "@/components/auth/RegisterForm"
import loginImg from "../assets/ا.jpg"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Full-screen Background Image with Netflix-style Gradient Overlay */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <img
          src={loginImg}
          alt="Registration Background"
          className="w-full h-full object-cover opacity-50 block"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Centered Form */}
      <div className="relative z-10 w-full max-w-[450px] px-4 md:px-0">
        <RegisterForm />
      </div>
    </div>
  )
}