import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Deposit() {
    const { token, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

    const handleDeposit = async (e) => {
        e.preventDefault();
        setError('');

        const depositAmount = parseFloat(amount);

        if (!depositAmount || depositAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/transactions/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: depositAmount }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Deposit failed');
            }

            setSuccess(true);
            // Refresh user profile to get updated balance
            await fetchUserProfile(token);

            // Reset form after short delay and redirect
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to process deposit. Please try again.');
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
                    <h2 className="text-2xl font-bold text-white mb-2">Deposit Successful!</h2>
                    <p className="text-gray-400 mb-4">
                        ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been added to your account.
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
                    <h1 className="text-3xl font-bold text-white">Deposit Funds</h1>
                    <p className="text-gray-400 mt-1">Add money to your account</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Deposit Form */}
                <Card className="p-6">
                    <form onSubmit={handleDeposit} className="space-y-6">
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
                                    step="0.01"
                                    className="w-full pl-12 pr-4 py-4 text-3xl font-bold bg-dark-700/50 border border-dark-600 
                                             rounded-xl text-white placeholder-gray-600 focus:border-primary-500 
                                             focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                                />
                            </div>
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
                                        className={`py-3 rounded-xl font-medium transition-all
                                                  ${amount === quickAmount.toString()
                                                ? 'bg-primary-500 text-white'
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
                            disabled={loading || !amount}
                            className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Deposit ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Info Section */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Deposit Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">Instant Credit</p>
                                    <p className="text-gray-500 text-sm">Funds are credited instantly to your account</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">No Transaction Fees</p>
                                    <p className="text-gray-500 text-sm">Deposit any amount without any charges</p>
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

                    <Card className="p-6 bg-gradient-to-br from-primary-900/20 to-accent-900/20 border-primary-700/30">
                        <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            If you face any issues with your deposit, our support team is available 24/7.
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
