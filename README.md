# Smart Serve 🍔🚚

Quick start guide to run **Smart Serve** locally.

---

## 🚀 Commands to Run Localhost

### 1. Start Backend (Django API)
Open Terminal 1 in the project root:

**Windows (PowerShell / CMD):**
```cmd
cd backend
.\venv\Scripts\python manage.py runserver 8000
```
*(Or activate first: `.\venv\Scripts\activate` in CMD / `.\venv\Scripts\Activate.ps1` in PowerShell)*

**macOS / Linux:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver 8000
```

### 2. Start Frontend (React)
Open Terminal 2 in the project root:
```bash
npm run dev
```
*(On Windows PowerShell, if script execution policy blocks `npm.ps1`, run `cmd /c "npm run dev"`)*

---

## 🌐 Application URLs

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)

---

## 🔑 Demo Accounts

**Password for all accounts:** `password`

| Role | Email |
| :--- | :--- |
| **Customer** | `customer@smartserve.demo` |
| **Admin** | `admin@smartserve.demo` |
| **Delivery** | `delivery@smartserve.demo` |
