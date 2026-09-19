# Smart Serve 🍔🚚

**Smart Serve** is a modern, centralized College Canteen Management System and Online Food Ordering Platform. It connects students, canteen management, and a peer-to-peer student delivery network into a single, cohesive ecosystem.

This project is built as a complete frontend prototype for an MCA Mini-Project, featuring a premium UI/UX, responsive design, and a simulated mock backend that uses `localStorage` for cross-tab live synchronization.

---

## 🎯 The Problem it Solves
1. **The Long Queue Problem:** Students waste valuable time standing in long lines between tight class schedules.
2. **Unpredictable Inventory:** Students often wait in line only to find out their favorite food is out of stock.
3. **Inefficient Canteen Operations:** Canteen staff struggle to manage peak-hour rushes and track paper orders.
4. **Dorm Delivery Friction:** When students are sick or studying late, there is no easy way to get canteen food delivered to their rooms.

## ✨ Key Features

### 👨‍🎓 Customer Flow (Students/Staff)
- **Smart Menu:** Browse categories, toggle Veg/Non-Veg, and search for items instantly.
- **Customizations:** Add extra cheese, toppings, or modify item quantities.
- **Seamless Checkout:** Multi-step cart process supporting both **Counter Pickup** and **Dorm Delivery**.
- **Live Tracking:** An animated stepper tracks the order status from "Placed" all the way to "Delivered".

### 👨‍🍳 Admin Command Center (Canteen Staff)
- **Live Dashboard:** Monitor daily revenue, total orders, and low-stock inventory alerts.
- **Order Management:** View all incoming orders and instantly update statuses.
- **Menu & Inventory CRUD:** Add new food items, update prices, toggle availability, and manage stock levels directly from the UI.

### 🚴‍♂️ Delivery Portal (Student Network)
- **Active Deliveries:** View assigned deliveries with dorm locations.
- **Status Updates:** One-click progression (Accepted → Picked Up → Out for Delivery → Delivered).

---

## 🛠 Tech Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **State Management:** React Context API + `useReducer`
- **Database (Mock):** Browser `localStorage` (Simulates a real DB with cross-tab live syncing!)

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository or extract the project folder.
2. Open your terminal and navigate to the project directory:
   ```bash
   cd Smart-Serve
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`

---

## 🔑 How to Test (Demo Credentials)

The login page features a **Demo Accounts** panel where you can instantly log into any role without typing. If you prefer to type manually:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `student@college.edu` | `password123` |
| **Admin** | `admin@college.edu` | `admin123` |
| **Delivery** | `delivery@college.edu` | `delivery123` |

### 💡 Pro-Tip for Presentation / Testing
To see the **Live Sync** functionality (simulating WebSockets), open **two separate windows of the SAME browser** (e.g., two Chrome windows). 
- Log in as a **Customer** in Window 1 and place an order.
- Log in as an **Admin** in Window 2.
- Update the order status in Window 2, and watch it instantly update in Window 1!

---

