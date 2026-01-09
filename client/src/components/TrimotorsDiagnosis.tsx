"use client";

import {
  TrimotorsDiagnosisKeys,
  DiagnosisState,
  DiagnosisStatus,
} from "@/types/jobOrderFormType";

export interface TrimotorsDiagnosisProps {
  diagnosis: Record<TrimotorsDiagnosisKeys, DiagnosisState>;
  setDiagnosis: React.Dispatch<
    React.SetStateAction<Record<TrimotorsDiagnosisKeys, DiagnosisState>>
  >;
}

export default function TrimotorsDiagnosis({
  diagnosis,
  setDiagnosis,
}: TrimotorsDiagnosisProps) {
  // Handler for checkbox button changes
  const handleStatusChange = (
    unit: TrimotorsDiagnosisKeys,
    status: DiagnosisStatus
  ) => {
    setDiagnosis((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        status: prev[unit].status === status ? null : status,
      },
    }));
  };

  const handleRemarksChange = (unit: TrimotorsDiagnosisKeys, value: string) => {
    setDiagnosis((prev) => ({
      ...prev,
      [unit]: {
        ...prev[unit],
        remarks: value,
      },
    }));
  };

  const renderRow = (
    label: string,
    unitKey: TrimotorsDiagnosisKeys,
    showGroupLabel: boolean = false,
    groupName: string = ""
  ) => (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      {/* Group Column */}
      <td className="p-1 border-r border-gray-200 text-md whitespace-nowrap font-medium bg-gray-50">
        {showGroupLabel && <span className="text-gray-700">{groupName}</span>}
      </td>

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
          value={diagnosis[unitKey].remarks}
          onChange={(e) => handleRemarksChange(unitKey, e.target.value)}
          className={`w-full px-1.5 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            !diagnosis[unitKey].status && "bg-gray-100 cursor-not-allowed"
          }`}
          placeholder="..."
          disabled={!diagnosis[unitKey].status}
          required={!!diagnosis[unitKey].status}
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
                <th className="p-1 text-left font-semibold border-r border-gray-300 text-sm whitespace-nowrap"></th>
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
              {renderRow("Windshield", "windshield", true, "BODY FRONT")}
              {renderRow("Wipe Arm", "wipeArm", false, "")}
              {renderRow("Front Indicator L/R", "frontIndicator", false, "")}
              {renderRow("Headlamp", "frontHeadLamp", false, "")}
              {renderRow("Housing Scudo", "housingScudo", false, "")}
              {renderRow("Housing Headlamp L/R", "housingHeadlamp", false, "")}
              {renderRow("Front Fender", "frontFender", false, "")}
              {renderRow("Mud Flap", "mudFlapFront", false, "")}
              {renderRow("Scudo/Front Paint", "scudoFront", false, "")}
              {renderRow("Emblem Logo", "frontEmblem", false, "")}
              {renderRow("Tail Lamp L/R", "tailLamp", true, "BODY REAR")}
              {renderRow("Bumper", "bumper", false, "")}
              {renderRow("Mud Flap L/R", "mudFlapRear", false, "")}
              {renderRow("Rear Door", "rearDoor", false, "")}
              {renderRow("Emblem Logo", "rearEmblem", false, "")}
              {renderRow("Tail End Body Paint", "tailEnd", false, "")}
              {renderRow("Beading", "leftBeading", true, "BODY LEFT SIDE")}
              {renderRow("Left Side Body Paint", "leftBodyPaint", false, "")}
              {renderRow("Mud Guard", "mudGuard", true, "BODY RIGHT SIDE")}
              {renderRow("Beading", "rightBeading", false, "")}
              {renderRow("Right Side Body Paint", "rightBodyPaint", false, "")}
              {renderRow(
                "Check for Holes/Torn",
                "checkHoles",
                true,
                "HOOD FITMENT"
              )}
              {renderRow("Damage Stitching", "damageStitching", false, "")}
              {renderRow("Cover Hood Top", "coverHood", false, "")}
            </tbody>
          </table>
        </div>

        {/* Right Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-1 text-left font-semibold border-r border-gray-300 text-sm whitespace-nowrap"></th>
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
              {renderRow("Tape Hood", "tapeHood", false, "")}
              {renderRow("Aluminum", "alumninum", false, "")}
              {renderRow("Nails & Screw", "nailScrew", false, "")}
              {renderRow("Dashboard", "dashboard", true, "INTERIOR")}
              {renderRow("Seats Driver", "seatsDriver", false, "")}
              {renderRow("Seats Passenger", "seatsPassenger", false, "")}
              {renderRow("Seat Belts 4pcs", "seatBelts", false, "")}
              {renderRow("Handle Leather", "handleLeather", false, "")}
              {renderRow("Rubber Matting (F/R/C)", "rubberMatting", false, "")}
              {renderRow("Underseat Cover", "underseatCover", false, "")}
              {renderRow("Headlamp/Park Lamp", "headlamp", true, "ELECTRICALS")}
              {renderRow("High/Low Beam", "beam", false, "")}
              {renderRow("Signal Lamps", "signalLamp", false, "")}
              {renderRow("Hazard Lamps", "hazardlamp", false, "")}
              {renderRow("Wiper Motor", "wiper", false, "")}
              {renderRow("Lamps (Interior/Engine)", "interiorLamp", false, "")}
              {renderRow("Gauge Lamps", "gaugeLamp", false, "")}
              {renderRow(
                "Car Charger w/ Cap",
                "carCharger",
                true,
                "ACCESSORIES"
              )}
              {renderRow("Tools", "tools", false, "")}
              {renderRow("Battery", "battery", false, "")}
              {renderRow("Jack", "jack", false, "")}
              {renderRow("Spare Tire", "spareTire", false, "")}
              {renderRow("Side Mirror L/R", "sideMirror", false, "")}
              {renderRow("Warranty Booklet", "warrantyBooklet", false, "")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
