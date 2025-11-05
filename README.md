# E-Commerce Frontend Application

Frontend application for an e-commerce platform built with Next.js 15, TypeScript, React 19, and Tailwind CSS.

## Table of Contents

- [Key Features](#key-features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Architecture](#project-architecture)
- [State Management](#state-management)
- [API Integration](#api-integration)

## Key Features

**Authentication & Authorization**

- User registration and login
- Google OAuth integration
- Email verification
- Password reset functionality
- Protected routes with authentication guards

**E-Commerce Core**

- Product browsing with filters and search
- Product detail pages
- Shopping cart management
- Checkout process
- Order tracking
- Payment integration

**User Features**

- User profile management
- Address management
- Email and password change
- Order history
- Order details and status tracking

**Admin Features**

- Admin dashboard
- Order management
- Store management
- Product management
- Sales reports

**Additional Features**

- Interactive maps with Leaflet
- Real-time location tracking
- Shipping cost calculation with RajaOngkir
- Data visualization with Chart.js
- Responsive design
- Toast notifications
- Sweet alerts for confirmations
- Image sliders with Swiper

## Technologies

### Core

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library

### State Management

- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management

### Form Management

- **React Hook Form** - Form validation
- **Formik** - Alternative form library
- **Yup** - Schema validation

### UI Components & Icons

- **Heroicons** - Icon library
- **React Icons** - Icon collection
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Data Visualization

- **Chart.js** - Charting library
- **react-chartjs-2** - React wrapper for Chart.js

### Maps

- **Leaflet** - Interactive maps
- **react-leaflet** - React components for Leaflet

### HTTP & API

- **Axios** - HTTP client
- **TanStack Query** - Data fetching and caching

### Utilities

- **Lodash** - Utility functions
- **lodash.debounce** - Debounce utility
- **Luxon** - Date and time manipulation
- **camelcase-keys** - Convert object keys to camelCase
- **snakecase-keys** - Convert object keys to snake_case

### UI Feedback

- **react-hot-toast** - Toast notifications
- **react-toastify** - Toast notifications alternative
- **SweetAlert2** - Beautiful alerts

### Carousel & Sliders

- **Swiper** - Modern slider library

## Folder Structure

```
grocery-app/
├── .next/                    # Next.js build output
├── node_modules/             # Dependencies
├── public/                   # Static assets
│   └── images/
│       ├── bank-transfer-logo.png
│       ├── file.svg
│       ├── globe.svg
│       ├── GoPay-Logo.png
│       ├── grocery.jpg
│       ├── next.svg
│       ├── OIP.webp
│       ├── vercel.svg
│       └── window.svg
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication routes
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── admin/           # Admin routes
│   │   │   ├── orders/
│   │   │   └── store/
│   │   ├── api/             # API routes
│   │   │   └── shipping-cost/
│   │   │       └── route.ts
│   │   ├── cart/            # Cart page
│   │   │   └── page.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── AuthGuard.tsx
│   │   │   └── PublicOnlyGuard.tsx
│   │   ├── orders/          # Order pages
│   │   │   ├── [id]/
│   │   │   ├── order-list/
│   │   │   └── page.tsx
│   │   ├── profile/         # User profile pages
│   │   │   ├── address/
│   │   │   ├── change-email/
│   │   │   ├── change-password/
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   ├── store/           # Store pages
│   │   │   ├── create/
│   │   │   ├── detail/
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   ├── users/           # Users management
│   │   │   └── page.tsx
│   │   ├── verify/[token]/  # Email verification
│   │   │   └── page.tsx
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── error/
│   │   ├── form/
│   │   ├── map/
│   │   ├── modals/
│   │   ├── products/
│   │   ├── stocks/
│   │   └── ui/
│   ├── constants/           # Constants and configurations
│   │   ├── menu.ts
│   │   └── orderStatusStyle.ts
│   ├── features/            # Feature-based modules
│   │   ├── admin/
│   │   │   ├── orders/
│   │   │   └── store/
│   │   ├── auth/
│   │   │   ├── change-email/
│   │   │   ├── change-password/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── cart/
│   │   ├── home/
│   │   │   └── data/
│   │   │       └── types.ts
│   │   ├── orders/
│   │   │   ├── AddressPopUp.tsx
│   │   │   ├── BreadCrumbs.tsx
│   │   │   ├── CheckOutOrderCard.tsx
│   │   │   ├── OrderFilterBar.tsx
│   │   │   ├── OrderListCard.tsx
│   │   │   ├── OrderStatusBedge.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── PaymentMethod.tsx
│   │   │   ├── ShippingInfo.tsx
│   │   │   ├── ShippingPopUp.tsx
│   │   │   ├── type.ts
│   │   │   └── UploadPayment.tsx
│   │   ├── shipping/
│   │   │   └── types.ts
│   │   └── user/
│   │       ├── address/
│   │       ├── components/
│   │       ├── profile/
│   │       └── schemas/
│   │           └── type.ts
│   ├── hoc/                 # Higher-Order Components
│   │   ├── AuthGuard.tsx
│   │   └── PublicOnlyGuard.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── axiosInstances.ts
│   │   ├── queryClient.ts
│   │   └── upload.ts
│   ├── providers/           # Context providers
│   │   ├── AuthProvider.tsx
│   │   └── LocationProvider.tsx
│   ├── services/            # API services
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── order-admin.ts
│   │   ├── order.ts
│   │   ├── payment.ts
│   │   ├── product.ts
│   │   ├── profile.ts
│   │   ├── public.ts
│   │   ├── shipping.ts
│   │   ├── stock.ts
│   │   ├── store.ts
│   │   └── user.ts
│   ├── store/               # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useLocationStore.ts
│   │   └── userOrderStore.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── pagination.ts
│   │   ├── product.ts
│   │   └── user.ts
│   └── utils/               # Utility functions
│       ├── batch.ts
│       ├── decodeToken.ts
│       ├── formatDate.ts
│       ├── formatPrice.ts
│       ├── formatProducts.ts
│       ├── formatWeight.ts
│       ├── normalizeOrderStatus.ts
│       └── swal.ts
├── .env                     # Environment variables
├── .env.example             # Environment variables example
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── eslint.config.mjs        # ESLint module configuration
├── next-env.d.ts            # Next.js TypeScript definitions
├── next.config.ts           # Next.js configuration
├── package.json             # Package dependencies
├── package-lock.json        # Lock file
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API running (see backend documentation)
- RajaOngkir API key for shipping cost calculation

## Installation

**Clone repository**

```bash
git clone <repository-url>
cd grocery-app
```

**Install dependencies**

```bash
npm install
```

## Environment Configuration

Create a `.env.local` file in the root folder with the following configuration:

```env
# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Google OAuth
NEXT_PUBLIC_LINK_AUTH_GOOGLE="http://localhost:4000/api/auth/google"

# RajaOngkir Integration (Shipping Cost Calculation)
RAJAONGKIR_URL="https://api.rajaongkir.com/starter"
RAJAONGKIR_API_KEY="your_rajaongkir_api_key"
```

### Setup Guide for External Services

**RajaOngkir API**

1. Register at [RajaOngkir](https://rajaongkir.com)
2. Get your API key from the dashboard
3. Copy the API key to `RAJAONGKIR_API_KEY`
4. Use the starter plan URL: `https://api.rajaongkir.com/starter`

**Backend API**

Ensure the backend API is running on the specified URL. The default is `http://localhost:4000`. Update `NEXT_PUBLIC_API_URL` if your backend runs on a different port or domain.

## Running the Application

**Development Mode**

```bash
npm run dev
```

Application will run at `http://localhost:3000` with hot-reload.

**Production Build**

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Linting**

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## Project Architecture

### App Router Structure

This project uses Next.js 15 App Router with the following routing patterns:

**Public Routes**

- `/` - Home page with product listings
- `/store/*` - Store pages
- `/verify/[token]` - Email verification

**Authentication Routes (Public Only)**

- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password
- `/verify-email` - Email verification page

**Protected Routes (Requires Authentication)**

- `/cart` - Shopping cart
- `/orders` - Order list
- `/orders/[id]` - Order details
- `/profile` - User profile
- `/profile/address` - Address management
- `/profile/change-email` - Change email
- `/profile/change-password` - Change password
- `/profile/edit` - Edit profile

**Admin Routes (Requires Admin Role)**

- `/admin/orders` - Admin order management
- `/admin/store` - Store management
- `/users` - User management

### Component Organization

**Feature-Based Structure**

Components are organized by feature for better maintainability:

```
features/
├── auth/           # Authentication features
├── cart/           # Shopping cart features
├── orders/         # Order management features
├── user/           # User profile features
└── admin/          # Admin features
```

**Shared Components**

Reusable components are placed in the `components/` directory:

```
components/
├── ui/            # Basic UI components
├── form/          # Form components
├── modals/        # Modal dialogs
└── map/           # Map components
```

## State Management

### Zustand Stores

**useAuthStore**

- User authentication state
- Login/logout functionality
- User profile data
- Token management

**useCartStore**

- Shopping cart items
- Add/remove/update cart items
- Cart total calculations

**useLocationStore**

- User location data
- Address information
- Shipping addresses

**useOrderStore**

- Order state management
- Order tracking
- Order history

### TanStack Query

Used for server state management with features:

- Automatic caching
- Background refetching
- Optimistic updates
- Query invalidation
- Infinite scroll pagination

## API Integration

### Axios Configuration

API calls are centralized in the `services/` directory with the following structure:

**Authentication Service** (`services/auth.ts`)

- Register
- Login
- Logout
- Verify email
- Forgot password
- Reset password
- Google OAuth

**Product Service** (`services/product.ts`)

- Get products
- Get product details
- Search products
- Filter products

**Cart Service** (`services/cart.ts`)

- Get cart
- Add to cart
- Update cart item
- Remove from cart

**Order Service** (`services/order.ts`)

- Create order
- Get orders
- Get order details
- Update order status

**Payment Service** (`services/payment.ts`)

- Create payment
- Verify payment
- Get payment methods

**Shipping Service** (`services/shipping.ts`)

- Calculate shipping cost
- Get shipping options
- Get provinces/cities

**Profile Service** (`services/profile.ts`)

- Get profile
- Update profile
- Manage addresses
- Change email/password

**Store Service** (`services/store.ts`)

- Get store info
- Update store
- Create store

### API Client Setup

The application uses a centralized Axios instance with:

- Base URL configuration
- Request/response interceptors
- Token injection
- Error handling
- Response transformation (camelCase/snake_case conversion)

## Key Features Implementation

### Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token included in all API requests
4. Protected routes check authentication status
5. Automatic redirect to login if unauthenticated

### Shopping Cart

1. Add products to cart
2. Update quantities
3. Remove items
4. Calculate totals
5. Persist cart data with Zustand

### Checkout Process

1. Review cart items
2. Select/add shipping address
3. Calculate shipping cost
4. Choose payment method
5. Confirm order
6. Payment upload/processing
7. Order confirmation

### Order Tracking

1. View order history
2. Check order status
3. View order details
4. Upload payment proof
5. Track shipping

### Admin Features

1. View all orders
2. Update order status
3. Manage store information
4. Generate reports

## Utility Functions

**formatPrice** - Format numbers to currency
**formatDate** - Format dates with Luxon
**formatWeight** - Format weight values
**formatProducts** - Transform product data
**normalizeOrderStatus** - Standardize order status
**decodeToken** - Decode JWT tokens
**swal** - SweetAlert2 wrapper for confirmations

## Scripts

```bash
# Development
npm run dev              # Run development server

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues

# Type Checking
npm run type-check     # Run TypeScript compiler check
```

## Performance Optimizations

- Next.js automatic code splitting
- Image optimization with next/image
- TanStack Query caching
- Lazy loading components
- Debounced search inputs
- Optimistic UI updates
- Static generation where possible

## Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- DaisyUI responsive components
- Touch-friendly interfaces
- Responsive navigation
- Adaptive layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
