import Input from "./ui/input";
import Label from "./ui/label";

export default function CustomerGrid({
  errors,
  customerName,
  date,
  address,
  contact,
  setCustomerName,
  setDate,
  setAddress,
  setContact,
}: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <Label required>Address</Label>
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
        <Label required>Contact</Label>
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
    </div>
  );
}
