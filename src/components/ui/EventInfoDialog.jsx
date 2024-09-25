import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function EventInfoDialog({
  open,
  onClose,
  event,
  familyMembers = [], // Default to an empty array if not provided
}) {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberChange = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = () => {
    console.log('Selected Members for Event:', selectedMembers);
    console.log('Selected Event:', event);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] p-6'>
        <img
          src='https://via.placeholder.com/400x200' // Replace with your image URL
          alt='Event Placeholder'
          className='w-full rounded-lg mb-4'
        />
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            {event?.title}
          </DialogTitle>
          <DialogDescription className='text-gray-800 text-sm mt-1'>
            <div className='font-bold'>
              Date: <span className='text-black'>{event?.date}</span>
            </div>
            <div className='font-bold'>
              Time: <span className='text-black'>{event?.time}</span>
            </div>
            {/* Add more detailed event information here */}
            <div className='mt-2'>
              <p className='font-bold'>Location:</p>
              <p>{event?.location}</p> {/* Add location info if available */}
            </div>
            <div className='mt-2'>
              <p className='font-bold'>Description:</p>
              <p>{event?.description}</p>{' '}
              {/* Add description info if available */}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 mt-4'>
          {familyMembers.map((member) => (
            <div key={member.family_member_id} className='flex items-center'>
              <input
                type='checkbox'
                id={`member-${member.family_member_id}`}
                checked={selectedMembers.includes(member.family_member_id)}
                onChange={() => handleMemberChange(member.family_member_id)}
                className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <label
                htmlFor={`member-${member.family_member_id}`}
                className='ml-2 text-sm'
              >
                {member.family_first_name} {member.family_last_name} (Type:{' '}
                {member.family_type})
              </label>
            </div>
          ))}
        </div>
        <DialogFooter className='mt-6'>
          <DialogClose asChild>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} className='ml-2'>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
