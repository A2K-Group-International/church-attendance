import Sidebar from "@/components/ui/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { fetchLatestSchedule, insertNewSchedule } from "@/services/apiAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Ensure correct import path
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminSchedule() {
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState(null);
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const latestSchedule = await fetchLatestSchedule();
        if (latestSchedule.length > 0) {
          const initialSchedule = new Date(latestSchedule[0].schedule);
          setSchedule(initialSchedule);
        } else {
          setError("No schedule found.");
        }
      } catch (error) {
        setError("Failed to load schedule: " + error.message);
      }
    };
    fetchSchedule();
  }, []);

  const handleDateSelect = (date) => {
    setSchedule(date);
  };

  const buttonHandleDateSelected = async () => {
    try {
      if (!schedule) {
        console.error("Schedule is not defined.");
        return;
      }

      const newSchedule = await insertNewSchedule({
        schedule: schedule,
      });

      console.log(`New schedule inserted: ${newSchedule}`);
    } catch (error) {
      console.log("Error inserting new schedule:", error.message);
    }
  };

  // Format the selected date to a readable string
  const formattedDate = schedule ? schedule.toLocaleDateString() : "";

  return (
    <Sidebar>
      <main className="p-4 lg:p-8">
        <h1 className="text-xl font-semibold mb-4">Mass Schedule</h1>
        {error && <div className="text-red-500">{error}</div>}
        <div className="mb-4 flex items-center space-x-4">
          <Calendar
            mode="single"
            selected={schedule}
            onSelect={handleDateSelect}
            className="rounded-md"
          />
        </div>
        {schedule && (
          <div className="mt-4">Next mass will be on: {formattedDate}</div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Update</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure you want to update?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={buttonHandleDateSelected}>Yes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Sidebar>
  );
}
