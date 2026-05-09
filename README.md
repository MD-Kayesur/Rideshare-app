# 🚖 Rideshare Pro - Real-Time Transport Solution

![Rideshare App Banner](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

Rideshare Pro is a high-performance, real-time ridesharing ecosystem designed for seamless urban mobility. This project features a robust **React Native (Expo)** frontend and a modular **Node.js (Express)** backend, delivering a premium user experience for Riders, Drivers, and Administrators.

---

## 🌟 Core Features

### 👤 For Riders (Users)
*   **Intuitive Booking:** Effortlessly book rides by selecting pickup and destination points on a live interactive map.
*   **Flexible Vehicle Choice:** Choose from a variety of transport options including **Cars (AC/Non-AC), Bikes, CNGs, and Cycles**.
*   **Real-Time Tracking:** Watch your driver move toward you in real-time with live GPS synchronization.
*   **Secure Payments:** Integrated **Stripe** payment gateway for seamless digital transactions and cash support.
*   **Live Communication:** Built-in **Chat** and **VoIP Call** functionality to coordinate with drivers without leaving the app.
*   **Ride History:** Detailed trip logs including route maps, fare breakdown, and driver info.

### 🚗 For Drivers
*   **Flexible Availability:** Easy "Online/Offline" toggle that instantly updates visibility to nearby riders.
*   **Multi-Vehicle Profile:** Register and manage multiple vehicles with category-specific validation.
*   **Earnings Dashboard:** Track daily/monthly income and trip history in a clean, visual interface.
*   **Smart Navigation:** One-tap navigation to rider pickup and drop-off points.
*   **In-App Support:** Real-time notifications for payment confirmation and new ride requests.

### 🛡️ For Admins
*   **Full Oversight:** Manage all registered users and drivers from a centralized dashboard.
*   **Verification System:** Review and approve/reject driver applications and vehicle documents.
*   **Live Monitoring:** View all active rides and system analytics in real-time.
*   **Financial Tracking:** Comprehensive logs of all payment transactions and revenue distribution.

---

## 🛠️ Technology Stack

### Frontend (Mobile App)
*   **React Native & Expo:** Cross-platform mobile development with Expo Router for file-based navigation.
*   **Redux Toolkit (RTK Query):** Advanced state management and automated caching for API requests.
*   **twrnc (Tailwind CSS):** Utility-first styling for a beautiful, responsive, and consistent UI.
*   **Socket.IO Client:** Persistent bidirectional communication for real-time updates.
*   **Stripe SDK:** Professional-grade secure payment processing.

### Backend (Server)
*   **Node.js & Express:** Scalable RESTful API architecture using the **Modular Pattern**.
*   **MongoDB & Mongoose:** Flexible NoSQL database for high-velocity data.
*   **Zod:** Strict end-to-end type safety and request validation.
*   **Socket.IO Server:** Real-time signaling for messaging, ride requests, and status updates.
*   **JWT & RBAC:** Secure authentication with Role-Based Access Control.

---

## 📡 Real-Time Ecosystem

*   **Socket.IO Rooms:** Targeted event delivery (e.g., notifying a *specific* driver of a payment).
*   **WebRTC Signaling:** Dedicated signaling server for peer-to-peer VoIP calls.
*   **Automatic Cache Invalidation:** Frontend Redux state instantly updates (e.g., removing a car from the map) when a driver goes offline via background socket events.

---

## 📂 Project Structure

### Frontend (`/Rideshare-app`)
*   `app/(tabs)`: Core navigation tabs (Home, History, Profile).
*   `app/(pages)`: Specialized screens (Chat, Call, Checkout, Track Ride).
*   `redux/features/`: API definitions and slices for Auth, Ride, Driver, and Payment.
*   `components/`: Reusable UI elements (Sidebar, Overlays, Custom Buttons).

### Backend (`/Rideshare-app-server`)
*   `src/modules/`: Self-contained feature folders (Auth, User, Ride, Payment, Chat).
*   `src/builder/`: Advanced `QueryBuilder` for complex DB searching/filtering.
*   `src/socket/`: Global socket initialization and event routing.

---

## 🚀 Setup & Installation

### 1. Prerequisites
*   Node.js (v16+)
*   MongoDB Instance
*   Expo CLI

### 2. Backend Setup
```bash
cd Rideshare-app-server
npm install
# Configure your .env file (DB_URL, JWT_SECRET, STRIPE_SECRET)
npm run dev
```

### 3. Frontend Setup
```bash
cd Rideshare-app
npm install
# Configure your .env (EXPO_PUBLIC_API_URL, EXPO_PUBLIC_STRIPE_KEY)
npx expo start
```

---

## 📦 Deployment

This project is configured for **EAS Build**. To generate a production APK:
```bash
npx eas build -p android --profile preview
```

---

## ⚡ How Socket.IO Works in this Project

The heart of the real-time experience is **Socket.IO**. It enables instant, bidirectional communication between the Rider, Driver, and Server without needing to refresh the app.

### 1. Connection & Authentication
*   **Initialization:** When the app starts, it establishes a persistent connection to the backend using `socketService.ts`.
*   **Identity Mapping:** Upon connection, the server maps the Socket ID to the User ID. This allows us to send messages to a *specific* person (e.g., sending a "New Ride Request" only to nearby drivers).

### 2. Key Real-Time Flows

#### 🚕 Ride Request & Matching
1.  **Rider** emits a `new_ride` event with their location and destination.
2.  **Server** receives the event, finds the nearest **Online** drivers, and emits a `ride_request` specifically to them.
3.  **Driver** receives the request via an overlay and emits `accept_ride`.
4.  **Rider** instantly receives the driver's details and starts tracking them.

#### 💬 Instant Messaging (Chat)
*   **Rooms:** Every ride has a unique Room ID. Both the rider and driver "join" this room.
*   **Message Delivery:** When one party sends a message, it is emitted to the Room. The server saves it to MongoDB and simultaneously broadcasts it to the other participant in real-time.

#### 📍 Live GPS Tracking
*   The **Driver's app** continuously emits `update_location` events every few seconds.
*   The **Rider's app** listens for these updates and moves the car icon on the map smoothly, providing a "live" feel.

#### 🔄 Driver Status Synchronization
*   When a driver toggles the **Online** switch, a `driver_status_changed` event is broadcasted globally.
*   All **Riders** currently looking for cars receive this event. If a driver goes offline, their car instantly disappears from the rider's "Available Cars" list without a refresh.

---

## 📂 Project File Structure

### 📱 Frontend (Rideshare-app)
```text
Rideshare-app/
├── app/                    # Expo Router - File-based routing
│   ├── (auth)/             # Auth flow: login.tsx, register.tsx, otp.tsx
│   ├── (tabs)/             # Tab navigation: index.tsx, history.tsx, profile.tsx
│   ├── (pages)/            # App screens:
│   │   ├── chat.tsx        # 1-to-1 Messaging
│   │   ├── track-ride.tsx  # Live map tracking & countdown
│   │   ├── checkout.tsx    # Stripe payment integration
│   │   ├── call.tsx        # VoIP calling interface
│   │   └── available-cars.tsx # Real-time nearby driver list
│   ├── _layout.tsx         # Global providers, Socket listeners, Toasts
│   └── +not-found.tsx      # 404 Error page
├── components/             # Reusable UI Architecture
│   ├── ui/                 # Atomic elements: Button.tsx, Input.tsx
│   ├── shared/             # Layout pieces: Sidebar.tsx, SafeScreen.tsx
│   └── RideRequestOverlay.tsx # Driver-side request popup
├── redux/                  # Redux Toolkit & RTK Query
│   ├── features/           # API Endpoints & State Slices:
│   │   ├── auth/           # Login/Logout/Profile
│   │   ├── ride/           # Booking/Cancellation
│   │   ├── driver/         # Vehicle management
│   │   └── payment/        # Stripe transaction verification
│   └── store.ts            # Centralized Store configuration
├── assets/                 # Static resources (Images, Fonts, Icons)
├── constants/              # Global constants (Colors, Layout, API_URL)
├── hooks/                  # Custom React hooks (useAuth, useLocation)
├── utils/                  # Helper utilities & Socket.IO client logic
├── app.json                # Project config (Package Name, Version, Icons)
├── eas.json                # Expo Application Services build profiles
└── tailwind.config.js      # Custom theme & styling configuration
```

### 🚀 Backend (Rideshare-app-server)
```text
Rideshare-app-server/
├── src/
│   ├── app.ts              # Express initialization & middleware stack
│   ├── server.ts           # Server bootstrap & Socket.IO setup
│   ├── modules/            # Domain-Driven Design (Feature Modules)
│   │   ├── auth/           # Login, Register, JWT, OTP service
│   │   ├── user/           # User models, Role-based updates
│   │   ├── ride/           # Ride matching, Distance calc, Life-cycle
│   │   ├── driver/         # License verification, Vehicle profiles
│   │   ├── chat/           # Messaging persistence & room management
│   │   └── payment/        # Stripe checkout & Webhook handlers
│   ├── socket/             # Core Socket.IO logic (Signaling, Broadcasts)
│   ├── middlewares/        # Auth guards, Global errors, Zod validators
│   ├── builder/            # QueryBuilder (Generic filter/sort/search)
│   ├── config/             # Environment configs & Cloudinary setup
│   └── utils/              # Global response & async error wrappers
├── dist/                   # Compiled production build
├── .env                    # Secrets & Environment keys
├── tsconfig.json           # TypeScript compilation rules
└── package.json            # Backend dependencies & scripts
```

---

## 🤝 Contributor & Support

Developed with ❤️ by **MD Kayesur Rahman**.
For inquiries or support, please contact the development team.

---
*Note: This project is intended for production use and follows the highest standards of clean code and modular architecture.*
