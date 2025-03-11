import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// project imports
import renderRoutes, { routes } from './routes';
import { AuthProvider } from './contexts/AuthContext';

// ==============================|| APP ||============================== //

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
        {renderRoutes(routes)}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
