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
import { fetchLatestSchedule } from "@/services/apiAuth";

export default function DialogWalkInRegister() {
  const [error, setError] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [guardianLastName, setGuardianLastName] = useState("");
  const [guardianTelephone, setGuardianTelephone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [children, setChildren] = useState([
    { firstName: "", lastName: "", age: "" },
  ]);
  const [nextMassDate, setNextMassDate] = useState("");
  const [activeTab, setActiveTab] = useState("guardian");

  const isStep1Complete =
    guardianLastName && guardianFirstName && preferredTime;

  const handleNext = () => {
    if (!isStep1Complete) {
      setError("Please fill out all fields.");
    } else {
      setError("");
      setActiveTab("children");
    }
  };

  const handleAddChild = () => {
    setChildren([...children, { firstName: "", lastName: "", age: "" }]);
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

  const handleSubmit = async () => {
    const trimmedGuardianTelephone = guardianTelephone.trim();
    const hasEmptyChild = children.some(
      (child) => !child.firstName || !child.lastName || !child.age
    );

    if (
      !guardianFirstName ||
      !guardianLastName ||
      !trimmedGuardianTelephone ||
      !preferredTime ||
      hasEmptyChild
    ) {
      setError("Please complete all fields.");
      return;
    }

    const parsedChildren = children.map((child) => ({
      ...child,
      age: parseInt(child.age, 10),
    }));

    if (parsedChildren.some((child) => isNaN(child.age))) {
      setError("Age must be a number.");
      return;
    }

    try {
      const { error: dataError } = await supabase
        .from("attendance_pending")
        .insert(
          parsedChildren.map((child) => ({
            guardian_first_name: guardianFirstName,
            guardian_last_name: guardianLastName,
            guardian_telephone: trimmedGuardianTelephone,
            children_last_name: child.lastName,
            children_first_name: child.firstName,
            children_age: child.age,
            has_attended: false,
            preferred_time: preferredTime,
          }))
        );

      if (dataError) throw dataError;

      setGuardianFirstName("");
      setGuardianLastName("");
      setGuardianTelephone("");
      setPreferredTime("");
      setChildren([{ firstName: "", lastName: "", age: "" }]);
      setActiveTab("guardian");
      setError("");
      alert("Registration successful!");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("There was an error submitting the form. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const latestSchedule = await fetchLatestSchedule();
        if (latestSchedule.length > 0) {
          setNextMassDate(latestSchedule[0].schedule); // Access the first item in the array
        } else {
          setError("No schedule found.");
        }
      } catch (error) {
        setError("Failed to load schedule.");
      }
    };
  
    fetchSchedule();
  }, []);
  
  const formattedDate = nextMassDate
    ? new Date(nextMassDate).toLocaleDateString()
    : "Loading...";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Walk-In Register</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Fill up the forms for one-time registration
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Next mass will be on: {formattedDate}</Label>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guardian">Step 1</TabsTrigger>
            <TabsTrigger value="children" disabled={!isStep1Complete}>
              Step 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guardian">
            <Card>
              <CardHeader>
                <CardTitle>Parent Registration</CardTitle>
                <CardDescription>
                  Please select your preferred time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormLabel>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={guardianLastName}
                    onChange={(e) => setGuardianLastName(e.target.value)}
                    required
                  />
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={guardianFirstName}
                    onChange={(e) => setGuardianFirstName(e.target.value)}
                    required
                  />
                  <Label htmlFor="telephone">Telephone</Label>
                  <Input
                    id="telephone"
                    type="number"
                    value={guardianTelephone}
                    onChange={(e) => setGuardianTelephone(e.target.value)}
                    placeholder="123-45-678"
                    required
                  />
                </FormLabel>
                <Label htmlFor="preferredtime">Preferred Time</Label>
                <Select
                  onValueChange={(value) => setPreferredTime(value)}
                  value={preferredTime}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00am">9:00 AM</SelectItem>
                    <SelectItem value="11:00am">11:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter className="flex-col justify-start items-start md:flex-row md:justify-between">
                <Button onClick={handleNext}>Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="children">
            <Card>
              <CardHeader>
                <CardTitle>Children Information</CardTitle>
                <CardDescription>
                  Please insert your child's information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {children.map((child, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex flex-col space-x-2 items-start md:flex-row md:items-end">
                      <Button
                        type="button"
                        onClick={() => handleRemoveChild(index)}
                        disabled={children.length === 1}
                      >
                        -
                      </Button>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`childrenLastName_${index}`}>
                          Last Name
                        </Label>
                        <Input
                          id={`childrenLastName_${index}`}
                          type="text"
                          value={child.lastName}
                          onChange={(e) =>
                            handleChangeChild(index, "lastName", e.target.value)
                          }
                          className="max-w-full"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`childrenFirstName_${index}`}>
                          First Name
                        </Label>
                        <Input
                          id={`childrenFirstName_${index}`}
                          type="text"
                          value={child.firstName}
                          onChange={(e) =>
                            handleChangeChild(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`age_${index}`}>Age</Label>
                        <Input
                          id={`age_${index}`}
                          type="number"
                          value={child.age}
                          onChange={(e) =>
                            handleChangeChild(index, "age", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={handleAddChild}>
                  +
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          {activeTab === "children" && (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
