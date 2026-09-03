# Maa Ambika Youth Club Barapada

Full-stack, modern, responsive website and Content Management System (CMS) for **Maa Ambika Youth Club Barapada**, a community youth committee dedicated to village unity, social service, cultural celebrations, sports, and village development.

> **Tagline**: *“Unity • Service • Youth • Community”*  
> **Motto**: *“Together for Our Village, Together for Our Future”*

---

## 🌟 Key Features

### 1. Public Portal
- **Hero Banner**: Village background, committee emblem, motto, tagline, action buttons, and animated statistic counters (4 Leaders, Total Members, Total Activities, Years of Service).
- **About Us**: Vision, Mission, and core pillars of village unity and youth empowerment.
- **Executive Leadership**: Dedicated profile cards for the **4 Fixed Roles**:
  1. **PRESIDENT** (Highlight spotlight card with glowing border and badge)
  2. **VICE PRESIDENT**
  3. **MANAGER**
  4. **CASHIER**
- **Committee Members**: Responsive grid of active youth volunteers with role tags, bio, and live search filter.
- **Village Activities**: Event timeline cards (Swachh Barapada cleanliness drives, cricket tournaments, blood donation camps, Raja Mahotsav cultural night, digital literacy workshops) with dates, location badges, and images.
- **Photo Gallery**: Categorized masonry layout (Committee, Leaders, Members, Events, Sports, Cultural Programs, Village Activities) with full-screen interactive Lightbox preview modal.
- **Contact Barapada**: Village address, phone, email, Google Maps button/iframe, social links, and public message submission form.

### 2. Secure Admin CMS Panel (`/admin/dashboard`)
- **JWT Authentication**: Password hashing with `bcryptjs`. Protected routes preventing unauthorized access.
- **Dashboard Overview Metrics**: Total Leaders, Total Members, Total Gallery Photos, Total Activities, Total Visitor Messages.
- **Leadership Management**: Edit any of the 4 executive roles (name, photo upload, description, phone).
- **Member Management**: Add, Edit, Delete committee members, photo upload, role designation, and display ordering.
- **Activity Management**: Create, Edit, Delete activities, title, description, date, location, photo upload.
- **Gallery Management**: Upload single or multiple images, assign category, edit caption, delete photos.
- **Website Settings**: Change committee name, tagline, about text, vision, mission, contact info, address, map link, hero image, and logo.
- **Visitor Messages**: View and manage contact messages submitted by public visitors.
- **Password Security**: Update admin password directly from the CMS panel.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM.
- **Backend**: Node.js, Express.js, SQLite (`sqlite3` / `sqlite`), `jsonwebtoken` (JWT), `bcryptjs`, `multer` (Image Uploads).
- **Database**: SQLite (`database.sqlite`) with automated schema initialization and default seed data.

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
- **Node.js**: v18+ installed
- **npm**: v9+ installed

### 1. Clone & Setup Backend
```bash
cd backend
npm install
node server.js
```
The backend server will launch at **`http://localhost:5000`**, automatically create `database.sqlite`, and seed default data.

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will launch at **`http://localhost:5174`** (or `5173`).

---

## 🔑 Initial Admin Credentials

| Username | Default Password | Role | Access Route |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | Administrator | `/admin/login` |

*Note: You can change the password at any time inside the Admin Dashboard under **Password Security**.*

---

## 📁 Database & File Storage Architecture

```
d:/committee/
├── backend/
│   ├── database.js          # SQLite database connection & seeder
│   ├── database.sqlite      # Persistent SQLite database file
│   ├── server.js            # Express API server
│   ├── routes/              # Auth, Leaders, Members, Activities, Gallery, Settings, Messages, Upload
│   └── uploads/             # Directory where uploaded images are saved
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, Footer, Lightbox, Toast, ProtectedRoute
    │   ├── pages/           # Home, About, Leadership, Members, Activities, Gallery, Contact, AdminLogin, AdminDashboard
    │   ├── services/api.js  # Axios API client
    │   └── context/         # AuthContext
```

---

## 🌐 Deployment Instructions

### Deployment to Render / VPS / Railway
1. **Backend**:
   - Set environment variables (`PORT`, `JWT_SECRET`).
   - Run `npm install && npm start`.
   - Ensure the `uploads/` folder has persistent storage or configure Cloudinary/S3.
2. **Frontend**:
   - Run `npm run build` in the `frontend` folder.
   - Serve the `dist/` directory using Nginx, Netlify, Vercel, or Express static middleware.

---

## 📝 License & Copyright
© 2026 **Maa Ambika Youth Club Barapada**. All Rights Reserved.  
*Unity • Service • Youth • Community*
