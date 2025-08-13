// types/qrcode.ts
// تایپ‌های TypeScript برای سیستم QR Code

/**
 * تنظیمات اصلی QR Code
 */
export interface QRCodeConfig {
  /** اندازه QR Code به پیکسل */
  size: number;
  /** حاشیه اطراف QR Code */
  margin: number;
  /** سطح تصحیح خطا */
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  /** تنظیمات رنگ */
  color: {
    /** رنگ پیش‌زمینه (نقاط تیره) */
    dark: string;
    /** رنگ پس‌زمینه (نقاط روشن) */
    light: string;
  };
}

/**
 * اطلاعات مقاله برای QR Code
 */
export interface ArticleInfo {
  /** کد رهگیری 12 رقمی */
  trackingId: string;
  /** عنوان مقاله */
  title: string;
  /** خلاصه مقاله (اختیاری) */
  excerpt?: string;
  /** URL تصویر شاخص */
  imageUrl?: string;
  /** تاریخ انتشار */
  publishedAt: string;
  /** نویسنده */
  author?: string;
  /** دسته‌بندی */
  category?: {
    title: string;
    slug: string;
  };
}

/**
 * داده‌های تولید شده QR Code
 */
export interface QRCodeData {
  /** URL کامل مقاله */
  url: string;
  /** کد رهگیری مرجع */
  trackingId: string;
  /** عنوان مقاله (برای alt text) */
  title?: string;
  /** زمان تولید */
  generatedAt: Date;
  /** تنظیمات استفاده شده */
  config?: Partial<QRCodeConfig>;
}

/**
 * پروپرتی‌های کامپوننت QRCode اصلی
 */
export interface QRCodeProps {
  /** کد رهگیری مقاله */
  trackingId: string;
  /** تنظیمات QR Code (اختیاری) */
  options?: Partial<QRCodeConfig>;
  /** کلاس CSS سفارشی */
  className?: string;
  /** متن alt سفارشی */
  alt?: string;
  /** آیا در حالت لودینگ باشد */
  loading?: boolean;
  /** تابع callback در صورت خطا */
  onError?: (error: Error) => void;
  /** تابع callback پس از تولید موفق */
  onGenerated?: (data: QRCodeData) => void;
}

/**
 * پروپرتی‌های بخش QR Code در مقاله
 */
export interface QRCodeSectionProps {
  /** اطلاعات مقاله */
  article: ArticleInfo;
  /** نمایش عنوان بخش */
  showTitle?: boolean;
  /** عنوان سفارشی */
  title?: string;
  /** نمایش توضیحات */
  showDescription?: boolean;
  /** متن توضیحات سفارشی */
  description?: string;
  /** موقعیت نمایش */
  position?: QRCodePosition;
  /** تنظیمات QR Code */
  qrOptions?: Partial<QRCodeConfig>;
  /** کلاس CSS کانتینر */
  className?: string;
  /** نمایش دکمه‌های اضافی */
  showActions?: boolean;
}

/**
 * موقعیت‌های نمایش QR Code
 */
export type QRCodePosition = 
  | 'sidebar'      // کناری (در سایدبار)
  | 'inline'       // درون متن
  | 'footer'       // انتهای مقاله
  | 'floating'     // شناور
  | 'modal';       // در مودال

/**
 * وضعیت تولید QR Code
 */
export type QRCodeStatus = 
  | 'idle'         // آماده
  | 'generating'   // در حال تولید
  | 'success'      // موفق
  | 'error';       // خطا

/**
 * نوع پریست‌های QR Code
 */
export type QRCodePreset = 
  | 'small'        // کوچک
  | 'medium'       // متوسط
  | 'large'        // بزرگ
  | 'branded'      // برندینگ
  | 'print';       // چاپ

/**
 * تنظیمات نمایش QR Code Section
 */
export interface QRCodeDisplaySettings {
  /** نمایش عنوان */
  title: {
    show: boolean;
    text?: string;
  };
  /** نمایش توضیحات */
  description: {
    show: boolean;
    text?: string;
  };
  /** نمایش دکمه‌ها */
  actions: {
    download: boolean;
    share: boolean;
    copy: boolean;
  };
  /** استایل کانتینر */
  container: {
    background?: string;
    border?: boolean;
    shadow?: boolean;
    rounded?: boolean;
  };
}

/**
 * داده‌های مورد نیاز برای اشتراک‌گذاری
 */
export interface ShareData {
  /** URL مقاله */
  url: string;
  /** عنوان مقاله */
  title: string;
  /** متن اشتراک‌گذاری */
  text?: string;
}

/**
 * نتیجه عملیات QR Code
 */
export interface QRCodeResult {
  /** وضعیت موفقیت */
  success: boolean;
  /** داده‌های QR Code (در صورت موفقیت) */
  data?: QRCodeData;
  /** پیام خطا (در صورت شکست) */
  error?: string;
  /** کد خطا */
  errorCode?: string;
}

/**
 * Context برای مدیریت QR Code در سطح اپلیکیشن
 */
export interface QRCodeContextValue {
  /** تنظیمات پیش‌فرض */
  defaultConfig: QRCodeConfig;
  /** تنظیمات نمایش */
  displaySettings: QRCodeDisplaySettings;
  /** دامنه سایت */
  baseUrl: string;
  /** تابع تولید QR Code */
  generateQRCode: (trackingId: string, options?: Partial<QRCodeConfig>) => Promise<QRCodeResult>;
  /** تابع اشتراک‌گذاری */
  shareArticle: (data: ShareData) => Promise<boolean>;
}

/**
 * خطاهای مخصوص QR Code
 */
export interface QRCodeError {
  /** نوع خطا */
  type: 'validation' | 'generation' | 'network' | 'unknown';
  /** پیام خطا */
  message: string;
  /** کد خطا */
  code?: string;
  /** جزئیات اضافی */
  details?: any;
}

/**
 * تنظیمات responsive برای QR Code
 */
export interface QRCodeResponsive {
  /** اندازه در موبایل */
  mobile: Partial<QRCodeConfig>;
  /** اندازه در تبلت */
  tablet: Partial<QRCodeConfig>;
  /** اندازه در دسکتاپ */
  desktop: Partial<QRCodeConfig>;
}

/**
 * آمار و تحلیل QR Code
 */
export interface QRCodeAnalytics {
  /** تعداد تولید */
  generationCount: number;
  /** تعداد اسکن */
  scanCount?: number;
  /** آخرین زمان تولید */
  lastGenerated: Date;
  /** آخرین زمان اسکن */
  lastScanned?: Date;
  /** دستگاه‌های اسکن کننده */
  scanDevices?: string[];
}

/**
 * متادیتای QR Code برای SEO
 */
export interface QRCodeMetadata {
  /** توضیحات برای alt */
  alt: string;
  /** عنوان برای title */
  title: string;
  /** توضیحات structured data */
  description: string;
  /** کلمات کلیدی */
  keywords?: string[];
}

// تمام تایپ‌ها قبلاً با export interface تعریف شده‌اند
// نیازی به export مجدد نیست