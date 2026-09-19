# Smart Serve 🍔🚚

**Smart Serve** is a modern, centralized College Canteen Management System and Online Food Ordering Platform. It connects students, canteen management, and a peer-to-peer student delivery network into a single, cohesive ecosystem.

This project is built as a full-stack MCA Mini-Project, featuring a premium UI/UX, responsive design, a Django REST API backend, and a Postgres database (Neon).

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
- **Frontend:** React 18 + Vite, React Router v6, Tailwind CSS v4, Lucide React
- **State Management:** React Context API + `useReducer`
- **Backend:** Django + Django REST Framework, JWT auth (`djangorestframework-simplejwt`)
- **Database:** PostgreSQL (Neon)

---

## 🚀 How to Run Locally

### Prerequisites
[Node.js](https://nodejs.org/) and Python 3.12+.

### 1. Backend (Django API)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows (use `source venv/bin/activate` on macOS/Linux)
pip install -r requirements.txt
```
Copy `backend/.env.example` to `backend/.env` and fill in `SECRET_KEY`, `DATABASE_URL` (a Neon Postgres connection string), and `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` (from your [Razorpay dashboard](https://dashboard.razorpay.com/app/keys) — test mode keys work fine for local dev; the online-payment option at checkout needs these set). Then:
```bash
python manage.py migrate
python manage.py seed_data   # loads demo categories/menu/users/orders
python manage.py runserver 8000
```

### 2. Frontend (React)
From the repo root:
```bash
npm install
npm run dev
```
Copy `.env.example` to `.env.local` if your API isn't running on the default `http://localhost:8000/api`.

Open `http://localhost:5173`.

---

## 🔑 How to Test (Demo Credentials)

`seed_data` creates these accounts (password `password` for all):

| Role | Email |
| :--- | :--- |
| **Customer** | `customer@smartserve.demo` |
| **Admin** | `admin@smartserve.demo` |
| **Delivery** | `delivery@smartserve.demo` |

The login page also has a **Demo Accounts** panel to fill these in automatically.

---

