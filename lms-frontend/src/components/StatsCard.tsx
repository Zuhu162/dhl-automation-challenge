import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  onClick?: () => void;
  isLoading?: boolean;
  bgColor?: string;
  accentColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  onClick,
  isLoading = false,
  bgColor = "bg-white",
  accentColor = "bg-gray-50",
}) => {
  return (
    <Card
      className={`${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${bgColor} border overflow-hidden`}
      onClick={onClick}>
      <div className={`h-1 w-full ${accentColor}`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span
            className={`text-3xl font-bold ${iconColor.replace(
              "text-",
              ""
            )}-600`}>
            {isLoading ? "..." : value}
          </span>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
