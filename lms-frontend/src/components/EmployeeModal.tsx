
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeaveApplication } from "@/types";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: LeaveApplication[];
  title: string;
}

const ITEMS_PER_PAGE = 5;

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employees,
  title
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredEmployees = employees.filter(emp => 
    emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="py-2 px-3 text-left text-sm font-medium">Employee</th>
                <th className="py-2 px-3 text-left text-sm font-medium">Leave Type</th>
                <th className="py-2 px-3 text-left text-sm font-medium">Period</th>
                <th className="py-2 px-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map(emp => (
                  <tr key={emp.id} className="border-b">
                    <td className="py-2 px-3">
                      <div className="font-medium">{emp.employeeName}</div>
                      <div className="text-xs text-gray-500">{emp.employeeId}</div>
                    </td>
                    <td className="py-2 px-3">{emp.leaveType}</td>
                    <td className="py-2 px-3">
                      <div>{format(new Date(emp.startDate), "MMM d, yyyy")}</div>
                      <div>to {format(new Date(emp.endDate), "MMM d, yyyy")}</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColorClass(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                />
              </PaginationItem>
              
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;
