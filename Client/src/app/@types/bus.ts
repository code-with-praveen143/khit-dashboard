export interface SubRoute {
    stationName: any;
    stationFee: number;
  }
  
export interface BusFee {
    _id: string;
    route: string;
    fee: number;
    noOfSeats: number;
    filledSeats: number;
    isAvailable: boolean;
    subRoutes: SubRoute[];
  }
  
export interface UpdatedBusData {
  id: string;
  route: string;
  fee: number;
  noOfSeats: number;
  filledSeats: number;
  isAvailable: boolean;
  subRoutes: Array<{ stationName: string; stationFee: number }>;
};
export interface UpdateBusRouteParams  {
  id: string;
  updatedData: UpdatedBusData
};