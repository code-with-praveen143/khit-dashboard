"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/utils/constants";
import { PaymentRecord } from "@/app/@types/payment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BillingTable = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/payments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPayments(data.slice(0, 5)); // Display the first 5 records
      } else {
        console.error("Error fetching payment history:", data.message);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-primary">
        Recent Billing
      </h2>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Register Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Receipt No</TableHead>
              <TableHead>Fees Type</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Transaction Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, idx) => (
              <TableRow key={payment._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{payment.studentId}</TableCell>
                <TableCell>N/A</TableCell> {/* Replace with actual student name if available */}
                <TableCell>{payment._id}</TableCell>
                <TableCell>{payment.paymentType}</TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                <TableCell>₹ {payment.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-right">
        <Link href="/dashboard/payment-history">
          <span className="text-primary font-medium hover:underline">
            Show More Results
          </span>
        </Link>
      </div>
    </div>
  );
};

export default BillingTable;
