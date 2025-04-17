import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// project imports
import renderRoutes, { routes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
// ==============================|| APP ||============================== //

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
                background: 'green',
              },
            },
            error: {
              duration: 3000,
              theme: {
                primary: 'red',
                secondary: 'black',
                background: 'red',
              },
            },
          }}
        />
        {renderRoutes(routes)}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
