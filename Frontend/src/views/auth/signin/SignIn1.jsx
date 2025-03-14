import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth hook

const Signin1 = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login method from useAuth
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/app/dashboard/analytics", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      login(res.data.token); // Use the login method to set the token
      showSuccessAlert("Login Successful!", "You are being redirected to the dashboard.");
      navigate("/app/dashboard/analytics");
    } catch (error) {
      showErrorAlert("Login Failed!", error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Signin1;


// import React, { useState, useEffect } from "react";
// import { Form, Button, Container, Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";

// const Signin1 = () => {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const navigate = useNavigate();
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/app/dashboard/analytics", { replace: true });
//     }
//   }, []); // No dependencies required since we are not depending on any external state
  

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${API_URL}/auth/login`, formData);
//       localStorage.setItem("token", res.data.token);
//       showSuccessAlert("Login Successful!", "You are being redirected to the dashboard.");
//       navigate("app/dashboard/analytics");
//     } catch (error) {
//       showErrorAlert("Login Failed!", error.response?.data?.message || "Invalid credentials.");
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center vh-100">
//       <Card className="p-4 shadow" style={{ width: "350px" }}>
//         <h3 className="text-center mb-3">Admin Login</h3>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Enter your username"
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </Form.Group>
//           <Button variant="primary" type="submit" className="w-100">
//             Login
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Signin1;
