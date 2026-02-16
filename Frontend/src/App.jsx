import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Layouts ---
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// --- Auth Guard ---
import ProtectedRoute from './components/auth/ProtectedRoute';

// --- Public Pages ---
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import AllPlaces from './pages/public/AllPlaces';
// FIX: Import from 'pages/public', not 'components/places'
import PlaceDetails from './components/places/PlaceDetails'; 

// --- Admin Pages ---
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddPlaces from './pages/admin/AddPlaces';
import ViewAllPlaces from './pages/admin/ViewAllPlaces';
import EditPlace from './pages/admin/EditPlace';  
import Reviews from './pages/admin/Reviews';
import Contacts from './pages/admin/Contacts';

function App() {
  return (
    <Router>
      <div className="antialiased min-h-screen bg-gray-50 text-gray-900 font-display">
        {/* Add ToastContainer here (it stays hidden until triggered) */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
      />
      
        <Routes>
          
          {/* =========================================
              PUBLIC ROUTES (Accessible by everyone)
              Wraps pages with Navbar & Footer 
          ========================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/all-places" element={<AllPlaces />} />
            {/* Dynamic Route for Single Place Details */}
            <Route path="/place/:id" element={<PlaceDetails />} />
          </Route>


          {/* =========================================
              ADMIN AUTH (No Layout)
          ========================================= */}
          <Route path="/admin/login" element={<Login />} />


          {/* =========================================
              PROTECTED ADMIN ROUTES 
              Requires Login + Wraps with Admin Sidebar 
          ========================================= */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              
              {/* Redirect /admin to /admin/dashboard */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/add" element={<AddPlaces />} />
              <Route path="/admin/viewplaces" element={<ViewAllPlaces />} />
              <Route path="/admin/edit/:id" element={<EditPlace />} />
              <Route path="/admin/submissions" element={<Contacts />} />
              <Route path="/admin/reviews" element={<Reviews />} />
              
            </Route>
          </Route>


          {/* =========================================
              404 NOT FOUND (Redirect to Home)
          ========================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;