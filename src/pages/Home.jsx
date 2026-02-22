import { motion } from "framer-motion";
import { Phone, Shield, Clock, Star } from "lucide-react";
import BookingForm from "../components/BookingForm";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900 px-4">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
                        alt="Airport Transfer"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-white space-y-6"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-sm font-semibold tracking-wide">
                            Haridwar to Dehradun Airport
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Premium Airport <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">Pickup & Drop</span> Service
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                            Experience safe, comfortable, and on-time rides with Speedo. Your trusted travel partner in Uttarakhand.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="#book" className="text-center bg-brand-orange hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-brand-orange/30 transition-all text-lg inline-flex items-center justify-center">
                                Book a Ride
                            </a>
                            <a href="tel:+919557300217" className="text-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-all text-lg inline-flex items-center justify-center">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Now
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        id="book"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <BookingForm />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose Speedo?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">We provide the highest quality transport service focusing on your comfort and safety.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Safe & Secure", desc: "Verified drivers and sanitized premium vehicles for your peace of mind." },
                            { icon: Clock, title: "On-Time Guarantee", desc: "We value your time. Our drivers always arrive 10 minutes prior to pickup." },
                            { icon: Star, title: "Premium Fleet", desc: "Choose from our wide range of well-maintained Sedans and SUVs." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group"
                            >
                                <div className="w-16 h-16 mx-auto bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors text-brand-blue">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Basic Footer */}
            <footer id="contact" className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Speedo</h3>
                        <p className="text-sm border-b border-transparent">Premium Airport Pickup & Drop Service operating from Haridwar.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📞 +91 9557300217</li>
                            <li>📍 Kankhal, Haridwar, Uttarakhand</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition cursor-pointer">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition cursor-pointer">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center">
                    &copy; {new Date().getFullYear()} Speedo Travels. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
