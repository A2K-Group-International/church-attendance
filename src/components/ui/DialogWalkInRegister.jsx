import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import FormLabel from "../ui/FormLabel";
import supabase from "../../utils/supabase";
import { fetchAllEvents } from "@/services/apiAuth";
import ReactInputMask from "react-input-mask";

export default function DialogWalkInRegister() {
  const [error, setError] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [guardianLastName, setGuardianLastName] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [children, setChildren] = useState([
    { firstName: "", lastName: "", telephone: "" },
  ]);
  const [eventName, setEventName] = useState([]);
  const [activeTab, setActiveTab] = useState("guardian");
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleNext = () => {
    if (!preferredTime) {
      setError("Please fill out all fields.");
    } else {
      setError("");
      setActiveTab("children");
    }
  };

  const handleAddChild = () => {
    setChildren([...children, { firstName: "", lastName: "", telephone: "" }]);
  };

  const handleRemoveChild = (index) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const handleChangeChild = (index, field, value) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
  };

  const handleGenerateRandomCode = () => {
    const randomNumber =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return randomNumber;
  };

  const handleSubmit = async () => {
    const hasEmptyChild = children.some(
      (child) => !child.firstName || !child.lastName || !child.telephone
    );

    if (
      !guardianFirstName ||
      !guardianLastName ||
      !preferredTime ||
      hasEmptyChild
    ) {
      setError("Please complete all fields.");
      return;
    }

    const parsedChildren = children.map((child) => ({
      ...child,
      telephone: parseInt(child.telephone, 10),
    }));

    if (parsedChildren.some((child) => isNaN(child.telephone))) {
      setError("Telephone must be a number.");
      return;
    }

    //Generate Unique Code to users for them to edit registration
    const randomCode = handleGenerateRandomCode();

    try {
      const { error: dataError } = await supabase
        .from("attendance_pending")
        .insert(
          parsedChildren.map((child) => ({
            guardian_first_name: guardianFirstName,
            guardian_last_name: guardianLastName,
            guardian_telephone: child.telephone,
            children_last_name: child.lastName,
            children_first_name: child.firstName,
            has_attended: false,
            attendance_code: randomCode,
            preferred_time: preferredTime,
            schedule_day: filteredMassSchedule,
            selected_event: selectedEvent,
          }))
        );

      if (dataError) throw dataError;

      setGuardianFirstName("");
      setGuardianLastName("");
      setPreferredTime("");
      setSelectedEvent("");
      setChildren([{ firstName: "", lastName: "", telephone: "" }]);
      setActiveTab("guardian");
      setError("");
      alert(`Registration successful! Please save your code: ${randomCode}`);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("There was an error submitting the form. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const events = await fetchAllEvents();
        if (events.length > 0) {
          setEventName(events);
          // setNextMassDate(events[0].schedule);
          // setMassTime(events[0].time);
        } else {
          setError("No schedule found.");
        }
      } catch (error) {
        setError("Failed to load schedule.", error);
      }
    };

    fetchSchedule();
  }, []);

  //check the time and day of the event
  const filteredMassTimes = eventName
    .filter((event) => event.name === selectedEvent)
    .flatMap((event) => event.time || []);

  const filteredMassSchedule = eventName
    .filter((event) => event.name === selectedEvent)
    .flatMap((event) => event.schedule);

  const date = new Date(filteredMassSchedule);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Walk-In Register
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md h-full lg:h-[44rem] no-scrollbar overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Register</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill up the forms for one-time registration
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="guardian" className="text-sm font-medium">
              Step 1
            </TabsTrigger>
            <TabsTrigger
              value="children"
              disabled={!preferredTime}
              className="text-sm font-medium"
            >
              Step 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guardian">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Registration
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Please provide your information and select your preferred time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormLabel>
                  <Label htmlFor="Event" className="text-sm font-medium">
                    Upcoming Events
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedEvent(value);
                      setPreferredTime("");
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventName.map((event, index) => (
                        <SelectItem key={index} value={event.name}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormLabel>
                <Label htmlFor="Schedule" className="text-sm font-medium">
                  {selectedEvent && <span>Schedule: {formattedDate}</span>}
                </Label>
                <FormLabel>
                  <Label
                    htmlFor="preferredtime"
                    className="text-sm font-medium"
                  >
                    Available Time
                  </Label>
                  <Select
                    onValueChange={(value) => setPreferredTime(value)}
                    value={preferredTime}
                    disabled={!selectedEvent}
                  >
                    <SelectTrigger className="mt-1 w-48">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMassTimes.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormLabel>
              </CardContent>
              <CardFooter className="flex-col">
                {error && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {error}
                  </p>
                )}
                <Button onClick={handleNext} className="w-full">
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="children">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Required Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Label htmlFor="lastName" className="text-md font-medium">
                  Add Parent/Carer
                </Label>
                <div className="flex flex-col md:flex-row gap-x-4">
                  <FormLabel>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={guardianLastName}
                      onChange={(e) => setGuardianLastName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </FormLabel>
                  <FormLabel>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={guardianFirstName}
                      onChange={(e) => setGuardianFirstName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </FormLabel>
                </div>
                {children.map((child, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        Add Child/Children
                        <span className="block text-black text-xs font-normal">
                          Please provide your child's information. You can add
                          multiple children
                        </span>
                      </h4>
                      <Button
                        type="button"
                        onClick={() => handleRemoveChild(index)}
                        disabled={children.length === 1}
                        size="sm"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormLabel>
                        <Label
                          htmlFor={`childrenLastName_${index}`}
                          className="text-sm font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id={`childrenLastName_${index}`}
                          type="text"
                          placeholder="Children's Last Name"
                          value={child.lastName}
                          onChange={(e) =>
                            handleChangeChild(index, "lastName", e.target.value)
                          }
                          className="mt-1"
                          required
                        />
                      </FormLabel>
                      <FormLabel>
                        <Label
                          htmlFor={`childrenFirstName_${index}`}
                          className="text-sm font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id={`childrenFirstName_${index}`}
                          type="text"
                          placeholder="Children's First Name"
                          value={child.firstName}
                          onChange={(e) =>
                            handleChangeChild(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                          className="mt-1"
                          required
                        />
                      </FormLabel>
                      <FormLabel>
                        <Label
                          htmlFor={`telephone_${index}`}
                          className="text-sm font-medium"
                        >
                          Telephone
                        </Label>
                        <Input
                          id={`telephone_${index}`}
                          type="number"
                          placeholder="Guardian's Telephone"
                          value={child.telephone}
                          onChange={(e) =>
                            handleChangeChild(
                              index,
                              "telephone",
                              e.target.value
                            )
                          }
                          className="mt-1"
                          required
                        />
                      </FormLabel>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddChild}
                  className="w-full"
                >
                  Add Another Child
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {error && (
          <p className="text-red-500 text-center md:text-end">{error}</p>
        )}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 items-center gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {activeTab === "children" && (
            <Button onClick={handleSubmit}>Submit Registration</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
