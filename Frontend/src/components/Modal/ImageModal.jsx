import React from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({ show, onHide, imageUrl }) => (
  <Modal show={show} onHide={onHide} size="md" centered>
    <Modal.Body style={{ padding: 0, background: '#000' }}>
      <img
        src={imageUrl}
        alt="Full Screen Preview"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </Modal.Body>
  </Modal>
);

export default ImageModal;
