import { FcEngineering } from "react-icons/fc";
import Input from "./ui/input";
import Label from "./ui/label";
import { Fuel } from "lucide-react";

export default function CustomerGrid({
  errors,
  customerName,
  date,
  branch,
  contact,
  model,
  engineFrameNo,
  mileage,
  purchaseDate,
  repairStart,
  repairEnd,
  fuelLevel,
  mechanic,
  setCustomerName,
  setDate,
  setBranch,
  setContact,
  setModel,
  setEngineFrameNo,
  setMileage,
  setPurchaseDate,
  setRepairStart,
  setRepairEnd,
  setFuelLevel,
  setMechanic,
}: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="col-span-1">
        <Label required>Date</Label>
        <Input
          type="date"
          error={errors.date}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Branch Name</Label>
        <Input
          type="text"
          error={errors.branch}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        {errors.branch && (
          <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Customer Name</Label>
        <Input
          type="text"
          error={errors.customerName}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        {errors.customerName && (
          <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Contact Number</Label>
        <Input
          type="text"
          error={errors.contact}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {errors.contact && (
          <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Model</Label>
        <Input
          type="text"
          error={errors.model}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        {errors.model && (
          <p className="text-red-500 text-xs mt-1">{errors.model}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Engine/Frame No.</Label>
        <Input
          type="text"
          error={errors.engineFrameNo}
          value={engineFrameNo}
          onChange={(e) => setEngineFrameNo(e.target.value)}
        />
        {errors.engineFrameNo && (
          <p className="text-red-500 text-xs mt-1">{errors.engineFrameNo}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Mileage</Label>
        <Input
          type="text"
          error={errors.mileage}
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
        {errors.contact && (
          <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Purchased Date</Label>
        <Input
          type="date"
          error={errors.purchaseDate}
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />
        {errors.purchaseDate && (
          <p className="text-red-500 text-xs mt-1">{errors.purchaseDate}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Fuel Level</Label>
        <Input
          type="text"
          error={errors.fuelLevel}
          value={fuelLevel}
          onChange={(e) => setFuelLevel(e.target.value)}
        />
        {errors.fuelLevel && (
          <p className="text-red-500 text-xs mt-1">{errors.fuelLevel}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Repair Start Time</Label>
        <Input
          type="text"
          error={errors.repairTime}
          value={repairStart}
          onChange={(e) => setRepairStart(e.target.value)}
        />
        {errors.repairStart && (
          <p className="text-red-500 text-xs mt-1">{errors.repairStart}</p>
        )}
      </div>
        <div className="col-span-1">
        <Label required>Repair End Time</Label>
        <Input
          type="text"
          error={errors.repairEnd}
          value={repairEnd}
          onChange={(e) => setRepairEnd(e.target.value)}
        />
        {errors.repairEnd && (
          <p className="text-red-500 text-xs mt-1">{errors.repairEnd}</p>
        )}
      </div>
      
      <div className="col-span-1">
        <Label required>Mechanic Name</Label>
        <Input
          type="text"
          error={errors.mechanic}
          value={mechanic}
          onChange={(e) => setMechanic(e.target.value)}
        />
        {errors.mechanic && (
          <p className="text-red-500 text-xs mt-1">{errors.mechanic}</p>
        )}
      </div>

    </div>
    
  );
}
