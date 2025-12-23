import { User, Mail, Phone, CreditCard, Shield, Edit, Check, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();

    const mockUser = {
        fullName: user?.fullName || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        phone: user?.phone || '9876543210',
        accountNumber: user?.accountNumber || '1234567890123456',
        accountType: user?.accountType || 'SAVINGS',
        balance: user?.balance || 125850.75,
        status: user?.status || 'ACTIVE',
        kycStatus: user?.kycStatus || 'VERIFIED',
        aadhaar: '•••• •••• 1234',
        pan: '•••••1234F',
        joinDate: 'December 2024',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Profile</h1>
                    <p className="text-gray-400 mt-1">Manage your personal information and settings</p>
                </div>
                <Button variant="secondary" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white">
                        {mockUser.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{mockUser.fullName}</h2>
                    <p className="text-gray-400 mb-4">{mockUser.accountType} Account</p>

                    <div className="flex justify-center gap-2 mb-6">
                        <Badge variant={mockUser.status === 'ACTIVE' ? 'success' : 'warning'}>
                            {mockUser.status}
                        </Badge>
                        <Badge variant={mockUser.kycStatus === 'VERIFIED' ? 'success' : 'info'}>
                            {mockUser.kycStatus}
                        </Badge>
                    </div>

                    <div className="border-t border-dark-700 pt-4">
                        <p className="text-sm text-gray-500">Member since</p>
                        <p className="text-gray-300">{mockUser.joinDate}</p>
                    </div>
                </Card>

                {/* Details Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-400" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem icon={User} label="Full Name" value={mockUser.fullName} />
                            <InfoItem icon={Mail} label="Email Address" value={mockUser.email} />
                            <InfoItem icon={Phone} label="Phone Number" value={`+91 ${mockUser.phone}`} />
                            <InfoItem icon={CreditCard} label="Account Number" value={mockUser.accountNumber} />
                        </div>
                    </Card>

                    {/* KYC Information */}
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-400" />
                            KYC Verification
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30">
                                <div>
                                    <p className="text-sm text-gray-500">Aadhaar Number</p>
                                    <p className="text-gray-100 font-mono">{mockUser.aadhaar}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30">
                                <div>
                                    <p className="text-sm text-gray-500">PAN Card</p>
                                    <p className="text-gray-100 font-mono">{mockUser.pan}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Security */}
                    <Card>
                        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30">
                                <div>
                                    <p className="text-gray-100">Password</p>
                                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                                </div>
                                <Button variant="secondary" size="sm">Change</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30">
                                <div>
                                    <p className="text-gray-100">Two-Factor Authentication</p>
                                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                </div>
                                <Button variant="accent" size="sm">Enable</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-gray-100">{value}</p>
            </div>
        </div>
    );
}
