import { useForm } from "react-hook-form";
import Sidebar from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/utils/supabase";
import { Calendar } from "@/components/ui/calendar";
import Table from "../layout/Table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";

// Table headers
const headers = ["Event Name", "Date", "Time"];

export default function AdminNewSchedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // React Hook Form for managing form submission and validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form and clear state
  const resetForm = () => {
    reset();
    setSelectedDate(null);
    setIsSubmitted(false);
  };

  // Handle event form submission
  const onSubmit = async (data) => {
    setIsSubmitted(true);

    // If date is not selected, stop form submission
    if (!selectedDate) return;

    try {
      const { error } = await supabase.from("schedule").insert([
        {
          name: data.name,
          schedule: selectedDate,
          time: [data.time],
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error);
      } else {
        alert("Event created successfully!");
        resetForm(); // Reset form after successful submission
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setValue("schedule", date);
  };

  // Fetch events from Supabase with pagination
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: fetchedData, error, count } = await supabase
        .from("schedule")
        .select("*", { count: "exact" })
        .range(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage - 1
        );

      if (error) throw error;

      setTotalPages(Math.ceil(count / itemsPerPage));
      setEvents(fetchedData);
    } catch (err) {
      setError("Error fetching events. Please try again.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Fetch events when page loads or currentPage changes
  useEffect(() => {
    fetchEvents();
  }, [currentPage, fetchEvents]);

  // Convert time to readable format (24-hour)
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Map rows for Table rendering
  const rows = events.map((event) => [
    event.name,
    format(new Date(event.schedule), "PPP"), // Format date as 'Sep 21, 2024'
    event.time && event.time.length > 0 ? formatTime(event.time[0]) : "N/A", // Safely handle time
  ]);

  return (
    <Sidebar>
      <main className="p-4 lg:p-8">
        <h1 className="text-xl font-semibold mb-4">Schedule</h1>

        {/* Create Event Dialog */}
        <Dialog onOpenChange={(isOpen) => !isOpen && resetForm()}>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Schedule an upcoming event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500">Event name is required</p>
                )}
              </div>

              {/* Date Selector */}
              <div className="mt-4">
                <Label htmlFor="schedule">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Please select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {isSubmitted && !selectedDate && (
                  <p className="text-red-500">Date is required</p>
                )}
              </div>

              {/* Time Selector */}
              <div className="mt-4">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time", { required: true })}
                  className="border rounded p-1 w-auto"
                />
                {errors.time && (
                  <p className="text-red-500">Time is required</p>
                )}
              </div>

              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Loading/Error States */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading schedule...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : rows.length > 0 ? (
          <>
            {/* Display Event Table */}
            <Table headers={headers} rows={rows} />

            {/* Pagination */}
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
                      if (currentPage < totalPages)
                        setCurrentPage((prev) => prev + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        )}
      </main>
    </Sidebar>
  );
}
