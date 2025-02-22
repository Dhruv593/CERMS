import { Card, CardBody, Input, Button, Typography } from "@material-tailwind/react";

export function SignIn() {
  return (
    <>
    

      <section className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <Card className="w-96 p-6 rounded-lg shadow-lg bg-white border border-gray-300">
          <CardBody>
            {/* Title */}
            <div className="text-center mb-6">
              <Typography variant="h4" className="font-bold text-gray-800">
                Equipment Rental Login
              </Typography>
              <Typography variant="paragraph" className="text-sm text-gray-600">
                Manage rentals, track inventory, and more.
              </Typography>
            </div>

            {/* Sign In Form */}
            <form className="space-y-4">
              {/* Username Field */}
              <div>
                <Typography variant="small" className="font-medium text-gray-700">
                  Username
                </Typography>
                <Input
                  size="lg"
                  placeholder="Enter your username"
                  className="w-full border border-gray-400 rounded-md"
                />
              </div>

              {/* Password Field */}
              <div>
                <Typography variant="small" className="font-medium text-gray-700">
                  Password
                </Typography>
                <Input
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="w-full border border-gray-400 rounded-md"
                />
              </div>

              {/* Submit Button */}
              <Button size="lg" fullWidth className="mt-4 bg-yellow-600 text-white hover:bg-yellow-700">
                Sign In
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

export default SignIn;
