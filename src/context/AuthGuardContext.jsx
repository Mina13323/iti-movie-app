import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useLanguage } from "./LanguageContext";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AuthGuardContext = createContext(null);

export const AuthGuardProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const ensureAuthenticated = (action) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setIsOpen(true);
    }
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const handleSignup = () => {
    setIsOpen(false);
    navigate("/signup");
  };

  return (
    <AuthGuardContext.Provider value={{ ensureAuthenticated }}>
      {children}
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className={cn(
          "bg-muted border-border text-foreground max-w-[90vw] sm:max-w-md rounded-2xl p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl",
          lang === "ar" && "font-arabic"
        )}>
          {/* Top accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-50" />
          
          <div className="p-6 sm:p-8">
            <AlertDialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-2 text-[#E50914] mb-1">
                <Sparkles className="size-5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exclusive Experience</span>
              </div>
              <AlertDialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                {lang === "en" ? "Sign in to witness the magic" : "سجل دخولك لتشهد المتعة"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                {lang === "en" 
                  ? "This cinematic journey is reserved for our members. Join the movement and unlock unlimited stories today." 
                  : "هذه الرحلة السينمائية محجوزة لأعضائنا. انضم إلينا وافتح آفاقاً غير محدودة من القصص اليوم."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-8 flex flex-col gap-4">
               {/* Primary CTAs */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={handleSignup}
                    className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-background hover:bg-muted text-foreground font-bold transition-all duration-300 border border-border overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <UserPlus className="size-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    {lang === "en" ? "Join Now" : "انضم الآن"}
                  </button>
                  
                  <button 
                    onClick={handleLogin}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E50914] hover:bg-[#f40612] text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.2)] hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] hover:scale-[1.02]"
                  >
                    <LogIn className="size-4 group-hover:translate-x-1 transition-transform" />
                    {lang === "en" ? "Sign In" : "تسجيل الدخول"}
                  </button>
               </div>

               {/* Secondary Link */}
               <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.1em]"
               >
                  {lang === "en" ? "I'll browse for now" : "سأكتفي بالتصفح حالياً"}
               </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuardContext.Provider>
  );
};

export const useAuthGuard = () => {
  const context = useContext(AuthGuardContext);
  if (!context) {
    throw new Error("useAuthGuard must be used within an AuthGuardProvider");
  }
  return context;
};
