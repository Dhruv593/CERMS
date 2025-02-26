import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth/sign-in" replace />;
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


// Below is one approach where your routing logic checks for the token and renders only the /auth/sign-in route when the user is not logged in. If the user is logged in, then the other routes (like /dashboard) are available. In this example, we use conditional rendering of the routes based on whether the token exists.

// import { Routes, Route, Navigate } from "react-router-dom";
// import { Dashboard, Auth } from "@/layouts";

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <Routes>
//       {/** If no token, only allow the sign-in page */}
//       {!token && (
//         <>
//           <Route path="/auth/sign-in" element={<Auth />} />
//           {/** Catch-all: any other route redirects to sign-in */}
//           <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
//         </>
//       )}

//       {/** If token exists, allow dashboard and redirect any /auth access */}
//       {token && (
//         <>
//           <Route path="/dashboard/*" element={<Dashboard />} />
//           <Route path="/auth/*" element={<Navigate to="/dashboard/home" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
//         </>
//       )}
//     </Routes>
//   );
// }

// export default App;
