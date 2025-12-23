import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(identifier, password);

        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-dark-950 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-dark-900 via-primary-900/20 to-dark-950 
                      flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Background Effects */}
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
                        <span className="text-white">Nex</span>
                        <span className="gradient-text">Bank</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-md">
                        Experience next-generation banking with seamless transactions and unmatched security
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Secure', 'Fast', 'Modern', '24/7 Support'].map((feature) => (
                            <span key={feature}
                                className="px-4 py-2 rounded-full bg-dark-800/50 border border-dark-700 
                               text-gray-400 text-sm">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                            flex items-center justify-center shadow-glow mx-auto mb-4">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">
                            <span className="text-white">Nex</span>
                            <span className="gradient-text">Bank</span>
                        </h1>
                    </div>

                    <div className="card p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400 mb-8">Sign in to access your account</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email, Phone, or Account Number"
                                type="text"
                                placeholder="Enter your identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded bg-dark-700 border-dark-600 
                                                    text-primary-500 focus:ring-primary-500/20" />
                                    Remember me
                                </label>
                                <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2"
                                loading={loading}
                            >
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                Open Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
