import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Table } from 'react-bootstrap';

const InOutModal = ({
  show,
  onClose,
  initialData,
  onSubmit,
  mode, // 'in' or 'out'
  mainFields = [],
  cartFields = [],
  customer,
  onCustomerChange,
  getDepositRate,
  onCategoryChange
}) => {
  // Ensure initialData is an object even if null
  const safeInitialData = initialData || {};

  // Build initial state for the main form
  const initialMainState = mainFields.reduce((acc, field) => {
    acc[field.name] = safeInitialData[field.name] || field.initialValue || '';
    return acc;
  }, {});
  const [mainForm, setMainForm] = useState(initialMainState);

  // Cart items state
  const [cartItems, setCartItems] = useState(safeInitialData.cartItems || []);

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

  // Handler for main form field changes
  const handleMainFieldChange = (e, fieldName) => {
    const { value, files } = e.target;
    setMainForm((prev) => ({
      ...prev,
      [fieldName]: files ? files[0] : value
    }));
    if (fieldName === 'customer' && mode === 'in') {
      onCustomerChange(value);
    }
  };

  // Handler for cart form field changes
  const handleCartFieldChange = (e, fieldName) => {
    const { value } = e.target;
    console.log(`fieldName: ${fieldName} \nvalue: ${value} `);
    setCartForm((prev) => ({ ...prev, [fieldName]: value }));
    if (fieldName === 'category' && onCategoryChange) {
      onCategoryChange(value);
    }
    console.log(`cartForm: ${cartForm}`);
  };

  // Handler to add a cart item
  const handleAddCartItem = () => {
    // Validate required cart fields
    for (const field of cartFields) {
      if (!cartForm[field.name]) {
        alert(`Please fill "${field.label}"`);
        return;
      }
    }

    // Calculations
    const rate = getDepositRate ? getDepositRate(cartForm.category, cartForm.subcategory) : 0;
    const quantityField = mode === 'in' ? 'returnQuantity' : 'quantity';
    const quantity = Number(cartForm[quantityField]) || 1;
    const totalDays = 5; // Example: 5 days
    const rent = rate * quantity;
    const totalAmount = rent * totalDays;
    const deposit = rate * quantity * 2; // Example: deposit is twice daily rent
    const depositReturn = deposit - totalAmount;

    const newCartItem = {
      ...cartForm,
      totalDays,
      rent,
      totalAmount,
      deposit,
      depositReturn
    };

    setCartItems((prev) => [...prev, newCartItem]);
    setCartForm(initialCartState);
  };

  // Handler to delete a cart item by its index
  const handleDeleteCartItem = (index) => {
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
    const data = {
      ...mainForm,
      cartItems
    };
    onSubmit(data);
  };

  // Define table columns for the cart items section based on mode
  const tableColumns = mode === 'in'
    ? [
        { label: '#', key: 'index', priorityMobile: true },
        { label: 'Category', key: 'category', priorityMobile: true },
        { label: 'Subcategory', key: 'subcategory', priorityMobile: true },
        { label: 'Invoice', key: 'invoice', priorityMobile: false },
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
          <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">Select Customer</h5>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="customer">
                <Form.Label>Select Customer</Form.Label>
                <Form.Select
                  value={mainForm['customer']}
                  onChange={(e) => handleMainFieldChange(e, 'customer')}
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
            <Row className="g-3">
              {cartFields.map((field) => (
                <Col xs={12} md={field.width || 3} key={field.name}>
                  <Form.Group controlId={`cart_${field.name}`}>
                    <Form.Label className="fw-medium text-secondary small mb-1">{field.label}</Form.Label>
                    {field.type === 'select' ? (
                      <Form.Select
                        value={cartForm[field.name]} 
                        onChange={(e) => handleCartFieldChange(e, field.name)}
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
                    ) : (
                      <Form.Control
                        type={field.type}
                        value={cartForm[field.name]}
                        onChange={(e) => handleCartFieldChange(e, field.name)}
                        placeholder={field.placeholder || ''}
                        className="rounded-2"
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
                >
                  Add Item
                </Button>
              </Col>
            </Row>
          </div>

          {/* Card Rendering for IN Mode */}
          {mode === 'in' && cartForm.category && cartForm.subcategory && (
            <Card className="mb-3 shadow-sm border">
              <Card.Body className="p-3">
                <Card.Title className="fs-6 fw-semibold">{cartForm.subcategory}</Card.Title>
                <Card.Text className="small text-secondary mb-0">
                  Pending: <span className="fw-semibold text-primary">50</span>
                </Card.Text>
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
                              <td className="fw-medium">${item.rent}</td>
                              <td className="fw-medium">${item.totalAmount}</td>
                              <td className="fw-medium">${item.deposit}</td>
                              <td className={`fw-medium ${item.depositReturn > 0 ? 'text-success' : 'text-danger'}`}>
                                ${item.depositReturn}
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
                      ${summary.totalAmount}
                    </span>
                  </div>
                  <div>
                    <span className="fw-semibold text-secondary">Deposit Return:</span>
                    <span className={`ms-2 fw-semibold ${summary.depositReturn > 0 ? 'text-success' : 'text-danger'}`}>
                      ${summary.depositReturn}
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
                    ) : (
                      <Form.Control
                        type={field.type}
                        value={field.type === 'file' ? undefined : mainForm[field.name]}
                        onChange={(e) => handleMainFieldChange(e, field.name)}
                        placeholder={field.placeholder || ''}
                        readOnly={field.readOnly || false}
                        accept={field.accept || undefined}
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