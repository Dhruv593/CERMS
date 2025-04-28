import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
const InOutModal = ({
  show,
  onClose,
  initialData,
  onSubmit,
  mode, // 'in' or 'out'
  mainFields = [],
  cartFields = [],
  customer,
  materialDataOfCustomer =[],
  onCustomerChange,
  getDepositRate,
  getRentRate,
  onCategoryChange
}) => {
  
  // Ensure initialData is an object even if null
  const safeInitialData = initialData || {};

  // Build initial state for the main form
  const initialMainState = {
    ...mainFields.reduce((acc, field) => {
    acc[field.name] = safeInitialData[field.name] || field.initialValue || '';
    return acc;
    }, {}),
    customer: safeInitialData.customer || '', // Ensure customer is included
  };  
  const [mainForm, setMainForm] = useState(initialMainState);

  // Cart items state
  const [cartItems, setCartItems] = useState(safeInitialData.cartItems || []);

  const [returnedQuantities, setReturnedQuantities] = useState(new Map());
  const today = new Date().toISOString().split('T')[0];

  // Build initial state for cart form
  const initialCartState = {};
  cartFields.forEach(field => {
    if (field.type === 'date' && field.name === 'returnDate') {
      initialCartState[field.name] = field.initialValue || new Date().toISOString().split('T')[0];
    } else {
      initialCartState[field.name] = field.initialValue || '';
    }
  });
  const [cartForm, setCartForm] = useState(initialCartState);

  useEffect(() => {
    const newReturnedQuantities = new Map();
    cartItems.forEach(item => {
      const key = `${item.category}-${item.subcategory}-${item.invoice}`;
      const currentReturned = newReturnedQuantities.get(key) || 0;
      newReturnedQuantities.set(key, currentReturned + Number(item.returnQuantity || 0));
    });
    setReturnedQuantities(newReturnedQuantities);
  }, [cartItems]);

  // Add this validation function at the top of the component
  const isValidImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1024 * 1024; // 1MB in bytes
  
    if (!file) return false;
    
    // Check file type
    if (!validTypes.includes(file.type)) {
      // alert('Please upload only JPG or PNG image files');
      toast.error("Please upload only JPG or PNG image files")
      return false;
    }
    
    // Check file size
    if (file.size > maxSize) {
      // alert('File size must be less than 1MB');
      toast.error("File size must be less than 1MB")
      return false;
    }
  
    return true;
  };

// Modify the handleMainFieldChange function
const handleMainFieldChange = (e, fieldName) => {
  const { value, files } = e.target;
  
  // Handle file uploads for aadharPhoto and other_proof
  if (files && (fieldName === 'aadharPhoto' || fieldName === 'other_proof')) {
    const file = files[0];
    if (!isValidImageFile(file)) {
      e.target.value = ''; // Reset the file input
      return;
    }
  }

  setMainForm((prev) => ({
    ...prev,
    [fieldName]: files ? files[0] : value
  }));

  if (fieldName === 'customer') {
    if (mode === 'in' && onCustomerChange) {
      onCustomerChange(value);
      setCartForm(initialCartState);
    }
    console.log('Customer selected:', value);
  }
};

  // Handler for cart form field changes
  const handleCartFieldChange = (e, fieldName) => {
    const { value } = e.target;
    
    if (fieldName === 'returnQuantity') {
        const selectedMaterial = materialDataOfCustomer.find(item => 
            item.category === cartForm.category && 
            item.subcategory === cartForm.subcategory &&
            item.quantity === cartForm.invoice
        );
        
        if (selectedMaterial) {
            const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
            const returnedQty = returnedQuantities.get(key) || 0;
            const availableQty = Number(selectedMaterial.quantity) - returnedQty;
            
            if (Number(value) > availableQty) {
                alert(`Return quantity cannot exceed available quantity (${availableQty})`);
                return;
            }
        }
    }
    
    setCartForm((prev) => ({ ...prev, [fieldName]: value }));
    if (fieldName === 'category' && onCategoryChange) {
        onCategoryChange(value);
        setCartForm(prev => ({ ...prev, subcategory: '', invoice: '' }));
    }
};


  const handleCalculations = async () => {
    try {
        // Fetch the rate asynchronously
        const depositRate = getDepositRate ? await getDepositRate(cartForm.category, cartForm.subcategory) : 0;
        console.log('depositRate', depositRate);

        const rentRate = getRentRate ? await getRentRate(cartForm.category, cartForm.subcategory) : 0;
        console.log('rentRate', rentRate);

        console.log('materialDataOfCustomer', materialDataOfCustomer);

        let totalDays = 0;
        let originalDeposit = 0;
        let originalQuantity = 0;
        let returnQuantity = 0;
        let originalRentDate = null;
        let originalOutId = null;

        if (mode === 'in') {
            console.log('Processing IN mode calculation');
            console.log('Cart form values:', cartForm);
            
            // The invoice field in IN mode contains the formatted string like "8 (OUT-12345 - date)"
            // We need to extract the outId from this string
            const invoiceValue = cartForm.invoice || '';
            console.log('Selected invoice/quantity value:', invoiceValue);
            
            // Try to extract the OUT ID from the format "quantity (OUT-id - date)"
            const outIdMatch = invoiceValue.match(/\(OUT-(\d+)/);
            if (outIdMatch && outIdMatch[1]) {
                originalOutId = outIdMatch[1];
                console.log('Extracted OUT ID:', originalOutId);
            }

            // First try to find the exact rental entry by matching outId
            let materialEntry = null;
            if (originalOutId) {
                materialEntry = materialDataOfCustomer.find(
                    entry => entry.category === cartForm.category && 
                            entry.subcategory === cartForm.subcategory &&
                            entry.outId == originalOutId
                );
                console.log('Found entry by outId:', materialEntry);
            }
            
            // If not found by outId, try finding by quantity as fallback
            if (!materialEntry) {
                // Extract just the quantity number from the invoice value
                const quantityMatch = invoiceValue.match(/^(\d+)/);
                const originalQty = quantityMatch ? quantityMatch[1] : null;
                
                if (originalQty) {
                    materialEntry = materialDataOfCustomer.find(
                        entry => entry.category === cartForm.category && 
                                entry.subcategory === cartForm.subcategory &&
                                entry.quantity == originalQty
                    );
                    console.log('Found entry by quantity:', materialEntry);
                }
            }
            
            // If still not found, log the error
            if (!materialEntry) {
                console.error('Could not find matching material entry for return. Available entries:', 
                    materialDataOfCustomer.filter(entry => 
                        entry.category === cartForm.category && entry.subcategory === cartForm.subcategory
                    )
                );
                alert('Error: Could not find the original rental entry. Please try again.');
                return;
            }

            // Get the original rental date (might be named created_at, date, etc.)
            originalRentDate = materialEntry.created_at || materialEntry.date || materialEntry.outDate;
            console.log('Original rent date:', originalRentDate);
            
            if (!originalRentDate) {
                console.error('Original rent date not found in entry:', materialEntry);
                // Try to extract date from the invoice value as fallback
                const dateMatch = invoiceValue.match(/- ([^)]+)\)/);
                if (dateMatch && dateMatch[1]) {
                    originalRentDate = new Date(dateMatch[1]);
                    console.log('Using date extracted from invoice string:', originalRentDate);
                } else {
                    // If still no date, use a fallback
                    console.warn('Using current date minus 1 day as fallback for missing rent date');
                    const fallbackDate = new Date();
                    fallbackDate.setDate(fallbackDate.getDate() - 1);
                    originalRentDate = fallbackDate;
                }
            }
            
            if (originalRentDate && cartForm.returnDate) {
                const startDate = new Date(originalRentDate);
                const returnDate = new Date(cartForm.returnDate);
                
                console.log('Start date for calculation:', startDate);
                console.log('Return date for calculation:', returnDate);
                
                if (isNaN(startDate.getTime())) {
                    console.error('Invalid start date:', originalRentDate);
                    alert('Error: Invalid rental date. Using today as fallback.');
                    // Use fallback
                    const fallbackDate = new Date();
                    fallbackDate.setDate(fallbackDate.getDate() - 1);
                    startDate = fallbackDate;
                }
                
                const timeDifference = returnDate - startDate;
                totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                totalDays = Math.max(1, totalDays); // Minimum 1 day
                
                console.log(`Days calculation: From ${startDate.toLocaleDateString()} to ${returnDate.toLocaleDateString()} = ${totalDays} days`);
            } else {
                console.error('Missing originalRentDate or returnDate for days calculation');
                totalDays = 1; // Use minimum 1 day as fallback
            }
            
            // Get original deposit and quantity, with better error handling
            if (materialEntry.deposit !== undefined) {
                originalDeposit = parseFloat(materialEntry.deposit) || 0;
            } else if (materialEntry.calculatedDeposit !== undefined) {
                originalDeposit = parseFloat(materialEntry.calculatedDeposit) || 0;
            } else {
                // If no deposit found in the entry, try to calculate it
                console.warn('No deposit found in material entry, calculating based on deposit rate');
                const originalQty = parseInt(materialEntry.quantity) || 0;
                const originalDays = parseInt(materialEntry.totalDays) || 1;
                originalDeposit = depositRate * originalQty * originalDays;
            }
            
            // Get the original quantity
            originalQuantity = parseInt(materialEntry.quantity) || 0;
            
            console.log(`Original rental: Deposit=${originalDeposit}, Quantity=${originalQuantity}, OutId=${originalOutId}`);
            
            // Get return quantity from form
            returnQuantity = parseInt(cartForm.returnQuantity) || 0;
            
            if (returnQuantity > originalQuantity) {
                alert(`Return quantity (${returnQuantity}) cannot exceed original quantity (${originalQuantity})`);
                return;
            }
        } else if (mode === 'out' && cartForm.date) {
            // Existing OUT mode calculation
            const todaysDate = new Date();
            console.log('todaysDate', todaysDate);

            const returnDateString = cartForm.date;
            const returnDate = new Date(returnDateString);
            console.log('cartForm return date', returnDate);

            const timeDifference = returnDate - todaysDate;
            totalDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            totalDays = Math.max(1, totalDays); // Minimum 1 day
        }

        console.log('totalDays', totalDays);

        // Perform calculations based on mode
        if (mode === 'in') {
            // For IN mode, calculate based on return quantity and original deposit
            
            // Calculate proportionate deposit (if returning partial quantity)
            const proportionReturned = returnQuantity / originalQuantity;
            const applicableDeposit = originalDeposit * proportionReturned;
            
            // Calculate rent for the returned items
            const rent = rentRate * returnQuantity;
            const totalAmount = rent * totalDays;
            
            // Calculate deposit return
            const depositReturn = applicableDeposit - totalAmount;
            
            console.log(`IN calculation details:
                Return quantity: ${returnQuantity}
                Original quantity: ${originalQuantity}
                Proportion returned: ${proportionReturned.toFixed(2)}
                Applicable deposit: ${applicableDeposit.toFixed(2)}
                Rent rate: ${rentRate} per item per day
                Total days: ${totalDays}
                Total amount: ${rent} × ${totalDays} days = ${totalAmount.toFixed(2)}
                Deposit return: ${applicableDeposit.toFixed(2)} - ${totalAmount.toFixed(2)} = ${depositReturn.toFixed(2)}
            `);
            
            // Create a new cart item with the calculated values
            const newCartItem = {
                ...cartForm,
                totalDays,
                rent,
                totalAmount,
                deposit: applicableDeposit,
                depositReturn,
                originalOutId,
                originalRentDate: originalRentDate ? new Date(originalRentDate).toLocaleDateString() : 'Unknown'
            };

            console.log('New IN cart item with calculations:', newCartItem);

            // Update the cart items state
            setCartItems((prev) => [...prev, newCartItem]);
            setCartForm(initialCartState);
            
        } else {
            // Existing OUT mode calculation
            const quantityField = 'quantity';
            const quantity = Number(cartForm[quantityField]) || 1;
            console.log('quantity', quantity);

            const rent = rentRate * quantity;
            const totalAmount = rent * totalDays;
            
            // For OUT mode, deposit should be: deposit_rate × days × quantity
            const depositOut = depositRate * totalDays * quantity;
            console.log('depositOut (rate × days × quantity):', `${depositRate} × ${totalDays} × ${quantity} = ${depositOut}`);
            
            // Calculate the total deposit by adding new item's deposit to existing items' total
            const existingItemsDeposit = cartItems.reduce((sum, item) => sum + (Number(item.deposit) || 0), 0);
            const newTotalDeposit = existingItemsDeposit + depositOut;
            
            console.log('Previous items total deposit:', existingItemsDeposit);
            console.log('New total deposit after adding this item:', newTotalDeposit);
            
            setMainForm((prevForm) => ({
                ...prevForm,
                deposit: newTotalDeposit
            }));
            
            // Create a new cart item with the calculated values
            const newCartItem = {
                ...cartForm,
                totalDays,
                rent,
                totalAmount,
                deposit: depositOut,
                depositReturn: depositOut - totalAmount,
                calculatedDeposit: depositOut
            };

            console.log('New OUT cart item with calculations:', newCartItem);

            // Update the cart items state
            setCartItems((prev) => [...prev, newCartItem]);
            setCartForm(initialCartState);
        }
    } catch (error) {
        console.error('Error calculating rate:', error);
    }
};

  

  // Handler to add a cart item

  const handleAddCartItem = async () => {
    for (const field of cartFields) {
      if (!cartForm[field.name]) {
        // alert(`Please fill "${field.label}"`);
        toast.error(`Please fill "${field.label}"`)
        return;
      }
    }
    await handleCalculations();
  };

  // Handle deletion of a cart item - need to update the total deposit when an item is removed
  const handleDeleteCartItem = (index) => {
    const itemToDelete = cartItems[index];
    
    if (itemToDelete) {
        const key = `${itemToDelete.category}-${itemToDelete.subcategory}-${itemToDelete.invoice}`;
        setReturnedQuantities(prev => {
            const newMap = new Map(prev);
            const currentQty = newMap.get(key) || 0;
            const newQty = currentQty - Number(itemToDelete.returnQuantity);
            if (newQty <= 0) {
                newMap.delete(key);
            } else {
                newMap.set(key, newQty);
            }
            return newMap;
        });
    }
    
    if (mode === 'out') {
        const itemToDelete = cartItems[index];
        if (itemToDelete) {
            const itemDeposit = Number(itemToDelete.deposit) || 0;
            const currentTotalDeposit = Number(mainForm.deposit) || 0;
            const newTotalDeposit = Math.max(0, currentTotalDeposit - itemDeposit);
            
            console.log(`Removing item deposit: ${itemDeposit} from total: ${currentTotalDeposit}`);
            console.log(`New total deposit: ${newTotalDeposit}`);
            
            // Update main form with new total deposit
            setMainForm(prev => ({
                ...prev,
                deposit: newTotalDeposit
            }));
        }
    }
    
    // Remove the item from the cart
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Compute summary values from cart items
  const summary = {
    totalAmount: cartItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0),
    depositReturn: cartItems.reduce((sum, item) => sum + (item.depositReturn || 0), 0)
  };

  // Update main form computed fields when summary changes
  useEffect(() => {
    setMainForm((prev) => ({
      ...prev,
      totalAmount: summary.totalAmount,
      depositReturn: summary.depositReturn
    }));
  }, [summary.totalAmount, summary.depositReturn]);

  // Final submit handler
  const handleSubmit = () => {
    // Ensure customer is included in the data
    const data = {
      ...mainForm,
      customer: mainForm.customer, // Explicitly include customer
      cartItems
    };
    console.log('Submitting data with customer:', data.customer);
    onSubmit(data);
  };

  // Define table columns for the cart items section based on mode
  const tableColumns = mode === 'in'
    ? [
        { label: '#', key: 'index', priorityMobile: true },
        { label: 'Category', key: 'category', priorityMobile: true },
        { label: 'Subcategory', key: 'subcategory', priorityMobile: true },
        { label: 'Total Quantity', key: 'invoice', priorityMobile: false },
        { label: 'Return Qty', key: 'returnQuantity', priorityMobile: true },
        { label: 'Return Date', key: 'returnDate', priorityMobile: false },
        { label: 'Days', key: 'totalDays', priorityMobile: false },
        { label: 'Rent', key: 'rent', priorityMobile: false },
        { label: 'Amount', key: 'totalAmount', priorityMobile: true },
        { label: 'Deposit', key: 'deposit', priorityMobile: false },
        { label: 'Return', key: 'depositReturn', priorityMobile: true },
        { label: 'Action', key: 'action', priorityMobile: true }
      ]
    : [
        { label: '#', key: 'index', priorityMobile: true },
        { label: 'Category', key: 'category', priorityMobile: true },
        { label: 'Subcategory', key: 'subcategory', priorityMobile: true },
        { label: 'Quantity', key: 'quantity', priorityMobile: true },
        { label: 'Return Date', key: 'returnDate', priorityMobile: true },
        { label: 'Action', key: 'action', priorityMobile: true }
      ];

  // State to track screen width for responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if we're on mobile view
  const isMobileView = windowWidth < 768;

  return (
    <Modal show={show} onHide={onClose} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="fw-bold text-dark">
          {safeInitialData && Object.keys(safeInitialData).length > 0 
            ? `Edit ${mode.toUpperCase()} Entry` 
            : `Add New ${mode.toUpperCase()} Entry`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Form>
          {/* Customer Selection Section */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Select Customer</h5>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="customer">
                <Form.Label>Select Customer</Form.Label>
                <Form.Select
                    value={mainForm.customer}
                  onChange={(e) => handleMainFieldChange(e, 'customer')}
                    className="rounded-2"
                >
                  <option value="">Select Customer</option>
                  {customer.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          </div>
          
          {/* Material Information Section */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Material Information</h5>
            {mode === 'in' && !mainForm.customer ? (
              <div className="alert alert-warning">
                Please select a customer first to view available categories and subcategories.
              </div>
            ) : (
            <Row className="g-3">
              {cartFields.map((field) => (
                <Col xs={12} md={field.width || 3} key={field.name}>
                  <Form.Group controlId={`cart_${field.name}`}>
                    <Form.Label className="fw-medium text-secondary small mb-1">
                      {field.name === 'invoice' ? field.label : 'Quantity' }
                    </Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        value={cartForm[field.name]} 
                        onChange={(e) => handleCartFieldChange(e, field.name)}
                        className="rounded-2"
                        disabled={mode === 'in' && (
                          !mainForm.customer || 
                          (field.name === 'subcategory' && !cartForm.category) ||
                          (field.name === 'invoice' && (!cartForm.category || !cartForm.subcategory))
                        )}
                      >
                        <option value="">{field.name === 'invoice' ? 'Select Quantity' : (field.placeholder || `Select ${field.label}`)}</option>
                        {field.options && (
                          field.name === 'invoice' ? 
                            materialDataOfCustomer
                              .filter(item => 
                                item.category === cartForm.category && 
                                item.subcategory === cartForm.subcategory
                              )
                              .map(item => (
                                <option key={item.invoice} value={item.quantity}>
                                  {item.quantity}
                                </option>
                              ))
                          : 
                          field.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))
                        )}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type={field.type}
                        value={cartForm[field.name]}
                        onChange={(e) => handleCartFieldChange(e, field.name)}
                        placeholder={field.placeholder || ''}
                        className="rounded-2"
                          min={field.type === 'date' ? today : undefined}
                          disabled={mode === 'in' && !mainForm.customer}
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
              <Col xs={12} md={2} className="d-flex align-items-end">
                <Button 
                  variant="primary" 
                  onClick={handleAddCartItem} 
                  className="w-100 mt-2 mt-md-0 rounded-2"
                    disabled={mode === 'in' && !mainForm.customer}
                >
                  Add Item
                </Button>
              </Col>
            </Row>
            )}
          </div>
          

          {/* Card Rendering for IN Mode */}
{mode === 'in' && cartForm.category && cartForm.subcategory && (
    <Card className="mb-3 border-0 overflow-hidden" 
        style={{ 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e2f1ff 100%)'
        }}>
        <div className="position-absolute" style={{
            top: 0, right: 0, width: '150px', height: '150px',
            background: 'radial-gradient(circle at center, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0) 70%)',
            borderRadius: '0 0 0 100%',
            transform: 'translate(30%, -30%)',
            zIndex: 0
        }}></div>
        
        <Card.Body className="p-4 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <Card.Title className="fs-5 fw-bold text-dark mb-0 d-flex align-items-center">
                        <i className="feather icon-package text-primary me-2" style={{ fontSize: '1.3rem' }}></i>
                        {cartForm.subcategory}
                    </Card.Title>
                    <small className="text-muted d-flex align-items-center mt-1">
                        <i className="feather icon-tag text-secondary me-1" style={{ fontSize: '0.85rem' }}></i>
                        {cartForm.category}
                    </small>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ 
                        width: '48px', 
                        height: '48px', 
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                        boxShadow: '0 4px 10px rgba(13, 110, 253, 0.25)'
                    }}>
                    <i className="feather icon-box text-white" style={{ fontSize: '1.4rem' }}></i>
                </div>
            </div>
            
            <hr className="my-3" style={{ opacity: 0.15, borderColor: '#0d6efd' }} />
            
            <div className="row g-3 mt-1">
                <div className="col-6">
                    <div className="p-3 rounded-3 bg-white h-100" 
                        style={{ 
                            borderLeft: '4px solid #0d6efd',
                            cursor: 'default'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0.05) 100%)'
                                }}>
                                <i className="feather icon-file-text text-primary" style={{ fontSize: '1rem' }}></i>
                            </div>
                            <div>
                                <div className="small text-muted">Selected Quantity</div>
                                <div className="fw-bold fs-5 text-primary">
                                    {cartForm.invoice || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="p-3 rounded-3 bg-white h-100" 
                        style={{ 
                            borderLeft: '4px solid #198754',
                            cursor: 'default'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.15) 0%, rgba(25, 135, 84, 0.05) 100%)'
                                }}>
                                <i className="feather icon-refresh-cw text-success" style={{ fontSize: '1rem' }}></i>
                            </div>
                            <div>
                                <div className="small text-muted">Available to Return</div>
                                <div className="fw-bold fs-5 text-success">
                                    {(() => {
                                        const selectedMaterial = materialDataOfCustomer.find(item => 
                                            item.category === cartForm.category && 
                                            item.subcategory === cartForm.subcategory &&
                                            item.quantity === cartForm.invoice
                                        );
                                        if (!selectedMaterial) return 0;
                                        
                                        const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
                                        const returnedQty = returnedQuantities.get(key) || 0;
                                        return Math.max(0, Number(selectedMaterial.quantity) - returnedQty);
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Progress bar showing return status */}
            {cartForm.invoice && (
                <div className="mt-3 p-3 rounded-3 bg-white">
                    <div className="d-flex justify-content-between align-items-center small mb-2">
                        <span className="d-flex align-items-center text-secondary">
                            <i className="feather icon-bar-chart-2 me-1"></i>
                            Return Progress
                        </span>
                        <span className="badge" style={{ 
                            background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                        }}>{(() => {
                            const selectedMaterial = materialDataOfCustomer.find(item => 
                                item.category === cartForm.category && 
                                item.subcategory === cartForm.subcategory &&
                                item.quantity === cartForm.invoice
                            );
                            if (!selectedMaterial) return '0%';
                            
                            const original = Number(selectedMaterial.quantity) || 0;
                            const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
                            const returnedQty = returnedQuantities.get(key) || 0;
                            const percentage = Math.min(100, Math.round((returnedQty / original) * 100)) || 0;
                            return `${percentage}%`;
                        })()}</span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '5px', backgroundColor: '#e9ecef' }}>
                        <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                                width: (() => {
                                    const selectedMaterial = materialDataOfCustomer.find(item => 
                                        item.category === cartForm.category && 
                                        item.subcategory === cartForm.subcategory &&
                                        item.quantity === cartForm.invoice
                                    );
                                    if (!selectedMaterial) return '0%';
                                    
                                    const original = Number(selectedMaterial.quantity) || 0;
                                    const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
                                    const returnedQty = returnedQuantities.get(key) || 0;
                                    const percentage = Math.min(100, Math.round((returnedQty / original) * 100)) || 0;
                                    return `${percentage}%`;
                                })(),
                                background: 'linear-gradient(90deg, #0d6efd 0%, #0a58ca 100%)',
                                borderRadius: '5px',
                                transition: 'width 0.5s ease'
                            }}
                            aria-valuenow={(() => {
                                const selectedMaterial = materialDataOfCustomer.find(item => 
                                    item.category === cartForm.category && 
                                    item.subcategory === cartForm.subcategory &&
                                    item.quantity === cartForm.invoice
                                );
                                if (!selectedMaterial) return 0;
                                
                                const original = Number(selectedMaterial.quantity) || 0;
                                const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
                                const returnedQty = returnedQuantities.get(key) || 0;
                                return Math.min(100, Math.round((returnedQty / original) * 100)) || 0;
                            })()} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        ></div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center small text-muted mt-2">
                        <span>
                            <i className="feather icon-check-circle text-success me-1"></i>
                            Returned: {(() => {
                                const key = `${cartForm.category}-${cartForm.subcategory}-${cartForm.invoice}`;
                                return returnedQuantities.get(key) || 0;
                            })()}
                        </span>
                        <span>
                            <i className="feather icon-archive text-primary me-1"></i>
                            Total: {(() => {
                                const selectedMaterial = materialDataOfCustomer.find(item => 
                                    item.category === cartForm.category && 
                                    item.subcategory === cartForm.subcategory &&
                                    item.quantity === cartForm.invoice
                                );
                                return selectedMaterial ? selectedMaterial.quantity : 0;
                            })()}
                        </span>
                    </div>
                </div>
            )}
        </Card.Body>
    </Card>
)}

          

      

          {/* Cart Items Section */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Selected Items</h5>
              
              {/* Mobile View - Card Layout */}
              {isMobileView ? (
                <div>
                  {cartItems.map((item, index) => (
                    <div key={index} className="border rounded mb-3 shadow-sm">
                      <div className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                        <div className="fw-semibold">
                          #{index + 1} {item.category} - {item.subcategory}
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteCartItem(index)}
                          className="rounded-2"
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="p-3">
                        {mode === 'in' ? (
                          <>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Return Quantity:</span>
                              <span className="fw-medium">{item.returnQuantity}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Return Date:</span>
                              <span>{item.returnDate}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Invoice:</span>
                              <span>{item.invoice}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Total Amount:</span>
                              <span className="fw-semibold">${item.totalAmount}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                              <span>Deposit Return:</span>
                              <span className={`fw-semibold ${item.depositReturn > 0 ? 'text-success' : 'text-danger'}`}>
                                ${item.depositReturn}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between py-2 border-bottom">
                              <span>Quantity:</span>
                              <span className="fw-medium">{item.quantity}</span>
                            </div>
                            <div className="d-flex justify-content-between py-2">
                              <span>Return Date:</span>
                              <span>{item.returnDate}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop View - Table Layout */
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead>
                      <tr className="bg-light">
                        {tableColumns.map((col) => (
                          <th key={col.key} className="small fw-semibold py-3">
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index} className="small">
                          <td className="py-3">{index + 1}</td>
                          {mode === 'in' ? (
                            <>
                              <td>{item.category}</td>
                              <td>{item.subcategory}</td>
                              <td>{item.invoice}</td>
                              <td>{item.returnQuantity}</td>
                              <td>{item.returnDate}</td>
                              <td>{item.totalDays}</td>
                              <td className="fw-medium">₹{item.rent}</td>
                              <td className="fw-medium">₹{item.totalAmount}</td>
                              <td className="fw-medium">₹{item.deposit}</td>
                              <td className={`fw-medium ${item.depositReturn > 0 ? 'text-success' : 'text-danger'}`}>
                              ₹{item.depositReturn}
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{item.category}</td>
                              <td>{item.subcategory}</td>
                              <td>{item.quantity}</td>
                              <td>{item.date}</td>
                            </>
                          )}
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteCartItem(index)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              
              {/* Summary Section */}
              {mode === 'in' && cartItems.length > 0 && (
                <div className={`bg-light rounded p-3 mt-3 ${isMobileView ? 'd-flex flex-column' : 'd-flex justify-content-end'}`}>
                  <div className={isMobileView ? 'mb-2' : 'me-4'}>
                    <span className="fw-semibold text-secondary">Total Amount:</span>
                    <span className="ms-2 fw-semibold text-primary">
                    ₹{summary.totalAmount}
                    </span>
                  </div>
                  <div>
                    <span className="fw-semibold text-secondary">Deposit Return:</span>
                    <span className={`ms-2 fw-semibold ${summary.depositReturn > 0 ? 'text-success' : 'text-danger'}`}>
                    ₹{summary.depositReturn}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Details Section */}
<div className="bg-white rounded shadow-sm p-4 mb-4">
  <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Client & Payment Details</h5>
  <Row className="g-3">
    {mainFields.map((field) => (
      <Col xs={12} md={field.width || 4} key={field.name}>
        <Form.Group controlId={`main_${field.name}`}>
          <Form.Label className="fw-medium text-secondary small mb-1">{field.label}</Form.Label>
          {field.type === 'select' ? (
            <Form.Select
              value={mainForm[field.name]} 
              onChange={(e) => handleMainFieldChange(e, field.name)}
              className="rounded-2"
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options &&
                field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
            </Form.Select>
          ) : field.type === 'textarea' ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={mainForm[field.name]}
              onChange={(e) => handleMainFieldChange(e, field.name)}
              placeholder={field.placeholder || ''}
              readOnly={field.readOnly || false}
              className={`rounded-2 ${field.readOnly ? 'bg-light' : ''}`}
            />
          ) : field.type === 'file' ? (
            <>
              <Form.Control
                type="file"
                onChange={(e) => handleMainFieldChange(e, field.name)}
                accept={field.accept || 'image/jpeg,image/png'}
                className="rounded-2"
              />
              <Form.Text className="text-muted">
              Only JPG and PNG images up to <span className="fw-bold">1 MB</span> are accepted
              </Form.Text>
            </>
          ) : (
            <Form.Control
              type={field.type}
              value={mainForm[field.name]}
              onChange={(e) => handleMainFieldChange(e, field.name)}
              placeholder={field.placeholder || ''}
              readOnly={field.readOnly || false}
              className={`rounded-2 ${field.readOnly ? 'bg-light' : ''}`}
            />
          )}
        </Form.Group>
      </Col>
    ))}
  </Row>
</div>

        </Form>
      </Modal.Body>
      <Modal.Footer className="border-top p-3">
        <div className={`d-flex ${isMobileView ? 'flex-column w-100' : 'justify-content-end'}`}>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className={`${isMobileView ? 'w-100 mb-2' : 'me-2'} rounded-2`}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            className={`${isMobileView ? 'w-100' : ''} rounded-2`}
          >
            {safeInitialData && Object.keys(safeInitialData).length > 0 ? 'Update' : 'Submit'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default InOutModal;