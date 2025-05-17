import { useState, useEffect } from "react";
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
import { Copy } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Check if user is already authenticated and redirect to home if they are
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

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

  // Demo credentials
  const demoEmail = "hr@dhl.com";
  const demoPassword = "9A8+8|]'73w3";

  // Handle demo credentials click
  const handleDemoCredentialsClick = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success("Demo credentials copied!");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/login_backdrop.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>

      <div className="w-full max-w-md space-y-8 px-4 z-10">
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-200">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <img
              src="/logo.png"
              alt="DHL Logo"
              className="mx-auto h-12 w-auto mb-2"
            />
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

            <div
              className="mt-4 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50 cursor-pointer flex items-center gap-3 hover:bg-yellow-100 transition-colors"
              onClick={handleDemoCredentialsClick}
              title="Click to autofill demo credentials">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Demo Credentials:
                </p>
                <div className="text-sm text-gray-600 mt-1">
                  <p>
                    <span className="font-medium">Email:</span> {demoEmail}
                  </p>
                  <p>
                    <span className="font-medium">Password:</span>{" "}
                    {demoPassword}
                  </p>
                </div>
              </div>
              <Copy className="h-5 w-5 text-gray-500 hover:text-dhl-red transition-colors" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="mailto:zuhayer@graduate.utm.my"
                className="font-medium text-dhl-red hover:underline">
                Contact your administrator
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Photo credits */}
      <div className="absolute bottom-4 left-4 z-10">
        <p className="text-xs text-white">
          Photo by{" "}
          <a
            href="https://unsplash.com/@nikihero666?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline hover:text-gray-200">
            Nikita rud
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/photos/man-in-black-jacket-riding-bicycle-on-sidewalk-during-daytime-mEF00fo9YFE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            className="underline hover:text-gray-200">
            Unsplash
          </a>
        </p>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2 z-10 bg-white rounded-md">
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
