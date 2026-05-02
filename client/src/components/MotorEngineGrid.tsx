import { useState } from "react";
import Input from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";

export default function MotorEngineGrid({
  errors,
  motorcycleUnit,
  remarks,
  engineUnit,
  engineCondition,
  contentUbox,
  setMotorcycleUnit,
  setRemarks,
  setEngineUnit,
  setEngineCondition,
  setContentUbox,
  setOtherRemarks,
  otherRemarks
}: any) {

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div>
            <Label>Motorcyle Unit</Label>
            <Select
              value={motorcycleUnit}
              onChange={(e) => setMotorcycleUnit(e.target.value)}
            >
              <option value="" disabled>
                Select Motocycle Unit
              </option>
              <option value="business">Business</option>
              <option value="automatic">Automatic</option>
              <option value="cub">Cub</option>
              <option value="sports">Sports</option>
            </Select>

            <div className="mt-2">
              <Label>Category</Label>
              <Select
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Repo Recon">Repo Recon</option>
                <option value="MC Service">MC Service</option>
                <option value="Under Warranty">Under Warranty</option>
                <option value="Regular Customer">Regular Customer</option>
                <option value="E-Bike">E-Bike</option>
                <option value="others">Others</option>
              </Select>
              {remarks === "others" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  className="mt-2 w-full p-2 border rounded"
                  value={otherRemarks}
                  onChange={(e) => setOtherRemarks(e.target.value)}
                />
              )}
              {errors.remarks && (
                <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div>
            <Label>Engine Unit</Label>
            <Select
              value={engineUnit}
              onChange={(e) => setEngineUnit(e.target.value)}
            >
              <option value="" disabled>
                Select Engine Unit
              </option>
              <option value="business_sports">Business/Sports</option>
              <option value="automatic">Automatic</option>
              <option value="cub">Cub</option>
            </Select>

            <div className="mt-2">
              <Label>Engine Condition</Label>
              <Input
                placeholder=""
                className="w-full"
                value={engineCondition}
                onChange={(e) => setEngineCondition(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Label>Contents inside U-Box</Label>
        <Input
          placeholder=""
          className="w-full"
          value={contentUbox}
          onChange={(e) => setContentUbox(e.target.value)}
        />
      </div>
    </div>
  );
}
