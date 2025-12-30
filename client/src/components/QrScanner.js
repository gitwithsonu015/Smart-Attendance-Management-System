import React, { useState, useRef } from 'react';
import QrReader from 'react-qr-scanner';
import api from '../services/api';

const QrScanner = ({ onScanSuccess }) => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const qrRef = useRef(null);

  const handleScan = async (data) => {
    if (data && scanning) {
      setResult(data.text);
      setScanning(false);

      try {
        await api.post('/attendance/mark', { qrData: data.text });
        setError('');
        alert('Attendance marked successfully!');
        if (onScanSuccess) onScanSuccess();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to mark attendance');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error accessing camera');
  };

  const resetScanner = () => {
    setResult('');
    setError('');
    setScanning(true);
  };

  return (
    <div className="text-center">
      <h5>Scan QR Code to Mark Attendance</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      {result && (
        <div className="alert alert-success">
          QR Code scanned successfully!
          <br />
          <small>{result}</small>
        </div>
      )}

      {scanning ? (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <QrReader
            ref={qrRef}
            delay={300}
            style={{ width: '100%' }}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: 'environment' }
            }}
          />
        </div>
      ) : (
        <button className="btn btn-primary" onClick={resetScanner}>
          Scan Another QR Code
        </button>
      )}

      <div className="mt-3">
        <small className="text-muted">
          Make sure the QR code is clearly visible and well-lit for best results.
        </small>
      </div>
    </div>
  );
};

export default QrScanner;
