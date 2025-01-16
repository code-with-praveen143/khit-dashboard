// pages/dashboard.js
import React from "react";
import BillingTable from "./components/billing-table";
import RevenueSummary from "./components/revenue-card";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Revenue Summary Section */}
      <section className="w-full">
        <RevenueSummary />
      </section>

      {/* Billing Table Section */}
      <section className="w-full">
        <BillingTable />
      </section>
    </div>
  );
}
