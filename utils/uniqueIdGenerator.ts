// utils/uniqueIdGenerator.ts
// یوتیلیتی برای تولید کد رهگیری یونیک 12 رقمی برای اخبار

export interface UniqueIdOptions {
  prefix?: string;
  suffix?: string;
  length?: number;
}

/**
 * تولید یک کد رهگیری یونیک 12 رقمی
 * @param options تنظیمات اختیاری
 * @returns کد رهگیری 12 رقمی
 */
export function generateUniqueTrackingId(options: UniqueIdOptions = {}): string {
  const { prefix = '', suffix = '', length = 12 } = options;
  
  // محاسبه طول واقعی عدد با در نظر گیری prefix و suffix
  const actualLength = length - prefix.length - suffix.length;
  
  if (actualLength <= 0) {
    throw new Error('طول کد رهگیری بعد از prefix و suffix باید حداقل 1 باشد');
  }
  
  // تولید عدد تصادفی با طول مشخص
  let randomNumber = '';
  
  // اولین رقم نمی‌تواند 0 باشد
  randomNumber += Math.floor(Math.random() * 9) + 1;
  
  // بقیه ارقام
  for (let i = 1; i < actualLength; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  
  return `${prefix}${randomNumber}${suffix}`;
}

/**
 * تولید چندین کد رهگیری یونیک (برای اطمینان از عدم تکرار)
 * @param count تعداد کدهای مورد نیاز
 * @param options تنظیمات اختیاری
 * @returns آرایه‌ای از کدهای رهگیری
 */
export function generateMultipleTrackingIds(
  count: number, 
  options: UniqueIdOptions = {}
): string[] {
  const ids = new Set<string>();
  
  while (ids.size < count) {
    const newId = generateUniqueTrackingId(options);
    ids.add(newId);
  }
  
  return Array.from(ids);
}

/**
 * اعتبارسنجی کد رهگیری
 * @param trackingId کد رهگیری برای بررسی
 * @param options تنظیمات مورد انتظار
 * @returns true اگر کد معتبر باشد
 */
export function validateTrackingId(
  trackingId: string, 
  options: UniqueIdOptions = {}
): boolean {
  const { prefix = '', suffix = '', length = 12 } = options;
  
  // بررسی طول کلی
  if (trackingId.length !== length) {
    return false;
  }
  
  // بررسی prefix
  if (prefix && !trackingId.startsWith(prefix)) {
    return false;
  }
  
  // بررسی suffix
  if (suffix && !trackingId.endsWith(suffix)) {
    return false;
  }
  
  // استخراج قسمت عددی
  const numericPart = trackingId.slice(prefix.length, length - suffix.length);
  
  // بررسی اینکه فقط عدد باشد
  if (!/^\d+$/.test(numericPart)) {
    return false;
  }
  
  // بررسی اینکه اولین رقم 0 نباشد
  if (numericPart.startsWith('0')) {
    return false;
  }
  
  return true;
}

/**
 * فرمت کردن کد رهگیری برای نمایش بهتر
 * @param trackingId کد رهگیری
 * @param separator جداکننده (پیش‌فرض: -)
 * @returns کد فرمت شده
 */
export function formatTrackingId(
  trackingId: string, 
  separator: string = '-'
): string {
  // تقسیم کد به گروه‌های 4 رقمی
  const groups = trackingId.match(/.{1,4}/g);
  return groups ? groups.join(separator) : trackingId;
}

/**
 * حذف فرمت از کد رهگیری
 * @param formattedId کد فرمت شده
 * @param separator جداکننده که باید حذف شود
 * @returns کد بدون فرمت
 */
export function unformatTrackingId(
  formattedId: string, 
  separator: string = '-'
): string {
  return formattedId.replace(new RegExp(separator, 'g'), '');
}

/**
 * تولید کد رهگیری با الگوی زمانی
 * @param includeTimestamp آیا timestamp اضافه شود؟
 * @returns کد رهگیری با زمان
 */
export function generateTimeBasedTrackingId(includeTimestamp: boolean = true): string {
  const timestamp = Date.now().toString();
  
  if (includeTimestamp) {
    // استفاده از 8 رقم آخر timestamp + 4 رقم تصادفی
    const timeBase = timestamp.slice(-8);
    const randomPart = Math.floor(Math.random() * 9000) + 1000; // 4 رقم تصادفی
    return `${timeBase}${randomPart}`;
  } else {
    return generateUniqueTrackingId();
  }
}

/**
 * بررسی منحصر به فرد بودن کد در لیست موجود
 * @param newId کد جدید
 * @param existingIds لیست کدهای موجود
 * @returns true اگر کد منحصر به فرد باشد
 */
export function isUniqueId(newId: string, existingIds: string[]): boolean {
  return !existingIds.includes(newId);
}

/**
 * تولید کد رهگیری با تضمین منحصر به فرد بودن
 * @param existingIds لیست کدهای موجود
 * @param maxAttempts حداکثر تلاش برای تولید کد منحصر به فرد
 * @param options تنظیمات اختیاری
 * @returns کد رهگیری منحصر به فرد
 */
export function generateGuaranteedUniqueId(
  existingIds: string[], 
  maxAttempts: number = 100,
  options: UniqueIdOptions = {}
): string {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const newId = generateUniqueTrackingId(options);
    
    if (isUniqueId(newId, existingIds)) {
      return newId;
    }
    
    attempts++;
  }
  
  throw new Error(`نتوانست کد منحصر به فرد بعد از ${maxAttempts} تلاش تولید کند`);
}

// Type definitions
export interface TrackingIdInfo {
  id: string;
  formatted: string;
  isValid: boolean;
  generatedAt: Date;
  prefix?: string;
  suffix?: string;
}

/**
 * تولید اطلاعات کامل کد رهگیری
 * @param options تنظیمات
 * @returns اطلاعات کامل کد رهگیری
 */
export function generateTrackingIdInfo(
  options: UniqueIdOptions = {}
): TrackingIdInfo {
  const id = generateUniqueTrackingId(options);
  
  return {
    id,
    formatted: formatTrackingId(id),
    isValid: validateTrackingId(id, options),
    generatedAt: new Date(),
    prefix: options.prefix,
    suffix: options.suffix
  };
}

// Export default configuration
export const DEFAULT_TRACKING_CONFIG: UniqueIdOptions = {
  prefix: '',
  suffix: '',
  length: 12
};

// Configuration برای انواع مختلف اخبار
export const NEWS_TRACKING_CONFIGS = {
  // اخبار عادی
  REGULAR: {
    prefix: '',
    suffix: '',
    length: 12
  },
  // اخبار فوری
  URGENT: {
    prefix: '9',
    suffix: '',
    length: 12
  },
  // اخبار مهم
  IMPORTANT: {
    prefix: '8',
    suffix: '',
    length: 12
  },
  // اخبار آرشیو
  ARCHIVE: {
    prefix: '7',
    suffix: '',
    length: 12
  }
} as const;