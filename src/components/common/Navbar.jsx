import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add scroll listener for Netflix style solid background transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Series", path: "/series" },
    { name: "My list", path: "/wishlist", hasDropdown: true },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-colors duration-500",
          scrolled
            ? "bg-[#141414]"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        )}
      >
        <div className="px-4 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-10">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="font-black text-3xl tracking-tighter"
              style={{ color: "#E50914" }} // Netflix Signature Red
            >
              NETMOVIES
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#b3b3b3] flex items-center gap-1 relative",
                      isActive ? "text-white font-semibold cursor-default hover:text-white" : "text-[#e5e5e5]"
                    )}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="size-4 ml-0.5 opacity-70" />}
                    {isActive && (
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 min-w-[5px] min-h-[5px] bg-[#E50914] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Utilities */}
          <div className="flex items-center gap-6 text-white/90">
            <button className="hover:text-[#b3b3b3] transition duration-300">
              <Search className="size-6" strokeWidth={2.5} />
            </button>
            <button className="hover:text-[#b3b3b3] transition duration-300 hidden sm:inline-block">
              <Bell className="size-6" strokeWidth={2.5} />
            </button>
            
            {/* User Profile Area */}
            <Link to="/login" className="flex items-center gap-2 cursor-pointer group">
              <Avatar className="size-8 rounded-sm outline outline-1 outline-transparent group-hover:outline-gray-300 transition-all flex items-center justify-center shadow-md">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" className="object-cover" />
                <AvatarFallback className="rounded-sm bg-gray-700/80 flex items-center justify-center">
                  <User className="size-5 text-gray-200" />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 opacity-70 group-hover:opacity-100 transition-opacity hidden sm:inline-block group-hover:rotate-180 duration-300" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {/* A dark #141414 canvas matching Netflix branding */}
      <main className="min-h-screen bg-[#141414] text-white">
        <Outlet /> 
      </main>
    </>
  );
}