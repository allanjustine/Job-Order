"use client";

import {
  DiagnosisKeys,
  DiagnosisState,
  DiagnosisStatus,
} from "@/types/jobOrderFormType";

export interface MotorcycleDiagnosisProps {
  diagnosis: Record<DiagnosisKeys, DiagnosisState>;
  setDiagnosis: React.Dispatch<
    React.SetStateAction<Record<DiagnosisKeys, DiagnosisState>>
  >;
}

export default function MotorcycleDiagnosis({
  diagnosis,
  setDiagnosis,
}: MotorcycleDiagnosisProps) {
  // Handler for checkbox button changes
  const handleStatusChange = (unit: DiagnosisKeys, status: DiagnosisStatus) => {
    setDiagnosis((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        status: prev[unit].status === status ? null : status,
      },
    }));
  };

  const handleRemarksChange = (unit: DiagnosisKeys, value: string) => {
    setDiagnosis((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        remarks: value,
      },
    }));
  };

  const renderRow = (label: string, unitKey: DiagnosisKeys) => (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="p-1 border-r border-gray-200 text-md whitespace-nowrap">
        {label}
      </td>

      {/* OK checkbox Button */}
      <td className="p-1 text-center border-r border-gray-200 w-10">
        <input
          type="checkbox"
          name={`${unitKey}-status`}
          checked={diagnosis[unitKey].status === "ok"}
          onChange={() => handleStatusChange(unitKey, "ok")}
          className="h-3 w-3 cursor-pointer"
        />
      </td>

      {/* NG checkbox Button */}
      <td className="p-1 text-center border-r border-gray-200 w-10">
        <input
          type="checkbox"
          name={`${unitKey}-status`}
          checked={diagnosis[unitKey].status === "ng"}
          onChange={() => handleStatusChange(unitKey, "ng")}
          className="h-3 w-3 cursor-pointer"
        />
      </td>

      {/* NA checkbox Button */}
      <td className="p-1 text-center border-r border-gray-200 w-10">
        <input
          type="checkbox"
          name={`${unitKey}-status`}
          checked={diagnosis[unitKey].status === "na"}
          onChange={() => handleStatusChange(unitKey, "na")}
          className="h-3 w-3 cursor-pointer"
        />
      </td>

      <td className="p-1">
        <input
          type="text"
          value={diagnosis[unitKey].remarks || ""}
          onChange={(e) => handleRemarksChange(unitKey, e.target.value)}
          className={`w-full px-1.5 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            !diagnosis[unitKey].status && "bg-gray-100 cursor-not-allowed"
          }`}
          placeholder="..."
          disabled={!diagnosis[unitKey].status}
          // required={!!diagnosis[unitKey].status}
        />
      </td>
    </tr>
  );

  return (
    <div className="mb-4 bg-white rounded border border-gray-300 p-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-1 text-left font-semibold border-r border-gray-300 text-sm whitespace-nowrap">
                  Units
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  OK
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  NG
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  N/A
                </th>
                <th className="p-1 text-left font-semibold text-sm">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {renderRow("Lights (HL / TL / SL / BL / MP)", "lights")}
              {renderRow("Horn", "horn")}
              {renderRow("Switches (IS / SS / SLS / HS)", "switches")}
              {renderRow("Brakes (FR / RR)", "brakes")}
              {renderRow("Tiers (FR / RR)", "tires")}
              {renderRow("Spokes/Wireless (FR / RR)", "spokesWheels")}
              {renderRow("Drive Chain/Belt", "driveChain")}
              {renderRow("Steering", "steering")}
            </tbody>
          </table>
        </div>

        {/* Right Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-1 text-left font-semibold border-r border-gray-300 text-sm whitespace-nowrap">
                  Units
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  OK
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  NG
                </th>
                <th className="p-1 text-center font-semibold border-r border-gray-300 w-10 text-sm">
                  N/A
                </th>
                <th className="p-1 text-left font-semibold text-sm">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {renderRow("Suspension (FR / RR)", "suspension")}
              {renderRow("Idle Speed", "idleSpeed")}
              {renderRow("Side / Main Stand", "sideMain")}
              {renderRow("Engine Oil / Final Drive", "engineOil")}
              {renderRow("Coolant Level", "coolantLevel")}
              {renderRow("Brake Fluid Level", "brakeFluid")}
              {renderRow("Battery", "battery")}
              {renderRow("Cable Operation (CL / BR / CBS)", "cableOperation")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
