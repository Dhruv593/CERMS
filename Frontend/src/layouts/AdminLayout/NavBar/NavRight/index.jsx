import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NavRight = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userName = localStorage.getItem("username") || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/auth/signin-1", { replace: true });
  };

  return (
    <div className="d-flex align-items-center position-relative">
      {/* Avatar Button */}
      <button
        className="d-flex align-items-center gap-2 bg-transparent border-0 px-3 py-2 rounded-2 text-white bg-primary"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="d-flex align-items-center justify-content-center rounded-circle border border-white "
             style={{ width: "40px", height: "40px" }}>
          <User size={24} className="text-white" />
        </div>
        <span className="fw-semibold d-none d-md-block">{userName}</span> {/* Hidden on small screens */}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`position-absolute top-100 end-0 bg-white rounded shadow-lg mt-2 ${dropdownOpen ? "d-block" : "d-none"}`}
        style={{ minWidth: "200px", zIndex: 1000 }}
      >
        <button
          onClick={handleLogout}
          className="d-flex align-items-center w-100 border-0 bg-transparent px-4 py-3 text-dark"
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavRight;
