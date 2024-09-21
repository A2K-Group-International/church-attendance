import { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabase';
import Sidebar from '@/components/ui/Sidebar';
import Table from '../layout/Table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

const headers = ['#', 'Email', 'Name', 'Registered', 'Action'];

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null); // To track the user selected for confirmation
  const [isDialogOpen, setIsDialogOpen] = useState(false); // To control the confirmation dialog state
  const [signUpLoading, setSignUpLoading] = useState(false); // Loading state for sign-up
  const itemsPerPage = 7;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = supabase
        .from('account_pending')
        .select('*', { count: 'exact' })
        .range(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage - 1
        );

      const { data: fetchedData, error, count } = await query;

      if (error) throw error;

      setTotalPages(Math.ceil(count / itemsPerPage));
      setData(fetchedData);
      console.log(fetchedData);
    } catch (error) {
      setError('Error fetching users. Please try again.');
      console.error('Error in fetchData function:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [currentPage, fetchData]);

  const signUp = async (email, password, userData) => {
    setSignUpLoading(true); // Set loading to true when sign-up starts
    try {
      const { data: user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      // Add user details to `user_list`
      const { error: insertError } = await supabase.from('user_list').insert([
        {
          user_uuid: user.user.id, // Foreign key to auth id
          user_name: userData.name, // Name from the pending account
          user_role: 'user', // Set the user role, you can adjust this accordingly
          user_email: email,
          user_password: password, // Note: Store passwords securely in a real app
          user_contact: userData.contact, // Contact from the pending account
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      // Update `account_pending` to set `registered` to true
      const { error: updateError } = await supabase
        .from('account_pending')
        .update({ registered: true })
        .eq('id', userData.id); // Use the correct identifier (e.g., `id`) to update the specific record

      if (updateError) {
        throw updateError;
      }

      // Re-fetch data to reflect the updated table
      fetchData();

      return user;
    } catch (error) {
      console.error('Error during sign-up:', error);
    } finally {
      setSignUpLoading(false); // Set loading to false after sign-up completes
    }
  };

  const handleApproveAccount = async (userData) => {
    await signUp(userData.email, userData.password, userData);
    setIsDialogOpen(false); // Close the dialog after approving
  };

  const handleApproveClick = (userData) => {
    setSelectedUser(userData); // Set the selected user to be approved
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const confirmApprove = () => {
    if (selectedUser) {
      handleApproveAccount(selectedUser);
    }
  };

  const rows = data.map((item, index) => [
    index + 1 + (currentPage - 1) * itemsPerPage,
    item.email,
    item.name,
    item.registered ? 'Yes' : 'No', // Display 'Yes' or 'No' based on the `registered` status
    <Button
      key={item.id}
      onClick={() => handleApproveClick(item)} // Trigger the confirmation dialog
      variant='primary'
      disabled={item.registered || signUpLoading} // Disable button if user is already registered or signup is loading
    >
      {signUpLoading && selectedUser?.id === item.id
        ? 'Registering...'
        : item.registered
        ? 'Registered'
        : 'Approve Account'}
    </Button>,
  ]);

  return (
    <Sidebar>
      <main className='p-4 lg:p-8 max-w-7xl mx-auto'>
        <h1 className='text-2xl font-bold'>Users</h1>
        <div className='bg-card rounded-lg shadow mt-4'>
          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
              <p className='mt-4 text-muted-foreground'>Loading users...</p>
            </div>
          ) : error ? (
            <div className='p-8 text-center'>
              <p className='text-destructive'>{error}</p>
            </div>
          ) : data.length > 0 ? (
            <>
              <Table headers={headers} rows={rows} />
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href='#'
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage((prev) => prev + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className='p-8 text-center'>
              <p className='text-muted-foreground'>No users found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Inline Confirmation Dialog */}
      {isDialogOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white rounded-lg shadow-lg w-96 p-6'>
            <h2 className='text-lg font-bold'>Approve Account</h2>
            <p className='mt-2'>
              Are you sure you want to approve the account for{' '}
              <strong>{selectedUser?.name}</strong>?
            </p>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button
                variant='secondary'
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                onClick={confirmApprove}
                disabled={signUpLoading} // Disable button during loading
              >
                {signUpLoading ? 'Registering...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
