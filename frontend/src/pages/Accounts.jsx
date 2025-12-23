import { CreditCard, Eye, EyeOff, MoreVertical, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Accounts() {
    const { user } = useAuth();
    const [showBalance, setShowBalance] = useState(true);

    const accounts = [
        {
            id: 1,
            type: 'SAVINGS',
            number: user?.accountNumber || '1234567890123456',
            balance: user?.balance || 125850.75,
            status: 'ACTIVE',
            primary: true,
        },
    ];

    const cards = [
        {
            id: 1,
            type: 'Debit Card',
            number: '•••• •••• •••• 4532',
            expiry: '12/27',
            network: 'VISA',
            status: 'Active',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Accounts</h1>
                    <p className="text-gray-400 mt-1">Manage your bank accounts and cards</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Account
                </Button>
            </div>

            {/* Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6"
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-500/20 rounded-full blur-2xl" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-primary-100 text-sm">{account.type} Account</p>
                                        {account.primary && <Badge variant="accent">Primary</Badge>}
                                    </div>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <MoreVertical className="w-5 h-5 text-primary-100" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-primary-100 text-sm">Balance</p>
                                    <button
                                        onClick={() => setShowBalance(!showBalance)}
                                        className="text-primary-200 hover:text-white transition-colors"
                                    >
                                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-3xl font-bold text-white">
                                    {showBalance
                                        ? `₹${account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                                        : '₹••••••'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-100 text-xs mb-1">Account Number</p>
                                    <p className="text-white font-mono">
                                        •••• •••• •••• {account.number.slice(-4)}
                                    </p>
                                </div>
                                <Badge variant={account.status === 'ACTIVE' ? 'success' : 'warning'}>
                                    {account.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Account Card */}
                <Card className="flex items-center justify-center min-h-[200px] border-dashed border-2 border-dark-600 
                         hover:border-primary-500/50 transition-colors cursor-pointer group">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mx-auto mb-3
                            group-hover:bg-primary-500/20 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-400 transition-colors" />
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            Open New Account
                        </p>
                    </div>
                </Card>
            </div>

            {/* Cards Section */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Linked Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Card key={card.id} hover className="group">
                            <div className="flex items-center justify-between mb-4">
                                <CreditCard className="w-8 h-8 text-primary-400" />
                                <span className="text-xl font-bold text-gray-400">{card.network}</span>
                            </div>
                            <p className="text-lg font-mono text-gray-100 mb-4">{card.number}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Valid Thru</p>
                                    <p className="text-gray-100">{card.expiry}</p>
                                </div>
                                <Badge variant="success">{card.status}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
