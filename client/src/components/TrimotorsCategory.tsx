import { useState } from "react";
import Input from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";

export default function TrimotorsCategory({
  errors,
  remarks,
  setRemarks,
  setOtherRemarks,
  otherRemarks
}: any) {

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
  );
}
