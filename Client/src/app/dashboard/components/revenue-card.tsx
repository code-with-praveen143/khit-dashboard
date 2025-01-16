"use client";
import { BASE_URL } from "@/app/utils/constants";
import React, { useState, useEffect } from "react";

const RevenueSummary = () => {
  const [role, setRole] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    total: 0,
    collegeFee: 0,
    busFee: 0,
    hostelFee: 0,
    tnpFee: 0,
  });
  const [studentData, setStudentData] = useState({
    totalFees: 0,
    paidFees: 0,
    dueFees: 0,
  });

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
        calculateTotals(data);
      } else {
        console.error("Error fetching payment history:", data.message);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const calculateTotals = (payments: any) => {
    const summary = {
      total: 0,
      collegeFee: 0,
      busFee: 0,
      hostelFee: 0,
      tnpFee: 0,
    };

    payments.forEach((payment: any) => {
      summary.total += payment.amount;
      if (payment.paymentType.toLowerCase().includes("college")) {
        summary.collegeFee += payment.amount;
      } else if (payment.paymentType.toLowerCase().includes("bus")) {
        summary.busFee += payment.amount;
      } else if (payment.paymentType.toLowerCase().includes("hostel")) {
        summary.hostelFee += payment.amount;
      } else if (payment.paymentType.toLowerCase().includes("tnp")) {
        summary.tnpFee += payment.amount;
      }
    });

    setTotals(summary);
  };

  const fetchStudentData = async () => {
    try {
      const id = sessionStorage.getItem("user_id");
      const response = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStudentData({
          totalFees: data.totalFees,
          paidFees: data.paidFees,
          dueFees: data.dueFees,
        });
      } else {
        console.error("Error fetching student data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "admin") {
      fetchPaymentHistory();
    } else if (storedRole === "student") {
      fetchStudentData();
    }
  }, []);

  const adminCards = [
    {
      title: "Total Revenue",
      amount: `₹ ${totals.total.toLocaleString()}`,
      icon: "📈",
      color: "bg-green-100",
    },
    {
      title: "College Fees",
      amount: `₹ ${totals.collegeFee.toLocaleString()}`,
      icon: "🏫",
      color: "bg-blue-100",
    },
    {
      title: "Bus Fees",
      amount: `₹ ${totals.busFee.toLocaleString()}`,
      icon: "🚌",
      color: "bg-orange-100",
    },
    {
      title: "Hostel Fees",
      amount: `₹ ${totals.hostelFee.toLocaleString()}`,
      icon: "🏢",
      color: "bg-indigo-100",
    },
  ];

  const studentStats = [
    {
      title: "Completed Courses",
      value: "24",
      icon: "🎓",
      color: "bg-green-100",

    },
    {
      title: "Average Grade",
      value: "A",
      icon: "📊",
      color: "bg-blue-100",
    },
    {
      title: "Attendance",
      value: "95%",
      icon: "📅",
      color: "bg-orange-100",
    },
    {
      title: "Total Fees Paid",
      value: `100000`,
      icon: "🏫",
      color: "bg-blue-100",
    }
  ];

  const cards = role === "admin" && adminCards;

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <h2 className="mb-6 text-2xl sm:text-3xl font-bold font-sans text-left text-primary">
        {role === "admin" ? "Revenue Summary" : "Fee Summary"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards && cards.map((card: any) => (
          <div
            key={card.title}
            className={`p-4 rounded-xl ${card.color} shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-center text-black font-bold`}
          >
            <div className="text-4xl mb-2">{card.icon}</div>
            <div className="text-center">
              <h3 className="text-sm sm:text-base font-medium">{card.title}</h3>
              <p className="text-lg sm:text-xl">{card.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {role === "student" && (
        <div className="mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentStats.map((stat) => (
              <div
                key={stat.title}
                className={`p-4 rounded-xl ${stat.color} shadow-md flex flex-col items-center justify-center text-black font-bold`}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-center">
                  <h4 className="text-sm sm:text-base font-medium">{stat.title}</h4>
                  <p className="text-lg sm:text-xl">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueSummary;
