import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrGenerator = () => {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const generateQR = () => {
    if (text.trim()) {
      setQrValue(text);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>QR Code Generator</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Enter text or URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to generate QR code"
                />
              </div>
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={generateQR}
                disabled={!text.trim()}
              >
                Generate QR Code
              </button>
              {qrValue && (
                <div className="text-center">
                  <QRCodeCanvas value={qrValue} size={256} />
                  <p className="mt-2">Scan this QR code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
