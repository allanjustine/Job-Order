'use client';

import { useState, useMemo, useRef } from 'react';
import { FaTrash, FaPrint } from 'react-icons/fa';
import PrintJobOrder from '@/components/print-job';
import { useReactToPrint } from 'react-to-print';
import { z } from 'zod';

// Schema for form validation
const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  date: z.string().min(1, "Date is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  chassis: z.string().min(1, "Chassis number is required"),
});

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
  // Form state
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const printRef = useRef<HTMLDivElement>(null);

  // Set default date to today
  useState(() => {
    setDate(new Date().toISOString().split('T')[0]);
  });

  // Calculate totals with memoization
  const laborTotal = useMemo(() => 
    jobRequests.reduce((sum, item) => sum + (item.cost || 0), 0), 
    [jobRequests]
  );
  
  const partsTotal = useMemo(() => 
    partsRequests.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0), 
    [partsRequests]
  );
  
  const totalAmount = useMemo(() => laborTotal + partsTotal, [laborTotal, partsTotal]);

  // Form handlers
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

  // Prepare data for printing
  const jobOrderData = {
    branch: 'Main Branch',
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
    laborTotal,
    partsTotal,
    totalAmount,
    date,
    contact,
    mileage,
    dateSold,
    jobType
  };

  // Form validation
  const validateForm = () => {
    try {
      formSchema.parse({
        customerName,
        date,
        address,
        contact,
        vehicleModel,
        chassis
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: A4 landscape; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none; }
      }
    `
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handlePrint();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-20 no-print">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[95vw] mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="text-center mb-6 border-b pb-4">
            <img src="/logo.png" alt="Company Logo" className="mx-auto mb-3 w-32 h-auto" />
            <h1 className="text-2xl font-extrabold text-gray-900">JOB ORDER</h1>
            <h2 className="text-lg text-gray-600">SMCT GROUP OF COMPANIES</h2>
          </div>
          
          {/* Customer Info - Wider 5-column layout */}
          <p className="block text-lg font-bold text-gray-900 mb-1">CUSTOMER DETAILS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>
          </div>
          <p className="block text-lg font-bold text-gray-900 mb-1">VEHICLE DETAILS</p>
          {/* Vehicle Info - Wider 5-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.vehicleModel ? 'border-red-500' : 'border-gray-300'}`}
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
              {errors.chassis && <p className="text-red-500 text-xs mt-1">{errors.chassis}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chassis *</label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${errors.chassis ? 'border-red-500' : 'border-gray-300'}`}
                value={chassis}
                onChange={(e) => setChassis(e.target.value)}
              />
              {errors.chassis && <p className="text-red-500 text-xs mt-1">{errors.chassis}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dealer</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={dealer}
                onChange={(e) => setDealer(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Sold</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={dateSold}
                onChange={(e) => setDateSold(e.target.value)}
              />
            </div>
          </div>

          <p className="block text-lg font-bold text-gray-900 mb-1">JOB DETAILS</p>
          {/* Repair Dates - Full width */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Type of Job</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">Select job type</option>
                <option value="Repair">Repair</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>
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
          
          {/* Documents and Visual Check - Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Documents */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-blue-700">VEHICLE DOCUMENT/TOOLS</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={documents.ownerToolKit}
                    onChange={(e) => setDocuments({...documents, ownerToolKit: e.target.checked})}
                  />
                  Owner Tool Kit
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={documents.ownerManual}
                    onChange={(e) => setDocuments({...documents, ownerManual: e.target.checked})}
                  />
                  Owner Manual
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={documents.warrantyGuideBook}
                    onChange={(e) => setDocuments({...documents, warrantyGuideBook: e.target.checked})}
                  />
                  Warranty Guide Book
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
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
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-md font-semibold mb-3 text-blue-700">VEHICLE VISUAL CHECKING</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={visualCheck.dent}
                    onChange={(e) => setVisualCheck({...visualCheck, dent: e.target.checked})}
                  />
                  <span>Dent</span>
                  {visualCheck.dent && (
                    <input
                      type="text"
                      className="flex-1 p-1 border border-gray-300 rounded-md"
                      placeholder="Location"
                      value={visualCheck.dentNotes}
                      onChange={(e) => setVisualCheck({...visualCheck, dentNotes: e.target.value})}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={visualCheck.scratch}
                    onChange={(e) => setVisualCheck({...visualCheck, scratch: e.target.checked})}
                  />
                  <span>Scratch</span>
                  {visualCheck.scratch && (
                    <input
                      type="text"
                      className="flex-1 p-1 border border-gray-300 rounded-md"
                      placeholder="Location"
                      value={visualCheck.scratchNotes}
                      onChange={(e) => setVisualCheck({...visualCheck, scratchNotes: e.target.value})}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={visualCheck.broken}
                    onChange={(e) => setVisualCheck({...visualCheck, broken: e.target.checked})}
                  />
                  <span>Broken</span>
                  {visualCheck.broken && (
                    <input
                      type="text"
                      className="flex-1 p-1 border border-gray-300 rounded-md"
                      placeholder="Location"
                      value={visualCheck.brokenNotes}
                      onChange={(e) => setVisualCheck({...visualCheck, brokenNotes: e.target.value})}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    checked={visualCheck.missing}
                    onChange={(e) => setVisualCheck({...visualCheck, missing: e.target.checked})}
                  />
                  <span>Missing</span>
                  {visualCheck.missing && (
                    <input
                      type="text"
                      className="flex-1 p-1 border border-gray-300 rounded-md"
                      placeholder="Location"
                      value={visualCheck.missingNotes}
                      onChange={(e) => setVisualCheck({...visualCheck, missingNotes: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Job Request - Full width */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-blue-700">CUSTOMER JOB REQUEST</h3>
              <button
                type="button"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                onClick={addJobRequest}
              >
                + Add Request
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer Request</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cost</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobRequests.map((request, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={request.request}
                          onChange={(e) => updateJobRequest(index, 'request', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
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
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteJobRequest(index)}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                          disabled={jobRequests.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-right font-medium">
              Labor Total: ₱{laborTotal.toFixed(2)}
            </div>
          </div>
          
          {/* Parts & Lubricants Request - Full width */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-blue-700">PARTS & LUBRICANTS REQUEST</h3>
              <button
                type="button"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                onClick={addPartRequest}
              >
                + Add Part
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parts Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Part No</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {partsRequests.map((part, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={part.name}
                          onChange={(e) => updatePartRequest(index, 'name', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={part.partNo}
                          onChange={(e) => updatePartRequest(index, 'partNo', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={part.quantity || ''}
                          onChange={(e) => updatePartRequest(index, 'quantity', e.target.value)}
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded-md"
                          value={part.price || ''}
                          onChange={(e) => updatePartRequest(index, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        ₱{(part.price * part.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => deletePartRequest(index)}
                          className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                          disabled={partsRequests.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-right font-medium">
              Part/Lub. Total: ₱{partsTotal.toFixed(2)}
            </div>
          </div>
          
          {/* Total Amount */}
          <div className="text-right text-xl font-bold mb-6 p-3 bg-blue-50 rounded-md">
            TOTAL AMOUNT: ₱{totalAmount.toFixed(2)}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPrint /> Print Job Order
            </button>
          </div>
        </form>

        {/* Print View (hidden until printing) */}
        <div className="hidden">
          <div ref={printRef}>
            <PrintJobOrder data={jobOrderData} />
          </div>
        </div>
      </div>
    </div>
  );
}