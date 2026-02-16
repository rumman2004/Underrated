import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Navigation Bar (Stays at top) */}
      <Navbar />

      {/* 2. Main Content Area 
          flex-grow ensures this section expands to fill space,
          pushing the footer down.
      */}
      <main className="flex-grow pt-20"> 
        {/* pt-20 adds padding so content doesn't hide behind a fixed navbar */}
        <Outlet />
      </main>

      {/* 3. Footer (Stays at bottom) */}
      <Footer />
    </div>
  );
};

export default PublicLayout;