export const CUSTOMER_DETAILS_FIELDS = [
  {
    label: "Date",
    value: "date",
    type: "date",
    is_customer_details: false,
  },
  {
    label: "Customer Name",
    value: "name",
    type: "text",
    is_customer_details: true,
  },
  {
    label: "Contact Number",
    value: "contact_number",
    type: "text",
    is_customer_details: true,
  },
  {
    label: "Model",
    value: "model",
    type: "text",
    is_customer_details: false,
  },
  {
    label: "Engine/Frame No.",
    value: "engine_number",
    type: "text",
    is_customer_details: false,
  },
  {
    label: "Mileage",
    value: "mileage",
    type: "text",
    is_customer_details: false,
  },
  {
    label: "Purchase Date",
    value: "purchase_date",
    type: "date",
    is_customer_details: false,
  },
  {
    label: "Address",
    value: "address",
    type: "text",
    is_customer_details: true,
  },
  {
    label: "Estimated Repair Time",
    value: "estimated_repair_time",
    type: "text",
    is_customer_details: false,
  },
  {
    label: "Repair Start Time",
    value: "repair_start",
    type: "time",
    is_customer_details: false,
  },
  {
    label: "Repair End Time",
    value: "repair_end",
    type: "time",
    is_customer_details: false,
  },
  {
    label: "Category",
    value: "category",
    type: "select",
    is_customer_details: false,
  },
  {
    label: "Select Mechanic",
    value: "mechanics",
    type: "multiple_select",
    is_customer_details: false,
  },
  {
    label: "Dealers Name",
    value: "dealers_name",
    type: "text",
    is_customer_details: false,
  },
];

export const BOTTOM_FIELDS = [
  {
    label: "Your Next Service Schedule is:",
    value: "next_schedule_date",
    type: "date",
  },
  {
    label: "KMS",
    value: "next_schedule_kms",
    type: "text",
  },
  {
    label: "General Remarks",
    value: "general_remarks",
    type: "text",
  },
  {
    label: "Salesrep/Service Advisor",
    value: "service_advisor",
    type: "text",
  },
  {
    label: "BM/BS",
    value: "branch_manager",
    type: "text",
  },
];
