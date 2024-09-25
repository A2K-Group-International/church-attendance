import { Link } from 'react-router-dom';
import Logout from '../../authentication/Logout';

export default function UserSidebar() {
  return (
    <div className='flex h-screen w-full'>
      <div className='hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:bg-gray-100 dark:lg:bg-gray-800'>
        <div className='flex h-full flex-col justify-between py-6 px-4'>
          <div className='space-y-6'>
            <Link to='#' className='flex items-center gap-2 font-bold'>
              <span className='text-xl'>User Dashboard</span>
            </Link>
            <nav className='space-y-1'>
              <Link
                to='/events'
                className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50'
              >
                <EventIcon className='h-5 w-5' />
                Events
              </Link>
              <Link
                to='/family'
                className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50'
              >
                <FamilyIcon className='h-5 w-5' />
                Family
              </Link>
            </nav>
          </div>
          <div className='space-y-4'>
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components for Events and Family

function EventIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M21 4h-18a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM12 16l4-4m-4 4l-4-4' />
    </svg>
  );
}

function FamilyIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 1C9.79 1 8 2.79 8 5s1.79 4 4 4 4-1.79 4-4S14.21 1 12 1zm0 18c-4.97 0-9 4.03-9 9v2h18v-2c0-4.97-4.03-9-9-9z' />
    </svg>
  );
}
