'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import PrintJobOrder from '@/components/print-job';


type JobRequest = {
  request: string;
  cost: number;
};

type PartRequest = {
  name: string;
  partNo: string;
  quantity: number;
  price: number;
};

type VehicleDocument = {
  ownerToolKit: boolean;
  ownerManual: boolean;
  warrantyGuideBook: boolean;
  others: boolean;
  othersText: string;
};

type VehicleVisualCheck = {
  dent: boolean;
  dentNotes: string;
  scratch: boolean;
  scratchNotes: string;
  broken: boolean;
  brokenNotes: string;
  missing: boolean;
  missingNotes: string;
};

export default function JobOrderForm() {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [chassis, setChassis] = useState('');
  const [dealer, setDealer] = useState('');
  const [mileage, setMileage] = useState('');
  const [dateSold, setDateSold] = useState('');
  const [jobType, setJobType] = useState('');
  const [repairStart, setRepairStart] = useState('');
  const [repairEnd, setRepairEnd] = useState('');
  
  const [documents, setDocuments] = useState<VehicleDocument>({
    ownerToolKit: false,
    ownerManual: false,
    warrantyGuideBook: false,
    others: false,
    othersText: ''
  });
  
  const [visualCheck, setVisualCheck] = useState<VehicleVisualCheck>({
    dent: false,
    dentNotes: '',
    scratch: false,
    scratchNotes: '',
    broken: false,
    brokenNotes: '',
    missing: false,
    missingNotes: ''
  });
  

  const [jobRequests, setJobRequests] = useState<JobRequest[]>([{ request: '', cost: 0 }]);
  const [partsRequests, setPartsRequests] = useState<PartRequest[]>([{ name: '', partNo: '', quantity: 0, price: 0 }]);
  
  const addJobRequest = () => {
    setJobRequests([...jobRequests, { request: '', cost: 0 }]);
  };
  
  const addPartRequest = () => {
    setPartsRequests([...partsRequests, { name: '', partNo: '', quantity: 0, price: 0 }]);
  };
  
  const updateJobRequest = (index: number, field: keyof JobRequest, value: string | number) => {
    const updatedRequests = [...jobRequests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]: field === 'cost' ? Number(value) : value
    };
    setJobRequests(updatedRequests);
  };
  
  const updatePartRequest = (index: number, field: keyof PartRequest, value: string | number) => {
    const updatedRequests = [...partsRequests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]: field === 'quantity' || field === 'price' ? Number(value) : value
    };
    setPartsRequests(updatedRequests);
  };

   // Add delete functions
  const deleteJobRequest = (index: number) => {
    const newRequests = [...jobRequests];
    newRequests.splice(index, 1);
    setJobRequests(newRequests);
  };
  
  const deletePartRequest = (index: number) => {
    const newRequests = [...partsRequests];
    newRequests.splice(index, 1);
    setPartsRequests(newRequests);
  };
  const jobOrderData = {
  branch: 'Main Branch', // or allow user input if needed
  customerName,
  address,
  vehicleModel,
  chassis,
  dealer,
  repairStart,
  repairEnd,
  documents,
  visualCheck,
  jobRequests,
  partsRequests,
};
  
  const calculateLaborTotal = () => {
    return jobRequests.reduce((sum, item) => sum + (item.cost || 0), 0);
  };
  
  const calculatePartsTotal = () => {
    return partsRequests.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  };
  
  const calculateTotal = () => {
    return calculateLaborTotal() + calculatePartsTotal();
  };
  const [showPrintView, setShowPrintView] = useState(false);

const handlePrint = () => {
  setShowPrintView(true);
  setTimeout(() => {
    window.print();
    setShowPrintView(false);
  }, 300); // Slight delay to allow render
};

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log(jobOrderData);
  handlePrint();
};


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Company Logo" className="mx-auto mb-4 w-40 h-auto" />
          <h1 className="text-2xl font-extrabold text-gray-900">JOB ORDER</h1>
          <h2 className="text-lg text-gray-600">SMCT GROUP OF COMPANIES</h2>
        </div>
        
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Vehicle Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chassis</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={chassis}
              onChange={(e) => setChassis(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Sold</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={dateSold}
              onChange={(e) => setDateSold(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Job</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
            >
              <option value="">Select job type</option>
              <option value="Repair">Repair</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>
        </div>
        
        {/* Repair Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repair Job Start</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={repairStart}
              onChange={(e) => setRepairStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repair Job End</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={repairEnd}
              onChange={(e) => setRepairEnd(e.target.value)}
            />
          </div>
        </div>
        
        {/* Documents and Visual Check */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-700">VEHICLE DOCUMENT/TOOLS</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={documents.ownerToolKit}
                  onChange={(e) => setDocuments({...documents, ownerToolKit: e.target.checked})}
                />
                Owner Tool Kit
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={documents.ownerManual}
                  onChange={(e) => setDocuments({...documents, ownerManual: e.target.checked})}
                />
                Owner Manual
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={documents.warrantyGuideBook}
                  onChange={(e) => setDocuments({...documents, warrantyGuideBook: e.target.checked})}
                />
                Warranty Guide Book
              </label>
              <div className="flex items-center">
                <label className="flex items-center mr-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={documents.others}
                    onChange={(e) => setDocuments({...documents, others: e.target.checked})}
                  />
                  Others
                </label>
                {documents.others && (
                  <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 rounded-md"
                    value={documents.othersText}
                    onChange={(e) => setDocuments({...documents, othersText: e.target.value})}
                    placeholder="Specify"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Visual Check */}
   <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">VEHICLE VISUAL CHECKING</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={visualCheck.dent}
              onChange={(e) => setVisualCheck({...visualCheck, dent: e.target.checked})}
            />
            <span>Dent</span>
            {visualCheck.dent && (
              <input
                type="text"
                className="ml-2 p-1 border border-gray-300 rounded-md flex-1 max-w-xs"
                placeholder="Enter body part..."
                value={visualCheck.dentNotes}
                onChange={(e) => setVisualCheck({...visualCheck, dentNotes: e.target.value})}
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={visualCheck.scratch}
              onChange={(e) => setVisualCheck({...visualCheck, scratch: e.target.checked})}
            />
            <span>Scratch</span>
            {visualCheck.scratch && (
              <input
                type="text"
                className="ml-2 p-1 border border-gray-300 rounded-md flex-1 max-w-xs"
                placeholder="Enter body part..."
                value={visualCheck.scratchNotes}
                onChange={(e) => setVisualCheck({...visualCheck, scratchNotes: e.target.value})}
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={visualCheck.broken}
              onChange={(e) => setVisualCheck({...visualCheck, broken: e.target.checked})}
            />
            <span>Broken</span>
            {visualCheck.broken && (
              <input
                type="text"
                className="ml-2 p-1 border border-gray-300 rounded-md flex-1 max-w-xs"
                placeholder="Enter body part..."
                value={visualCheck.brokenNotes}
                onChange={(e) => setVisualCheck({...visualCheck, brokenNotes: e.target.value})}
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={visualCheck.missing}
              onChange={(e) => setVisualCheck({...visualCheck, missing: e.target.checked})}
            />
            <span>Missing</span>
            {visualCheck.missing && (
              <input
                type="text"
                className="ml-2 p-1 border border-gray-300 rounded-md flex-1 max-w-xs"
                placeholder="Enter body part..."
                value={visualCheck.missingNotes}
                onChange={(e) => setVisualCheck({...visualCheck, missingNotes: e.target.value})}
              />
            )}
          </div>
        </div>
      </div>
</div>
        
        {/* Customer Job Request */}
  <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">CUSTOMER JOB REQUEST</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Request</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobRequests.map((request, index) => (
                  <tr key={index} className="relative">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={request.request}
                        onChange={(e) => updateJobRequest(index, 'request', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={request.cost || ''}
                        onChange={(e) => updateJobRequest(index, 'cost', e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                    {jobRequests.length > 1 && (
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteJobRequest(index)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-6 text-red-500 hover:text-red-700"
                        title="Delete request"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 cursor-pointer"
            onClick={addJobRequest}
          >
            + Add another request
          </button>
          <div className="mt-2 text-right font-medium ">
            Labor Total: ₱{calculateLaborTotal().toFixed(2)}
          </div>
        </div>
        
        {/* Parts & Lubricants Request */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">PARTS & LUBRICANTS REQUEST</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parts Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part No</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partsRequests.map((part, index) => (
                  <tr key={index} className="relative">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={part.name}
                        onChange={(e) => updatePartRequest(index, 'name', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={part.partNo}
                        onChange={(e) => updatePartRequest(index, 'partNo', e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={part.quantity || ''}
                        onChange={(e) => updatePartRequest(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded-md"
                        value={part.price || ''}
                        onChange={(e) => updatePartRequest(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    {partsRequests.length > 1 && (
                    <td>
                      <button
                        type="button"
                        onClick={() => deletePartRequest(index)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-6 text-red-500 hover:text-red-700"
                        title="Delete part"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 cursor-pointer"
            onClick={addPartRequest}
          >
            + Add another request
          </button>
          <div className="mt-2 text-right font-medium ">
            Part/Lub. Total: ₱{calculatePartsTotal().toFixed(2)}
          </div>
        </div>
        
        {/* Total Amount */}
        <div className="text-right text-l font-semibold mb-6">
          TOTAL AMOUNT: ₱{calculateTotal().toFixed(2)}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Print
          </button>
{showPrintView && (
  <div className="print-area">
    <div className="hidden print:block">
      <PrintJobOrder data={jobOrderData} />
    </div>
  </div>
)}

        </div>
      </form>
    </div>
  );
}