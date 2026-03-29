import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. تعريف الـ Schema
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export function LoginForm({ className, ...props }) {
  const nav = useNavigate(); // استخدام الهوك بشكل صحيح

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 3. دالة معالجة الدخول
  const onSubmit = (data) => {
    const existingUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

    const user = existingUsers.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (user) {
      toast.success(`Hello! ${user.name}`, {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: 'white',
          color: 'black',
        },
      });
      
      localStorage.setItem("isLoggedIn", "true"); // تعديل الاسم للأفضل
      nav("/"); // التوجيه للمسار الرئيسي (Home)
    } else {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة", {
        description: "تأكد من البيانات وأعد المحاولة مرة أخرى.",
        duration: 4000,
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
            className="bg-background"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")}
            className="bg-background" 
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </Field>

        <Button type="submit" className="w-full">Login</Button>

        <FieldSeparator>Or continue with</FieldSeparator>
        
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
} // تم مسح كلمة navigation الزائدة هنا