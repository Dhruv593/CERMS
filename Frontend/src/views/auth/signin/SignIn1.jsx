import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";
import { useAuth } from "../../../contexts/AuthContext"; // Import useAuth hook

const Signin1 = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();
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
      login(res.data.token);
      showSuccessAlert("Login Successful!", "Redirecting to dashboard...");
      navigate("/app/dashboard/analytics");
    } catch (error) {
      showErrorAlert("Login Failed!", error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-primary bg-gradient"
    >
      <Card className="p-4 shadow-lg rounded-3 bg-white" style={{ width: "380px" }}>
        <h3 className="text-center mb-3 fw-bold text-primary">Admin Login</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-secondary">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="p-2 rounded-3 border border-secondary focus-ring"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-secondary">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="p-2 rounded-3 border border-secondary focus-ring"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 p-2 rounded-3 fw-semibold"
          >
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Signin1;
