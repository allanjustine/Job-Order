import { format } from "date-fns";

export default function PreviewData({ data }: any) {
  const calculateLaborTotal = () => {
    return data?.job_requests.reduce(
      (sum: any, item: any) => sum + (item.cost || 0),
      0
    );
  };

  const calculatePartsTotal = () => {
    return data?.parts_requests.reduce(
      (sum: any, item: any) => sum + (item.sub_total_price || 0),
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
            <strong className="text-gray-700">Branch:</strong>{" "}
            {data?.customer?.user?.branch?.branch_name}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Customer Name:</strong>{" "}
            {data?.customer?.name}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Address:</strong>{" "}
            {data?.customer?.address}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Vehicle Model:</strong>{" "}
            {data?.vehicle_model}
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
            {data?.customer?.contact_number}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Mileage:</strong> {data?.mileage}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Date Sold:</strong>{" "}
            {format(data?.date_sold, "MMM dd, yyyy hh:mm a")}
          </p>
        </div>
      </div>

      {/* Type of Job */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="font-bold text-lg text-blue-800 mb-2">TYPE OF JOB</h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong className="text-gray-700">Repair Job Start:</strong>{" "}
            {format(data?.repair_job_start, "MMM dd, yyyy hh:mm a")}
          </p>
          <p>
            <strong className="text-gray-700">Repair Job End:</strong>{" "}
            {format(data?.repair_job_end, "MMM dd, yyyy hh:mm a")}
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
                data?.document.owner_toolkit
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.document.owner_toolkit ? "✓" : ""}
            </span>
            <span
              className={data?.document.owner_toolkit ? "" : "text-gray-500"}
            >
              Owner Tool Kit
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.document.owner_manual
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.document.owner_manual ? "✓" : ""}
            </span>
            <span
              className={data?.document.owner_manual ? "" : "text-gray-500"}
            >
              Owner Manual
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.document.warranty_guide_book
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.document.warranty_guide_book ? "✓" : ""}
            </span>
            <span
              className={
                data?.document.warranty_guide_book ? "" : "text-gray-500"
              }
            >
              Warranty Guide Book
            </span>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 ${
                data?.document.others ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {data?.document.others ? "✓" : ""}
            </span>
            <span className={data?.document.others ? "" : "text-gray-500"}>
              Others: {data?.document.others_text}
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
                data?.visual_check.dent ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {data?.visual_check.dent ? "✓" : ""}
            </span>
            <div>
              <span className={data?.visual_check.dent ? "" : "text-gray-500"}>
                Dent
              </span>
              {data?.visual_check.dent && (
                <p className="text-sm text-gray-600 mt-1">
                  {data?.visual_check.dent_notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visual_check.scratch
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.visual_check.scratch ? "✓" : ""}
            </span>
            <div>
              <span
                className={data?.visual_check.scratch ? "" : "text-gray-500"}
              >
                Scratch
              </span>
              {data?.visual_check.scratch && (
                <p className="text-sm text-gray-600 mt-1">
                  {data?.visual_check.scratch_notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visual_check.broken
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.visual_check.broken ? "✓" : ""}
            </span>
            <div>
              <span
                className={data?.visual_check.broken ? "" : "text-gray-500"}
              >
                Broken
              </span>
              {data?.visual_check.broken && (
                <p className="text-sm text-gray-600 mt-1">
                  {data?.visual_check.broken_notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <span
              className={`inline-block w-5 h-5 border text-center border-gray-400 mr-2 mt-1 flex-shrink-0 ${
                data?.visual_check.missing
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {data?.visual_check.missing ? "✓" : ""}
            </span>
            <div>
              <span
                className={data?.visual_check.missing ? "" : "text-gray-500"}
              >
                Missing
              </span>
              {data?.visual_check.missing && (
                <p className="text-sm text-gray-600 mt-1">
                  {data?.visual_check.missing_notes}
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
            {data?.job_requests.map((request: any, index: any) => (
              <tr key={index}>
                <td className="py-2 px-3 border border-gray-300">
                  {request.job_request}
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
            {data?.parts_requests.map((part: any, index: any) => (
              <tr key={index}>
                <td className="py-2 px-3 border border-gray-300">
                  {part.parts_name}
                </td>
                <td className="py-2 px-3 border border-gray-300">
                  {part.parts_number}
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
          <span>{data?.service_advisor}</span>
          <div className="h-2 border-b-2 border-black mt-2"></div>
          <p className="text-sm text-gray-600 mt-2">
            Service Advisor Name & Signature
          </p>
        </div>
        <div className="text-center">
          <span>{data?.branch_manager}</span>
          <div className="h-2 border-b-2 border-black mt-2"></div>
          <p className="text-sm text-gray-600 mt-2">BS / BM Name & Signature</p>
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
}
