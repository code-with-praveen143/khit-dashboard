'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { BASE_URL } from '@/app/utils/constants';
import { Toaster } from '@/components/ui/toaster';

type FeeDetails = {
  total: number;
  paid: number;
  due: number;
};

type FeesStructure = {
  [feeType: string]: {
    [year: number]: FeeDetails;
  };
};

const FeeDetailsUI = () => {
  const [fees, setFees] = useState<FeesStructure>({
    'College Fee': {
      1: { total: 10000, paid: 7000, due: 3000 },
      2: { total: 11000, paid: 8000, due: 3000 },
      3: { total: 12000, paid: 9000, due: 3000 },
      4: { total: 13000, paid: 10000, due: 3000 },
    },
    'Hostel Fee': {
      1: { total: 8000, paid: 5000, due: 3000 },
      2: { total: 8500, paid: 6000, due: 2500 },
      3: { total: 9000, paid: 7000, due: 2000 },
      4: { total: 9500, paid: 8000, due: 1500 },
    },
    'Bus Fee': {
      1: { total: 5000, paid: 4000, due: 1000 },
      2: { total: 5500, paid: 4500, due: 1000 },
      3: { total: 6000, paid: 5000, due: 1000 },
      4: { total: 6500, paid: 5500, due: 1000 },
    },
  });

  const [dropdownState, setDropdownState] = useState<{
    feeType: string | null;
    year: number | null;
  }>({ feeType: null, year: null });

  const [customAmount, setCustomAmount] = useState<number | null>(null);

  const { toast } = useToast()
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : null;

  const handleCustomPayment = async (feeType: string, year: number) => {
    if (!customAmount || customAmount <= 0) {
      toast({
        title: "Scheduled: Catch up",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
      return;
    }

    try {
      const payload = {
        studentId: userId,
        amount: customAmount,
        gatewayName: 'ICICI Eazypay',
        transactionId: `TXN_${Date.now()}`,
        yearSem: `${year} Year`,
        paymentType: feeType,
      };

      const response = await fetch(`${BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        })      
        const updatedFees = { ...fees };
        updatedFees[feeType][year].paid += customAmount;
        updatedFees[feeType][year].due -= customAmount;
        setFees(updatedFees);
        setDropdownState({ feeType: null, year: null });
        setCustomAmount(null);
      } else {
        toast({
          title: "Error!",
          description: data.message || "Failed to process payment",
          variant: "destructive",
          className: "bg-red-500 text-white",
        })
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error!",
        description: "An error occurred while processing payment",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {Object.entries(fees).map(([feeType, years]) => (
        <Card key={feeType}>
          <CardHeader>
            <CardTitle>{feeType}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Year</th>
                    <th className="border border-gray-300 px-4 py-2">Total</th>
                    <th className="border border-gray-300 px-4 py-2">Paid</th>
                    <th className="border border-gray-300 px-4 py-2">Due</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(years).map(([year, details]) => (
                    <tr key={year} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-center">{`${year} Year`}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">₹{details.total}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">₹{details.paid}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">₹{details.due}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <Button
                          onClick={() =>
                            setDropdownState(
                              dropdownState.feeType === feeType && dropdownState.year === Number(year)
                                ? { feeType: null, year: null }
                                : { feeType, year: Number(year) }
                            )
                          }
                        >
                          Pay
                        </Button>
                        {dropdownState.feeType === feeType && dropdownState.year === Number(year) && (
                          <div className="mt-2">
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              value={customAmount || ''}
                              onChange={(e) => setCustomAmount(Number(e.target.value))}
                              className="mb-2"
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleCustomPayment(feeType, Number(year))}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setDropdownState({ feeType: null, year: null });
                                  setCustomAmount(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
      <Toaster />
    </div>
  );
};

export default FeeDetailsUI;
