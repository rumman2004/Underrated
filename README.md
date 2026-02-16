# 🌍 Underrated - Curated Hidden Gems

> A full-stack travel curation platform dedicated to discovering and sharing the world's most underrated locations, hidden gems, and quiet retreats.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-underrated.vercel.app-2ea44f?style=for-the-badge&logo=vercel&logoColor=white)](https://underrated.vercel.app/)

![Project Banner](https://res.cloudinary.com/dtbytfxzs/image/upload/v1771274368/portfolio/1771274368165-Screenshot%202026-02-17%20020417.png)

## 📖 About The Project

**Underrated** is a web application designed to help travelers avoid tourist traps and discover authentic experiences. It features a public-facing explorer for users to find locations and a secure admin panel for curators to manage content.

### ✨ Key Features

**For Travelers (Public):**
* **Hero Search:** Search places by name, city, or category.
* **Geolocation:** "Near Me" functionality to find gems based on user location.
* **Interactive Maps:** Visual exploration using Leaflet maps.
* **Place Details:** Comprehensive info including best visit times, open days, and ratings.
* **Reviews:** Read and submit user reviews.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

**For Curators (Admin):**
* **Secure Authentication:** JWT-based login system for admins.
* **Dashboard:** Analytics overview (Total places, average ratings, verification status).
* **Content Management:** Add, edit, and delete travel locations.
* **Review Moderation:** Approve or reject user-submitted reviews.
* **Submission Inbox:** Manage place suggestions from users.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **React.js** (Vite)
* **Tailwind CSS** (Styling & Responsive Design)
* **Lucide React** (Icons)
* **React Router DOM** (Navigation)
* **React Leaflet** (Maps)
* **Axios** (API Requests)
* **React Toastify** (Notifications)

### Backend (Server)
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (Database)
* **JWT (JSON Web Tokens)** (Authentication)
* **Cors & Dotenv** (Security & Config)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js (v14 or higher)
* npm or yarn
* MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/underrated-app.git](https://github.com/your-username/underrated-app.git)
cd underrated-app
```
### 2. Backend Setup
Navigate to the server directory and install dependencies.
```Bash
cd server
npm install
```
Configuration:
Create a `.env` file in the `server/utils` folder (or root, depending on your setup) and add the following:
```Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Admin Credentials (for initial login)
ADMIN_EMAIL=admin@underrated.com
ADMIN_PASSWORD=your_secure_password
```
Start the Server:
```Bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
```Bash
cd client
npm install
```
Start the React App:
```Bash
npm run dev
```
The app should now be running at http://localhost:5173 (Frontend) and http://localhost:5000 (Backend).

📂 Project Structure
```Plaintext
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Cards)
│   │   ├── context/        # React Context (Auth, Places)
│   │   ├── pages/          # Full pages (Home, Login, AdminDashboard)
│   │   └── utils/          # API helpers
│   └── ...
│
├── server/                 # Node.js Backend
│   ├── config/             # DB connection
│   ├── controllers/        # Logic for routes
│   ├── models/             # Mongoose Schemas (Place, Review, User)
│   ├── routes/             # API Endpoints
│   ├── server.js           # Entry point
│   └── ...
└── README.md
```

### 4. 🔐 Admin Access
To access the Admin Panel:
1. Navigate to `/admin/login` in your browser.
2. Log in using the credentials defined in your backend `.env` file (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

### 5. 📡 API Endpoints

Method,Endpoint,Description
GET,/api/places,Get all approved places
GET,/api/places/:id,Get details of a specific place
POST,/api/auth/login,Admin login
POST,/api/reviews,Submit a new review
POST,/api/contacts,Submit a contact/suggestion form

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See LICENSE for more information.

### 📧 Contact
- Your Name - rumman.ahmed.work+query@gmail.com
- Project Link: https://github.com/rumman2004/Underrated
