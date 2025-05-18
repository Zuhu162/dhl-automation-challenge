import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  activeTab: string;
  currentPage: number;
  completedPage: number;
  allPage: number;
  activeTotalPages: number;
  completedTotalPages: number;
  allTotalPages: number;
  handlePageChange: (page: number) => void;
  pageNumbers: (number | string)[];
}

export default function TablePagination({
  activeTab,
  currentPage,
  completedPage,
  allPage,
  activeTotalPages,
  completedTotalPages,
  allTotalPages,
  handlePageChange,
  pageNumbers,
}: TablePaginationProps) {
  const totalPages =
    activeTab === "active"
      ? activeTotalPages
      : activeTab === "completed"
      ? completedTotalPages
      : allTotalPages;

  const currentPageValue =
    activeTab === "active"
      ? currentPage
      : activeTab === "completed"
      ? completedPage
      : allPage;

  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPageValue - 1)}
          disabled={currentPageValue === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPageValue ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={typeof page !== "number"}>
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPageValue + 1)}
          disabled={currentPageValue === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
