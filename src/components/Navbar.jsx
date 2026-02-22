import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { logOutUser } from "../firebase/auth";
import toast from "react-hot-toast";

// Will be passed down via props or context in a real scenario
import AuthModal from "./AuthModal";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logOutUser();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/#services" },
        { name: "Fare", path: "/#fare" },
        { name: "Contact", path: "/#contact" },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-orange bg-clip-text text-transparent">
                                Speedo
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-8 items-center">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="text-slate-600 hover:text-brand-orange transition-colors font-medium text-sm"
                                >
                                    {link.name}
                                </a>
                            ))}

                            {!user ? (
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="text-brand-blue font-medium hover:text-brand-orange transition-colors"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to={isAdmin ? "/admin" : "/dashboard"}
                                        className="flex items-center text-slate-700 hover:text-brand-blue font-medium"
                                    >
                                        <User className="w-4 h-4 mr-1" />
                                        {isAdmin ? "Admin Pivot" : "Dashboard"}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 font-medium hover:text-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}

                            <a
                                href="#book"
                                className="bg-gradient-to-r from-brand-orange to-amber-500 text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Book Now
                            </a>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-slate-600 hover:text-brand-blue focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-brand-orange hover:bg-slate-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            <div className="border-t border-slate-200 pt-4 pb-2">
                                {!user ? (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsAuthOpen(true);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-blue hover:bg-slate-50"
                                    >
                                        Login / Sign up
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            to={isAdmin ? "/admin" : "/dashboard"}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleLogout();
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-slate-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};

export default Navbar;
