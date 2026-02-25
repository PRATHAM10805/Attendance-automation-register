# DSCE Digital Attendance & Marks Register (MERN Stack)

A professional, feature-rich web application designed to digitize teacher registers. Built with the MERN stack for robust data persistence and a modern user experience.

## 🚀 Features

- **MongoDB Persistence**: Real-time data synchronization and persistence.
- **7-Day Attendance Grid**: Fast, interactive attendance marking.
- **Marks & Assessment**: Automated calculation of IAT reduction, IA best-of-3, and Final Totals.
- **Row & Sheet Locking**: Prevent accidental edits with a secure locking mechanism.
- **Premium Dark Mode**: A sleek, high-contrast interface designed for focus.
- **Print Optimization**: Generate clean, register-style physical copies.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, CSS3
- **Backend**: Node.js, Express
- **Database**: MongoDB (Local or Atlas)
- **Styling**: Vanilla CSS (Custom UI Components)

## 📦 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port 27017)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd dsce-attendance
```

### 2. Install Dependencies
Install dependencies for root, server, and client:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Environment Configuration
Verify the `.env` file in the `server/` directory:
```env
MONGO_URI=mongodb://localhost:27017/dsce_attendance
PORT=5000
```

## 🏃 Running the App

From the **root directory**, run:
```bash
npm run dev
```
This will start both the backend server and the frontend client simultaneously.

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

## 🖨️ Printing
Use the **Print** button in the top-right of the application to generate a clean PDF or physical printout.

