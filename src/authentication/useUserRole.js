import { useQuery } from '@tanstack/react-query';
import { getUserRole } from '@/services/apiAuth';

export function useUserRole() {
  const { isLoading, data: userRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: getUserRole,
  });

  return { isLoading, userRole };
}
