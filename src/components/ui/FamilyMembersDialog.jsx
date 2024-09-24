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

export default function FamilyMembersDialog({
  open,
  onClose,
  familyMembers,
  selectedEvent,
}) {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberChange = (memberId) => {
    setSelectedMembers(
      (prev) =>
        prev.includes(memberId)
          ? prev.filter((id) => id !== memberId) // Remove if already selected
          : [...prev, memberId] // Add to selected members
    );
  };

  const handleSubmit = () => {
    // Handle the submission of selected family members
    console.log('Selected Members for Event:', selectedMembers);
    console.log('Selected Event:', selectedEvent);
    onClose(); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Family Members for {selectedEvent?.title}
          </DialogTitle>
          <DialogDescription className='text-gray-800 text-sm mt-1'>
            <div className='font-bold'>
              Date: <span className='text-black'>{selectedEvent?.date}</span>
            </div>
            <div className='font-bold'>
              Time: <span className='text-black'>{selectedEvent?.time}</span>
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
