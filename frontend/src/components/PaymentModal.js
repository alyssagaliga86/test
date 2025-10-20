import React, { useMemo, useState } from 'react';

export default function PaymentModal({
  isOpen,
  onClose,
  totalPrice,
  defaultDiscountType = 'none',
  defaultCustomDiscount = 0,
  defaultCashGiven = '',
  onConfirm,
}) {
  const [discountType, setDiscountType] = useState(defaultDiscountType);
  const [customDiscount, setCustomDiscount] = useState(
    typeof defaultCustomDiscount === 'number' ? defaultCustomDiscount : 0
  );
  const [cashGiven, setCashGiven] = useState(String(defaultCashGiven ?? ''));

  const effectiveDiscountPercent = useMemo(() => {
    const rates = {
      none: 0,
      senior: 20,
      pwd: 20,
      student: 10,
      custom: Number.isFinite(customDiscount) ? customDiscount : 0,
    };
    const selected = discountType in rates ? rates[discountType] : 0;
    return Math.max(0, Math.min(100, Number(selected) || 0));
  }, [discountType, customDiscount]);

  const discountAmount = useMemo(() => {
    return (Number(totalPrice) || 0) * (effectiveDiscountPercent / 100);
  }, [totalPrice, effectiveDiscountPercent]);

  const netPay = useMemo(() => {
    const gross = Number(totalPrice) || 0;
    const discounted = Math.max(0, gross - discountAmount);
    return Number(discounted.toFixed(2));
  }, [totalPrice, discountAmount]);

  const numericCashGiven = useMemo(() => {
    const numeric = parseFloat(cashGiven);
    return Number.isFinite(numeric) ? numeric : 0;
  }, [cashGiven]);

  const change = useMemo(() => {
    return Number((numericCashGiven - netPay).toFixed(2));
  }, [numericCashGiven, netPay]);

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm({
        discountType,
        effectiveDiscountPercent,
        discountAmount,
        netPay,
        cashGiven: numericCashGiven,
        change,
      });
    }
  };

  return (
    <div className="modal-overlay" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="modal-content">
        <h3>Payment Details</h3>

        <div className="ui-form-group">
          <label htmlFor="discountType">Discount</label>
          <select
            id="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="ui-input"
          >
            <option value="none">None</option>
            <option value="senior">Senior (20%)</option>
            <option value="pwd">PWD (20%)</option>
            <option value="student">Student (10%)</option>
            <option value="custom">Custom (%)</option>
          </select>
        </div>

        {discountType === 'custom' && (
          <div className="ui-form-group">
            <label htmlFor="customDiscount">Custom discount (%)</label>
            <input
              id="customDiscount"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={customDiscount}
              onChange={(e) => setCustomDiscount(parseFloat(e.target.value) || 0)}
              className="ui-input"
            />
          </div>
        )}

        <div className="ui-form-group">
          <label>Total price</label>
          <div>₱{(Number(totalPrice) || 0).toFixed(2)}</div>
        </div>

        <div className="ui-form-group">
          <label>Discount amount</label>
          <div>₱{discountAmount.toFixed(2)}</div>
        </div>

        <div className="ui-form-group">
          <label>Net payable</label>
          <div className="ui-net-payable">₱{netPay.toFixed(2)}</div>
        </div>

        <div className="ui-form-group">
          <label htmlFor="cashGiven">Cash given</label>
          <input
            id="cashGiven"
            type="number"
            min="0"
            step="0.01"
            value={cashGiven}
            onChange={(e) => setCashGiven(e.target.value)}
            className="ui-input"
          />
        </div>

        <div className="ui-form-group">
          <label>Change</label>
          <div className={change < 0 ? 'cash-info change' : 'cash-info'}>
            ₱{change.toFixed(2)}
          </div>
        </div>

        <div className="modal-options">
          <button className="modal-option-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-option-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
