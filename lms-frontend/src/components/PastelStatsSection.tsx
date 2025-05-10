import React from "react";
import StatsCard from "./StatsCard";
import { Calendar, CheckCircle, XCircle, Hourglass } from "lucide-react";

interface PastelStatsSectionProps {
  stats: {
    onLeave: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  isLoading: boolean;
  onCardClick: (category: string) => void;
}

const PastelStatsSection: React.FC<PastelStatsSectionProps> = ({
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
        bgColor="bg-red-50"
        accentColor="bg-gradient-to-r from-red-100 to-red-200"
      />

      <StatsCard
        title="Pending Approval"
        value={stats.pending}
        description="Awaiting review"
        icon={Hourglass}
        iconColor="text-yellow-500"
        isLoading={isLoading}
        onClick={() => onCardClick("pending")}
        bgColor="bg-amber-50"
        accentColor="bg-gradient-to-r from-amber-100 to-amber-200"
      />

      <StatsCard
        title="Approved"
        value={stats.approved}
        description="Total approved leaves"
        icon={CheckCircle}
        iconColor="text-green-500"
        isLoading={isLoading}
        onClick={() => onCardClick("approved")}
        bgColor="bg-green-50"
        accentColor="bg-gradient-to-r from-green-100 to-green-200"
      />

      <StatsCard
        title="Rejected"
        value={stats.rejected}
        description="Total rejected leaves"
        icon={XCircle}
        iconColor="text-red-500"
        isLoading={isLoading}
        onClick={() => onCardClick("rejected")}
        bgColor="bg-rose-50"
        accentColor="bg-gradient-to-r from-rose-100 to-rose-200"
      />
    </div>
  );
};

export default PastelStatsSection;
