import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2, Clapperboard } from "lucide-react";
import { getRequestToken } from "../../services/movieService";
import { useLanguage } from "../../context/LanguageContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Your password must contain between 4 and 60 characters."),
});

export function LoginForm({ className, ...props }) {
  const nav = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const { login, isLoading } = useAuthStore();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      
      toast.success(`Welcome back, ${user.name}!`, {
        icon: '🍿',
        style: {
          borderRadius: '4px',
          background: '#e50914',
          color: 'white',
          border: 'none',
        },
      });
      
      nav(from, { replace: true }); 
    } catch (err) {
      toast.error("Sign In Failed", {
        description: err.message || "Please check your credentials and try again.",
        duration: 4000,
        style: {
          background: '#d89d31', 
          color: 'black',
        }
      });
    }
  };

  const handleTmdbLogin = async () => {
    try {
      const res = await getRequestToken();
      const token = res.data.request_token;
      
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const callbackUrl = window.location.origin + baseUrl + "/auth/callback";
      const tmdbAuthUrl = `${import.meta.env.VITE_TMDB_AUTH_URL}/${token}?redirect_to=${encodeURIComponent(callbackUrl)}`;
      
      window.location.href = tmdbAuthUrl;
    } catch (err) {
      console.error(err);
      toast.error(lang === "en" ? "Failed to connect to TMDb" : "فشل الاتصال بـ TMDb");
    }
  };

  return (
    <div 
      className={cn("w-full bg-black/80 md:px-16 px-8 py-16 md:-mt-[0px] shadow-2xl rounded-lg border-t-2 border-[#e50914]/20", className)} 
      {...props}
    >
        <h1 className="text-white text-3xl font-bold mb-7 tracking-tight">Sign In</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Field className="space-y-0 relative text-left">
            <Input
              id="email"
              type="text"
              placeholder="Email or phone number"
              {...register("email")}
              className={cn(
                "w-full bg-[#333333]/70 focus:bg-[#454545] text-white border-0 h-14 rounded pt-3 px-4 text-base focus:ring-2 focus:ring-offset-0 focus:ring-white transition-all shadow-inner",
                 errors.email && "border-b-2 border-[#e87c03]"
              )}
            />
            {errors.email && <p className="text-[#e87c03] text-[13px] px-1 py-1 font-medium">{errors.email.message}</p>}
          </Field>

          <Field className="space-y-0 relative text-left">
            <Input 
              id="password" 
              type="password" 
              placeholder="Password"
              {...register("password")}
              className={cn(
                "w-full bg-[#333333]/70 focus:bg-[#454545] text-white border-0 h-14 rounded pt-3 px-4 text-base focus:ring-2 focus:ring-offset-0 focus:ring-white transition-all shadow-inner",
                 errors.password && "border-b-2 border-[#e87c03]"
              )} 
            />
            {errors.password && <p className="text-[#e87c03] text-[13px] px-1 py-1 font-medium">{errors.password.message}</p>}
          </Field>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#e50914] hover:bg-[#c11119] text-white font-semibold h-12 rounded mt-6 text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="size-5 animate-spin mx-auto" /> : (lang === "en" ? "Sign In" : "تسجيل الدخول")}
          </Button>

          {/* TMDb Login Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-[11px] text-[#737373] uppercase font-bold tracking-widest">
              {lang === "en" ? "OR" : "أو"}
            </span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          {/* TMDb Login Button */}
          <Button 
            type="button"
            onClick={handleTmdbLogin}
            className="w-full bg-[#0d253f] hover:bg-[#01b4e4] text-white font-bold h-12 rounded flex items-center justify-center gap-3 transition-colors border border-transparent shadow-lg"
          >
            <Clapperboard className="size-5" />
            {lang === "en" ? "Log In with TMDb" : "الدخول بحساب TMDb"}
          </Button>

          <div className="flex justify-between items-center text-[#b3b3b3] text-[13px] mt-6 font-medium">
             <label className="flex items-center space-x-2 cursor-pointer group">
               <input type="checkbox" className="w-4 h-4 rounded bg-[#737373] border-none text-[#e50914] focus:ring-0 checked:bg-[#e50914]" defaultChecked />
               <span className="group-hover:text-[#e5e5e5] transition-colors">{lang === "en" ? "Remember me" : "تذكرني"}</span>
             </label>
             <Link to="#" className="hover:underline hover:text-[#e5e5e5] transition-colors">
               {lang === "en" ? "Need help?" : "تحتاج مساعدة؟"}
             </Link>
          </div>
        </form>

        <div className="mt-16 text-[#737373] text-[15px] font-medium">
          <p className="mb-2">
            {lang === "en" ? "New to NetMovies?" : "جديد في NetMovies؟"}{" "}
            <Link to="/signup" className="text-white hover:underline transition-all font-semibold ml-1">
              {lang === "en" ? "Sign up now." : "سجل الآن."}
            </Link>
          </p>
          <p className="text-[13px] leading-snug font-normal text-[#8c8c8c]">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot. 
            <button className="text-[#0071eb] ml-1 hover:underline">Learn more.</button>
          </p>
        </div>
    </div>
  );
}
