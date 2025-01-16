import { StudentFee } from "@/app/@types/student"; // Replace with your actual type
import { auth_token } from "@/app/@types/data"; // Replace with your actual auth token
import { BASE_URL } from "@/app/utils/constants"; // Replace with your actual base URL
import { QueryClient, useQuery } from "@tanstack/react-query";

// Fetch function to get student fee records
async function fetchStudentFees(): Promise<StudentFee[]> {
  const response = await fetch(`${BASE_URL}/api/students`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Custom hook for fetching student fee records
export function useGetStudentFees() {
  return useQuery<StudentFee[], Error>({
    queryKey: ["studentFees"],
    queryFn: fetchStudentFees,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
}

// Initialize a QueryClient for the application
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});
