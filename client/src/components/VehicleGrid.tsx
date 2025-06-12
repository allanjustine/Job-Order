import Input from "./ui/input";
import Label from "./ui/label";

export default function VehicleGrid({
  errors,
  vehicleModel,
  chassis,
  dealer,
  mileage,
  dateSold,
  setVehicleModel,
  setChassis,
  setDealer,
  setMileage,
  setDateSold,
}: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="col-span-1">
        <Label>Vehicle Model</Label>
        <Input
          type="text"
          error={errors.vehicleModel}
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
        />
        {errors.chassis && (
          <p className="text-red-500 text-xs mt-1">{errors.chassis}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label required>Chassis</Label>
        <Input
          type="text"
          error={errors.chassis}
          value={chassis}
          onChange={(e) => setChassis(e.target.value)}
        />
        {errors.chassis && (
          <p className="text-red-500 text-xs mt-1">{errors.chassis}</p>
        )}
      </div>
      <div className="col-span-1">
        <Label>Dealer</Label>
        <Input
          type="text"
          value={dealer}
          onChange={(e) => setDealer(e.target.value)}
        />
      </div>
      <div className="col-span-1">
        <Label>Mileage</Label>
        <Input
          type="text"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
      </div>
      <div className="col-span-1">
        <Label>Date Sold</Label>
        <Input
          type="date"
          value={dateSold}
          onChange={(e) => setDateSold(e.target.value)}
        />
      </div>
    </div>
  );
}
