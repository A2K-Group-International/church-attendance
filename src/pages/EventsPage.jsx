'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const eventItems = [
  {
    title: 'Event Title 1',
    content: 'This is a brief description of event 1.',
  },
  {
    title: 'Event Title 2',
    content: 'This is a brief description of event 2.',
  },
  {
    title: 'Event Title 3',
    content: 'This is a brief description of event 3.',
  },
  {
    title: 'Event Title 4',
    content: 'This is a brief description of event 4.',
  },
];

export default function EventsPage() {
  return (
    <Sidebar>
      <main className='p-4 lg:p-8'>
        <div>
          <h1 className='text-2xl font-bold'>Events</h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Latest updates and announcements about upcoming events at the
            church.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8'>
          {eventItems.map((item, index) => (
            <Card key={index} className='p-4 shadow-lg'>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.content}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Sidebar>
  );
}
