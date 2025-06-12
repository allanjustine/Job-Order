import { FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import Button from "./ui/button";
import Input from "./ui/input";

export default function CustomersJobRequest({
  jobRequests,
  addJobRequest,
  updateJobRequest,
  deleteJobRequest,
  removeAllJobRequest,
  laborTotal,
}: any) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold text-blue-700">
          CUSTOMER JOB REQUEST
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Customer Request
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Cost
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobRequests.map((request: any, index: any) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <Input
                    type="text"
                    value={request.request}
                    onChange={(e) =>
                      updateJobRequest(index, "request", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="px-4 py-2 w-48">
                  <Input
                    type="number"
                    value={request.cost || ""}
                    onChange={(e) =>
                      updateJobRequest(index, "cost", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </td>
                <td className="px-4 py-2 text-center w-28">
                  <button
                    type="button"
                    onClick={() => deleteJobRequest(index)}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                    disabled={jobRequests.length <= 1}
                    hidden={jobRequests.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 float-end">
                <span className="font-bold text-lg">Labor Total:</span>
              </td>
              <td className="px-4 py-2">
                <span className="mt-2 text-right font-medium">
                  {laborTotal.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="my-2 float-end">
          <div className="flex gap-1">
            {jobRequests.length > 1 && (
              <Button
                type="button"
                onClick={removeAllJobRequest}
                className="bg-red-400 hover:bg-red-500 text-white"
              >
                <FaTrashAlt /> Remove all
              </Button>
            )}
            <Button
              type="button"
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              onClick={addJobRequest}
            >
              <FaPlus /> Add Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
