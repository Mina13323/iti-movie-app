import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white font-bold text-xl">Movie App</div>
                    <div className="flex space-x-4">
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        {/* ملاحظة: رابط التفاصيل عادة لا يوضع في النافبار لأنه يحتاج رقم ID محدد */}
                        <Link to="/wishlist" className="text-gray-300 hover:text-white">Wishlist</Link>
                        <Link to="/search" className="text-gray-300 hover:text-white">Search</Link>
                        <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                        <Link to="/signup" className="text-gray-300 hover:text-white">Register</Link>
                    </div>
                </div>
            </nav>

            {/* الـ Outlet مكانه الصحيح هنا (تحت النافبار) لكي تظهر الصفحات تحته */}
            <main className="container mx-auto p-4">
                <Outlet /> 
            </main>
        </>
    );
}