import { useState, useEffect } from "react";
import { User, LogOut, FileText, CheckCircle, Clock, Trash2, XCircle, TrendingUp, Search } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getAllBookings, updateBookingStatus, deleteBookingRecord } from "../firebase/firestore";
import { logOutUser } from "../firebase/auth";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-blue-100 text-blue-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    const { user, profile } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAllBookings(data);
        } catch (error) {
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            setAllBookings(allBookings.map(b => b.bookingId === bookingId ? { ...b, status: newStatus } : b));
            toast.success(`Booking marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (bookingId) => {
        if (window.confirm("Are you sure you want to permanently delete this record?")) {
            try {
                await deleteBookingRecord(bookingId);
                setAllBookings(allBookings.filter(b => b.bookingId !== bookingId));
                toast.success("Record deleted");
            } catch (error) {
                toast.error("Failed to delete record");
            }
        }
    };

    // Derived Analytics
    const totalRevenue = allBookings
        .filter(b => b.status === "completed" || b.status === "confirmed")
        .reduce((sum, b) => sum + (Number(b.fare) || 0), 0);

    const pendingCount = allBookings.filter(b => b.status === "pending").length;

    // Filtered List
    const filteredBookings = allBookings.filter(b => {
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesSearch = b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.drop.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Stats Row */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Control Panel</h1>
                        <p className="text-slate-500 mt-1">Manage global bookings and system revenue.</p>
                    </div>
                    <button
                        onClick={() => logOutUser()}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium text-sm"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Admin Logout
                    </button>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Revenue</p>
                                <h3 className="text-4xl font-black text-brand-blue">₹{totalRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Action Required</p>
                                <h3 className="text-4xl font-black text-amber-500">{pendingCount}</h3>
                                <p className="text-sm text-slate-400 mt-1">Pending Bookings</p>
                            </div>
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Volume</p>
                                <h3 className="text-4xl font-black text-slate-800">{allBookings.length}</h3>
                                <p className="text-sm text-slate-400 mt-1">All Time Rides</p>
                            </div>
                            <div className="p-3 bg-orange-50 text-brand-orange rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search ID or Location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none transition text-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition ${statusFilter === status ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 text-left">Booking Ref</th>
                                    <th className="px-6 py-4 text-left">Route Details</th>
                                    <th className="px-6 py-4 text-left">Schedule</th>
                                    <th className="px-6 py-4 text-left">Service & Fare</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            No records found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.bookingId} className="hover:bg-slate-50/50 transition font-medium text-sm text-slate-700">
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-xs text-slate-500">{booking.bookingId.substring(0, 8)}...</div>
                                                <div className="text-xs text-slate-400 mt-0.5">User: {booking.userId.substring(0, 5)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 max-w-xs truncate">
                                                    <span className="truncate text-slate-800" title={booking.pickup}>P: {booking.pickup}</span>
                                                    <span className="truncate text-slate-500" title={booking.drop}>D: {booking.drop}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-800">{new Date(booking.dateTime).toLocaleDateString()}</div>
                                                <div className="text-slate-500">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="capitalize text-slate-800">{booking.vehicleType}</div>
                                                <div className="font-bold text-brand-blue">₹{booking.fare.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.bookingId, 'confirmed')}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Confirm"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.bookingId, 'completed')}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Mark Completed"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.bookingId, 'cancelled')}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Cancel"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(booking.bookingId)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Record"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
