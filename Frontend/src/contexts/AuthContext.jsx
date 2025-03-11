import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('authToken'); // Initialize from localStorage
  });

  useEffect(() => {
    console.log('AuthProvider checking authentication');
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, []); // Empty dependency array to run only once

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


// import { createContext, useContext, useState, useEffect } from 'react';

// // Create AuthContext
// const AuthContext = createContext(null);

// // Provide authentication state and functions
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsAuthenticated(!!token); // Convert token existence to boolean
//   }, []);

//   const login = (token) => {
//     localStorage.setItem('authToken', token);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use AuthContext
// export const useAuth = () => useContext(AuthContext);
