import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2 } from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password should be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export function RegisterForm({ className, ...props }) {
  const nav = useNavigate();
  const { register: registerAuth, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAuth(data);
      
      toast.success('Account created successfully!', {
        icon: '🍿',
        style: {
            background: '#333',
            color: 'white',
            border: 'none',
        }
      });
      nav("/login");
    } catch (err) {
      toast.error("Registration Failed", {
        description: err.message || "Something went wrong. Please try again.",
        duration: 4000,
        style: {
          background: '#e50914',
          color: 'white',
          border: 'none',
        }
      });
    }
  };

  return (
    <div 
      className={cn("w-full bg-black/80 md:px-16 px-8 py-16 md:-mt-[0px] shadow-2xl rounded-lg border-t-2 border-[#e50914]/20", className)} 
      {...props}
    >
        <h1 className="text-white text-3xl font-bold mb-7 tracking-tight">Sign Up</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Field className="space-y-0 relative text-left">
            <Input 
              id="name" 
              type="text" 
              placeholder="Full Name"
              {...register("name")} 
              className={cn(
                "w-full bg-[#333333]/70 focus:bg-[#454545] text-white border-0 h-14 rounded pt-3 px-4 text-base focus:ring-2 focus:ring-offset-0 focus:ring-white transition-all shadow-inner",
                 errors.name && "border-b-2 border-[#e87c03]"
              )}
            />
            {errors.name && <p className="text-[#e87c03] text-[13px] px-1 py-1 font-medium">{errors.name.message}</p>}
          </Field>

          <Field className="space-y-0 relative text-left">
            <Input 
              id="email" 
              type="email" 
              placeholder="Email address"
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
              placeholder="Add a password"
              {...register("password")} 
              className={cn(
                "w-full bg-[#333333]/70 focus:bg-[#454545] text-white border-0 h-14 rounded pt-3 px-4 text-base focus:ring-2 focus:ring-offset-0 focus:ring-white transition-all shadow-inner",
                 errors.password && "border-b-2 border-[#e87c03]"
              )}
            />
            {errors.password && <p className="text-[#e87c03] text-[13px] px-1 py-1 font-medium">{errors.password.message}</p>}
          </Field>

          <Field className="space-y-0 relative text-left">
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm password"
              {...register("confirmPassword")} 
              className={cn(
                "w-full bg-[#333333]/70 focus:bg-[#454545] text-white border-0 h-14 rounded pt-3 px-4 text-base focus:ring-2 focus:ring-offset-0 focus:ring-white transition-all shadow-inner",
                 errors.confirmPassword && "border-b-2 border-[#e87c03]"
              )}
            />
            {errors.confirmPassword && <p className="text-[#e87c03] text-[13px] px-1 py-1 font-medium">{errors.confirmPassword.message}</p>}
          </Field>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#e50914] hover:bg-[#c11119] text-white font-semibold h-12 rounded mt-6 text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="size-5 animate-spin mx-auto" /> : "Sign Up"}
          </Button>

        </form>

        <div className="mt-16 text-[#737373] text-[15px] font-medium">
          <p className="mb-2">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline transition-all font-semibold ml-1">
              Sign In now.
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
