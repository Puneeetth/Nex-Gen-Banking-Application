import { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Transactions() {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const transactions = [
        { id: 'TXN001', type: 'credit', name: 'Salary Credit - ABC Corp', amount: 75000, date: 'Dec 22, 2024', time: '09:30 AM', category: 'Income', status: 'completed' },
        { id: 'TXN002', type: 'debit', name: 'Amazon Purchase', amount: 2499, date: 'Dec 21, 2024', time: '03:45 PM', category: 'Shopping', status: 'completed' },
        { id: 'TXN003', type: 'debit', name: 'Electricity Bill - BESCOM', amount: 1250, date: 'Dec 20, 2024', time: '11:20 AM', category: 'Utilities', status: 'completed' },
        { id: 'TXN004', type: 'credit', name: 'Refund - Flipkart', amount: 899, date: 'Dec 19, 2024', time: '05:15 PM', category: 'Refund', status: 'completed' },
        { id: 'TXN005', type: 'debit', name: 'Netflix Subscription', amount: 649, date: 'Dec 18, 2024', time: '12:00 AM', category: 'Entertainment', status: 'completed' },
        { id: 'TXN006', type: 'debit', name: 'Swiggy Order', amount: 450, date: 'Dec 17, 2024', time: '08:30 PM', category: 'Food', status: 'completed' },
        { id: 'TXN007', type: 'credit', name: 'Transfer from Rahul', amount: 5000, date: 'Dec 16, 2024', time: '02:45 PM', category: 'Transfer', status: 'completed' },
        { id: 'TXN008', type: 'debit', name: 'Petrol - HP', amount: 2000, date: 'Dec 15, 2024', time: '10:00 AM', category: 'Transport', status: 'completed' },
    ];

    const filteredTransactions = transactions.filter(tx => {
        if (filter !== 'all' && tx.type !== filter) return false;
        if (searchTerm && !tx.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-gray-400 mt-1">View and manage your transaction history</p>
                </div>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-dark-700/50 border border-dark-600 rounded-xl
                         text-gray-100 placeholder-gray-500 focus:border-primary-500 
                         focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['all', 'credit', 'debit'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl font-medium transition-all capitalize
                           ${filter === f
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-dark-700 text-gray-400 hover:text-gray-200'}`}
                            >
                                {f === 'all' ? 'All' : f === 'credit' ? 'Income' : 'Expenses'}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Transactions Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Transaction</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Category</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                      ${tx.type === 'credit'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'}`}>
                                                {tx.type === 'credit'
                                                    ? <ArrowDownLeft className="w-5 h-5" />
                                                    : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-100">{tx.name}</p>
                                                <p className="text-sm text-gray-500 font-mono">{tx.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 rounded-lg bg-dark-700 text-gray-300 text-sm">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-100">{tx.date}</p>
                                        <p className="text-sm text-gray-500">{tx.time}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge variant="success">Completed</Badge>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700 mt-4">
                    <p className="text-sm text-gray-500">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium">1</button>
                        <button className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors">2</button>
                        <button className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors">3</button>
                        <button className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
