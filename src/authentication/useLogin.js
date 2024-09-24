import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../services/apiAuth';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      console.log(user);
      queryClient.setQueriesData(['user'], user);
      navigate('/events-page'), { replace: true };
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return { login, isLoading, isError };
}
