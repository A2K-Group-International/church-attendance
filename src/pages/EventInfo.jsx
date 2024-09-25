'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/ui/Sidebar';
import FamilyMembersDialog from '@/components/ui/FamilyMembersDialog'; // Import your dialog component
import { Button } from '@/components/ui/button';

export default function EventInfo() {
  const queryClient = useQueryClient();
  const selectedEvent = queryClient.getQueryData(['selectedEvent']); // Get selected event from query data
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const familyMembers = [
    // Sample family member data, replace this with your actual data
    {
      family_member_id: 1,
      family_first_name: 'John',
      family_last_name: 'Doe',
      family_type: 'Adult',
    },
    {
      family_member_id: 2,
      family_first_name: 'Jane',
      family_last_name: 'Doe',
      family_type: 'Child',
    },
    // Add more members as necessary
  ];

  if (!selectedEvent) {
    return <div>No event selected.</div>; // Handle case where no event is selected
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Sidebar>
      <div className='p-4 lg:p-8'>
        <Card className='shadow-md border rounded-lg'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold'>
              {selectedEvent.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for Event Image */}
            <img
              src='https://via.placeholder.com/600x400' // Placeholder image URL
              alt={selectedEvent.title}
              className='w-full h-48 object-cover rounded-md mb-4' // Styling for the image
            />
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <strong>Date:</strong>
                <p>{selectedEvent.date}</p>
              </div>
              <div className='flex flex-col'>
                <strong>Time:</strong>
                <p>{selectedEvent.time}</p>
              </div>
            </div>
            <div className='mt-4'>
              <strong>Description:</strong>
              <p>{selectedEvent.content}</p>
            </div>
            <div className='mt-6'>
              <Button
                onClick={handleDialogOpen}
                className='bg-blue-500 text-white'
              >
                Attend Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members Dialog */}
      <FamilyMembersDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        familyMembers={familyMembers} // Pass the family members data
        selectedEvent={selectedEvent} // Pass the selected event
      />
    </Sidebar>
  );
}
