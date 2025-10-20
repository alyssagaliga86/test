import React, { useEffect, useState } from 'react';

export default function ManualAddModal({ isOpen, onClose, onAdd }) {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setQuantity(1);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const trimmed = String(code).trim();
    const qty = Number.parseInt(String(quantity), 10);
    if (!trimmed) {
      alert('Please enter a product code or barcode.');
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      alert('Please enter a valid quantity (>= 1).');
      return;
    }
    onAdd?.({ code: trimmed, quantity: qty });
  };

  const handleOverlayClick = () => {
    onClose?.();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" style={{ display: isOpen ? 'flex' : 'none' }} onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <h3>Manual Add</h3>

        <div className="ui-form-group">
          <label htmlFor="manual-code">Barcode or Product Code</label>
          <input
            id="manual-code"
            type="text"
            className="ui-input"
            placeholder="Enter barcode or code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
          />
        </div>

        <div className="ui-form-group">
          <label htmlFor="manual-qty">Quantity</label>
          <input
            id="manual-qty"
            type="number"
            min="1"
            className="ui-input"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
          />
        </div>

        <div className="modal-options">
          <button className="modal-option-button cancel" onClick={onClose}>Cancel</button>
          <button className="modal-option-button" onClick={handleConfirm}>Add</button>
        </div>
      </div>
    </div>
  );
}
