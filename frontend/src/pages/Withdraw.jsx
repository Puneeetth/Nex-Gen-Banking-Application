import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, ArrowLeft, CheckCircle, AlertCircle, Loader2, Wallet } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Withdraw() {
    const { token, user, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];
    const currentBalance = user?.balance || 0;

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setError('');

        const withdrawAmount = parseFloat(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        if (withdrawAmount > currentBalance) {
            setError('Insufficient balance for this withdrawal');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/transactions/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: withdrawAmount }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Withdrawal failed');
            }

            setSuccess(true);
            // Refresh user profile to get updated balance
            await fetchUserProfile(token);

            // Reset form after short delay and redirect
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to process withdrawal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Successful!</h2>
                    <p className="text-gray-400 mb-4">
                        ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been withdrawn from your account.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-dark-700/50 text-gray-400 hover:text-white 
                             hover:bg-dark-700 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Withdraw Funds</h1>
                    <p className="text-gray-400 mt-1">Withdraw money from your account</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Withdraw Form */}
                <Card className="p-6">
                    <form onSubmit={handleWithdraw} className="space-y-6">
                        {/* Current Balance Display */}
                        <div className="p-4 rounded-xl bg-dark-700/50 border border-dark-600">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Available Balance</p>
                                    <p className="text-xl font-bold text-white">
                                        ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Enter Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="1"
                                    max={currentBalance}
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-4 text-3xl font-bold bg-dark-700/50 border border-dark-600 
                                             rounded-xl text-white placeholder-gray-600 focus:border-primary-500 
                                             focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                                />
                            </div>
                            {amount && parseFloat(amount) > currentBalance && (
                                <p className="text-red-400 text-sm mt-2">Amount exceeds available balance</p>
                            )}
                        </div>

                        {/* Quick Amount Buttons */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Quick Select
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        type="button"
                                        onClick={() => setAmount(quickAmount.toString())}
                                        disabled={quickAmount > currentBalance}
                                        className={`py-3 rounded-xl font-medium transition-all
                                                  ${amount === quickAmount.toString()
                                                ? 'bg-red-500 text-white'
                                                : quickAmount > currentBalance
                                                    ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                                                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'}`}
                                    >
                                        ₹{quickAmount.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading || !amount || parseFloat(amount) > currentBalance}
                            className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 
                                     bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Minus className="w-5 h-5" />
                                    Withdraw ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Info Section */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Withdrawal Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">Instant Processing</p>
                                    <p className="text-gray-500 text-sm">Withdrawals are processed instantly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">No Transaction Fees</p>
                                    <p className="text-gray-500 text-sm">Withdraw any amount without any charges</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">Secure Transaction</p>
                                    <p className="text-gray-500 text-sm">All transactions are encrypted and secure</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-700/30">
                        <h3 className="text-lg font-semibold text-white mb-2">Important Notice</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Please ensure you have sufficient balance before making a withdrawal.
                            Contact support if you face any issues.
                        </p>
                        <Button variant="secondary" className="w-full">
                            Contact Support
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
