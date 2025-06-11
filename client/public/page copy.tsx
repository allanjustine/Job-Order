'use client'

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

const RepairJobForm: FC = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    date: "",
    contact: "",
    vehicleModel: "",
    chassis: "",
    dealer: "",
    mileage: "",
    dateSold: "",
    typeOfJob: "",
    repairJobStart: "",
    repairJobEnd: "",
    vehicleDocument: [] as string[],
    vehicleDocumentOthers: "",
    vehicleVisual:[] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
  };

  const router = useRouter();
  const handleNext = () => {
    router.push("/customer-request");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 mt-8 rounded-xl shadow-md">
      
      {/* Header Titles */}
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Company Logo" className="mx-auto mb-4 w-45 h-auto"/>
        <h1 className="text-4xl font-extrabold text-gray-900">JOB ORDER</h1>
        <p className="text-lg text-gray-600 mt-1">SMCT GROUP OF COMPANIES</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Contact */}
        <div>
          <label htmlFor="contact" className="block text-sm font-medium mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            id="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Vehicle Model */}
        <div>
          <label htmlFor="vehicleModel" className="block text-sm font-medium mb-1">Vehicle Model</label>
          <input
            type="text"
            name="vehicleModel"
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Chassis */}
        <div>
          <label htmlFor="chassis" className="block text-sm font-medium mb-1">Chassis</label>
          <input
            type="text"
            name="chassis"
            id="chassis"
            value={formData.chassis}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Dealer */}
        <div>
          <label htmlFor="dealer" className="block text-sm font-medium mb-1">Dealer</label>
          <input
            type="text"
            name="dealer"
            id="dealer"
            value={formData.dealer}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Mileage */}
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium mb-1">Mileage</label>
          <input
            type="number"
            name="mileage"
            id="mileage"
            value={formData.mileage}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date Sold */}
        <div>
          <label htmlFor="dateSold" className="block text-sm font-medium mb-1">Date Sold</label>
          <input
            type="date"
            name="dateSold"
            id="dateSold"
            value={formData.dateSold}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Type of Job */}
        <div>
          <label htmlFor="typeOfJob" className="block text-sm font-medium mb-1">Type of Job</label>
          <select
            name="typeOfJob"
            id="typeOfJob"
            value={formData.typeOfJob}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select job type</option>
            <option value="PMS">PMS</option>
            <option value="Regular Repair">Regular Repair</option>
            <option value="Warranty Claim">Warranty Claim</option>
          </select>
        </div>

        {/* Repair Job Start */}
        <div>
          <label htmlFor="repairJobStart" className="block text-sm font-medium mb-1">Repair Job Start</label>
          <input
            type="datetime-local"
            name="repairJobStart"
            id="repairJobStart"
            value={formData.repairJobStart}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Repair Job End */}
        <div>
          <label htmlFor="repairJobEnd" className="block text-sm font-medium mb-1">Repair Job End</label>
          <input
            type="datetime-local"
            name="repairJobEnd"
            id="repairJobEnd"
            value={formData.repairJobEnd}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

           {/* Vehicle Document */}
<div>
  <label className="block text-sm font-medium mb-1">VEHICLE DOCUMENT/TOOLS</label>
  <div className="flex flex-wrap gap-6 pl-2">
    {["Owner Tool Kit", "Owner Manual", "Warranty Guide Book", "Others"].map((type) => (
      <div key={type} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="vehicleDocument"
          value={type}
          checked={formData.vehicleDocument.includes(type)}
          onChange={(e) => {
            const value = e.target.value;
            const isChecked = e.target.checked;
            setFormData((prev) => ({
              ...prev,
              vehicleDocument: isChecked
                ? [...prev.vehicleDocument, value]
                : prev.vehicleDocument.filter((item) => item !== value),
            }));
          }}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
        />
        <span>{type}</span>

        {/* Show input field if "Others" is checked */}
        {type === "Others" && formData.vehicleDocument.includes("Others") && (
          <input
            type="text"
            name="vehicleDocumentOthers"
            placeholder="Please specify"
            value={formData.vehicleDocumentOthers || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                vehicleDocumentOthers: e.target.value,
              }))
            }
            className="ml-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    ))}
  </div>
</div>


            {/* Vehicle Visual Checking */}
          <div>
          <label className="block text-sm font-medium mb-1">VEHICLE VISUAL CHECKING</label>
          <div className="flex flex-col space-y-2 pl-2">
            {["Dent", "Scratch", "Broken", "Missing"].map((type) => (
              <label key={type} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="vehicleVisual"
                  value={type}
                  checked={formData.vehicleVisual.includes(type)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      vehicleVisual: isChecked
                        ? [...prev.vehicleVisual, value]
                        : prev.vehicleVisual.filter((item) => item !== value),
                    }));
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>


        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
           type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Next
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default RepairJobForm;

