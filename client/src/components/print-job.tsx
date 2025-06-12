'use client';

import React, { forwardRef } from 'react';

interface PrintJobOrderProps {
  data: {
    branch: string;
    customerName: string;
    address: string;
    vehicleModel: string;
    chassis: string;
    dealer: string;
    repairStart: string;
    repairEnd: string;
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
  };
}

const PrintJobOrder = forwardRef<HTMLDivElement, PrintJobOrderProps>(({ data }, ref) => {
  const calculateLaborTotal = () => {
    return data.jobRequests.reduce((sum, item) => sum + (item.cost || 0), 0);
  };
  
  const calculatePartsTotal = () => {
    return data.partsRequests.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  };
  
  const calculateTotal = () => {
    return calculateLaborTotal() + calculatePartsTotal();
  };

  return (
    <div ref={ref} className="p-6 font-sans" style={{ fontSize: '12pt' }}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">SMC7</h1>
        <h2 className="text-lg font-bold">SMC7 GROUP OF COMPANIES</h2>
      </div>
      
      {/* Branch and Customer Info */}
      <div className="mb-4">
        <p><strong>Branch:</strong> {data.branch}</p>
        <p><strong>Customer Name:</strong> {data.customerName}</p>
        <p><strong>Address:</strong> {data.address}</p>
        <p><strong>Vehicle Model:</strong> {data.vehicleModel}</p>
        <p><strong>Chassis/Engine #:</strong> {data.chassis}</p>
        <p><strong>Dealer/Brand Purchase:</strong> {data.dealer}</p>
      </div>
      
      {/* Type of Job */}
      <div className="mb-4">
        <h3 className="font-bold underline">TYPE OF JOB</h3>
        <p><strong>Repair Job Start (time/date):</strong> {data.repairStart}</p>
        <p><strong>Repair Job End (time/date):</strong> {data.repairEnd}</p>
      </div>
      
      <hr className="my-4 border-black" />
      
      {/* Vehicle Documents/Tools */}
      <div className="mb-4">
        <h3 className="font-bold underline">VEHICLE DOCUMENTS/TOOLS</h3>
        <ul className="list-none pl-0">
          <li className={data.documents.ownerToolKit ? '' : 'text-gray-400'}>
            {data.documents.ownerToolKit ? '✓' : '☐'} Owner Tool Kit
          </li>
          <li className={data.documents.ownerManual ? '' : 'text-gray-400'}>
            {data.documents.ownerManual ? '✓' : '☐'} Owner Manual
          </li>
          <li className={data.documents.warrantyGuideBook ? '' : 'text-gray-400'}>
            {data.documents.warrantyGuideBook ? '✓' : '☐'} Warranty Guide Book
          </li>
          <li className={data.documents.others ? '' : 'text-gray-400'}>
            {data.documents.others ? '✓' : '☐'} Others: {data.documents.othersText}
          </li>
        </ul>
      </div>
      
      <hr className="my-4 border-black" />
      
      {/* Vehicle Visual Checking */}
      <div className="mb-4">
        <h3 className="font-bold underline">VEHICLE VISUAL CHECKING Body Parts Per Any Damage</h3>
        <ul className="list-none pl-0">
          <li className={data.visualCheck.dent ? '' : 'text-gray-400'}>
            {data.visualCheck.dent ? '✓' : '☐'} Dent: {data.visualCheck.dentNotes}
          </li>
          <li className={data.visualCheck.scratch ? '' : 'text-gray-400'}>
            {data.visualCheck.scratch ? '✓' : '☐'} Scratch: {data.visualCheck.scratchNotes}
          </li>
          <li className={data.visualCheck.broken ? '' : 'text-gray-400'}>
            {data.visualCheck.broken ? '✓' : '☐'} Broken: {data.visualCheck.brokenNotes}
          </li>
          <li className={data.visualCheck.missing ? '' : 'text-gray-400'}>
            {data.visualCheck.missing ? '✓' : '☐'} Missing: {data.visualCheck.missingNotes}
          </li>
        </ul>
      </div>
      
      <hr className="my-4 border-black" />
      
      {/* Customer Job Request */}
      <div className="mb-4">
        <h3 className="font-bold underline">CUSTOMER JOB REQUEST</h3>
        <table className="w-full border-collapse">
          <tbody>
            {data.jobRequests.map((request, index) => (
              <tr key={index}>
                <td className="border-b border-gray-300 py-1">
                  {request.request}
                </td>
                <td className="border-b border-gray-300 py-1 text-right">
                  ₱{request.cost.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="pt-2 font-bold">Labor Total:</td>
              <td className="pt-2 text-right font-bold">₱{calculateLaborTotal().toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <hr className="my-4 border-black" />
      
      {/* Parts & Lubricants Request */}
      <div className="mb-4">
        <h3 className="font-bold underline">PARTS & LUBRICANTS REQUEST</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left pb-1">Parts Name</th>
              <th className="text-left pb-1">Part No.</th>
              <th className="text-right pb-1">Qty</th>
              <th className="text-right pb-1">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.partsRequests.map((part, index) => (
              <tr key={index}>
                <td className="border-b border-gray-300 py-1">{part.name}</td>
                <td className="border-b border-gray-300 py-1">{part.partNo}</td>
                <td className="border-b border-gray-300 py-1 text-right">{part.quantity}</td>
                <td className="border-b border-gray-300 py-1 text-right">₱{part.price.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="pt-2 font-bold">Part/Lub. Total:</td>
              <td className="pt-2 text-right font-bold">₱{calculatePartsTotal().toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <hr className="my-4 border-black" />
      
      {/* Total Amount */}
      <div className="mb-6 text-right">
        <h3 className="font-bold">TOTAL AMOUNT: ₱{calculateTotal().toFixed(2)}</h3>
      </div>
      
      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="text-center">
          <p className="border-t-2 border-black pt-2">Service Advisor Name & Signature</p>
        </div>
        <div className="text-center">
          <p className="border-t-2 border-black pt-2">BA / KB Name & Signature</p>
        </div>
        <div className="text-center">
          <p className="border-t-2 border-black pt-2">CUSTOMER SIGNATURE</p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm">
        <p>Customer acknowledges that the above work request has been approved</p>
      </div>
    </div>
  );
});

export default PrintJobOrder;
