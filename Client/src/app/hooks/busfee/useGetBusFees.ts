import { BusFee } from "@/app/@types/bus";
import { auth_token } from "@/app/@types/data";
import { BASE_URL } from "@/app/utils/constants";
import { QueryClient, useQuery } from "@tanstack/react-query";

async function fetchBusFees(): Promise<BusFee[]> {
    const response = await fetch(`${BASE_URL}/api/busRoutes`, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }
  
  export function useGetBusFees() {
    return useQuery<BusFee[], Error>({
      queryKey: ['busFees'],
      queryFn: fetchBusFees,
      staleTime: 5 * 60 * 1000, 
    })
  }
  
  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  }) 