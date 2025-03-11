import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/auth/signin-1', { replace: true });
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
