import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/app/utils/constants";

type UpdateBusRouteParams = {
  id: string;
  updatedData: {
    route: string;
    fee: number;
    noOfSeats: number;
    filledSeats: number;
    isAvailable: boolean;
    subRoutes: Array<{ stationName: string; stationFee: number }>;
  };
};

export const useUpdateBusRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: UpdateBusRouteParams) => {
      const response = await fetch(`${BASE_URL}/api/busRoutes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update bus route");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["busFees"] });
    },
  });
};
