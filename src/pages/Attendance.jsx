import { useState, useEffect, useCallback } from "react";
import supabase from "../utils/supabase";
import Sidebar from "../components/ui/Sidebar";
import Table from "../layout/Table";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Switch } from "../components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon, Clock, Filter } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const headers = [
  "#",
  "Children Name",
  "Guardian Name",
  "Telephone",
  "Status",
  "Action",
];

export default function Attendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 7;

  const fetchData = useCallback(async (date, time, status) => {
    setLoading(true);
    setError(null);
    try {
      const today = date ? new Date(date) : new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      let query = supabase
        .from("attendance_pending")
        .select("*", { count: 'exact' })
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .eq("preferred_time", time)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (status !== "all") {
        query = query.eq("has_attended", status === "attended");
      }

      const { data: fetchedData, error, count } = await query;

      if (error) throw error;

      setTotalPages(Math.ceil(count / itemsPerPage)); // Set total pages
      const formattedData = fetchedData.map((item) => ({
        ...item,
        formattedDate: new Date(item.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }));

      setData(formattedData);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error in fetchData function:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData(selectedDate, selectedTime, statusFilter);
  }, [selectedDate, selectedTime, statusFilter, currentPage, fetchData]);

  const handleDateChange = (date) => {
    setSelectedDate(date ? new Date(date) : new Date());
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSwitchChange = async (itemId, checked) => {
    try {
      const { error } = await supabase
        .from("attendance_pending")
        .update({ has_attended: checked })
        .eq("id", itemId);

      if (error) throw error;

      const updatedData = data.map((dataItem) =>
        dataItem.id === itemId ? { ...dataItem, has_attended: checked } : dataItem
      );

      setData(updatedData);
    } catch (error) {
      setError("Error updating attendance. Please try again.");
      console.error("Error in handleSwitchChange function:", error);
    }
  };

  const rows = data.map((item, index) => [
    index + 1 + (currentPage - 1) * itemsPerPage,
    `${item.children_first_name} ${item.children_last_name}`,
    `${item.guardian_first_name} ${item.guardian_last_name}`,
    item.guardian_telephone,
    item.has_attended ? "Attended" : "Pending",
    <Switch
      key={item.id}
      checked={item.has_attended}
      onCheckedChange={(checked) => handleSwitchChange(item.id, checked)}
      aria-label="Toggle attendance status"
    />,
  ]);

  return (
    <Sidebar>
      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attendance</h1>
          <p className="text-muted-foreground">Manage and track attendance records for children.</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="p-2 border border-input bg-background rounded-md"
            >
              <option value="09:00">09:00 AM</option>
              <option value="11:00">11:00 AM</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="p-2 border border-input bg-background rounded-md"
            >
              <option value="all">All</option>
              <option value="attended">Attended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading attendance records...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : data.length > 0 ? (
            <>
              <Table headers={headers} rows={rows} />
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No attendance records found.</p>
            </div>
          )}
        </div>
      </main>
    </Sidebar>
  );
}
