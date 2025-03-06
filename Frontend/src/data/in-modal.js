export const inFields = () => [
    {
      name: "customer",
      label: "Select Customer",
      type: "select",
      options: ["customer 1","customer 2","customer 3"],
      placeholder: "Select Customer",
    },
    {
      name: "category",
      label: "Select Category",
      type: "select",
      options: ["category 1","category 2","category 3"],
      placeholder: "Select Category",
    },
    {
      name: "subcategory",
      label: "Select Subcategory",
      type: "select",
      options: ["sub-category 1","sub-category 2","sub-category 3"],
      placeholder: "Select Subcategory",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "Enter Quantity",
    },
    {
      name: "rent",
      label: "Rent",
      type: "number",
      placeholder: "Enter Rent",
    },
    {
      name: "calculatedRent",
      label: "Calculated Rent",
      type: "number",
      placeholder: "Calculated Rent", // calculate rent from the date on which it was rented to today's date
      readonly: true, // Assuming this is a calculated field
    },
    {
      name: "amountPaid",
      label: "Amount Paid",
      type: "number",
      placeholder: "Amount Paid",
    },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      options: ["Cash", "Online", "Cheque"],
      placeholder: "Select Payment Mode",
    },
    {
      name: "receiverName",
      label: "Receiver Name",
      type: "text",
      placeholder: "Receiver Name",
    },
    {
      name: "receiverAadhar",
      label: "Receiver Aadhar",
      type: "file",
    },
    {
      name: "otherDocument",
      label: "Other Document",
      type: "file",
    },
    {
      name: "remarks",
      label: "Remarks",
      type: "textarea",
      placeholder: "Remarks (Optional)",
    },
  ];
  