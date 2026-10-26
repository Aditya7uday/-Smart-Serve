# Smart Serve 🍔🚚

Quick start guide to run **Smart Serve** locally.

---

## 🚀 Commands to Run Localhost

### 1. Start Backend (Django API)
Open Terminal 1, inside the **`backend/`** folder:

**Windows (PowerShell / CMD):**
```cmd
.\venv\Scripts\python.exe manage.py runserver 8000
```

**macOS / Linux:**
```bash
source venv/bin/activate
python manage.py runserver 8000
```

### 2. Start Frontend (React)
Open Terminal 2, inside the **project root** folder:
```bash
npm.cmd run dev
```
*(On Windows PowerShell, if script execution policy blocks `npm.ps1`, use `npm.cmd run dev` as above, or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once to allow plain `npm run dev`.)*

> Start the backend first, then the frontend.

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
