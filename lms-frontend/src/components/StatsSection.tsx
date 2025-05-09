import React, { useState } from "react";
import StatsCard from "./StatsCard";
import EmployeeModal from "./EmployeeModal";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import { LeaveApplication } from "@/types";

interface StatsSectionProps {
  stats: {
    onLeave: number;
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
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-8">
      <StatsCard
        title="Currently On Leave"
        value={stats.onLeave}
        description="Click to view details"
        icon={Calendar}
        iconColor="text-dhl-red"
        isLoading={isLoading}
        onClick={() => onCardClick("onLeave")}
        bgColor="bg-white"
        accentColor="bg-red-100"
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
