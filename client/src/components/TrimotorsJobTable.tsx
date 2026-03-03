// components/print/TrimotorsJobTable.tsx
import React from 'react';
import { TrimotorsJobItem, trimotorsJobItems } from '@/constants/trimotors-job-items';

interface TrimotorsJobTableProps {
  data: any;
  jobItems: TrimotorsJobItem[];
  renderCheckbox: (checked: boolean) => string;
  getJobAmount: (key: string) => number;
  formatCurrency: (amount: number) => string;
  jobTotal: number;
}

export const TrimotorsJobTable: React.FC<TrimotorsJobTableProps> = ({
  data,
  jobItems,
  renderCheckbox,
  getJobAmount,
  formatCurrency,
  jobTotal
}) => {
  
  // Split job items into pairs for left and right columns
  const getJobPairs = () => {
    const pairs = [];
    for (let i = 0; i < jobItems.length; i += 2) {
      pairs.push({
        left: jobItems[i],
        right: jobItems[i + 1] || null
      });
    }
    return pairs;
  };

  const renderJobCell = (item: TrimotorsJobItem | null) => {
    if (!item) {
      return (
        <>
          <td className="border border-black p-0.5" ></td>
          <td className="border border-black p-0.5 text-left"></td>
        </>
      );
    }

    const displayLabel = item.hasText && data.jobRequest[item.key] 
      ? `${item.label} ${data.jobRequest.othersText || ''}`
      : item.label;

    return (
      <>
        <td className="border border-black p-0.5" >
          <div className="flex items-center">
            <span className="w-6"style={{ fontSize: "8pt", lineHeight: "0.8" }} >{renderCheckbox(data.jobRequest?.[item.key])}</span>
            <span style={{ fontSize: "8pt", lineHeight: "0.8" }}>{displayLabel}</span>
          </div>
        </td>
        <td className="border border-black p-0.5 text-left">
          {data.jobRequest?.[item.key] ? formatCurrency(getJobAmount(item.key)) : ""}
        </td>
      </>
    );
  };

  const renderRow = (pair: { left: TrimotorsJobItem; right: TrimotorsJobItem | null }, index: number) => {
    return (
      <tr key={`job-row-${index}`}>
        {renderJobCell(pair.left)}
        {renderJobCell(pair.right)}
      </tr>
    );
  };

  const jobPairs = getJobPairs();

  return (
    <>
      <h3 className="font-bold text-center border border-black py-1 bg-gray-100">
        JOB ORDER
      </h3>
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-40">
            <th className="border border-black p-0.5 text-left">Specific Job(s) Request</th>
            <th className="border border-black p-0.5 text-center w-16">Amount</th>
            <th className="border border-black p-0.5 text-left">Specific Job(s) Request</th>
            <th className="border border-black p-0.5 text-center w-16">Amount</th>
          </tr>
        </thead>
        <tbody>
          {jobPairs.map((pair, index) => renderRow(pair, index))}
          
          {/* Totals Row */}
          <tr>
            <td className="border border-black p-0.5 font-semibold" colSpan={2}>
              Total Labor Cost:
            </td>
            <td className="border border-black p-0.5 text-left font-semibold" colSpan={2}>
              {formatCurrency(jobTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};