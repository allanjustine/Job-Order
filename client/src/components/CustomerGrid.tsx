import Input from "./ui/input";
import { Label } from "./ui/label";
import { MultiMechanic } from "./MultiMechanic";
import Select from "./ui/select";
import { useAuth } from "@/context/authContext";

export default function CustomerGrid({
  errors,
  customerName,
  address,
  date,
  branch,
  contact,
  model,
  engineFrameNo,
  mileage,
  purchaseDate,
  repairStart,
  repairEnd,
  // fuelLevel,
  mechanic,
  remarks,
  estimatedRepairTime,
  setRemarks,
  setOtherRemarks,
  otherRemarks,
  setCustomerName,
  setAddress,
  setDate,
  setBranch,
  setContact,
  setModel,
  setEngineFrameNo,
  setMileage,
  setPurchaseDate,
  setRepairStart,
  setRepairEnd,
  // setFuelLevel,
  setMechanic,
  mechanics,
  setEstimatedRepairTime,
}: any) {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="col-span-1">
        <Label>Date</Label>
        <Input
          type="date"
          error={errors.date}
          value={date}
          onChange={(e) =>
            setDate(user.is_locked_date ? new Date() : e.target.value)
          }
          readOnly={user.is_locked_date}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Branch Name</Label>
        <Input
          type="text"
          error={errors.branch}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          readOnly
        />
        {errors.branch && (
          <p className="text-red-500 text-xs mt-1">{errors.branch}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Customer Name</Label>
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
        <Label>Contact Number</Label>
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
        <Label>Model</Label>
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
        <Label>Engine/Frame No.</Label>
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
        <Label>Mileage</Label>
        <Input
          type="text"
          error={errors.mileage}
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
        {errors.mileage && (
          <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Purchased Date</Label>
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
        <Label>Address</Label>
        <Input
          type="text"
          error={errors.address}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Estimated Repair Time</Label>
        <Input
          type="text"
          error={errors.estimatedRepairTime}
          value={estimatedRepairTime}
          onChange={(e) => setEstimatedRepairTime(e.target.value)}
        />
        {errors.estimatedRepairTime && (
          <p className="text-red-500 text-xs mt-1">
            {errors.estimatedRepairTime}
          </p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Repair Start Time</Label>
        <Input
          type="time"
          error={errors.repairStart}
          min="08:00"
          max="18:00"
          value={repairStart}
          onChange={(e) => setRepairStart(e.target.value)}
        />
        {errors.repairStart && (
          <p className="text-red-500 text-xs mt-1">{errors.repairStart}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Repair End Time</Label>
        <Input
          type="time"
          error={errors.repairEnd}
          min={repairStart || "08:00"}
          max="18:00"
          value={repairEnd}
          onChange={(e) => setRepairEnd(e.target.value)}
        />
        {errors.repairEnd && (
          <p className="text-red-500 text-xs mt-1">{errors.repairEnd}</p>
        )}
      </div>
      <div className="mt-2">
        <Label>Category</Label>
        <Select value={remarks} onChange={(e) => setRemarks(e.target.value)}>
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

      <div className="col-span-1">
        <Label>Select Mechanic</Label>
        <MultiMechanic
          mechanics={mechanics}
          setMechanic={setMechanic}
          mechanic={mechanic}
          inputError={errors.mechanic}
        />
      </div>
    </div>
  );
}
