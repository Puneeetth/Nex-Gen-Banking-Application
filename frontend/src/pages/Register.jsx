import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Wallet, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';

export default function Register() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        aadhaarNumber: '',
        panCardNumber: '',
        accountType: 'SAVINGS',
        initialDeposit: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
        if (!formData.phone.match(/^[6-9]\d{9}$/)) newErrors.phone = 'Valid 10-digit phone number required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.aadhaarNumber.match(/^\d{12}$/)) newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar required';
        if (!formData.panCardNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) newErrors.panCardNumber = 'Valid PAN format required (e.g., ABCDE1234F)';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors = {};
        if (!formData.initialDeposit || parseFloat(formData.initialDeposit) <= 0) {
            newErrors.initialDeposit = 'Initial deposit must be greater than 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setLoading(true);
        setError('');

        const result = await register({
            ...formData,
            initialDeposit: parseFloat(formData.initialDeposit),
        });

        if (result.success) {
            setSuccess(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center p-8">
                <div className="card p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Account Created!</h2>
                    <p className="text-gray-400 mb-6">{success.message}</p>

                    <div className="bg-dark-700/50 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm text-gray-400 mb-1">Account Number</p>
                        <p className="text-xl font-mono font-bold text-primary-400">{success.accountNumber}</p>
                        <p className="text-sm text-gray-400 mt-3 mb-1">Account Type</p>
                        <p className="text-gray-100">{success.accountType}</p>
                    </div>

                    <Button onClick={() => navigate('/login')} className="w-full">
                        Proceed to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark-900 via-primary-900/20 to-dark-950 
                      flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center shadow-glow-lg mx-auto mb-8">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-white">Open Your</span><br />
                        <span className="gradient-text">NexBank Account</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-md">
                        Join millions of users enjoying seamless digital banking
                    </p>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                ${step >= s
                                        ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                                        : 'bg-dark-700 text-gray-500'}`}>
                                    {step > s ? <Check className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-8 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-dark-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500">
                        <span className={step >= 1 ? 'text-primary-400' : ''}>Personal</span>
                        <span className={step >= 2 ? 'text-primary-400' : ''}>KYC</span>
                        <span className={step >= 3 ? 'text-primary-400' : ''}>Account</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {step === 1 && 'Personal Details'}
                            {step === 2 && 'KYC Verification'}
                            {step === 3 && 'Account Setup'}
                        </h2>
                        <p className="text-gray-400 mb-8">Step {step} of 3</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {step === 1 && (
                                <>
                                    <Input
                                        label="Full Name"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        error={errors.fullName}
                                    />
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="Enter 10-digit phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                    />
                                    <div className="relative">
                                        <Input
                                            label="Password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={errors.password}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Input
                                        label="Aadhaar Number"
                                        name="aadhaarNumber"
                                        placeholder="Enter 12-digit Aadhaar number"
                                        value={formData.aadhaarNumber}
                                        onChange={handleChange}
                                        error={errors.aadhaarNumber}
                                        maxLength={12}
                                    />
                                    <Input
                                        label="PAN Card Number"
                                        name="panCardNumber"
                                        placeholder="Enter PAN (e.g., ABCDE1234F)"
                                        value={formData.panCardNumber}
                                        onChange={handleChange}
                                        error={errors.panCardNumber}
                                        maxLength={10}
                                        className="uppercase"
                                    />
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <Select
                                        label="Account Type"
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'SAVINGS', label: 'Savings Account' },
                                            { value: 'CURRENT', label: 'Current Account' },
                                        ]}
                                    />
                                    <Input
                                        label="Initial Deposit (₹)"
                                        name="initialDeposit"
                                        type="number"
                                        placeholder="Enter initial deposit amount"
                                        value={formData.initialDeposit}
                                        onChange={handleChange}
                                        error={errors.initialDeposit}
                                        min="0"
                                        step="0.01"
                                    />
                                </>
                            )}

                            <div className="flex gap-4 pt-4">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setStep(step - 1)}
                                        className="flex-1 flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 flex items-center justify-center gap-2"
                                    >
                                        Next
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2"
                                        loading={loading}
                                    >
                                        Create Account
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="mt-8 text-center text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
