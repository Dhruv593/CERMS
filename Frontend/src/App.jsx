import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return <Navigate to="/auth/sign-in" replace />;
    }
  
    return children;
  
}

function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}

export default App;
