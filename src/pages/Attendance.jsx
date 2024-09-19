import { useState, useEffect, useCallback } from "react";
import supabase from "../utils/supabase";
import Sidebar from "../components/ui/Sidebar";
import Table from "../layout/Table";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Switch } from "../components/ui/switch";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState(Date);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  // Fetch data depends on date, time, status
  const fetchData = useCallback(async (date, time, status) => {
    setLoading(true);
    setError(null);
    try {
      const today = date ? new Date(date) : new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      let query = supabase
        .from("attendance_pending")
        .select("*")
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .eq("preferred_time", time);

      if (status !== "all") {
        query = query.eq("has_attended", status === "attended");
      }

      const { data: fetchedData, error } = await query;

      if (error) {
        throw error; // Throw error to be caught by the catch block
      }

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
  }, []);

  useEffect(() => {
    fetchData(selectedDate, selectedTime, statusFilter);
  }, [selectedDate, selectedTime, statusFilter, fetchData]);

  const handleDateChange = (date) => {
    setSelectedDate(date ? new Date(date) : null);
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

      if (error) {
        throw error; // Throw error to be caught by the catch block
      }

      // Update local state after successful database update
      const updatedData = data.map((dataItem) =>
        dataItem.id === itemId ? { ...dataItem, has_attended: checked } : dataItem
      );

      setData(updatedData);
    } catch (error) {
      setError("Error updating attendance. Please try again.");
      console.error("Error in handleSwitchChange function:", error);
    }
  };

  // Rows for table component
  const rows = data.map((item, index) => [
    index + 1,
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
      <main className="p-4 lg:p-8">
        <h1 className="text-xl font-semibold mb-4">Attendance</h1>
        <div className="mb-4 flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                {selectedDate
                  ? format(new Date(selectedDate), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="09:00">09:00 AM</option>
            <option value="11:00">11:00 AM</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="attended">Attended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length > 0 ? (
          <Table headers={headers} rows={rows} />
        ) : (
          <p>No data found.</p>
        )}
      </main>
    </Sidebar>
  );
}
