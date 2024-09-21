"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "@/components/ui/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Church Attendance Bar Chart";

// Church attendance data for adults and children at events
const chartData = [
  { month: "January", adults: 186, children: 80 },
  { month: "February", adults: 305, children: 200 },
  { month: "March", adults: 237, children: 120 },
  { month: "April", adults: 73, children: 190 },
  { month: "May", adults: 209, children: 130 },
  { month: "June", adults: 214, children: 140 },
];

// Chart configuration
const chartConfig = {
  adults: {
    label: "Adults",
    color: "hsl(var(--chart-1))",
  },
  children: {
    label: "Children",
    color: "hsl(var(--chart-2))",
  },
};

export default function ChurchAttendanceDashboard() {
  return (
    <Sidebar>
      <main className="p-4 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold">Church Attendance Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monthly attendance data for church.
          </p>
        </div>

        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
          <Card>
            <CardHeader>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
                    <Legend />
                    <Bar dataKey="adults" fill={chartConfig.adults.color} name={chartConfig.adults.label} />
                    <Bar dataKey="children" fill={chartConfig.children.color} name={chartConfig.children.label} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total attendance for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </Sidebar>
  );
}
