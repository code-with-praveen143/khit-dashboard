import { BASE_URL } from '@/app/utils/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteBusRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${BASE_URL}/api/busRoutes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete bus route');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['busFees'] });
    },
  });
};
