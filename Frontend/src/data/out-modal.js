export const outFields = () => [
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
      name: "dateOfReturn",
      label: "Date of Return",
      type: "datetime-local",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "Enter Quantity",
    //   additionalLabels: [
    //     { label: "Rent per day", id: "rentPerDay" },
    //     { label: "Total Price", id: "totalPrice" },
    //     { label: "Deposited Amount", id: "depositedAmount" },
    //   ],
    },
    {
      name: "pricePerDay",
      label: "Price per day",
      type: "number",
      placeholder: "Price Per Day"
    },
    {
      name: "deposit",
      label: "Deposit",
      type: "number",
      placeholder: "Deposit Amount" // Take the value from deposit master
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
  