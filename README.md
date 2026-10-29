# Enterprise Human Resource Management (HRM) System

A modern full-stack MERN (MongoDB, Express.js, React.js, Node.js) Human Resource Management System with Role-Based Access Control (RBAC) for **HR**, **Manager**, and **Employee** roles.

---

## 🛠️ Tech Stack
- **Frontend**: React.js (React Router v6, Axios, Modern Vanilla CSS Design System)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcrypt password hashing
- **Environment & Cross-Origin**: dotenv, cors

---

## 🚀 Quick Setup & Execution

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure MongoDB is running locally or configure MONGO_URI in .env
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
# Client runs on http://localhost:3000
```

---

## 🔐 Role Access Table
| Role | Capabilities |
| :--- | :--- |
| **HR** | Full Employee CRUD, Approve/Reject Leaves, View Company Attendance Summary, Post/Delete Announcements |
| **Manager** | Approve/Reject Team Leaves, Create/Schedule Trainings, Assign Staff to Trainings, Post Announcements |
| **Employee** | Daily Check-in/Check-out, Apply for Leaves, View Leave History & Status, View Announcements, Maintain Personal Contact Info |
