import { useState } from "react";
import { LeaveApplication } from "@/types";
import { leaveService } from "@/services/leaveService";
import { toast } from "sonner";

export function useEmployeeFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<
    LeaveApplication[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = async (category: string) => {
    try {
      const applications = await leaveService.getAll();
      const currentDate = new Date();

      let filtered: LeaveApplication[] = [];

      switch (category) {
        case "onLeave":
          filtered = applications.filter((app) => {
            const startDate = new Date(app.startDate);
            const endDate = new Date(app.endDate);
            return (
              app.status === "Approved" &&
              startDate <= currentDate &&
              endDate >= currentDate
            );
          });
          break;
        case "pending":
          filtered = applications.filter((app) => app.status === "Pending");
          break;
        case "approved":
          filtered = applications.filter((app) => app.status === "Approved");
          break;
        case "rejected":
          filtered = applications.filter((app) => app.status === "Rejected");
          break;
      }

      setFilteredEmployees(filtered);
      setSelectedCategory(category);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      toast.error("Failed to load employee data");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getModalTitle = () => {
    return selectedCategory === "onLeave"
      ? "Currently On Leave"
      : selectedCategory === "pending"
      ? "Pending Approval"
      : selectedCategory === "approved"
      ? "Approved Leaves"
      : "Rejected Leaves";
  };

  return {
    selectedCategory,
    filteredEmployees,
    isModalOpen,
    handleCardClick,
    closeModal,
    getModalTitle,
  };
}

export default useEmployeeFilter;
