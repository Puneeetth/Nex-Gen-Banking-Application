import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (identifier, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                accountNumber: data.accountNumber,
                accountStatus: data.accountStatus,
            }));

            setToken(data.token);
            setUser({
                accountNumber: data.accountNumber,
                accountStatus: data.accountStatus,
            });

            // Fetch full user profile
            await fetchUserProfile(data.token);

            navigate('/dashboard');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch('http://localhost:8080/api/me', {
                headers: {
                    'Authorization': `Bearer ${authToken || token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userData = {
                    ...user,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    accountNumber: data.accountNumber,
                    accountType: data.accountType,
                    balance: data.balance,
                    status: data.status,
                    kycStatus: data.kycStatus,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const register = async (formData) => {
        try {
            const response = await fetch('http://localhost:8080/api/accounts/open', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        register,
        fetchUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
