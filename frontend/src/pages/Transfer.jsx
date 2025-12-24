import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Users, History, ArrowRight, Check, ArrowLeft, AlertCircle, Loader2, Wallet } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Transfer() {
    const { token, user, fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        receiverAccountNumber: '',
        recipientName: '',
        amount: '',
        note: '',
    });

    const currentBalance = user?.balance || 0;

    const quickTransfers = [
        { name: 'Rahul Sharma', account: '1234567890', recent: '₹5,000' },
        { name: 'Priya Singh', account: '0987654321', recent: '₹2,500' },
        { name: 'Amit Kumar', account: '1122334455', recent: '₹10,000' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const transferAmount = parseFloat(formData.amount);

        if (!formData.receiverAccountNumber.trim()) {
            setError('Please enter recipient account number');
            return;
        }

        if (!transferAmount || transferAmount <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }

        if (transferAmount > currentBalance) {
            setError('Insufficient balance for this transfer');
            return;
        }

        setStep(2);
    };

    const confirmTransfer = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/transactions/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiverAccountNumber: formData.receiverAccountNumber,
                    amount: parseFloat(formData.amount),
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Transfer failed');
            }

            // Refresh user profile to get updated balance
            await fetchUserProfile(token);
            setStep(3);

        } catch (err) {
            setError(err.message || 'Failed to process transfer. Please try again.');
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            receiverAccountNumber: '',
            recipientName: '',
            amount: '',
            note: '',
        });
        setError('');
        setStep(1);
    };

    // Success Screen
    if (step === 3) {
        return (
            <div className="max-w-md mx-auto">
                <Card className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h2>
                    <p className="text-gray-400 mb-6">
                        ₹{parseFloat(formData.amount).toLocaleString('en-IN')} has been sent to account {formData.receiverAccountNumber}
                    </p>

                    <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Recipient Account</span>
                            <span className="text-gray-100 font-mono">{formData.receiverAccountNumber}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Amount</span>
                            <span className="text-green-400 font-semibold">₹{parseFloat(formData.amount).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date & Time</span>
                            <span className="text-gray-100">{new Date().toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1" onClick={resetForm}>
                            New Transfer
                        </Button>
                        <Button className="flex-1" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Confirmation Screen
    if (step === 2) {
        return (
            <div className="max-w-md mx-auto">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Transfer</h2>

                    {loading ? (
                        <div className="flex flex-col items-center py-8">
                            <Loader2 className="w-12 h-12 text-primary-400 animate-spin mb-4" />
                            <p className="text-gray-400">Processing your transfer...</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between p-4 rounded-xl bg-dark-700/30">
                                    <span className="text-gray-400">Recipient Account</span>
                                    <span className="text-gray-100 font-mono">{formData.receiverAccountNumber}</span>
                                </div>
                                {formData.recipientName && (
                                    <div className="flex justify-between p-4 rounded-xl bg-dark-700/30">
                                        <span className="text-gray-400">Recipient Name</span>
                                        <span className="text-gray-100">{formData.recipientName}</span>
                                    </div>
                                )}
                                <div className="flex justify-between p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-2xl font-bold text-primary-400">
                                        ₹{parseFloat(formData.amount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                {formData.note && (
                                    <div className="flex justify-between p-4 rounded-xl bg-dark-700/30">
                                        <span className="text-gray-400">Note</span>
                                        <span className="text-gray-100">{formData.note}</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-6">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                                    Edit
                                </Button>
                                <Button className="flex-1" onClick={confirmTransfer}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Confirm Transfer
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        );
    }

    // Main Transfer Form
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-dark-700/50 text-gray-400 hover:text-white 
                             hover:bg-dark-700 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Transfer Money</h1>
                    <p className="text-gray-400 mt-1">Send money instantly to any bank account</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transfer Form */}
                <div className="lg:col-span-2">
                    <Card className="p-8">
                        {/* Current Balance Display */}
                        <div className="p-4 rounded-xl bg-dark-700/50 border border-dark-600 mb-6">
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Recipient Account Number"
                                name="receiverAccountNumber"
                                placeholder="Enter account number"
                                value={formData.receiverAccountNumber}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Recipient Name (Optional)"
                                name="recipientName"
                                placeholder="Enter recipient name for your reference"
                                value={formData.recipientName}
                                onChange={handleChange}
                            />

                            <div>
                                <Input
                                    label="Amount (₹)"
                                    name="amount"
                                    type="number"
                                    placeholder="Enter amount to transfer"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    min="1"
                                    max={currentBalance}
                                    required
                                />
                                {formData.amount && parseFloat(formData.amount) > currentBalance && (
                                    <p className="text-red-400 text-sm mt-2">Amount exceeds available balance</p>
                                )}
                            </div>

                            <Input
                                label="Note (Optional)"
                                name="note"
                                placeholder="Add a note for this transfer"
                                value={formData.note}
                                onChange={handleChange}
                            />

                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2"
                                disabled={parseFloat(formData.amount) > currentBalance}
                            >
                                <Send className="w-5 h-5" />
                                Continue to Review
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Quick Transfer */}
                <div className="lg:col-span-1">
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-400" />
                            Quick Transfer
                        </h3>
                        <div className="space-y-3">
                            {quickTransfers.map((contact, index) => (
                                <button
                                    key={index}
                                    onClick={() => setFormData({
                                        ...formData,
                                        recipientName: contact.name,
                                        receiverAccountNumber: contact.account,
                                    })}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-700/30 
                             hover:bg-dark-700/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                                    flex items-center justify-center text-white font-semibold text-sm">
                                            {contact.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-100">{contact.name}</p>
                                            <p className="text-sm text-gray-500 font-mono">••••{contact.account.slice(-4)}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400">{contact.recent}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-dark-700">
                            <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Recent Transfers
                            </h4>
                            <p className="text-sm text-gray-500 text-center py-4">
                                Your recent transfers will appear here
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
