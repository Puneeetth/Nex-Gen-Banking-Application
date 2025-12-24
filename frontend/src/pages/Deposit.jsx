import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, CheckCircle, AlertCircle, Loader2, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Deposit() {
    const { token, user, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment Methods

    const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

    const paymentMethods = [
        {
            id: 'upi',
            name: 'UPI',
            description: 'GPay, PhonePe, Paytm & more',
            icon: Smartphone,
            color: 'from-purple-500 to-indigo-500',
            popular: true
        },
        {
            id: 'card',
            name: 'Card',
            description: 'Credit & Debit Cards',
            icon: CreditCard,
            color: 'from-blue-500 to-cyan-500',
            popular: false
        },
        {
            id: 'netbanking',
            name: 'Net Banking',
            description: 'All major banks supported',
            icon: Building2,
            color: 'from-green-500 to-emerald-500',
            popular: false
        },
        {
            id: 'wallet',
            name: 'Wallet',
            description: 'Paytm, Mobikwik & more',
            icon: Wallet,
            color: 'from-orange-500 to-amber-500',
            popular: false
        },
    ];

    const upiApps = [
        { name: 'Google Pay', logo: '📱', color: 'bg-white' },
        { name: 'PhonePe', logo: '💜', color: 'bg-purple-100' },
        { name: 'Paytm', logo: '💙', color: 'bg-blue-100' },
        { name: 'BHIM', logo: '🏛️', color: 'bg-green-100' },
    ];

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        setError('');

        const depositAmount = parseFloat(amount);

        if (!depositAmount || depositAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        if (depositAmount < 1) {
            setError('Minimum deposit amount is ₹1');
            return;
        }

        setStep(2);
    };

    const initiatePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create order on backend
            const orderResponse = await fetch('http://localhost:8080/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();

            // Step 2: Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount * 100, // Amount in paise
                currency: orderData.currency || 'INR',
                name: 'NexBank',
                description: 'Deposit to Account',
                order_id: orderData.orderId,
                handler: async function (response) {
                    // Step 3: Verify payment on backend
                    try {
                        const verifyResponse = await fetch('http://localhost:8080/api/payments/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        setSuccess(true);
                        await fetchUserProfile(token);

                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 2000);

                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                        setStep(1);
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#3B82F6',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                setError(`Payment failed: ${response.error.description}`);
                setLoading(false);
                setStep(1);
            });
            razorpay.open();

        } catch (err) {
            setError(err.message || 'Failed to initiate payment. Please try again.');
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

    // Step 2: Payment Methods
    if (step === 2) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setStep(1)}
                        className="p-2 rounded-xl bg-dark-700/50 text-gray-400 hover:text-white 
                                 hover:bg-dark-700 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Choose Payment Method</h1>
                        <p className="text-gray-400 mt-1">
                            Deposit ₹{parseFloat(amount).toLocaleString('en-IN')} to your account
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Payment Methods */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Options</h3>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={initiatePayment}
                                        disabled={loading}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-700/30 
                                                 hover:bg-dark-700/50 transition-all border border-transparent
                                                 hover:border-primary-500/30 group relative"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} 
                                                       flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-100">{method.name}</p>
                                                {method.popular && (
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{method.description}</p>
                                        </div>
                                        {loading && (
                                            <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 mt-4">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </Card>

                    {/* UPI Apps Quick Access */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick UPI Payment</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Click any payment method to open Razorpay checkout with all UPI options
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {upiApps.map((app) => (
                                    <button
                                        key={app.name}
                                        onClick={initiatePayment}
                                        disabled={loading}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-dark-700/30 
                                                 hover:bg-dark-700/50 transition-all"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-2xl`}>
                                            {app.logo}
                                        </div>
                                        <span className="text-xs text-gray-400">{app.name}</span>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-primary-900/20 to-accent-900/20 border-primary-700/30">
                            <h3 className="text-lg font-semibold text-white mb-2">Amount to Deposit</h3>
                            <p className="text-3xl font-bold text-primary-400 mb-4">
                                ₹{parseFloat(amount).toLocaleString('en-IN')}
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Deposit Amount</span>
                                    <span>₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Transaction Fee</span>
                                    <span className="text-green-400">FREE</span>
                                </div>
                                <div className="border-t border-dark-600 pt-2 flex justify-between text-white font-medium">
                                    <span>Total</span>
                                    <span>₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Step 1: Amount Entry
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
                    <p className="text-gray-400 mt-1">Add money to your account via UPI, Cards or Net Banking</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Deposit Form */}
                <Card className="p-6">
                    <form onSubmit={handleProceedToPayment} className="space-y-6">
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
                            <Plus className="w-5 h-5" />
                            Proceed to Pay ₹{amount ? parseFloat(amount).toLocaleString('en-IN') : '0'}
                        </Button>
                    </form>
                </Card>

                {/* Info Section */}
                <div className="space-y-6">
                    {/* Payment Methods Preview */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Available Payment Methods</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <div
                                        key={method.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/30"
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} 
                                                       flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-200 text-sm">{method.name}</p>
                                            <p className="text-xs text-gray-500">{method.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Deposit Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">Instant Credit</p>
                                    <p className="text-gray-500 text-sm">Funds are credited instantly after payment</p>
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
                                    <p className="text-gray-200 font-medium">Secure Payment</p>
                                    <p className="text-gray-500 text-sm">Powered by Razorpay secure gateway</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
