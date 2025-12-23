import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CreditCard,
    ArrowLeftRight,
    History,
    User,
    Settings,
    LogOut,
    Wallet,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/accounts', icon: CreditCard, label: 'Accounts' },
    { path: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
    { path: '/transactions', icon: History, label: 'Transactions' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 
                  flex flex-col transition-all duration-300 z-50
                  ${collapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-dark-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center shadow-glow">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold gradient-text">NexBank</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive
                                    ? 'text-primary-400 bg-primary-500/10 border-l-2 border-primary-500'
                                    : 'text-gray-400 hover:text-primary-400 hover:bg-dark-700/50'}`}
                        >
                            <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-dark-700/50">
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 
                      hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full`}
                >
                    <LogOut className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-700 border border-dark-600
                   flex items-center justify-center text-gray-400 hover:text-primary-400 
                   hover:border-primary-500 transition-all duration-200"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
}
