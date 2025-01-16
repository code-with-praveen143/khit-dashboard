"use client";

import { useState } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddBusFee } from "@/app/hooks/busfee/useCreateBusFee";
import { useGetBusFees } from "@/app/hooks/busfee/useGetBusFees";
import { useUpdateBusRoute } from "@/app/hooks/busfee/useUpdateBusFee";
import { useDeleteBusRoute } from "@/app/hooks/busfee/useDeleteBusFee";
import { BusFee, SubRoute } from "@/app/@types/bus";

export default function FeeStructure() {
  const [isOpen, setIsOpen] = useState(false);
  const [subRouteModal, setSubRouteModal] = useState<SubRoute[] | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [newRoute, setNewRoute] = useState("");
  const [newFee, setNewFee] = useState("");
  const [noOfSeats, setNoOfSeats] = useState("");
  const [filledSeats, setFilledSeats] = useState("0");
  const [subRoutes, setSubRoutes] = useState<SubRoute[]>([
    { stationName: "", stationFee: 0 },
  ]);

  const { data: busFees } = useGetBusFees();
  const addBusFeeMutation = useAddBusFee();
  const updateBusRouteMutation = useUpdateBusRoute();
  const deleteBusRouteMutation = useDeleteBusRoute();

  const handleSubRouteChange = (
    index: number,
    key: keyof SubRoute,
    value: string | number
  ) => {
    const updatedSubRoutes = [...subRoutes];
    updatedSubRoutes[index] = {
      ...updatedSubRoutes[index],
      [key]: key === "stationFee" ? Number(value) : value,
    };
    setSubRoutes(updatedSubRoutes);
  };

  const addSubRoute = () => {
    setSubRoutes([...subRoutes, { stationName: "", stationFee: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const busData = {
      route: newRoute,
      fee: Number(newFee),
      noOfSeats: Number(noOfSeats),
      filledSeats: Number(filledSeats),
      subRoutes: subRoutes.filter(
        (subRoute) => subRoute.stationName && subRoute.stationFee
      ),
      isAvailable: true,
    };
  
    if (editMode && editingBusId) {
      updateBusRouteMutation.mutate(
        { id: editingBusId, updatedData: busData },
        {
          onSuccess: () => {
            resetForm();
            setIsOpen(false);
          },
        }
      );
    } else {
      addBusFeeMutation.mutate(busData, {
        onSuccess: () => {
          resetForm();
          setIsOpen(false);
        },
      });
    }
  };
  

  const handleEdit = (busfee: BusFee) => {
    setEditMode(true);
    setEditingBusId(busfee._id);
    setNewRoute(busfee.route);
    setNewFee(busfee.fee.toString());
    setNoOfSeats(busfee.noOfSeats.toString());
    setFilledSeats(busfee.filledSeats.toString());
    setSubRoutes(busfee.subRoutes || [{ stationName: "", stationFee: 0 }]);
    setIsOpen(true);
  };
  
  const resetForm = () => {
    setNewRoute("");
    setNewFee("");
    setNoOfSeats("");
    setFilledSeats("0");
    setSubRoutes([{ stationName: "", stationFee: 0 }]);
    setEditMode(false);
    setEditingBusId(null);
  };
  

  const handleDelete = (id: any) => {
    if (window.confirm("Are you sure you want to delete this bus route?")) {
      deleteBusRouteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-primary">Bus Fee Structure</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#22a140] hover:bg-[#64ca61]"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Fee Structure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Edit Bus Fee" : "Add New Bus Fee"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="route">Bus Route</Label>
                  <Input
                    id="route"
                    value={newRoute}
                    onChange={(e) => setNewRoute(e.target.value)}
                    placeholder="Enter bus route"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noOfSeats">Number of Seats</Label>
                  <Input
                    id="noOfSeats"
                    type="number"
                    value={noOfSeats}
                    onChange={(e) => setNoOfSeats(e.target.value)}
                    placeholder="Enter total number of seats"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filledSeats">Filled Seats</Label>
                  <Input
                    id="filledSeats"
                    type="number"
                    value={filledSeats}
                    onChange={(e) => setFilledSeats(e.target.value)}
                    placeholder="Enter filled seats (default 0)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sub-Routes</Label>
                  <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-[#47B5B6] scrollbar-track-gray-200">
                    {subRoutes.map((subRoute, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={subRoute.stationName}
                          onChange={(e) =>
                            handleSubRouteChange(
                              index,
                              "stationName",
                              e.target.value
                            )
                          }
                          placeholder="Station Name"
                          required
                        />
                        <Input
                          type="number"
                          value={subRoute.stationFee.toString()}
                          onChange={(e) =>
                            handleSubRouteChange(
                              index,
                              "stationFee",
                              e.target.value
                            )
                          }
                          placeholder="Station Fee"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={addSubRoute}
                    className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-sm text-black"
                  >
                    Add Sub-Route
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    addBusFeeMutation.isPending || updateBusRouteMutation.isPending
                  }
                >
                  {addBusFeeMutation.isPending || updateBusRouteMutation.isPending
                    ? "Saving..."
                    : editMode
                    ? "Save Changes"
                    : "Add Fee"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#47B5B6] scrollbar-track-gray-200">
          <Table className="min-w-full">
            <TableHeader className="hover:bg-black">
              <TableRow className="bg-[#76946A]">
                <TableHead className="text-white w-24">S.No</TableHead>
                <TableHead className="text-white">Bus Routes</TableHead>
                <TableHead className="text-white">No of Seats</TableHead>
                <TableHead className="text-white">Available Seats</TableHead>
                <TableHead className="text-white text-right">Fee</TableHead>
                <TableHead className="text-white text-right">Sub-Routes</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {busFees?.map((busfee, index) => (
                <TableRow key={busfee._id} className="transition">
                  <TableCell className="font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>{busfee.route}</TableCell>
                  <TableCell>{busfee.noOfSeats}</TableCell>
                  <TableCell>{busfee.noOfSeats - busfee.filledSeats}</TableCell>
                  <TableCell className="text-right">₹{busfee.fee}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => setSubRouteModal(busfee.subRoutes)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => handleEdit(busfee)}
                        variant="ghost"
                        size="icon"
                      >
                        <Pencil className="text-green-500 w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(busfee._id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash className="text-red-500 w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {subRouteModal && (
        <Dialog
          open={Boolean(subRouteModal)}
          onOpenChange={() => setSubRouteModal(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sub-Routes</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {subRouteModal.map((subRoute, index) => (
                <div key={index} className="flex justify-between">
                  <span>{subRoute.stationName}</span>
                  <span>₹{subRoute.stationFee}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
