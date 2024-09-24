import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../services/apiAuth'; // Assuming this handles authentication
import supabase from '../utils/supabase'; // Make sure to import your Supabase client
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      const { user } = await loginApi({ email, password });
      return user;
    },
    onSuccess: async (user) => {
      queryClient.setQueriesData(['user'], user);

      const { data: userData, error: userError } = await supabase
        .from('user_list')
        .select('user_role,user_id')
        .eq('user_uuid', user.id)
        .single();

      if (userError || !userData) {
        console.error(userError?.message || 'Could not fetch user data.');
        return;
      }

      // Store user data in query cache
      queryClient.setQueryData(['userData'], userData); // Save userData in cache

      // Check user_role and navigate accordingly
      if (userData.user_role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/events-page', { replace: true });
      }
    },
    onError: (err) => {
      console.log('Login error:', err.message);
    },
  });

  return { login, isLoading, isError };
}
