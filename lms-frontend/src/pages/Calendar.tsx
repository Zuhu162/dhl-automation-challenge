import { useQuery } from "@tanstack/react-query";
import { leaveService } from "@/services/leaveService";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LeaveCalendar from "@/components/LeaveCalendar";

const Calendar = () => {
  // Fetch leave data
  const { data: leaveData, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: leaveService.getAll,
  });

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <LeaveCalendar leaveData={leaveData} isLoading={isLoading} />
        </main>
      </div>
    </>
  );
};

export default Calendar;
