import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-7xl font-bold text-dhl-red">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-gray-500">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-dhl-red hover:bg-red-700">
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;
