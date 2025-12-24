# 🏦 Nex-Gen Banking Application - Frontend

A modern, responsive banking dashboard built with React 19 and TailwindCSS, featuring a sleek blue-themed UI with comprehensive banking functionality.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Pages Overview](#-pages-overview)
- [Components](#-components)
- [Running the Application](#-running-the-application)
- [Build for Production](#-build-for-production)

---

## ✨ Features

- **🎨 Modern UI/UX** - Sleek, responsive design with blue gradient theme
- **🔐 Authentication** - Secure login and registration flows
- **📊 Dashboard** - Real-time account overview and quick actions
- **🏧 Account Management** - View and manage multiple bank accounts
- **💸 Fund Transfers** - Seamless money transfer between accounts
- **💰 Deposits** - Razorpay integrated payment gateway (GPay, PhonePe, Cards)
- **💳 Withdrawals** - Easy withdrawal functionality
- **📜 Transaction History** - Complete transaction tracking with filters
- **👤 Profile Management** - User profile viewing and editing
- **⚙️ Settings** - Account and security settings
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.2.4 | Build Tool & Dev Server |
| **TailwindCSS** | 3.4.19 | Utility-first CSS |
| **React Router** | 7.11.0 | Client-side Routing |
| **Axios** | 1.13.2 | HTTP Client |
| **Lucide React** | 0.562.0 | Icon Library |
| **clsx** | 2.1.1 | Conditional Classes |

---

## 📁 Project Structure

```
frontend/
├── 📄 index.html                 # HTML entry point
├── 📄 package.json               # Dependencies & scripts
├── 📄 vite.config.js             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind customization
├── 📄 postcss.config.js          # PostCSS configuration
├── 📁 public/                    # Static assets
└── 📁 src/
    ├── 📄 main.jsx               # React entry point
    ├── 📄 App.jsx                # Main app component & routes
    ├── 📄 App.css                # Global styles
    ├── 📄 index.css              # Tailwind imports & base styles
    ├── 📁 assets/                # Images & media
    ├── 📁 components/            # Reusable components
    │   ├── 📁 layout/            # Layout components
    │   │   ├── Header.jsx        # Top navigation bar
    │   │   ├── Sidebar.jsx       # Side navigation menu
    │   │   └── Layout.jsx        # Main layout wrapper
    │   └── 📁 ui/                # UI components
    │       ├── Badge.jsx         # Status badges
    │       ├── Button.jsx        # Button component
    │       ├── Card.jsx          # Card container
    │       └── Input.jsx         # Form input
    ├── 📁 context/               # React Context providers
    │   └── AuthContext.jsx       # Authentication state
    ├── 📁 hooks/                 # Custom React hooks
    ├── 📁 pages/                 # Page components
    │   ├── Accounts.jsx          # Account management
    │   ├── Dashboard.jsx         # Main dashboard
    │   ├── Deposit.jsx           # Deposit with Razorpay
    │   ├── Login.jsx             # User login
    │   ├── Profile.jsx           # User profile
    │   ├── Register.jsx          # User registration
    │   ├── Settings.jsx          # App settings
    │   ├── Transactions.jsx      # Transaction history
    │   ├── Transfer.jsx          # Fund transfer
    │   └── Withdraw.jsx          # Withdrawal
    └── 📁 services/              # API service modules
```

---

## 📋 Prerequisites

Before running the application, ensure you have:

- 📦 **Node.js** 18.0 or higher
- 📦 **npm** 9.0 or higher (or yarn/pnpm)
- 🖥️ **Backend API** running on `http://localhost:8080`

---

## ⚙️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## 🔧 Configuration

### API Base URL

The frontend is configured to communicate with the backend at `http://localhost:8080`. To change this, update the base URL in your API service files or create an environment file:

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080
```

### Razorpay Integration

For the deposit feature, ensure Razorpay is properly configured:
1. The Razorpay script is loaded in `index.html`
2. Backend must be configured with valid Razorpay API keys

---

## 📄 Pages Overview

### 🔐 Authentication Pages

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | User authentication with email/password |
| **Register** | `/register` | New user registration with validation |

### 🏠 Main Application Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | Account overview, balance, quick actions |
| **Accounts** | `/accounts` | View and manage bank accounts |
| **Transfer** | `/transfer` | Transfer funds to other accounts |
| **Deposit** | `/deposit` | Add funds via Razorpay (UPI, Cards) |
| **Withdraw** | `/withdraw` | Withdraw funds from account |
| **Transactions** | `/transactions` | Full transaction history with filters |
| **Profile** | `/profile` | View and edit user profile |
| **Settings** | `/settings` | Application and security settings |

---

## 🧩 Components

### Layout Components

- **`Layout`** - Main wrapper with sidebar and header
- **`Header`** - Top navigation with user menu and notifications
- **`Sidebar`** - Navigation menu with active state indicators

### UI Components

- **`Button`** - Customizable button with variants (primary, secondary, outline)
- **`Card`** - Container component with shadow and rounded corners
- **`Input`** - Form input with label and error state
- **`Badge`** - Status indicator badges

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### With Hot Module Replacement

Vite provides instant HMR for a seamless development experience.

---

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🧪 Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 🎨 Theming

The application uses a custom blue color palette defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... blue shades
    900: '#1e3a8a',
  },
  banking: {
    blue: '#1a56db',
    dark: '#0f172a',
    light: '#f0f9ff',
  }
}
```

---

## 🔌 API Integration

The frontend communicates with the backend API using Axios. Key API interactions:

| Feature | Endpoint | Method |
|---------|----------|--------|
| Login | `/api/auth/login` | POST |
| Register | `/api/auth/register` | POST |
| Get Profile | `/api/me` | GET |
| Transfer | `/api/transfer` | POST |
| Withdraw | `/api/withdraw` | POST |
| Create Payment | `/api/payment/create-order` | POST |
| Verify Payment | `/api/payment/verify` | POST |

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">Made with ❤️ using React & TailwindCSS</p>
