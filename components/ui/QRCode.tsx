// components/ui/QRCode.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeLib from 'qrcode';
import { 
  QRCodeProps, 
  QRCodeData, 
  QRCodeStatus,
  QRCodeError as QRCodeErrorType 
} from '../../types/qrcode';
import { 
  generateQRCodeData, 
  getDefaultQROptions, 
  generateQRAltText,
  validateTrackingId,
  QRCodeError 
} from '../../utils/qrcode-generator';

/**
 * کامپوننت اصلی QR Code
 * تولید و نمایش QR Code برای مقالات
 */
const QRCode: React.FC<QRCodeProps> = ({
  trackingId,
  options = {},
  className = '',
  alt,
  loading = false,
  onError,
  onGenerated,
}) => {
  // State management
  const [status, setStatus] = useState<QRCodeStatus>('idle');
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [error, setError] = useState<QRCodeErrorType | null>(null);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * تابع تولید QR Code
   */
  const generateQRCode = useCallback(async () => {
    if (!trackingId || loading) return;

    try {
      setStatus('generating');
      setError(null);

      // اعتبارسنجی کد رهگیری
      if (!validateTrackingId(trackingId)) {
        throw new QRCodeError('کد رهگیری نامعتبر', 'INVALID_TRACKING_ID');
      }

      // تولید داده‌های QR Code
      const data = generateQRCodeData(trackingId);
      
      // تنظیمات QR Code
      const qrOptions = getDefaultQROptions(options);

      // بررسی وجود canvas
      if (!canvasRef.current) {
        throw new QRCodeError('Canvas در دسترس نیست', 'CANVAS_NOT_AVAILABLE');
      }

      // تولید QR Code روی canvas
      await QRCodeLib.toCanvas(canvasRef.current, data.url, {
        width: qrOptions.size,
        margin: qrOptions.margin,
        errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        color: {
          dark: qrOptions.color.dark,
          light: qrOptions.color.light,
        },
      });

      // ذخیره داده‌ها
      const finalData: QRCodeData = {
        ...data,
        config: options, // استفاده از options اصلی به جای qrOptions
      };

      setQrData(finalData);
      setStatus('success');

      // فراخوانی callback موفقیت
      onGenerated?.(finalData);

    } catch (err) {
      const qrError: QRCodeErrorType = {
        type: err instanceof QRCodeError ? 'validation' : 'generation',
        message: err instanceof Error ? err.message : 'خطای نامشخص در تولید QR Code',
        code: err instanceof QRCodeError ? err.code : undefined,
        details: err,
      };

      setError(qrError);
      setStatus('error');

      // فراخوانی callback خطا
      onError?.(err instanceof Error ? err : new Error(qrError.message));
    }
  }, [trackingId, options, loading, onGenerated, onError]);

  /**
   * Effect برای تولید QR Code
   */
  useEffect(() => {
    if (trackingId && !loading) {
      generateQRCode();
    }
  }, [generateQRCode, trackingId, loading]);

  /**
   * تابع دانلود QR Code
   */
  const downloadQRCode = useCallback(() => {
    if (!canvasRef.current || !qrData) return;

    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      
      link.download = `qr-${qrData.trackingId}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('خطا در دانلود QR Code:', err);
    }
  }, [qrData]);

  /**
   * تابع کپی URL
   */
  const copyToClipboard = useCallback(async () => {
    if (!qrData?.url) return;

    try {
      await navigator.clipboard.writeText(qrData.url);
      // می‌توان toast notification اضافه کرد
    } catch (err) {
      console.error('خطا در کپی کردن URL:', err);
    }
  }, [qrData]);

  /**
   * تولید متن alt
   */
  const altText = alt || (qrData ? generateQRAltText(qrData) : `QR Code برای کد رهگیری ${trackingId}`);

  /**
   * کلاس‌های CSS
   */
  const containerClasses = `
    qr-code-container
    ${className}
    ${status === 'generating' ? 'qr-loading' : ''}
    ${status === 'error' ? 'qr-error' : ''}
    ${status === 'success' ? 'qr-success' : ''}
  `.trim();

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Loading State */}
      {(status === 'generating' || loading) && (
        <div className="qr-loading-overlay">
          <div className="qr-spinner"></div>
          <span className="qr-loading-text">در حال تولید QR Code...</span>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && error && (
        <div className="qr-error-container">
          <div className="qr-error-icon">⚠️</div>
          <div className="qr-error-content">
            <h4 className="qr-error-title">خطا در تولید QR Code</h4>
            <p className="qr-error-message">{error.message}</p>
            <button 
              onClick={generateQRCode}
              className="qr-retry-button"
              type="button"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && qrData && (
        <div className="qr-success-container">
          <canvas
            ref={canvasRef}
            className="qr-canvas"
            role="img"
            aria-label={altText}
          />
          
          {/* Actions */}
          <div className="qr-actions">
            <button
              onClick={downloadQRCode}
              className="qr-action-button qr-download-button"
              type="button"
              title="دانلود QR Code"
            >
              <span className="qr-button-icon">📥</span>
              <span className="qr-button-text">دانلود</span>
            </button>
            
            <button
              onClick={copyToClipboard}
              className="qr-action-button qr-copy-button"
              type="button"
              title="کپی لینک"
            >
              <span className="qr-button-icon">📋</span>
              <span className="qr-button-text">کپی لینک</span>
            </button>
          </div>

          {/* QR Info */}
          <div className="qr-info">
            <div className="qr-tracking-id">
              کد رهگیری: <strong>{qrData.trackingId}</strong>
            </div>
            <div className="qr-url">
              <a 
                href={qrData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="qr-url-link"
              >
                {qrData.url}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles */}
      <style>{`
        .qr-code-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 300px;
          margin: 0 auto;
        }

        .qr-loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
        }

        .qr-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .qr-loading-text {
          font-size: 0.9rem;
          color: #666;
        }

        .qr-error-container {
          text-align: center;
          padding: 1rem;
        }

        .qr-error-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .qr-error-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: #dc3545;
          margin: 0 0 0.5rem 0;
        }

        .qr-error-message {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 1rem 0;
        }

        .qr-retry-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .qr-retry-button:hover {
          background: #c82333;
        }

        .qr-success-container {
          text-align: center;
        }

        .qr-canvas {
          display: block;
          margin: 0 auto 1rem auto;
          border-radius: 4px;
        }

        .qr-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .qr-action-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .qr-action-button:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .qr-download-button:hover {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .qr-copy-button:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .qr-info {
          font-size: 0.8rem;
          color: #666;
          text-align: center;
        }

        .qr-tracking-id {
          margin-bottom: 0.25rem;
        }

        .qr-url-link {
          color: #007bff;
          text-decoration: none;
          word-break: break-all;
        }

        .qr-url-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .qr-code-container {
            max-width: 100%;
            padding: 0.75rem;
          }
          
          .qr-actions {
            flex-direction: column;
          }
          
          .qr-action-button {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCode;