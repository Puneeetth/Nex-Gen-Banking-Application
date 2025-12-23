import {
    Bell,
    Shield,
    Globe,
    Moon,
    Smartphone,
    CreditCard,
    ChevronRight,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import { useState } from 'react';

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: true,
        smsAlerts: false,
        darkMode: true,
        biometric: true,
        twoFactor: false,
    });

    const toggleSetting = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your app preferences and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifications */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle
                            label="Push Notifications"
                            description="Get notified about transactions and updates"
                            enabled={settings.notifications}
                            onToggle={() => toggleSetting('notifications')}
                        />
                        <SettingToggle
                            label="Email Alerts"
                            description="Receive transaction alerts via email"
                            enabled={settings.emailAlerts}
                            onToggle={() => toggleSetting('emailAlerts')}
                        />
                        <SettingToggle
                            label="SMS Alerts"
                            description="Get SMS for important transactions"
                            enabled={settings.smsAlerts}
                            onToggle={() => toggleSetting('smsAlerts')}
                        />
                    </div>
                </Card>

                {/* Security */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Security</h2>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle
                            label="Biometric Login"
                            description="Use fingerprint or face ID to login"
                            enabled={settings.biometric}
                            onToggle={() => toggleSetting('biometric')}
                        />
                        <SettingToggle
                            label="Two-Factor Authentication"
                            description="Add extra security to your account"
                            enabled={settings.twoFactor}
                            onToggle={() => toggleSetting('twoFactor')}
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t border-dark-700">
                        <SettingLink
                            icon={CreditCard}
                            label="Transaction Limits"
                            description="Set daily and monthly limits"
                        />
                        <SettingLink
                            icon={Smartphone}
                            label="Trusted Devices"
                            description="Manage your logged-in devices"
                        />
                    </div>
                </Card>

                {/* Appearance */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                            <Moon className="w-5 h-5 text-accent-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Appearance</h2>
                    </div>

                    <SettingToggle
                        label="Dark Mode"
                        description="Use dark theme throughout the app"
                        enabled={settings.darkMode}
                        onToggle={() => toggleSetting('darkMode')}
                    />
                </Card>

                {/* Language & Region */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Language & Region</h2>
                    </div>

                    <SettingLink
                        label="Language"
                        description="English (India)"
                    />
                    <SettingLink
                        label="Currency"
                        description="Indian Rupee (₹)"
                    />
                    <SettingLink
                        label="Time Zone"
                        description="Asia/Kolkata (IST)"
                    />
                </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-500/20">
                <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10">
                    <div>
                        <p className="font-medium text-gray-100">Close Account</p>
                        <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-medium 
                             hover:bg-red-500/30 transition-colors">
                        Close Account
                    </button>
                </div>
            </Card>
        </div>
    );
}

function SettingToggle({ label, description, enabled, onToggle }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-dark-700/30 hover:bg-dark-700/50 transition-colors">
            <div>
                <p className="font-medium text-gray-100">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button onClick={onToggle} className="text-primary-400">
                {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-500" />}
            </button>
        </div>
    );
}

function SettingLink({ icon: Icon, label, description }) {
    return (
        <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-dark-700/50 transition-colors">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                <div className="text-left">
                    <p className="font-medium text-gray-100">{label}</p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>
    );
}
