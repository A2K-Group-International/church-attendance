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
import { Input } from "@/components/ui/input";

const formatTimeWithoutTimezone = (timeString) => {
  return timeString.includes("+") ? timeString.split("+")[0] : timeString;
};

export default function AdminSchedule() {
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [time, setTime] = useState([""]);

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
  const handleAddTimeInput = () => {
    setTime([...time, ""]); // Add a new input
  };
  const handleRemoveTimeInput = (index) => {
    if (time.length > 1) {
      setTime(time.filter((_, i) => i !== index)); // Remove input at the specified index
    }
  };
  const handleChangeTime = (index, value) => {
    const updatedTimes = [...time];
    updatedTimes[index] = value; // Update the specific time input
    setTime(updatedTimes);
  };

  const buttonHandleDateSelected = async () => {
    try {
      if (!schedule && !time) {
        console.error("Schedule is not defined.");
        return;
      }

      const newSchedule = await insertNewSchedule({
        schedule: schedule,
        time: time,
      });

      console.log(`New schedule inserted: ${newSchedule}`);
    } catch (error) {
      console.log("Error inserting new schedule:", error.message);
    }
  };
  // Format the selected date to a readable string
  const formattedDate = schedule ? schedule.toLocaleDateString() : "";
  const formattedTimes = time.map((t) => formatTimeWithoutTimezone(t));

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
        {time.map((time, index) => (
          <div key={index} className="flex space-x-2 mb-2 items-center">
            <Input
              type="time"
              value={time}
              onChange={(e) => handleChangeTime(index, e.target.value)}
              className="border rounded p-1 w-auto"
            />
            <Button
              variant="outline"
              onClick={() => handleRemoveTimeInput(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={handleAddTimeInput}>Add more time</Button>
        {schedule && (
          <div className="mt-4">Next mass will be on: {formattedDate}</div>
        )}
        {/* <p>{formattedTimes}</p> */}
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
