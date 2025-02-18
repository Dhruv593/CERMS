import {
  Card,
  CardBody,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
      <Card className="w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side Image (only visible on large screens) */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="/img/pattern.png"
            alt="Signup Visual"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right Side Form */}
        <CardBody className="w-full lg:w-1/2 p-8">
          <div className="text-center mb-8">
            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
              Join Us Today
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              Enter your email and password to register.
            </Typography>
          </div>
          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </div>
            {/* Password Field */}
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Password
              </Typography>
              <Input type="password" size="lg" placeholder="Enter your password" />
            </div>
            {/* Confirm Password Field */}
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Confirm Password
              </Typography>
              <Input type="password" size="lg" placeholder="Confirm your password" />
            </div>
            {/* Terms and Conditions Checkbox */}
            <Checkbox
              label={
                <Typography variant="small" color="gray" className="flex items-center">
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
            />
            {/* Register Button */}
            <Button size="lg" fullWidth>
              Register Now
            </Button>
            {/* Social Buttons */}
            <div className="flex flex-col space-y-4 mt-4">
              <Button
                size="lg"
                color="white"
                fullWidth
                className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.6 10.23c0-.68-.06-1.35-.18-2H10v3.8h5.4a4.62 4.62 0 01-2 3.03v2.5h3.22c1.88-1.73 2.98-4.28 2.98-7.36z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20c2.7 0 4.97-.9 6.63-2.43l-3.22-2.5c-.89.6-2.03.95-3.41.95-2.62 0-4.83-1.77-5.62-4.15H1.02v2.6A10 10 0 0010 20z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.38 11.39a5.99 5.99 0 010-3.77V5.02H1.02a10.01 10.01 0 000 9.96l3.36-2.59z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M10 4.01c1.47 0 2.8.51 3.84 1.51l2.88-2.88C14.96 1.13 12.7 0 10 0A10 10 0 001.02 5.02l3.36 2.6A5.99 5.99 0 0110 4.01z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in With Google</span>
              </Button>
              <Button
                size="lg"
                color="white"
                fullWidth
                className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400"
              >
                <img src="/img/twitter-logo.svg" alt="Twitter Logo" className="w-5 h-5" />
                <span>Sign in With Twitter</span>
              </Button>
            </div>
            {/* Sign In Link */}
            <Typography
              variant="paragraph"
              className="text-center text-gray-600 font-medium mt-4"
            >
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </Typography>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}

export default SignUp;
