import { useState, useEffect } from "react";
import { User, LogOut, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getUserBookings, updateBookingStatus } from "../firebase/firestore";
import { logOutUser } from "../firebase/auth";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        confirmed: "bg-blue-100 text-blue-700 border-blue-200",
        completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cancelled: "bg-red-100 text-red-700 border-red-200"
    };

    const icons = {
        pending: <Clock className="w-3.5 h-3.5 mr-1" />,
        confirmed: <CheckCircle className="w-3.5 h-3.5 mr-1" />,
        completed: <Package className="w-3.5 h-3.5 mr-1" />,
        cancelled: <XCircle className="w-3.5 h-3.5 mr-1" />
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {icons[status]}
            <span className="capitalize">{status}</span>
        </span>
    );
};

const Dashboard = () => {
    const { user, profile } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (user) {
                    const data = await getUserBookings(user.uid);
                    // Sort by date desc (newest first)
                    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setBookings(data);
                }
            } catch (error) {
                toast.error("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await updateBookingStatus(bookingId, "cancelled");
                setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status: "cancelled" } : b));
                toast.success("Booking cancelled");
            } catch (error) {
                toast.error("Error cancelling booking");
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
                                {profile?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{profile?.name || "User"}</h2>
                            <p className="text-sm text-slate-500 mb-1">{user?.email}</p>
                            <p className="text-sm text-slate-500 mb-6">{profile?.phone}</p>

                            <button
                                onClick={() => logOutUser()}
                                className="w-full flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition font-medium"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Bookings</h2>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Package className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">No bookings yet</h3>
                                <p className="text-slate-500 mb-6">Ready for your premium transfer?</p>
                                <a
                                    href="/#book"
                                    className="inline-flex bg-brand-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition"
                                >
                                    Book a Ride
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.bookingId} className="border border-slate-100 rounded-xl p-5 hover:border-slate-300 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                        ID: {booking.bookingId.substring(0, 8)}
                                                    </span>
                                                    <StatusBadge status={booking.status} />
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-semibold text-slate-800">
                                                        {new Date(booking.dateTime).toLocaleDateString()}
                                                    </span>
                                                    {" at "}
                                                    <span className="font-semibold text-slate-800">
                                                        {new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-2xl font-bold text-brand-blue">₹{booking.fare.toLocaleString()}</p>
                                                <p className="text-xs text-slate-500 capitalize">{booking.vehicleType} • Pay on pickup</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 py-3 border-t border-slate-50">
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-400 uppercase mb-1">Pickup</p>
                                                <p className="text-sm font-medium text-slate-800">{booking.pickup}</p>
                                            </div>
                                            <div className="text-slate-300">→</div>
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-400 uppercase mb-1">Drop</p>
                                                <p className="text-sm font-medium text-slate-800">{booking.drop}</p>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                                                <button
                                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                                    className="text-sm text-red-500 font-medium hover:text-red-700 transition"
                                                >
                                                    Cancel Booking
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
