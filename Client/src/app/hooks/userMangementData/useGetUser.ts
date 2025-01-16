import { useQuery, QueryClient } from '@tanstack/react-query'
import { BASE_URL } from '@/app/utils/constants';

export type UserRole = 'admin' | 'accountant' | 'student'

export interface User {
  role: UserRole
  _id?: string
  serialNo: string
  staffCode: string
  name: string
  email: string
}

async function fetchUser(): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
    }
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export function useGetUser() {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
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


