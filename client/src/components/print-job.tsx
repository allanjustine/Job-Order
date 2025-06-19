"use client";

import { format } from "date-fns";

interface PrintJobOrderProps {
  data: {
    branch: string;
    customerName: string;
    address: string;
    vehicleModel: string;
    chassis: string;
    dealer: string;
    jobType: string;
    repairStart: string;
    repairEnd: string;
    date: string;
    contact: string;
    dateSold: string;
    mileage: string;
    documents: {
      ownerToolKit: boolean;
      ownerManual: boolean;
      warrantyGuideBook: boolean;
      others: boolean;
      othersText: string;
    };
    visualCheck: {
      dent: boolean;
      dentNotes: string;
      scratch: boolean;
      scratchNotes: string;
      broken: boolean;
      brokenNotes: string;
      missing: boolean;
      missingNotes: string;
    };
    jobRequests: {
      request: string;
      cost: number;
    }[];
    partsRequests: {
      name: string;
      partNo: string;
      quantity: number;
      price: number;
    }[];
    serviceAdvisor: string;
    branchManager: string;
  };
}

const PrintJobOrder = ({ data }: PrintJobOrderProps) => {
  // console.log(data);
  const calculateLaborTotal = () => {
    return data?.jobRequests.reduce((sum, item) => sum + (item.cost || 0), 0);
  };

  const calculatePartsTotal = () => {
    return data?.partsRequests.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    );
  };

  const calculateTotal = () => {
    return calculateLaborTotal() + calculatePartsTotal();
  };

  return (
    <div
      className="p-6 font-sans bg-white"
      style={{ fontSize: "12pt", maxWidth: "800px", margin: "0 auto" }}
    >
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-blue-800">SMCT</h1>
        <h2 className="text-xl font-semibold text-gray-700">
          SMCT GROUP OF COMPANIES
        </h2>
        <p className="text-sm text-gray-500 mt-1">JOB ORDER</p>
      </div>

      {/* Branch and Customer Info */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2">
            <strong className="text-gray-700">Branch:</strong> {data?.branch}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Customer Name:</strong>{" "}
            {data?.customerName}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Address:</strong> {data?.address}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Vehicle Model:</strong>{" "}
            {data?.vehicleModel}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Chassis/Engine #:</strong>{" "}
            {data?.chassis}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Dealer/Brand Purchase:</strong>{" "}
            {data?.dealer}
          </p>
        </div>
        <div>
          <p className="mb-2">
            <strong className="text-gray-700">Date:</strong>{" "}
            {format(data?.date, "MMM dd, yyyy hh:mm a")}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Contact #:</strong>{" "}
            {data?.contact}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Mileage:</strong> {data?.mileage}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Date Sold:</strong>{" "}
            {format(data?.dateSold, "MMM dd, yyyy hh:mm a")}
          </p>
        </div>
      </div>

      {/* Type of Job */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <strong className="font-bold text-md text-gray-700 mb-2">Type of Job:</strong> {data?.jobType}
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-700">Repair Job Start:</strong>{" "}
            {format(data?.repairStart, "MMM dd, yyyy hh:mm a")}
          </p>
          <p>
            <strong className="text-gray-700">Repair Job End:</strong>{" "}
            {format(data?.repairEnd, "MMM dd, yyyy hh:mm a")}
          </p>
        </div>
      </div>

      {/* Vehicle Documents/Tools */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="font-bold text-lg text-blue-800 mb-3">
          VEHICLE DOCUMENTS/TOOLS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.documents.ownerToolKit
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.documents.ownerToolKit ? "✓" : ""}
            </span>
            <span
              className={data?.documents.ownerToolKit ? "" : "text-gray-500"}
            >
              Owner Tool Kit
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.documents.ownerManual
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.documents.ownerManual ? "✓" : ""}
            </span>
            <span
              className={data?.documents.ownerManual ? "" : "text-gray-500"}
            >
              Owner Manual
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.documents.warrantyGuideBook
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.documents.warrantyGuideBook ? "✓" : ""}
            </span>
            <span
              className={
                data?.documents.warrantyGuideBook ? "" : "text-gray-500"
              }
            >
              Warranty Guide Book
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.documents.others ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {data?.documents.others ? "✓" : ""}
            </span>
            <span className={data?.documents.others ? "" : "text-gray-500"}>
              Others: {data?.documents.othersText}
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Visual Checking */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="font-bold text-lg text-blue-800 mb-3">
          VEHICLE VISUAL CHECKING
        </h3>
        <p className="text-sm text-gray-600 mb-3">Body Parts Per Any Damage</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visualCheck.dent ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {data?.visualCheck.dent ? "✓" : ""}
            </span>
            <div>
              <span className={data?.visualCheck.dent ? "" : "text-gray-500"}>
                Dent
              </span>
              {data?.visualCheck.dent && (
                <p className="text-sm text-gray-600 mt-1">
                  NOTE: {data?.visualCheck.dentNotes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visualCheck.scratch
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.visualCheck.scratch ? "✓" : ""}
            </span>
            <div>
              <span
                className={data?.visualCheck.scratch ? "" : "text-gray-500"}
              >
                Scratch
              </span>
              {data?.visualCheck.scratch && (
                <p className="text-sm text-gray-600 mt-1">
                  NOTE: {data?.visualCheck.scratchNotes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visualCheck.broken ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {data?.visualCheck.broken ? "✓" : ""}
            </span>
            <div>
              <span className={data?.visualCheck.broken ? "" : "text-gray-500"}>
                Broken
              </span>
              {data?.visualCheck.broken && (
                <p className="text-sm text-gray-600 mt-1">
                  NOTE: {data?.visualCheck.brokenNotes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visualCheck.missing
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.visualCheck.missing ? "✓" : ""}
            </span>
            <div>
              <span
                className={data?.visualCheck.missing ? "" : "text-gray-500"}
              >
                Missing
              </span>
              {data?.visualCheck.missing && (
                <p className="text-sm text-gray-600 mt-1">
                  NOTE: {data?.visualCheck.missingNotes}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Job Request */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-blue-800 mb-3">
          CUSTOMER JOB REQUEST
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-3 border border-gray-300">
                Description
              </th>
              <th className="text-right py-2 px-3 border border-gray-300">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.jobRequests.map((request, index) => (
              <tr key={index}>
                <td className="py-2 px-3 border border-gray-300">
                  {request.request}
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right">
                  {request.cost.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="py-2 px-3 border border-gray-300 font-bold">
                Labor Total:
              </td>
              <td className="py-2 px-3 border border-gray-300 text-right font-bold">
                {calculateLaborTotal().toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Parts & Lubricants Request */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-blue-800 mb-3">
          PARTS & LUBRICANTS REQUEST
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-2 px-3 border border-gray-300">
                Parts Name
              </th>
              <th className="text-left py-2 px-3 border border-gray-300">
                Part No.
              </th>
              <th className="text-right py-2 px-3 border border-gray-300">
                Qty
              </th>
              <th className="text-right py-2 px-3 border border-gray-300">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.partsRequests.map((part, index) => (
              <tr key={index}>
                <td className="py-2 px-3 border border-gray-300">
                  {part.name}
                </td>
                <td className="py-2 px-3 border border-gray-300">
                  {part.partNo}
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right">
                  {part.quantity}
                </td>
                <td className="py-2 px-3 border border-gray-300 text-right">
                  {part.price.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td
                colSpan={3}
                className="py-2 px-3 border border-gray-300 font-bold"
              >
                Part/Lub. Total:
              </td>
              <td className="py-2 px-3 border border-gray-300 text-right font-bold">
                {calculatePartsTotal().toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="mb-6 p-4 bg-blue-50 rounded text-right">
        <h3 className="font-bold text-xl text-blue-800">
          TOTAL AMOUNT:{" "}
          {calculateTotal().toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          })}
        </h3>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-6 mt-10">
        <div className="text-center">
          <span>{data?.serviceAdvisor}</span>
          <div className="h-2 border-b-2 border-black mt-2"></div>
          <p className="text-sm text-gray-600 mt-2">
            Service Advisor Name & Signature
          </p>
        </div>
        <div className="text-center">
          <span>{data?.branchManager}</span>
          <div className="h-2 border-b-2 border-black mt-2"></div>
          <p className="text-sm text-gray-600 mt-2">BA / KB Name & Signature</p>
        </div>
        <div className="text-center">
          <span className="opacity-0">Customer</span>
          <div className="h-2 border-b-2 border-black mt-2"></div>
          <p className="text-sm text-gray-600 mt-2">CUSTOMER SIGNATURE</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        <p>
          Customer acknowledges that the above work request has been approved
          and authorizes SMC7 to perform the necessary services. Any additional
          work required will be communicated for approval prior to completion.
        </p>
        <p className="mt-2">
          Printed on: {format(new Date(), "MMMM dd, yyyy hh:mm a")}
        </p>
      </div>
    </div>
  );
};

export default PrintJobOrder;
