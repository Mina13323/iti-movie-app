import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createSession, getAccountDetails } from "../services/movieService";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../context/LanguageContext";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const setTmdbSession = useAuthStore((state) => state.setTmdbSession);
  
  const isMounted = useRef(false);
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const requestToken = searchParams.get("request_token");
    const approved = searchParams.get("approved");

    if (approved === "true" && requestToken) {
      handleCompleteLogin(requestToken);
    } else {
      setStatus("error");
      setErrorMessage(lang === "en" ? "Authentication denied by user." : "تم رفض المصادقة من قبل المستخدم.");
    }
  }, [searchParams, lang]);

  const handleCompleteLogin = async (requestToken) => {
    try {
      // 1. Create Session
      const sessionRes = await createSession(requestToken);
      const sessionId = sessionRes.data.session_id;

      if (!sessionId) throw new Error("Failed to create session");

      // 2. Get Account Details
      const accountRes = await getAccountDetails(sessionId);
      const account = accountRes.data;

      // 3. Update Store
      setTmdbSession(sessionId, account);
      
      setStatus("success");
      toast.success(lang === "en" 
        ? `Welcome back, ${account.username}!` 
        : `أهلاً بعودتك، ${account.username}!`);

      // 4. Redirect after a short delay
      setTimeout(() => {
        navigate("/account");
      }, 2000);

    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(lang === "en" ? "Failed to synchronize with TMDb." : "فشل المزامنة مع TMDb.");
      toast.error(lang === "en" ? "Authentication failed" : "فشلت المصادقة");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-muted/30 border border-border p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm">
        {status === "loading" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#E50914] rounded-full blur-3xl opacity-20 animate-pulse" />
              <Loader2 className="size-16 text-[#E50914] animate-spin relative" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {lang === "en" ? "Synchronizing with TMDb" : "جاري المزامنة مع TMDb"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "en" ? "Finalizing your secure session..." : "جاري إنهاء جلستك الآمنة..."}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="size-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-black tracking-tight">
              {lang === "en" ? "Successfully Connected!" : "تم الاتصال بنجاح!"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "en" 
                ? "Your TMDb account is now linked. Redirecting to your profile..." 
                : "تم ربط حساب TMDb الخاص بك بنجاح. جاري توجيهك إلى ملفك الشخصي..."}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <AlertCircle className="size-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-black tracking-tight">
              {lang === "en" ? "Connection Failed" : "فشل الاتصال"}
            </h1>
            <p className="text-red-500/80 font-medium">
              {errorMessage}
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="w-full bg-[#E50914] text-white py-3 rounded-lg font-bold hover:bg-[#b20710] transition-colors"
            >
              {lang === "en" ? "Back to Login" : "العودة لتسجيل الدخول"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
