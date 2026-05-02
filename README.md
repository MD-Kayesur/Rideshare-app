# Rideshare Application - Project Overview & Implementation Log

This project is a high-performance, real-time ridesharing platform built with **React Native (Expo)** for the frontend and **Node.js (Express)** for the backend. It features a robust architecture designed for scalability, security, and a premium user experience.

---

## 🚀 Recently Implemented Features

### 1. Real-Time Messaging & Chat System
*   **1-to-1 Instant Chat:** Integrated Socket.IO for seamless, real-time communication between riders and drivers.
*   **Chat History Dashboard:** A dedicated screen to view all active conversations, featuring smart participant filtering to correctly identify the "other" person in the chat.
*   **Socket.IO Sync:** Backend support for broadcasting messages to multiple rooms, ensuring updates are received even when navigating between different views.
*   **Message Persistence:** Messages are stored in MongoDB and fetched instantly upon opening a chat, providing a smooth "always-on" experience.

### 2. Professional Driver Management Module
*   **Specialized Driver Profiles:** Created a comprehensive backend module dedicated to driver data, separate from basic authentication.
*   **Multi-Vehicle Support:** Built-in support for multiple local transport categories:
    *   🚗 **Car:** Includes support for specific details like Air Conditioning (AC/Non-AC).
    *   🏍️ **Bike:** Specialized registration for motorized two-wheelers.
    *   🚲 **Cycle:** Simplified registration flow for non-motorized transport.
    *   🛺 **CNG:** Support for local auto-rickshaws.
*   **Dynamic Validation:** Using Zod for strict server-side validation to ensure all vehicle data (Plate Numbers, License info) is accurate and complete.

### 3. Integrated Vehicle Registration Workflow
*   **Dynamic Sidebar:** The app's menu now intelligently detects the user's role. Drivers see a dedicated "Add Vehicle" dropdown with category-specific options.
*   **Smart "Add Vehicle" Interface:** A premium frontend page that adapts its inputs based on the selected vehicle type (e.g., hiding plate numbers for cycles).
*   **Image Upload Capability:** Integrated `expo-image-picker` allowing drivers to document their vehicles with high-quality photos.
*   **Live Preview Dashboard:** After saving, drivers are instantly redirected to a live "Vehicle Details" preview to review their registered information.

---

## 🛠️ Technical Stack & Architecture

### Frontend (Mobile App)
*   **Framework:** Expo (React Native) with Expo Router.
*   **State Management:** Redux Toolkit & RTK Query for high-performance API communication and caching.
*   **Styling:** `twrnc` (Tailwind CSS for React Native) for a consistent, premium design system.
*   **Icons:** Ionicons and MaterialCommunityIcons for a modern look.

### Backend (Server)
*   **Runtime:** Node.js with Express.js.
*   **Database:** MongoDB with Mongoose ODM.
*   **Validation:** Zod schemas for end-to-end type safety.
*   **Real-time:** Socket.IO for persistent bidirectional communication.
*   **Security:** Role-Based Access Control (RBAC) ensuring only authorized drivers can manage vehicle profiles.

---

## 📂 Key Files & Modules

### Frontend Logic
*   `app/(pages)/chat.tsx`: Real-time chat interface.
*   `app/(pages)/chat_history.tsx`: History list with participant identification.
*   `app/(pages)/add-vehicle.tsx`: Dynamic vehicle registration form.
*   `redux/features/driver/driverApi.ts`: API endpoints for driver profile management.
*   `redux/features/upload/uploadApi.ts`: Image transmission logic.

### Backend Logic
*   `src/modules/driver/`: Core driver management module (Interface, Model, Routes, Service, Controller).
*   `src/modules/chat/`: Messaging and socket synchronization logic.
*   `src/routes/index.ts`: Centralized route registry.

---

## 📜 How to Run the Project

1.  **Backend:**
    ```bash
    cd Rideshare-app-server
    npm run dev
    ```
2.  **Frontend:**
    ```bash
    cd Rideshare-app
    npm run start
    ```

*Note: Ensure MongoDB is running and `.env` files are correctly configured with your JWT secrets and database URLs.*
