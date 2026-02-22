import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { logInUser, signUpUser, setupRecaptcha, sendOTP } from "../firebase/auth";
import { createUserProfile } from "../firebase/firestore";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [usePhone, setUsePhone] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Phone Auth State
    const [verificationId, setVerificationId] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    if (!isOpen) return null;

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await logInUser(email, password);
                toast.success("Successfully logged in!");
            } else {
                const user = await signUpUser(email, password, {
                    name: name,
                    phone: phone
                });
                toast.success("Account created successfully!");
            }
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phone) return toast.error("Please enter a phone number");
        setLoading(true);
        try {
            // Force clean the container in the DOM if it exists to prevent 'already rendered'
            const container = document.getElementById('recaptcha-container');
            if (container) {
                container.innerHTML = '';
            }
            // Always initialize a fresh verifier
            window.recaptchaVerifier = setupRecaptcha('recaptcha-container');

            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
            const confirmation = await sendOTP(formattedPhone);
            setConfirmationResult(confirmation);
            toast.success("OTP sent successfully!");
        } catch (error) {
            toast.error("Error sending OTP: " + error.message);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP");
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);

            // Attempt to set a profile if it's a new user (requires checking existence in a real prod app)
            await createUserProfile(result.user.uid, {
                uid: result.user.uid,
                phone: result.user.phoneNumber,
                role: "user",
                createdAt: new Date().toISOString()
            }).catch(err => console.log("Profile might already exist", err));

            toast.success("Phone verified successfully!");
            onClose();
        } catch (error) {
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setEmail(""); setPassword(""); setName(""); setPhone(""); setOtp("");
        setConfirmationResult(null);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                >
                    {/* Close button */}
                    <button
                        onClick={() => { resetState(); onClose(); }}
                        className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 transition"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">
                                {isLogin ? "Welcome Back" : "Create Account"}
                            </h2>
                            <p className="text-slate-500 mt-1 text-sm">
                                {isLogin ? "Sign in to manage your bookings" : "Join premium airport transfer service"}
                            </p>
                        </div>

                        {/* Auth Toggle */}
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${!usePhone ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => { setUsePhone(false); resetState(); }}
                            >
                                Email
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${usePhone ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => { setUsePhone(true); resetState(); }}
                            >
                                Phone (OTP)
                            </button>
                        </div>

                        {/* Forms */}
                        {!usePhone ? (
                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                {!isLogin && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                                            <input
                                                type="text" required
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                                            <input
                                                type="tel" required
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                                    <input
                                        type="email" required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
                                    <input
                                        type="password" required
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full bg-brand-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-70 mt-2"
                                >
                                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div id="recaptcha-container"></div>
                                {!confirmationResult ? (
                                    <form onSubmit={handleSendOtp} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                                            <input
                                                type="tel" required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition"
                                                placeholder="e.g. 9876543210"
                                            />
                                        </div>
                                        <button
                                            type="submit" disabled={loading}
                                            className="w-full bg-brand-orange text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-70"
                                        >
                                            {loading ? "Sending..." : "Send OTP"}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Enter OTP</label>
                                            <input
                                                type="text" required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center tracking-widest text-xl focus:ring-2 focus:ring-brand-blue outline-none transition"
                                                placeholder="------"
                                            />
                                        </div>
                                        <button
                                            type="submit" disabled={loading}
                                            className="w-full bg-brand-blue text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-70"
                                        >
                                            {loading ? "Verifying..." : "Verify & Login"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {!usePhone && (
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-500">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-brand-orange font-semibold hover:underline"
                                    >
                                        {isLogin ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
