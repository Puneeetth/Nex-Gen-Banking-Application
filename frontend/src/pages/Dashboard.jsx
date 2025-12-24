import { useState, useEffect } from 'react';
import {
    ArrowUpRight,
    ArrowDownLeft,
    History,
    CreditCard,
    TrendingUp,
    PiggyBank,
    Send,
    Plus,
    Minus,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, token } = useAuth();
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [stats, setStats] = useState({
        moneyIn: 0,
        moneyOut: 0,
        saved: 0
    });

    // Mock data for demonstration
    const mockUser = {
        fullName: user?.fullName || 'John Doe',
        balance: user?.balance || 125850.75,
        accountNumber: user?.accountNumber || '1234567890123456',
        accountType: user?.accountType || 'SAVINGS',
        status: user?.status || 'ACTIVE',
        kycStatus: user?.kycStatus || 'VERIFIED',
    };

    const quickActions = [
        { icon: Send, label: 'Transfer', color: 'from-blue-500 to-blue-600', path: '/transfer' },
        { icon: Plus, label: 'Deposit', color: 'from-green-500 to-green-600', path: '/deposit' },
        { icon: Minus, label: 'Withdraw', color: 'from-red-500 to-red-600', path: '/withdraw' },
        { icon: History, label: 'History', color: 'from-orange-500 to-orange-600', path: '/transactions' },
    ];

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper function to get readable transaction name
    const getTransactionName = (type) => {
        switch (type) {
            case 'DEPOSIT':
                return 'Deposit';
            case 'WITHDRAW':
                return 'Withdrawal';
            case 'TRANSFER':
                return 'Fund Transfer';
            default:
                return type;
        }
    };

    // Fetch recent transactions
    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (!token) return;

            setLoadingTransactions(true);
            try {
                const response = await fetch(
                    'http://localhost:8080/api/transactions?page=0&size=5&sort=createdAt,desc',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    // Transform and set transactions
                    const transformed = data.content.map((tx) => ({
                        id: tx.transactionId,
                        type: tx.transactionType === 'DEPOSIT' ? 'credit' : 'debit',
                        transactionType: tx.transactionType,
                        name: getTransactionName(tx.transactionType),
                        amount: parseFloat(tx.amount),
                        date: formatDate(tx.createdAt),
                        category: tx.transactionType,
                    }));

                    setRecentTransactions(transformed);

                    // Calculate stats from all transactions
                    let moneyIn = 0;
                    let moneyOut = 0;

                    data.content.forEach((tx) => {
                        const amount = parseFloat(tx.amount);
                        if (tx.transactionType === 'DEPOSIT') {
                            moneyIn += amount;
                        } else {
                            moneyOut += amount;
                        }
                    });

                    setStats({
                        moneyIn,
                        moneyOut,
                        saved: moneyIn - moneyOut
                    });
                }
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
            } finally {
                setLoadingTransactions(false);
            }
        };

        fetchRecentTransactions();
    }, [token]);

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, <span className="gradient-text">{mockUser.fullName.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Here's what's happening with your account today.</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant={mockUser.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {mockUser.status}
                    </Badge>
                    <Badge variant={mockUser.kycStatus === 'VERIFIED' ? 'success' : 'info'}>
                        KYC: {mockUser.kycStatus}
                    </Badge>
                </div>
            </div>

            {/* Main Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 md:p-8">
                {/* Background Decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-primary-100 text-sm font-medium mb-1">Total Balance</p>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                ₹{mockUser.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 text-green-300">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm">+12.5% this month</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-primary-100 text-sm mb-1">Account Number</p>
                            <p className="text-white font-mono text-lg">
                                •••• •••• •••• {mockUser.accountNumber.slice(-4)}
                            </p>
                            <p className="text-primary-200 text-sm mt-2">{mockUser.accountType} Account</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.label} to={action.path}>
                            <Card
                                hover
                                className="cursor-pointer group h-full"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
                                    flex items-center justify-center mb-3 
                                    group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-gray-100 font-medium">{action.label}</span>
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <ArrowDownLeft className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Money In</p>
                        <p className="text-xl font-bold text-white">
                            ₹{stats.moneyIn.toLocaleString('en-IN')}
                        </p>
                        <p className="text-green-400 text-xs mt-1">Recent activity</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Money Out</p>
                        <p className="text-xl font-bold text-white">
                            ₹{stats.moneyOut.toLocaleString('en-IN')}
                        </p>
                        <p className="text-red-400 text-xs mt-1">Recent activity</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
                        <PiggyBank className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Net Change</p>
                        <p className={`text-xl font-bold ${stats.saved >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stats.saved >= 0 ? '+' : ''}₹{stats.saved.toLocaleString('en-IN')}
                        </p>
                        <p className="text-accent-400 text-xs mt-1">Recent activity</p>
                    </div>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    <Link to="/transactions">
                        <Button variant="ghost" className="text-sm flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {loadingTransactions ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-2" />
                        <p className="text-gray-500 text-sm">Loading transactions...</p>
                    </div>
                ) : recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-3">
                            <History className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400">No transactions yet</p>
                        <p className="text-gray-500 text-sm mt-1">Your transaction history will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30 
                             hover:bg-dark-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                    ${tx.type === 'credit'
                                            ? 'bg-green-500/20 text-green-400'
                                            : tx.transactionType === 'TRANSFER'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-red-500/20 text-red-400'}`}>
                                        {tx.type === 'credit'
                                            ? <ArrowDownLeft className="w-5 h-5" />
                                            : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-100">{tx.name}</p>
                                        <p className="text-sm text-gray-500">{tx.date} • {tx.category}</p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
