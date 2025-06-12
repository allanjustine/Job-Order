import { FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import Button from "./ui/button";
import Input from "./ui/input";

export default function PartsAndLubricantsRequest({
  partsRequests,
  updatePartRequest,
  deletePartRequest,
  removeAllPartRequest,
  addPartRequest,
  partsTotal,
}: any) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold text-blue-700">
          PARTS & LUBRICANTS REQUEST
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Parts Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Part No
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Subtotal
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partsRequests.map((part: any, index: any) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <Input
                    type="text"
                    value={part.name}
                    onChange={(e) =>
                      updatePartRequest(index, "name", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="text"
                    value={part.partNo}
                    onChange={(e) =>
                      updatePartRequest(index, "partNo", e.target.value)
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={part.quantity || ""}
                    onChange={(e) =>
                      updatePartRequest(index, "quantity", e.target.value)
                    }
                    min="1"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={part.price || ""}
                    onChange={(e) =>
                      updatePartRequest(index, "price", e.target.value)
                    }
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-2">
                  {(part.price * part.quantity).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => deletePartRequest(index)}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                    hidden={partsRequests.length <= 1}
                    disabled={partsRequests.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="px-4 py-2 text-end">
                <span className="font-bold text-lg">Part/Lub. Total:</span>
              </td>
              <td className="px-4 py-2">
                <span className="mt-2 text-center font-medium">
                  {partsTotal.toLocaleString("en-PH", {
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
            {partsRequests.length > 1 && (
              <Button
                type="button"
                onClick={removeAllPartRequest}
                className="bg-red-400 hover:bg-red-500 text-white"
              >
                <FaTrashAlt /> Remove all
              </Button>
            )}
            <Button
              type="button"
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
              onClick={addPartRequest}
            >
              <FaPlus /> Add Part
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
