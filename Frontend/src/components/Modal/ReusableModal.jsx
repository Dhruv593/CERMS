import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export function ReusableModal({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitButtonLabel = "Submit",
  onCategoryChange,
  initialFormData = null,
}) {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || (field.type === "file" ? null : "");
    return acc;
  }, {});
  console.log("initial state",initialState);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData ? { ...initialFormData } : initialState);
      setErrors({});
    }
  }, [isOpen, initialFormData]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "category" || name === "") {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        error = `${name} must contain only letters and spaces.`;
      }
    }

    if (name === "partyContact" && !/^\d{10}$/.test(value)) {
      error = "Contact number must be exactly 10 digits.";
    }

    if (name.includes("deposit") || name.includes("rent") || name.includes("purchaseQuantity")) {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        error = `${name} must be a valid number.`;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      console.log("Updated formData:", updatedFormData); // Debugging log
      return updatedFormData;
    });
  
    validateField(name, value);
  
    if (name === "category" && onCategoryChange) {
      onCategoryChange(value);
    }
  };
  

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      validateField(name, files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting formdata:", formData); // Debugging line
    if (Object.values(errors).some((err) => err)) return;
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
            {fields.map((field, index) => (
              <Col md={fields.length > 5 ? 6 : 12} key={field.name} className="mb-3">
                <Form.Group>
                  <Form.Label className="fw-medium">{field.label}</Form.Label>
                  {field.type === "text" || field.type === "number" || field.type === "datetime-local" || field.type === "tel" ? (
                    <Form.Control
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={errors[field.name] ? "is-invalid" : ""}
                    />
                  ) : field.type === "textarea" ? (
                    <Form.Control
                      as="textarea"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={errors[field.name] ? "is-invalid" : ""}
                    />
                  ) : field.type === "select" ? (
                    <Form.Select name={field.name} value={formData[field.name]} onChange={handleChange}>
                      <option value="">{field.placeholder || `Select ${field.label}`}</option>
                      {field.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  ) : field.type === "file" ? (
                    <Form.Control type="file" name={field.name} onChange={handleFileChange} />
                  ) : null}
                  {errors[field.name] && <Form.Text className="text-danger">{errors[field.name]}</Form.Text>}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={Object.values(errors).some((err) => err)}
        >
          {submitButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReusableModal;
