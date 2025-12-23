import { useState } from 'react';
import { Send, Users, History, ArrowRight, Check } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Transfer() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        recipientAccount: '',
        recipientName: '',
        amount: '',
        note: '',
    });

    const quickTransfers = [
        { name: 'Rahul Sharma', account: '••••7890', recent: '₹5,000' },
        { name: 'Priya Singh', account: '••••4567', recent: '₹2,500' },
        { name: 'Amit Kumar', account: '••••1234', recent: '₹10,000' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const confirmTransfer = () => {
        setStep(3);
        // In real app, call backend API here
    };

    if (step === 3) {
        return (
            <div className="max-w-md mx-auto">
                <Card className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h2>
                    <p className="text-gray-400 mb-6">
                        ₹{parseFloat(formData.amount).toLocaleString('en-IN')} has been sent to {formData.recipientName}
                    </p>

                    <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="text-gray-100 font-mono">TXN123456789</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date & Time</span>
                            <span className="text-gray-100">{new Date().toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                            New Transfer
                        </Button>
                        <Button className="flex-1">
                            Download Receipt
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="max-w-md mx-auto">
                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Transfer</h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between p-4 rounded-xl bg-dark-700/30">
                            <span className="text-gray-400">Recipient</span>
                            <span className="text-gray-100">{formData.recipientName}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-xl bg-dark-700/30">
                            <span className="text-gray-400">Account</span>
                            <span className="text-gray-100 font-mono">{formData.recipientAccount}</span>
                        </div>
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

                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                            Edit
                        </Button>
                        <Button className="flex-1" onClick={confirmTransfer}>
                            Confirm Transfer
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Transfer Money</h1>
                <p className="text-gray-400 mt-1">Send money instantly to any bank account</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transfer Form */}
                <div className="lg:col-span-2">
                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Recipient Account Number"
                                name="recipientAccount"
                                placeholder="Enter account number"
                                value={formData.recipientAccount}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Recipient Name"
                                name="recipientName"
                                placeholder="Enter recipient name"
                                value={formData.recipientName}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Amount (₹)"
                                name="amount"
                                type="number"
                                placeholder="Enter amount to transfer"
                                value={formData.amount}
                                onChange={handleChange}
                                min="1"
                                required
                            />

                            <Input
                                label="Note (Optional)"
                                name="note"
                                placeholder="Add a note for this transfer"
                                value={formData.note}
                                onChange={handleChange}
                            />

                            <Button type="submit" className="w-full flex items-center justify-center gap-2">
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
                                        recipientAccount: contact.account.replace('••••', '123456'),
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
                                            <p className="text-sm text-gray-500">{contact.account}</p>
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
