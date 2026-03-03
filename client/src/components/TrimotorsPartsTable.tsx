// components/print/TrimotorsPartsTable.tsx
import React from 'react';
import { partsItems, PartsItem } from '@/constants/part-items';

interface TrimotorsPartsTableProps {
  data: any;
  partsItems: PartsItem[];
  renderCheckbox: (checked: boolean) => string;
  formatPartDetail: (key: string) => string;
  getPartsQuantity: (key: string) => number;
  getPartsAmount: (key: string) => number;
  formatCurrency: (amount: number) => string;
  isPartSelected: (key: string) => boolean;
  partsTotal: number;
}

export const TrimotorsPartsTable: React.FC<TrimotorsPartsTableProps> = ({
  data,
  partsItems,
  renderCheckbox,
  formatPartDetail,
  getPartsQuantity,
  getPartsAmount,
  formatCurrency,
  isPartSelected,
  partsTotal
}) => {
  
  // Split parts into pairs for left and right columns
  const getPartPairs = () => {
    const pairs = [];
    for (let i = 0; i < partsItems.length; i += 2) {
      pairs.push({
        left: partsItems[i],
        right: partsItems[i + 1] || null
      });
    }
    return pairs;
  };

  const renderPartCell = (part: PartsItem | null) => {
    if (!part) {
      return (
        <>
          <td className="border border-black p-0.5"></td>
          <td className="border border-black p-0.5 text-left text-[7pt]"></td>
          <td className="border border-black p-0.5 text-center"></td>
          <td className="border border-black p-0.5 text-left"></td>
        </>
      );
    }

    return (
      <>
        <td className="border border-black p-0.5">
          <div className="flex items-center">
            <span className="w-6">{renderCheckbox(data.partsReplacement?.[part.key])}</span>
            <span>{part.label}</span>
          </div>
        </td>
        <td className="border border-black p-0.5 text-left text-[7pt]">
          {data.partsReplacement?.[part.key] && formatPartDetail(part.key)}
        </td>
        <td className="border border-black p-0.5 text-center">
          {isPartSelected(part.key) ? getPartsQuantity(part.key) : ""}
        </td>
        <td className="border border-black p-0.5 text-left">
          {isPartSelected(part.key) ? formatCurrency(getPartsAmount(part.key)) : ""}
        </td>
      </>
    );
  };

  const renderRow = (pair: { left: PartsItem; right: PartsItem | null }, index: number) => {
    return (
      <tr key={`parts-row-${index}`}>
        {renderPartCell(pair.left)}
        {renderPartCell(pair.right)}
      </tr>
    );
  };

  const partPairs = getPartPairs();

  return (
    <>
      <h3 className="font-bold text-center border border-black py-1 bg-gray-100 mt-2">
        PARTS USED
      </h3>
      <table className="w-full border-collapse border border-black">
        <thead>
          <tr className="bg-gray-40">
            <th className="border border-black p-0.5 text-left">Parts Used</th>
            <th className="border border-black p-0.5 text-left w-28">Brand / Part No.</th>
            <th className="border border-black p-0.5 text-center w-10">Qty</th>
            <th className="border border-black p-0.5 text-center w-16">Amount</th>
            <th className="border border-black p-0.5 text-left">Parts Used</th>
            <th className="border border-black p-0.5 text-left w-28">Brand / Part No.</th>
            <th className="border border-black p-0.5 text-center w-10">Qty</th>
            <th className="border border-black p-0.5 text-center w-16">Amount</th>
          </tr>
        </thead>
        <tbody>
          {partPairs.map((pair, index) => renderRow(pair, index))}
          
          {/* Totals Row */}
          <tr>
            <td className="border border-black p-0.5 font-semibold" colSpan={8}>
              Total Parts Cost: {formatCurrency(partsTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};