import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import Providers
import { AuthProvider } from './context/AuthContext';
import { PlaceProvider } from './context/PlaceContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PlaceProvider>
        <App />
      </PlaceProvider>
    </AuthProvider>
  </React.StrictMode>,
);