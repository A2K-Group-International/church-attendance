import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import FormLabel from "../components/ui/FormLabel";
import supabase from "../utils/supabase";

export default function Registration() {
  const [error, setError] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [guardianLastName, setGuardianLastName] = useState("");
  const [guardianTelephone, setGuardianTelephone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [children, setChildren] = useState([
    { firstName: "", lastName: "", age: "" },
  ]);

  const [activeTab, setActiveTab] = useState("guardian");

  // Check if Step 1 is complete
  const isStep1Complete =
    guardianLastName && guardianFirstName && preferredTime;

  const handleNext = () => {
    if (!isStep1Complete) {
      setError("Please fill out all required fields.");
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
      // Insert the data into Supabase
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

      // Clear form data and handle success
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

  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[400px]"
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
              <CardTitle>Guardian Registration</CardTitle>
              <CardDescription>Enter your information.</CardDescription>
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
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  required
                />
              </FormLabel>
              <Label htmlFor="preferredtime">Prefrered Time</Label>
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
            <CardFooter className="justify-between">
              <Button onClick={handleNext}>Next</Button>
              {error && <p className="text-red-500">{error}</p>}
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
                  <div className="flex space-x-2 items-center">
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
                          handleChangeChild(index, "firstName", e.target.value)
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
            <CardFooter>
              <Button onClick={handleSubmit}>Submit</Button>
              {error && <p className="text-red-500">{error}</p>}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
