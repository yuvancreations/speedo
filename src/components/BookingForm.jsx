import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Navigation, Car } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { createBooking } from "../firebase/firestore";
import toast from "react-hot-toast";
import AuthModal from "./AuthModal";

const vehicleOptions = [
    { id: "sedan", name: "Sedan (4 Seats)", baseRate: 2000, multiplier: 1 },
    { id: "suv", name: "SUV (6 Seats)", baseRate: 3500, multiplier: 1.3 },
    { id: "premium", name: "Premium Sedan", baseRate: 5500, multiplier: 1.8 }
];

const BookingForm = () => {
    const { user } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        pickup: "Haridwar, Uttarakhand", // Default or user input
        drop: "Dehradun Airport (DED)",
        date: "",
        time: "",
        vehicleType: "sedan"
    });

    const [fare, setFare] = useState(1500); // Default estimate

    const calculateFare = (vehicleId) => {
        const vehicle = vehicleOptions.find(v => v.id === vehicleId);
        // Simple mock logic: fixed base * multiplier based on Dehradun-Haridwar distance
        setFare(Math.round(vehicle.baseRate * vehicle.multiplier));
    };

    const handleVehicleChange = (e) => {
        setFormData({ ...formData, vehicleType: e.target.value });
        calculateFare(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast("Please login to book your ride", { icon: "🔒" });
            setIsAuthOpen(true);
            return;
        }

        if (!formData.date || !formData.time || !formData.pickup || !formData.drop) {
            return toast.error("Please fill all fields");
        }

        setLoading(true);
        try {
            const bookingRecord = {
                userId: user.uid,
                pickup: formData.pickup,
                drop: formData.drop,
                dateTime: `${formData.date}T${formData.time}`,
                vehicleType: formData.vehicleType,
                fare: fare,
                status: "pending",
                createdAt: new Date().toISOString()
            };

            await createBooking(bookingRecord);
            toast.success("Booking confirmed successfully!");

            // Reset form on success
            setFormData(prev => ({ ...prev, date: "", time: "" }));
        } catch (error) {
            toast.error("Failed to create booking");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 md:p-8 w-full max-w-lg mx-auto relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Book Your Transfer</h3>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                    {/* Locations */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-orange">
                                <MapPin size={18} />
                            </div>
                            <input
                                type="text" required
                                value={formData.pickup}
                                onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                                placeholder="Pickup Location"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition shadow-sm"
                            />
                        </div>

                        <div className="flex justify-center -my-3 relative z-10">
                            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100 text-slate-400">
                                <Navigation size={14} className="transform rotate-180" />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue">
                                <MapPin size={18} />
                            </div>
                            <input
                                type="text" required
                                value={formData.drop}
                                onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
                                placeholder="Drop Location"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <input
                                type="date" required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition shadow-sm text-sm"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="time" required
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition shadow-sm text-sm"
                            />
                        </div>
                    </div>

                    {/* Vehicle Selection */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Car size={18} />
                        </div>
                        <select
                            value={formData.vehicleType}
                            onChange={handleVehicleChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition shadow-sm appearance-none"
                        >
                            {vehicleOptions.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fare Estimate */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">Estimated Fare</span>
                        <span className="text-xl font-bold text-brand-blue">₹{fare.toLocaleString()}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-blue to-blue-800 text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            {loading ? "Processing..." : (user ? "Confirm Booking" : "Login to Book")}
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-brand-orange to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </form>
            </motion.div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
};

export default BookingForm;
