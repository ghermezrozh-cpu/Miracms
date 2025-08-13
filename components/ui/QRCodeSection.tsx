// components/ui/QRCodeSection.tsx
'use client';

import React, { useState } from 'react';
import QRCode from './QRCode';
import { 
  QRCodeSectionProps, 
  QRCodeData,
  ShareData 
} from '../../types/qrcode';
import { QR_PRESETS } from '../../utils/qrcode-generator';

/**
 * کامپوننت بخش QR Code برای نمایش در مقالات
 * شامل QR Code + عنوان + توضیحات + دکمه‌های عملیاتی
 */
const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  article,
  showTitle = true,
  title = 'اشتراک‌گذاری مقاله',
  showDescription = true,
  description = 'برای دسترسی سریع به این مقاله، QR Code زیر را اسکن کنید.',
  position = 'inline',
  qrOptions = QR_PRESETS.MEDIUM,
  className = '',
  showActions = true,
}) => {
  // State management
  const [isExpanded, setIsExpanded] = useState(position !== 'floating');
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'success' | 'error'>('idle');

  /**
   * تابع اشتراک‌گذاری از طریق Web Share API
   */
  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback: کپی لینک
      await handleCopyLink();
      return;
    }

    try {
      setShareStatus('sharing');
      
      const shareData: ShareData = {
        title: article.title,
        text: article.excerpt || `مقاله: ${article.title}`,
        url: `${window.location.origin}/${article.trackingId}`,
      };

      await navigator.share(shareData);
      setShareStatus('success');
      
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setShareStatus('error');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    }
  };

  /**
   * تابع کپی لینک
   */
  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/${article.trackingId}`;
      await navigator.clipboard.writeText(url);
      setShareStatus('success');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (error) {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  /**
   * تابع toggle برای حالت floating
   */
  const toggleExpanded = () => {
    if (position === 'floating') {
      setIsExpanded(!isExpanded);
    }
  };

  /**
   * تولید کلاس‌های CSS بر اساس position
   */
  const getContainerClasses = () => {
    const baseClasses = 'qr-section';
    const positionClasses = {
      sidebar: 'qr-section--sidebar',
      inline: 'qr-section--inline', 
      footer: 'qr-section--footer',
      floating: 'qr-section--floating',
      modal: 'qr-section--modal',
    };

    return `${baseClasses} ${positionClasses[position]} ${className} ${
      isExpanded ? 'qr-section--expanded' : 'qr-section--collapsed'
    }`.trim();
  };

  /**
   * رندر دکمه‌های عملیاتی
   */
  const renderActions = () => {
    if (!showActions) return null;

    return (
      <div className="qr-actions-extended">
        {/* دکمه اشتراک‌گذاری */}
        <button
          onClick={handleShare}
          disabled={shareStatus === 'sharing'}
          className={`qr-action-btn qr-share-btn ${shareStatus}`}
          type="button"
        >
          <span className="qr-btn-icon">
            {shareStatus === 'sharing' && '⏳'}
            {shareStatus === 'success' && '✅'}
            {shareStatus === 'error' && '❌'}
            {shareStatus === 'idle' && '📤'}
          </span>
          <span className="qr-btn-text">
            {shareStatus === 'sharing' && 'در حال اشتراک...'}
            {shareStatus === 'success' && 'اشتراک‌گذاری شد!'}
            {shareStatus === 'error' && 'خطا در اشتراک‌گذاری'}
            {shareStatus === 'idle' && 'اشتراک‌گذاری'}
          </span>
        </button>

        {/* دکمه کپی لینک */}
        <button
          onClick={handleCopyLink}
          className="qr-action-btn qr-copy-btn"
          type="button"
        >
          <span className="qr-btn-icon">🔗</span>
          <span className="qr-btn-text">کپی لینک</span>
        </button>
      </div>
    );
  };

  /**
   * رندر اطلاعات مقاله
   */
  const renderArticleInfo = () => (
    <div className="qr-article-info">
      <div className="qr-article-meta">
        <h3 className="qr-article-title">{article.title}</h3>
        {article.category && (
          <span className="qr-article-category">
            {article.category.title}
          </span>
        )}
        {article.author && (
          <span className="qr-article-author">
            نویسنده: {article.author}
          </span>
        )}
      </div>
      <div className="qr-tracking-info">
        <strong>کد رهگیری:</strong> {article.trackingId}
      </div>
    </div>
  );

  return (
    <div className={getContainerClasses()}>
      {/* هدر بخش (برای حالت floating) */}
      {position === 'floating' && (
        <button
          onClick={toggleExpanded}
          className="qr-floating-toggle"
          type="button"
        >
          <span className="qr-toggle-icon">
            {isExpanded ? '📱' : '📱'}
          </span>
          <span className="qr-toggle-text">QR Code</span>
        </button>
      )}

      {/* محتوای اصلی */}
      <div className="qr-section-content">
        {/* عنوان */}
        {showTitle && (
          <div className="qr-section-header">
            <h2 className="qr-section-title">{title}</h2>
            {showDescription && (
              <p className="qr-section-description">{description}</p>
            )}
          </div>
        )}

        {/* QR Code */}
        <div className="qr-code-wrapper">
          <QRCode
            trackingId={article.trackingId}
            options={qrOptions}
            onError={(error) => {
              console.error('خطا در تولید QR Code:', error);
            }}
            onGenerated={(data: QRCodeData) => {
              console.log('QR Code تولید شد:', data);
            }}
          />
        </div>

        {/* اطلاعات مقاله */}
        {position !== 'floating' && renderArticleInfo()}

        {/* دکمه‌های عملیاتی */}
        {renderActions()}
      </div>

      {/* استایل‌های کامپوننت */}
      <style>{`
        /* استایل‌های پایه */
        .qr-section {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .qr-section-content {
          padding: 1.5rem;
        }

        /* عنوان و توضیحات */
        .qr-section-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .qr-section-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
        }

        .qr-section-description {
          font-size: 0.9rem;
          color: #718096;
          margin: 0;
          line-height: 1.5;
        }

        /* QR Code wrapper */
        .qr-code-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        /* اطلاعات مقاله */
        .qr-article-info {
          background: #f7fafc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .qr-article-meta {
          margin-bottom: 0.75rem;
        }

        .qr-article-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .qr-article-category,
        .qr-article-author {
          display: inline-block;
          font-size: 0.8rem;
          color: #718096;
          margin-left: 1rem;
        }

        .qr-article-category {
          background: #e2e8f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .qr-tracking-info {
          font-size: 0.85rem;
          color: #4a5568;
          font-family: monospace;
          background: #edf2f7;
          padding: 0.5rem;
          border-radius: 4px;
          text-align: center;
        }

        /* دکمه‌های عملیاتی */
        .qr-actions-extended {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .qr-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          min-width: 120px;
          justify-content: center;
        }

        .qr-action-btn:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
          transform: translateY(-1px);
        }

        .qr-share-btn.success {
          background: #f0fff4;
          border-color: #68d391;
          color: #22543d;
        }

        .qr-share-btn.error {
          background: #fed7d7;
          border-color: #fc8181;
          color: #742a2a;
        }

        .qr-copy-btn:hover {
          background: #e6fffa;
          border-color: #4fd1c7;
        }

        /* استایل‌های مخصوص هر position */
        
        /* Sidebar */
        .qr-section--sidebar {
          max-width: 280px;
          margin: 0 0 2rem 0;
        }

        .qr-section--sidebar .qr-section-content {
          padding: 1rem;
        }

        .qr-section--sidebar .qr-article-title {
          font-size: 0.9rem;
        }

        /* Inline */
        .qr-section--inline {
          max-width: 400px;
          margin: 2rem auto;
        }

        /* Footer */
        .qr-section--footer {
          max-width: 600px;
          margin: 3rem auto 0;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        /* Floating */
        .qr-section--floating {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          max-width: 300px;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .qr-section--floating.qr-section--collapsed .qr-section-content {
          display: none;
        }

        .qr-floating-toggle {
          width: 100%;
          padding: 1rem;
          background: #4299e1;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          font-weight: 600;
        }

        .qr-floating-toggle:hover {
          background: #3182ce;
        }

        /* Modal */
        .qr-section--modal {
          max-width: 500px;
          margin: 0 auto;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .qr-section--floating {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }

          .qr-actions-extended {
            flex-direction: column;
          }

          .qr-action-btn {
            min-width: 100%;
          }

          .qr-section-content {
            padding: 1rem;
          }

          .qr-section--sidebar {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .qr-section-title {
            font-size: 1.1rem;
          }

          .qr-section-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodeSection;