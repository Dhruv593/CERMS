import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

export function ReusableModal({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitButtonLabel = 'Submit',
  onCategoryChange,
  initialFormData = null
}) {
  // Initialize form state from fields
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || (field.type === 'file' ? null : '');
    return acc;
  }, {});
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  
  // State to track screen width for responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const storedCategory = localStorage.getItem("selectedCategory");
      setFormData((prev) => ({
        ...initialState,
        ...initialFormData,
        category: storedCategory || initialFormData?.category || "",
      }));
      setErrors({});
    }
  }, [isOpen, initialFormData]);

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

  // Field validation logic
  const validateField = (name, value) => {
    let error = '';

    if (name === 'category') {
      if (!/^[A-Za-z0-9\s]+$/.test(value)) {
        error = 'Category must contain only letters, numbers, and spaces.';
      }
    }

    if (name === 'partyContact' && !/^\d{10}$/.test(value)) {
      error = 'Contact number must be exactly 10 digits.';
    }

    if (name.includes('deposit') || name.includes('rent') || name.includes('purchaseQuantity')) {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        error = `${name} must be a valid number.`;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Handler for category field changes
  const handleCategoryFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem("selectedCategory", value);
    validateField(name, value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  // Generic handler for field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handler for file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      validateField(name, files[0]);
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) return;
    onSubmit(formData);
    onClose();
  };

  // Group fields by section if specified
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  return (
    <Modal 
      show={isOpen} 
      onHide={onClose} 
      size="lg" 
      centered 
      backdrop="static" 
      animation={false}
    >
      <Modal.Header closeButton className="bg-light border-bottom">
        <Modal.Title className="fw-bold text-dark">
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Form onSubmit={handleSubmit}>
          {Object.entries(groupedFields).map(([section, sectionFields]) => (
            <div key={section} className="bg-white rounded shadow-sm p-4 mb-4">
              {section !== 'default' && (
                <h5 className="fw-semibold text-secondary border-bottom pb-2 mb-3">{section}</h5>
              )}
              <Row className="g-3">
                {sectionFields.map((field) => (
                  <Col 
                    xs={12} 
                    md={field.width || (sectionFields.length > 3 ? 6 : 12)} 
                    key={field.name}
                  >
                    <Form.Group controlId={`form_${field.name}`}>
                      <Form.Label className="fw-medium text-secondary small mb-1">{field.label}</Form.Label>
                      {field.type === 'select' ? (
                        <Form.Select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
                          className={`rounded-2 ${errors[field.name] ? 'is-invalid' : ''}`}
                        >
                          <option value="">{field.placeholder || `Select ${field.label}`}</option>
                          {field.options && field.options.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      ) : field.type === 'textarea' ? (
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name={field.name} 
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder || ''}
                          className={`rounded-2 ${errors[field.name] ? 'is-invalid' : ''}`}
                        />
                      ) : field.type === 'file' ? (
                        <Form.Control 
                          type="file" 
                          name={field.name} 
                          onChange={handleFileChange}
                          className="rounded-2"
                        />
                      ) : (
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
                          placeholder={field.placeholder || ''}
                          className={`rounded-2 ${errors[field.name] ? 'is-invalid' : ''}`}
                          readOnly={field.readOnly || false}
                        />
                      )}
                      {errors[field.name] && (
                        <Form.Text className="text-danger">{errors[field.name]}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
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
            disabled={Object.values(errors).some((err) => err)}
            className={`${isMobileView ? 'w-100' : ''} rounded-2`}
          >
            {submitButtonLabel}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ReusableModal;