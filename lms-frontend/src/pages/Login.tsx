import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { IconLink } from "@/components/IconLink";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            <span className="font-bold text-3xl text-dhl-red">DHL</span>
            <span className="ml-2">Leave Management</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-dhl-red hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-dhl-red hover:bg-red-700"
                disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-700">
                Demo Credentials:
              </p>
              <div className="text-sm text-gray-600 mt-1">
                <p>
                  <span className="font-medium">Email:</span> hr@dhl.com
                </p>
                <p>
                  <span className="font-medium">Password:</span> 9A8+8|]'73w3
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-dhl-red hover:underline">
                Contact your administrator
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <IconLink
          type="github"
          href="https://github.com/Zuhu162/dhl-automation-challenge"
        />
        <IconLink type="portfolio" href="https://zuhu.dev/" />
      </div>
    </div>
  );
};

export default Login;
