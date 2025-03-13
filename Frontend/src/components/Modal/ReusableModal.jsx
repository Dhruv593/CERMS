import React, { useState, useEffect, useRef } from 'react';
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
  // Create a proper initial state that includes all fields
  const createInitialState = () => {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.initialValue !== undefined ? field.initialValue : (field.type === 'file' ? null : '');
      return acc;
    }, {});
  };
  
  const [formData, setFormData] = useState(createInitialState());
  const [errors, setErrors] = useState({});
  const isInitialized = useRef(false);
  const categoryRef = useRef('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (!isInitialized.current) {
        const newState = initialFormData ? { ...createInitialState(), ...initialFormData } : createInitialState();
        console.log("Initializing form with:", newState);
        setFormData(newState);
        setErrors({});
        isInitialized.current = true;
      }
    } else {
      // Reset when modal closes
      isInitialized.current = false;
      categoryRef.current = '';
    }
  }, [isOpen]);

  // Update form when initialFormData changes (but not on category change)
  useEffect(() => {
    if (isOpen && initialFormData && !categoryRef.current) {
      const newState = { ...createInitialState(), ...initialFormData };
      console.log("Updating form with new initialFormData:", newState);
      setFormData(newState);
    }
  }, [initialFormData, isOpen]);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'category') {
      if (value && !/^[A-Za-z0-9\s]+$/.test(value)) {
        error = 'Category must contain only letters, numbers, and spaces.';
      }
    }

    if (name === 'partyContact' && value && !/^\d{10}$/.test(value)) {
      error = 'Contact number must be exactly 10 digits.';
    }

    if ((name.includes('deposit') || name.includes('rent') || name.includes('purchaseQuantity')) && 
        value && !/^\d+(\.\d{1,2})?$/.test(value)) {
      error = `${name} must be a valid number.`;
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    return error === '';
  };

  const handleCategoryFieldChange = (e) => {
    const { name, value } = e.target;
    console.log(`Category changed to: ${value}`);
    
    // Store the category value to prevent re-initialization
    categoryRef.current = value;
    
    // Update form data with the new category value
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    
    // Log the updated form data
    console.log("Updated form data with category:", updatedFormData);
    
    validateField(name, value);
    
    // Call the onCategoryChange callback with the new value
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    console.log('Updated formData:', updatedFormData);
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const updatedFormData = { ...formData, [name]: files[0] };
      setFormData(updatedFormData);
      validateField(name, files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    let isValid = true;
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      if (!validateField(field.name, value)) {
        isValid = false;
        newErrors[field.name] = `${field.label} is invalid`;
      }
    });
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Submitting formdata:', formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-semibold">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {fields.map((field) => {
              // Ensure the value is never undefined
              const fieldValue = formData[field.name] !== undefined ? formData[field.name] : '';
              
              return (
                <Col md={fields.length > 5 ? 6 : 12} key={field.name} className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-medium">{field.label}</Form.Label>
                    {field.type === 'text' || field.type === 'number' || field.type === 'datetime-local' || field.type === 'tel' ? (
                      <Form.Control
                        type={field.type}
                        name={field.name}
                        value={fieldValue}
                        onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
                        placeholder={field.placeholder}
                        className={errors[field.name] ? 'is-invalid' : ''}
                      />
                    ) : field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        name={field.name} 
                        value={fieldValue}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={errors[field.name] ? 'is-invalid' : ''}
                      />
                    ) : field.type === 'select' ? (
                      <Form.Select
                        name={field.name}
                        value={fieldValue}
                        onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
                      >
                        <option value="">{field.placeholder || `Select ${field.label}`}</option>
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    ) : field.type === 'file' ? (
                      <Form.Control type="file" name={field.name} onChange={handleFileChange} />
                    ) : null}
                    {errors[field.name] && <Form.Text className="text-danger">{errors[field.name]}</Form.Text>}
                  </Form.Group>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={Object.values(errors).some((err) => err)}>
          {submitButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReusableModal;

// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

// export function ReusableModal({
//   isOpen,
//   onClose,
//   title,
//   fields,
//   onSubmit,
//   submitButtonLabel = 'Submit',
//   onCategoryChange,
//   initialFormData = null
// }) {
//   const initialState = fields.reduce((acc, field) => {
//     acc[field.name] = field.initialValue || (field.type === 'file' ? null : '');
//     return acc;
//   }, {});
//   // console.log('initial state', initialState);
//   const [formData, setFormData] = useState(initialState);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isOpen) {
//       setFormData(initialFormData ? { ...initialFormData } : initialState);
//       setErrors({});
//     }
//   }, [isOpen, initialFormData]);

//   const validateField = (name, value) => {
//     let error = '';

//     if (name === 'category') {
//       if (!/^[A-Za-z0-9\s]+$/.test(value)) {
//         error = 'Category must contain only letters, numbers, and spaces.';
//       }
//     }

//     if (name === 'partyContact' && !/^\d{10}$/.test(value)) {
//       error = 'Contact number must be exactly 10 digits.';
//     }

//     if (name.includes('deposit') || name.includes('rent') || name.includes('purchaseQuantity')) {
//       if (!/^\d+(\.\d{1,2})?$/.test(value)) {
//         error = `${name} must be a valid number.`;
//       }
//     }

//     setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
//   };

//   const handleCategoryFieldChange = (e) => {
//     const { name, value } = e.target;
//     console.log(`Category changed to: ${value}`);
//     // Update only the category field in formData
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     console.log("category form data",formData);
//     validateField(name, value);
//     if (onCategoryChange) {
//       onCategoryChange(value);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updatedFormData = { ...prev, [name]: value };
//       console.log('Updated formData:', updatedFormData);
//       return updatedFormData;
//     });
//     validateField(name, value);
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//       validateField(name, files[0]);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Submitting formdata:', formData); // Debugging line
//     if (Object.values(errors).some((err) => err)) return;
//     onSubmit(formData);
//     onClose();
//   };

//   return (
//     <Modal show={isOpen} onHide={onClose} centered backdrop="static" animation={false}>
//       <Modal.Header closeButton>
//         <Modal.Title className="fw-semibold">{title}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Row>
//             {fields.map((field, index) => (
//               <Col md={fields.length > 5 ? 6 : 12} key={field.name} className="mb-3">
//                 <Form.Group>
//                   <Form.Label className="fw-medium">{field.label}</Form.Label>
//                   {field.type === 'text' || field.type === 'number' || field.type === 'datetime-local' || field.type === 'tel' ? (
//                     <Form.Control
//                       type={field.type}
//                       name={field.name}
//                       value={formData[field.name]}
//                       onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
//                       placeholder={field.placeholder}
//                       className={errors[field.name] ? 'is-invalid' : ''}
//                     />
//                   ) : field.type === 'textarea' ? (
//                     <Form.Control
//                       as="textarea"
//                       name={field.name} 
//                       value={formData[field.name]}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                       className={errors[field.name] ? 'is-invalid' : ''}
//                     />
//                   ) : field.type === 'select' ? (
//                     <Form.Select
//                       name={field.name}
//                       value={formData[field.name]}
//                       onChange={field.name === 'category' ? handleCategoryFieldChange : handleChange}
//                     >
//                       <option value="">{field.placeholder || `Select ${field.label}`}</option>
//                       {field.options.map((option, index) => (
//                         <option key={index} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   ) : field.type === 'file' ? (
//                     <Form.Control type="file" name={field.name} onChange={handleFileChange} />
//                   ) : null}
//                   {errors[field.name] && <Form.Text className="text-danger">{errors[field.name]}</Form.Text>}
//                 </Form.Group>
//               </Col>
//             ))}
//           </Row>
//         </Form>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSubmit} disabled={Object.values(errors).some((err) => err)}>
//           {submitButtonLabel}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default ReusableModal;
