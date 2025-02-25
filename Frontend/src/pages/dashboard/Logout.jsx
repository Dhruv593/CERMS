import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and navigate to login page
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/auth/sign-in");
  };

  return (
    <>
      {/* Button to trigger logout confirmation */}
      <Button color="red" onClick={() => setOpen(true)}>
        Logout
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>Confirm Logout</DialogHeader>
        <DialogBody divider>
          Are you sure you want to logout?
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="blue-gray" 
            onClick={() => setOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Logout;
