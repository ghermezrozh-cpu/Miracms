// utils/qrcode-generator.ts
// یوتیلیتی برای تولید QR Code از کد رهگیری مقالات

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: {
    dark?: string;
    light?: string;
  };
}

export interface QRCodeData {
  url: string;
  trackingId: string;
  title?: string;
  generatedAt: Date;
}

/**
 * تولید URL کامل مقاله از کد رهگیری
 * @param trackingId کد رهگیری 12 رقمی
 * @param baseUrl دامنه سایت (اختیاری)
 * @returns URL کامل مقاله
 */
export function generateArticleUrl(
  trackingId: string,
  baseUrl?: string
): string {
  // اعتبارسنجی کد رهگیری
  if (!trackingId || !/^[1-9]\d{11}$/.test(trackingId)) {
    throw new Error('کد رهگیری نامعتبر: باید 12 رقم باشد و با صفر شروع نشود');
  }

  // استفاده از متغیر محیطی یا URL فعلی
  const domain = baseUrl || 
                 (typeof window !== 'undefined' ? window.location.origin : '') ||
                 process.env.NEXT_PUBLIC_SITE_URL ||
                 'http://localhost:3333';

  // حذف اسلش انتهایی از domain
  const cleanDomain = domain.replace(/\/$/, '');
  
  return `${cleanDomain}/${trackingId}`;
}

/**
 * اعتبارسنجی کد رهگیری
 * @param trackingId کد رهگیری برای بررسی
 * @returns true اگر کد معتبر باشد
 */
export function validateTrackingId(trackingId: string): boolean {
  if (!trackingId || typeof trackingId !== 'string') {
    return false;
  }

  // بررسی طول (دقیقاً 12 رقم)
  if (trackingId.length !== 12) {
    return false;
  }

  // بررسی اینکه فقط عدد باشد
  if (!/^\d+$/.test(trackingId)) {
    return false;
  }

  // بررسی اینکه با صفر شروع نشود
  if (trackingId.startsWith('0')) {
    return false;
  }

  return true;
}

/**
 * تولید تنظیمات پیش‌فرض QR Code
 * @param customOptions تنظیمات سفارشی
 * @returns تنظیمات کامل QR Code
 */
export function getDefaultQROptions(
  customOptions: QRCodeOptions = {}
): Required<QRCodeOptions> {
  return {
    size: customOptions.size || 200,
    margin: customOptions.margin || 2,
    errorCorrectionLevel: customOptions.errorCorrectionLevel || 'M',
    color: {
      dark: customOptions.color?.dark || '#000000',
      light: customOptions.color?.light || '#FFFFFF',
    },
  };
}

/**
 * تولید داده‌های کامل QR Code
 * @param trackingId کد رهگیری مقاله
 * @param title عنوان مقاله (اختیاری)
 * @param baseUrl دامنه سایت (اختیاری)
 * @returns داده‌های QR Code
 */
export function generateQRCodeData(
  trackingId: string,
  title?: string,
  baseUrl?: string
): QRCodeData {
  // اعتبارسنجی کد رهگیری
  if (!validateTrackingId(trackingId)) {
    throw new Error('کد رهگیری نامعتبر');
  }

  // تولید URL
  const url = generateArticleUrl(trackingId, baseUrl);

  return {
    url,
    trackingId,
    title,
    generatedAt: new Date(),
  };
}

/**
 * تولید متن alt برای QR Code
 * @param data داده‌های QR Code
 * @returns متن alt مناسب
 */
export function generateQRAltText(data: QRCodeData): string {
  const baseText = `QR Code برای مقاله با کد رهگیری ${data.trackingId}`;
  
  if (data.title) {
    return `${baseText} - ${data.title}`;
  }
  
  return baseText;
}

/**
 * تولید نام فایل برای ذخیره QR Code
 * @param trackingId کد رهگیری
 * @param format فرمت فایل
 * @returns نام فایل
 */
export function generateQRFileName(
  trackingId: string,
  format: 'png' | 'jpg' | 'svg' = 'png'
): string {
  if (!validateTrackingId(trackingId)) {
    throw new Error('کد رهگیری نامعتبر');
  }

  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `qr-${trackingId}-${timestamp}.${format}`;
}

/**
 * بررسی پشتیبانی مرورگر از QR Code
 * @returns true اگر مرورگر پشتیبانی کند
 */
export function isBrowserSupported(): boolean {
  if (typeof window === 'undefined') {
    return false; // SSR
  }

  // بررسی پشتیبانی از Canvas
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
}

/**
 * تنظیمات پیش‌فرض برای انواع مختلف QR Code
 */
export const QR_PRESETS = {
  // QR Code کوچک برای نمایش در لیست
  SMALL: {
    size: 120,
    margin: 1,
    errorCorrectionLevel: 'L' as const,
    color: { dark: '#000000', light: '#FFFFFF' },
  },
  
  // QR Code متوسط برای نمایش در مقاله
  MEDIUM: {
    size: 200,
    margin: 2,
    errorCorrectionLevel: 'M' as const,
    color: { dark: '#000000', light: '#FFFFFF' },
  },
  
  // QR Code بزرگ برای پرینت
  LARGE: {
    size: 400,
    margin: 4,
    errorCorrectionLevel: 'H' as const,
    color: { dark: '#000000', light: '#FFFFFF' },
  },
  
  // QR Code با رنگ‌بندی برند
  BRANDED: {
    size: 200,
    margin: 2,
    errorCorrectionLevel: 'M' as const,
    color: { dark: '#1a365d', light: '#f7fafc' },
  },
} as const;

/**
 * کلاس خطاهای QR Code
 */
export class QRCodeError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'QRCodeError';
  }
}

/**
 * تابع کمکی برای لاگ کردن اطلاعات QR Code
 * @param data داده‌های QR Code
 * @param options تنظیمات
 */
export function logQRCodeGeneration(
  data: QRCodeData,
  options: QRCodeOptions
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('QR Code Generated:', {
      trackingId: data.trackingId,
      url: data.url,
      title: data.title,
      size: options.size,
      generatedAt: data.generatedAt.toISOString(),
    });
  }
}