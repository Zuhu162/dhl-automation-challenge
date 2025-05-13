import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  activeTab: string;
  currentPage: number;
  completedPage: number;
  activeTotalPages: number;
  completedTotalPages: number;
  handlePageChange: (page: number) => void;
  pageNumbers: (number | string)[];
}

export default function TablePagination({
  activeTab,
  currentPage,
  completedPage,
  activeTotalPages,
  completedTotalPages,
  handlePageChange,
  pageNumbers,
}: TablePaginationProps) {
  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (activeTab === "active" && currentPage > 1) {
                  handlePageChange(currentPage - 1);
                } else if (activeTab === "completed" && completedPage > 1) {
                  handlePageChange(completedPage - 1);
                }
              }}
              className={
                (activeTab === "active" && currentPage === 1) ||
                (activeTab === "completed" && completedPage === 1)
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, i) => (
            <PaginationItem key={i}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={
                    activeTab === "active"
                      ? currentPage === page
                      : completedPage === page
                  }
                  className="cursor-pointer">
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (activeTab === "active" && currentPage < activeTotalPages) {
                  handlePageChange(currentPage + 1);
                } else if (
                  activeTab === "completed" &&
                  completedPage < completedTotalPages
                ) {
                  handlePageChange(completedPage + 1);
                }
              }}
              className={
                (activeTab === "active" && currentPage === activeTotalPages) ||
                (activeTab === "completed" &&
                  completedPage === completedTotalPages)
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
