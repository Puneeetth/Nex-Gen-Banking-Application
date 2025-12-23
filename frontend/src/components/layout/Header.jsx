import { Bell, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useAuth();

    return (
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 
                       flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search transactions, accounts..."
                    className="w-full pl-10 pr-4 py-2 bg-dark-700/50 border border-dark-600 rounded-xl
                     text-gray-100 placeholder-gray-500 focus:border-primary-500 
                     focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-xl text-gray-400 hover:text-primary-400 
                       hover:bg-dark-700/50 transition-all duration-200"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 bg-dark-800 border border-dark-700 
                            rounded-xl shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-dark-700">
                                <h3 className="font-semibold text-gray-100">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <NotificationItem
                                    title="Payment Received"
                                    message="₹5,000 credited to your account"
                                    time="2 min ago"
                                    type="success"
                                />
                                <NotificationItem
                                    title="Bill Reminder"
                                    message="Electricity bill due tomorrow"
                                    time="1 hour ago"
                                    type="warning"
                                />
                                <NotificationItem
                                    title="Security Alert"
                                    message="New login from Chrome on Windows"
                                    time="2 hours ago"
                                    type="info"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-dark-700/50 
                        transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center text-white font-semibold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-100">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.accountType || 'Premium'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
        </header>
    );
}

function NotificationItem({ title, message, time, type }) {
    const typeColors = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        info: 'bg-primary-500',
        error: 'bg-red-500',
    };

    return (
        <div className="flex items-start gap-3 p-4 hover:bg-dark-700/50 transition-colors cursor-pointer">
            <span className={`w-2 h-2 rounded-full mt-2 ${typeColors[type]}`} />
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-100">{title}</p>
                <p className="text-xs text-gray-400">{message}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    );
}
