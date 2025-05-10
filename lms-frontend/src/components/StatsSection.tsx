import React from "react";
import StatsCard from "./StatsCard";
import EmployeeModal from "./EmployeeModal";
import { LayoutDashboard, Users, CheckCircle, XCircle } from "lucide-react";
import { LeaveApplication } from "@/types";

interface StatsSectionProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  isLoading: boolean;
  onCardClick: (category: string) => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  isLoading,
  onCardClick,
}) => {
  const totalApplications = stats.pending + stats.approved + stats.rejected;
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8">
      <StatsCard
        title="Total Applications"
        value={totalApplications}
        description="All leave requests submitted"
        icon={LayoutDashboard}
        iconColor="text-gray-500"
        isLoading={isLoading}
        bgColor="bg-white"
        accentColor="bg-gray-100"
      />

      <StatsCard
        title="Pending Approval"
        value={stats.pending}
        description="Awaiting review"
        icon={Users}
        iconColor="text-yellow-500"
        isLoading={isLoading}
        onClick={() => onCardClick("pending")}
        bgColor="bg-white"
        accentColor="bg-yellow-100"
      />

      <StatsCard
        title="Approved"
        value={stats.approved}
        description="Total approved leaves"
        icon={CheckCircle}
        iconColor="text-green-500"
        isLoading={isLoading}
        onClick={() => onCardClick("approved")}
        bgColor="bg-white"
        accentColor="bg-green-100"
      />

      <StatsCard
        title="Rejected"
        value={stats.rejected}
        description="Total rejected leaves"
        icon={XCircle}
        iconColor="text-red-500"
        isLoading={isLoading}
        onClick={() => onCardClick("rejected")}
        bgColor="bg-white"
        accentColor="bg-red-100"
      />
    </div>
  );
};

export default StatsSection;
