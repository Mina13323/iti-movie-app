import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from "zod";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" // لا تنسى تثبيت هذا الملحق
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// 1. تعريف الـ Schema
const signupSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"], // مكان ظهور الخطأ
});

export function SignupForm({ ...props }) {
  const nav=useNavigate()
  // 2. إعداد الـ Form مع الـ Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

const onSubmit = (data) => {
  // 1. جلب قائمة المستخدمين الحالية من localStorage
  // إذا كانت فارغة، ننشئ مصفوفة فارغة []
  const existingUsers = JSON.parse(localStorage.getItem("allUsers")) || [];

  // 2. التحقق مما إذا كان البريد الإلكتروني مسجلاً مسبقاً (خطوة هامة)
  const isEmailTaken = existingUsers.some(user => user.email === data.email);
  
  if (isEmailTaken) {
    alert("هذا البريد الإلكتروني مسجل بالفعل! حاول تسجيل الدخول.");
    return; // توقف عن التنفيذ
  }

  // 3. إضافة المستخدم الجديد للقائمة (نستثني confirmPassword لأنه غير ضروري للتخزين)
  const { ...newUser } = data;
  // console.log(...newUser);
  
  const updatedUsers = [...existingUsers, newUser];

  // 4. حفظ القائمة المحدثة بالكامل تحت اسم مفتاح واحد
  localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
  
toast.success('Successfully toasted!')
  nav("/");
  // اختيارياً: توجيه المستخدم لصفحة Login
  // window.location.href = "/login";
};
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* حقل الاسم */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" {...register("name")} />
              {errors.name&&<p className="text-red-500 text-sm">{errors.name.message}</p>}

            </Field>

            {/* حقل الإيميل */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...register("email")} />
                 {errors.email&&<p className="text-red-500 text-sm">{errors.email.message}</p>}
            </Field>

            {/* حقل كلمة المرور */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...register("password")} />
                   {errors.password&&<p className="text-red-500 text-sm">{errors.password.message}</p>}
            </Field>

            {/* حقل تأكيد كلمة المرور */}
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input id="confirm-password" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </Field>

            <Button type="submit" className="w-full">Create Account</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}