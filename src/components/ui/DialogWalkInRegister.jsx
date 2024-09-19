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
    preferredTime && guardianFirstName && guardianLastName && guardianTelephone;

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
          setNextMassDate(latestSchedule[0].schedule);
        } else {
          setError("No schedule found.");
        }
      } catch (error) {
        setError("Failed to load schedule.", error);
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
        <Button variant="outline" className="w-full">
          Walk-In Register
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md h-full lg:h-[42rem] no-scrollbar overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Register</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill up the forms for one-time registration
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <Label className="text-sm font-medium">
            Next mass will be on:{" "}
            <span className="font-semibold">{formattedDate}</span>
          </Label>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="guardian" className="text-sm font-medium">
              Step 1: Guardian
            </TabsTrigger>
            <TabsTrigger
              value="children"
              disabled={!isStep1Complete}
              className="text-sm font-medium"
            >
              Step 2: Children
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guardian">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Parent Registration
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Please provide your information and select your preferred time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-x-4">
                  <FormLabel>
                    <Label htmlFor="lastName" className="text-sm font-medium">
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
                  <FormLabel>
                    <Label htmlFor="telephone" className="text-sm font-medium">
                      Telephone
                    </Label>
                    <Input
                      id="telephone"
                      type="number"
                      value={guardianTelephone}
                      onChange={(e) => setGuardianTelephone(e.target.value)}
                      placeholder="123-456-7890"
                      required
                      className="mt-1"
                    />
                  </FormLabel>
                </div>
                <FormLabel>
                  <Label
                    htmlFor="preferredtime"
                    className="text-sm font-medium"
                  >
                    Preferred Time
                  </Label>
                  <Select
                    onValueChange={(value) => setPreferredTime(value)}
                    value={preferredTime}
                  >
                    <SelectTrigger className="mt-1 w-48">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00am">9:00 AM</SelectItem>
                      <SelectItem value="11:00am">11:00 AM</SelectItem>
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
                  Children Information
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Please provide your child's information. You can add multiple
                  children.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {children.map((child, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        Child {index + 1}
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
                          htmlFor={`age_${index}`}
                          className="text-sm font-medium"
                        >
                          Age
                        </Label>
                        <Input
                          id={`age_${index}`}
                          type="number"
                          value={child.age}
                          onChange={(e) =>
                            handleChangeChild(index, "age", e.target.value)
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
          <p className="text-red-500 text-center md:text-end">
            Please fill all the fields
          </p>
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
