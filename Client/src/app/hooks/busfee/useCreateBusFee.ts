// utils/busFeeAPI.ts
import { BusFee } from "@/app/@types/bus";
import { auth_token } from "@/app/@types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from '@/app/utils/constants';


export const useAddBusFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBusFee: Omit<BusFee, "_id">) => {
      const response = await fetch(`${BASE_URL}/api/busRoutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify(newBusFee),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["busFees"] });
    },
  });
};
