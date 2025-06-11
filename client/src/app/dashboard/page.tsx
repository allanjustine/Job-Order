import React from "react";
import { Search } from "lucide-react";

const data = {
  totalReceiptPrints: 0,
  todaysPrints: 0,
  weeklyPrints: 0,
  monthlyPrints: 0,
  totalBranchPrintedRecords: 0,
  totalCashSales: 0,
  totalCustomerPayments: 0,
  totalSales: 0,
};

const Dashboard = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Receipt Prints", value: data.totalReceiptPrints },
          { label: "Today's Prints", value: data.todaysPrints },
          { label: "Weekly Prints", value: data.weeklyPrints },
          { label: "Monthly Prints", value: data.monthlyPrints },
          { label: "Branch Printed Records", value: data.totalBranchPrintedRecords },
          { label: "Cash Sales/Invoices", value: data.totalCashSales },
          { label: "Customer Payments", value: data.totalCustomerPayments },
          { label: "Total Sales", value: `₱${data.totalSales.toLocaleString()}` },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white mt-10 p-6 rounded-2xl shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Print Jobs</h2>
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">External ID</th>
                <th className="px-4 py-3">Print Count</th>
                <th className="px-4 py-3">Print By</th>
                <th className="px-4 py-3">Can Re-Print</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((id) => (
                <tr key={id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{id}</td>
                  <td className="px-4 py-3">INV-XXX-{id}</td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">Branch {id}</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">₱0.00</td>
                  <td className="px-4 py-3">Apr 24, 2025 - 5:30 AM</td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-blue-600 transition">Edit</button>
                    <button className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-lg hover:bg-red-600 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
