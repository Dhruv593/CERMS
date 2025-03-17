import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NavRight = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/signin-1", { replace: true });
  };

  return (
    <div className="d-flex align-items-center ms-auto position-relative" 
         style={{ backgroundColor: "", padding: "0.5rem 1rem" }}>
      {/* Avatar Button */}
      <div
        className="d-flex align-items-center justify-content-center p-2 rounded-circle border border-2 border-white cursor-pointer"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "transparent",
          transition: "all 0.2s ease",
          hover: { opacity: 0.8 }
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <User size={28} className="text-white" />
      </div>

      {/* Dropdown Menu */}
      <div 
        className={`position-absolute top-100 end-0 bg-white rounded shadow-lg mt-1`}
        style={{
          minWidth: "220px",
          display: dropdownOpen ? "block" : "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          border: "1px solid rgba(0,0,0,0.1)"
        }}
      >
        {/* <div className="p-3 border-bottom text-center">
          <div 
            className="d-flex align-items-center justify-content-center p-2 rounded-circle bg-primary mx-auto"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#007bff"
            }}
          >
            <User size={40} className="text-white" />
          </div>
          <p className="fw-semibold mb-0 mt-2 text-dark">User</p>
        </div> */}

        <button
          onClick={handleLogout}
          className="d-flex align-items-center w-100 border-0 bg-transparent px-4 py-3 text-dark"
          style={{
            transition: "background-color 0.2s",
            hover: { backgroundColor: "#f8f9fa" }
          }}
        >
          <LogOut size={18} className="me-2" />
          <span className="text-dark">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default NavRight;
