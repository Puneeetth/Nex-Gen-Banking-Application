import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Download, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export default function Transactions() {
    const { token } = useAuth();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const fetchTransactions = async (page = 0) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `http://localhost:8080/api/transactions?page=${page}&size=${pageSize}&sort=createdAt,desc`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch transactions');
            }

            const data = await response.json();

            // Transform backend data to frontend format
            const transformedTransactions = data.content.map((tx) => ({
                id: tx.transactionId,
                type: tx.transactionType === 'DEPOSIT' ? 'credit' : 'debit',
                transactionType: tx.transactionType,
                name: getTransactionName(tx.transactionType),
                amount: parseFloat(tx.amount),
                balanceBefore: parseFloat(tx.balanceBefore),
                balanceAfter: parseFloat(tx.balanceAfter),
                date: formatDate(tx.createdAt),
                time: formatTime(tx.createdAt),
                category: tx.transactionType,
                status: tx.status.toLowerCase(),
            }));

            setTransactions(transformedTransactions);
            setCurrentPage(data.number);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

        } catch (err) {
            setError(err.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
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

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Helper function to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    useEffect(() => {
        if (token) {
            fetchTransactions(currentPage);
        }
    }, [token, currentPage]);

    const filteredTransactions = transactions.filter(tx => {
        if (filter !== 'all' && tx.type !== filter) return false;
        if (searchTerm && !tx.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !tx.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'success':
                return <Badge variant="success">Completed</Badge>;
            case 'failed':
                return <Badge variant="danger">Failed</Badge>;
            default:
                return <Badge variant="warning">Pending</Badge>;
        }
    };

    const getTransactionIcon = (tx) => {
        if (tx.transactionType === 'DEPOSIT') {
            return (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20 text-green-400">
                    <ArrowDownLeft className="w-5 h-5" />
                </div>
            );
        } else if (tx.transactionType === 'WITHDRAW') {
            return (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/20 text-red-400">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            );
        } else {
            // TRANSFER
            return (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            );
        }
    };

    // Loading state
    if (loading && transactions.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Transactions</h1>
                        <p className="text-gray-400 mt-1">View and manage your transaction history</p>
                    </div>
                </div>
                <Card className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 text-primary-400 animate-spin mb-4" />
                    <p className="text-gray-400">Loading transactions...</p>
                </Card>
            </div>
        );
    }

    // Error state
    if (error && transactions.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Transactions</h1>
                        <p className="text-gray-400 mt-1">View and manage your transaction history</p>
                    </div>
                </div>
                <Card className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => fetchTransactions(0)} className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-gray-400 mt-1">View and manage your transaction history</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                        onClick={() => fetchTransactions(currentPage)}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
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

            {/* Empty state */}
            {filteredTransactions.length === 0 && !loading && (
                <Card className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4">
                        <Filter className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-400 mb-2">No transactions found</p>
                    <p className="text-gray-500 text-sm">
                        {searchTerm || filter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Your transaction history will appear here'}
                    </p>
                </Card>
            )}

            {/* Transactions Table */}
            {filteredTransactions.length > 0 && (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Transaction</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Type</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Balance</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {getTransactionIcon(tx)}
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
                                            <p className="text-gray-400 text-sm">
                                                ₹{tx.balanceBefore?.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-gray-100 text-sm">
                                                → ₹{tx.balanceAfter?.toLocaleString('en-IN')}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(tx.status)}
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
                            Showing {filteredTransactions.length} of {totalElements} transactions
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className={`p-2 rounded-lg transition-colors
                                    ${currentPage === 0
                                        ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                                        : 'bg-dark-700 text-gray-400 hover:text-gray-200'}`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (currentPage < 3) {
                                    pageNum = i;
                                } else if (currentPage >= totalPages - 3) {
                                    pageNum = totalPages - 5 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors
                                            ${currentPage === pageNum
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-dark-700 text-gray-400 hover:text-gray-200'}`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className={`p-2 rounded-lg transition-colors
                                    ${currentPage >= totalPages - 1
                                        ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                                        : 'bg-dark-700 text-gray-400 hover:text-gray-200'}`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
