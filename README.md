# 🏨 HotelPro - Next-Generation Enterprise Hotel Management Solution

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple.svg)](https://getbootstrap.com/)

[![Documentation](https://img.shields.io/badge/Documentation-PDF%20Download-red.svg)](./HotelPro_Project_Documentation.pdf)

> **Your ultimate hotel management solution!** Our system streamlines hotel operations with a secure, scalable backend, ensuring efficient booking, guest management, and payment processing with intuitive interfaces and robust JWT authentication.

📄 **Official Project Documentation:** [Download HotelPro_Project_Documentation.pdf](./HotelPro_Project_Documentation.pdf)

---

## 🌟 Key Features & 6 Core Epics

### 🛡️ Epic 1: User Authentication & Role-Based Access Control (RBAC)
- **JSON Web Token (JWT)** authentication with secure bearer tokens.
- Password encryption using **bcryptjs** (10 salt rounds).
- Distinct roles: **Guest**, **Staff (Housekeeping & Operations)**, and **Admin (General Manager)**.
- Protected API routes and role authorization middleware.
- Instant **One-Click Demo Switcher** in navigation for effortless evaluation.

### 🛏️ Epic 2: Room Inventory & Real-Time Availability
- Live room tracking across categories: **Presidential**, **Royal Suite**, **Executive**, **Deluxe**, and **Standard**.
- Attributes: room number, floor level, capacity (adults/children), sq ft, amenities list, pricing per night, and status (`Available`, `Booked`, `Cleaning`, `Maintenance`).
- Real-time search, category filtering, status pills, and sorting controls.
- Full Admin CRUD: Add, edit, and adjust room details.

### 📅 Epic 3: Reservation & Booking Engine
- Interactive booking modal with dynamic date range selection.
- Automatic night computation and live financial calculations (rate × nights + 12% hospitality tax).
- Instant room locking to prevent double bookings.
- Celebration confetti on booking confirmation.
- Reservation lifecycle management: `Confirmed` ➔ `Checked-In` ➔ `Checked-Out` ➔ `Cancelled`.

### 💳 Epic 4: Payment Processing & Invoicing
- Multi-channel simulated payment support: **Credit Card**, **Debit Card**, **UPI**, **Net Banking**, and **Cash at Desk**.
- Automated transaction ID generation and verification.
- **Printable/PDF-ready official hotel invoices and receipts** with itemized breakdown of room charges and taxes.

### 🧹 Epic 5: Housekeeping & Maintenance Workflows
- **Automated room turnover**: When a guest checks out, the room is automatically flagged as `Cleaning` and a high-priority sanitation task is queued for housekeeping.
- Operations Kanban Board with **Pending**, **In Progress**, and **Completed** stages.
- **One-click "Complete & Release"**: Once cleaned, the room is automatically restored to `Available` status in the live catalog.

### 📊 Epic 6: Executive Analytics & Guest CRM
- Executive dashboard with live **Occupancy Rate %**, **Gross Revenue**, **Average Daily Rate (ADR)**, and **RevPAR**.
- Room inventory category distribution graphs.
- **Guest CRM Directory**: Tracks repeat stays, contact info, and lifetime guest spend.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 (JSX), Vite, Bootstrap 5, Bootstrap Icons, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js REST API, Morgan Logger, CORS, Dotenv |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, Strict RBAC |
| **Styling** | Custom Luxury Glassmorphism CSS, HSL Color Palettes, Plus Jakarta Sans & Cinzel Typography |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or MongoDB Atlas connection string)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mahajanvedika9-lab/hotelpro.git
cd hotelpro
```

### 2. Install Dependencies
```bash
# Install root, backend, and frontend dependencies in one command
npm run install:all
```
*(Or install manually: `npm install`, `cd backend && npm install`, `cd ../frontend && npm install`)*

### 3. Configure Environment Variables
In `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secure_jwt_secret_key_2026
```

### 4. Seed Database with Luxury Suites & Sample Data
```bash
npm run seed
```
This populates 8 luxury suites/rooms, default users, sample reservations, and housekeeping tasks.

### 5. Start the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Passkey (if registering) |
|---|---|---|---|
| **Admin (General Manager)** | `admin@hotelpro.com` | `admin123` | `HOTELPRO_ADMIN_2026` |
| **Staff (Operations/Housekeeping)** | `staff@hotelpro.com` | `staff123` | `HOTELPRO_ADMIN_2026` |
| **Guest** | `guest@hotelpro.com` | `guest123` | N/A |

*(You can also use the **Instant Role Switcher** buttons in the navigation bar to test each role with zero hassle.)*

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Current user profile
- `GET /api/auth/users` - Admin user list

### Room Inventory (`/api/rooms`)
- `GET /api/rooms` - Query rooms with filters (type, status, price, search)
- `GET /api/rooms/:id` - Single room details
- `POST /api/rooms` - Add new room (Admin only)
- `PUT /api/rooms/:id` - Update room details / status (Admin & Staff)
- `DELETE /api/rooms/:id` - Remove room (Admin only)

### Reservations (`/api/bookings`)
- `GET /api/bookings` - List reservations (query by status/search)
- `GET /api/bookings/my` - Logged-in user's bookings
- `GET /api/bookings/:id` - Single booking & invoice
- `POST /api/bookings` - Create reservation & lock room
- `PUT /api/bookings/:id/status` - Lifecycle update (Checked-In, Checked-Out, Cancelled)

### Housekeeping & Maintenance (`/api/tasks`)
- `GET /api/tasks` - List tasks with priority/status filters
- `POST /api/tasks` - Dispatch housekeeping task
- `PUT /api/tasks/:id` - Update task status (auto-releases room on completion)
- `DELETE /api/tasks/:id` - Delete task

### Executive Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Occupancy %, revenue, ADR, room type distributions

### Guest CRM (`/api/guests`)
- `GET /api/guests` - Guest stay frequency, lifetime spend, and history

---

## 📄 License
This project is licensed under the ISC License.
