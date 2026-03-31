import { useAuthStore } from "../store/useAuthStore";
import { useLanguage } from "../context/LanguageContext";
import usePageTitle from "../hooks/usePageTitle";
import { User, Mail, Shield, LogOut, Calendar, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { lang } = useLanguage();
  const { authUser, logout, tmdbAccount, tmdbSessionId, tmdbLogout } = useAuthStore();
  
  usePageTitle(lang === "en" ? "My Account" : "حسابي");

  const t = {
    title: { en: "Account Details", ar: "تفاصيل الحساب", fr: "Détails du compte", zh: "账户详情" },
    memberSince: { en: "Member Since", ar: "عضو منذ", fr: "Membre depuis", zh: "会员自" },
    plan: { en: "Current Plan", ar: "الخطة الحالية", fr: "Forfait actuel", zh: "当前计划" },
    standard: { en: "NetMovies Premium (4K + HDR)", ar: "نيتفليكس المميز (4K + HDR)", fr: "NetMovies Premium", zh: "高级版" },
    logout: { en: "Sign Out of NetMovies", ar: "تسجيل الخروج من نيتفليكس", fr: "Se déconnecter", zh: "退出登录" },
    security: { en: "Security & Privacy", ar: "الأمان والخصوصية", fr: "Sécurité et confidentialité", zh: "安全与隐私" },
    connectedServices: { en: "Connected Services", ar: "الخدمات المرتبطة", fr: "Services connectés", zh: "已连接服务" },
    tmdbConnected: { en: "TMDb Account Linked", ar: "تم ربط حساب TMDb", fr: "Compte TMDb lié", zh: "TMDb 账号已关联" },
    tmdbDisconnect: { en: "Disconnect", ar: "قطع الاتصال", fr: "Déconnecter", zh: "取消关联" },
    syncActive: { en: "Real-time Cloud Sync Active", ar: "المزامنة السحابية النشطة", fr: "Sync Cloud active", zh: "云端同步已激活" }
  };

  const getLabel = (obj) => obj[lang] || obj["en"];

  return (
    <div className="pt-32 pb-20 px-4 md:px-12 bg-background min-h-screen text-foreground">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-muted/30 border border-border rounded-xl p-8 md:p-12 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-border pb-12">
            <Avatar className="size-32 rounded-lg ring-4 ring-[#E50914]/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.email}`} />
              <AvatarFallback className="text-4xl">{authUser?.name?.[0]}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black tracking-tight">{authUser?.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail className="size-4" />
                <span className="font-medium">{authUser?.email}</span>
              </div>
              <Badge className="bg-[#E50914] hover:bg-[#E50914] text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest mt-2">
                 Premium Member
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-foreground/80 font-bold">
                 <Calendar className="size-5 text-[#E50914]" />
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-black">{getLabel(t.memberSince)}</span>
                    <span>March 2024</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 text-foreground/80 font-bold">
                 <Shield className="size-5 text-[#E50914]" />
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-black">{getLabel(t.security)}</span>
                    <span>Two-Factor Authentication Active</span>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-foreground/80 font-bold">
                 <Star className="size-5 text-[#E50914]" />
                 <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-black">{getLabel(t.plan)}</span>
                    <span className="text-[#E50914]">{getLabel(t.standard)}</span>
                 </div>
              </div>

              {tmdbSessionId && tmdbAccount && (
                <div className="flex items-center gap-4 text-foreground/80 font-bold p-4 bg-sky-500/5 rounded-lg border border-sky-500/20 animate-in fade-in zoom-in duration-500">
                   <div className="size-10 bg-[#0d253f] rounded flex items-center justify-center text-white font-black text-xs">
                     TMDb
                   </div>
                   <div className="flex-1 flex flex-col">
                      <span className="text-[10px] text-sky-400 uppercase tracking-widest font-black">{getLabel(t.tmdbConnected)}</span>
                      <span className="text-sm">@{tmdbAccount.username}</span>
                   </div>
                   <Button 
                    onClick={tmdbLogout}
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8"
                   >
                     {getLabel(t.tmdbDisconnect)}
                   </Button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-sm text-center sm:text-left font-medium">
               Your account is billed for the upcoming month on April 30, 2024. Next billing amount is $19.99.
            </p>
            <Button 
              onClick={logout}
              variant="outline" 
              className="px-8 h-12 border-border font-black uppercase text-xs tracking-widest hover:bg-muted transition-all active:scale-95 gap-2"
            >
              <LogOut className="size-4" />
              {getLabel(t.logout)}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

function Badge({ children, className }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    );
}
