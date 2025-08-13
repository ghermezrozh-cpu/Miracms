// utils/scheduleStatus.ts
// یوتیلیتی برای مدیریت وضعیت‌های انتشار پست‌ها

export type PublishStatus = 'draft' | 'published' | 'scheduled';

export interface ScheduleInfo {
  status: PublishStatus;
  publishedAt?: string | Date;
  scheduledFor?: string | Date;
  expireAt?: string | Date;
  isExpired?: boolean;
  canBePublished?: boolean;
}

export interface StatusValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * تعیین وضعیت پست بر اساس تاریخ‌ها
 * @param publishedAt تاریخ انتشار
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @param expireAt تاریخ انقضا
 * @returns وضعیت پست
 */
export function determinePostStatus(
  publishedAt?: string | Date | null,
  scheduledFor?: string | Date | null,
  expireAt?: string | Date | null
): PublishStatus {
  const now = new Date();
  
  // اگر تاریخ انتشار مشخص است و گذشته، پست منتشر شده
  if (publishedAt) {
    const publishDate = new Date(publishedAt);
    if (publishDate <= now) {
      return 'published';
    }
  }
  
  // اگر تاریخ برنامه‌ریزی مشخص است و آینده، پست برنامه‌ریزی شده
  if (scheduledFor) {
    const scheduleDate = new Date(scheduledFor);
    if (scheduleDate > now) {
      return 'scheduled';
    }
  }
  
  // در غیر این صورت پیش‌نویس
  return 'draft';
}

/**
 * بررسی اینکه آیا پست منقضی شده یا نه
 * @param expireAt تاریخ انقضا
 * @returns true اگر منقضی شده باشد
 */
export function isPostExpired(expireAt?: string | Date | null): boolean {
  if (!expireAt) return false;
  
  const now = new Date();
  const expireDate = new Date(expireAt);
  
  return expireDate <= now;
}

/**
 * بررسی اینکه آیا پست می‌تواند منتشر شود یا نه
 * @param status وضعیت فعلی پست
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @param expireAt تاریخ انقضا
 * @returns true اگر قابل انتشار باشد
 */
export function canPublishPost(
  status: PublishStatus,
  scheduledFor?: string | Date | null,
  expireAt?: string | Date | null
): boolean {
  const now = new Date();
  
  // اگر منقضی شده، نمی‌تواند منتشر شود
  if (isPostExpired(expireAt)) {
    return false;
  }
  
  // اگر برنامه‌ریزی شده و زمانش رسیده
  if (status === 'scheduled' && scheduledFor) {
    const scheduleDate = new Date(scheduledFor);
    return scheduleDate <= now;
  }
  
  // اگر پیش‌نویس، همیشه می‌تواند منتشر شود
  if (status === 'draft') {
    return true;
  }
  
  return false;
}

/**
 * محاسبه زمان باقی‌مانده تا انتشار برنامه‌ریزی شده
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @returns زمان باقی‌مانده به میلی‌ثانیه
 */
export function getTimeUntilPublish(scheduledFor?: string | Date | null): number {
  if (!scheduledFor) return 0;
  
  const now = new Date();
  const scheduleDate = new Date(scheduledFor);
  
  return Math.max(0, scheduleDate.getTime() - now.getTime());
}

/**
 * محاسبه زمان باقی‌مانده تا انقضا
 * @param expireAt تاریخ انقضا
 * @returns زمان باقی‌مانده به میلی‌ثانیه
 */
export function getTimeUntilExpire(expireAt?: string | Date | null): number {
  if (!expireAt) return Infinity;
  
  const now = new Date();
  const expireDate = new Date(expireAt);
  
  return Math.max(0, expireDate.getTime() - now.getTime());
}

/**
 * فرمت کردن زمان باقی‌مانده به رشته قابل خواندن
 * @param milliseconds زمان به میلی‌ثانیه
 * @returns رشته فرمت شده
 */
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds === 0) return 'اکنون';
  if (milliseconds === Infinity) return 'نامحدود';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} روز و ${hours % 24} ساعت`;
  } else if (hours > 0) {
    return `${hours} ساعت و ${minutes % 60} دقیقه`;
  } else if (minutes > 0) {
    return `${minutes} دقیقه و ${seconds % 60} ثانیه`;
  } else {
    return `${seconds} ثانیه`;
  }
}

/**
 * اعتبارسنجی تاریخ‌های مرتبط با وضعیت پست
 * @param publishedAt تاریخ انتشار
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @param expireAt تاریخ انقضا
 * @returns نتیجه اعتبارسنجی
 */
export function validateScheduleDates(
  publishedAt?: string | Date | null,
  scheduledFor?: string | Date | null,
  expireAt?: string | Date | null
): StatusValidationResult {
  const result: StatusValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  const now = new Date();
  
  // تبدیل تاریخ‌ها به Date objects
  const publishDate = publishedAt ? new Date(publishedAt) : null;
  const scheduleDate = scheduledFor ? new Date(scheduledFor) : null;
  const expireDate = expireAt ? new Date(expireAt) : null;
  
  // بررسی معتبر بودن تاریخ‌ها
  if (publishDate && isNaN(publishDate.getTime())) {
    result.errors.push('تاریخ انتشار معتبر نیست');
    result.isValid = false;
  }
  
  if (scheduleDate && isNaN(scheduleDate.getTime())) {
    result.errors.push('تاریخ برنامه‌ریزی معتبر نیست');
    result.isValid = false;
  }
  
  if (expireDate && isNaN(expireDate.getTime())) {
    result.errors.push('تاریخ انقضا معتبر نیست');
    result.isValid = false;
  }
  
  // بررسی منطقی تاریخ‌ها
  if (publishDate && scheduleDate) {
    result.warnings.push('نمی‌توان هم‌زمان تاریخ انتشار و برنامه‌ریزی تنظیم کرد');
  }
  
  if (scheduleDate && scheduleDate <= now) {
    result.warnings.push('تاریخ برنامه‌ریزی شده در گذشته است');
  }
  
  if (expireDate && expireDate <= now) {
    result.warnings.push('تاریخ انقضا در گذشته است');
  }
  
  if (publishDate && expireDate && publishDate >= expireDate) {
    result.errors.push('تاریخ انتشار نمی‌تواند بعد از تاریخ انقضا باشد');
    result.isValid = false;
  }
  
  if (scheduleDate && expireDate && scheduleDate >= expireDate) {
    result.errors.push('تاریخ برنامه‌ریزی نمی‌تواند بعد از تاریخ انقضا باشد');
    result.isValid = false;
  }
  
  return result;
}

/**
 * تولید اطلاعات کامل برنامه‌ریزی پست
 * @param publishedAt تاریخ انتشار
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @param expireAt تاریخ انقضا
 * @returns اطلاعات کامل برنامه‌ریزی
 */
export function generateScheduleInfo(
  publishedAt?: string | Date | null,
  scheduledFor?: string | Date | null,
  expireAt?: string | Date | null
): ScheduleInfo {
  const status = determinePostStatus(publishedAt, scheduledFor, expireAt);
  
  return {
    status,
    publishedAt: publishedAt || undefined,
    scheduledFor: scheduledFor || undefined,
    expireAt: expireAt || undefined,
    isExpired: isPostExpired(expireAt),
    canBePublished: canPublishPost(status, scheduledFor, expireAt)
  };
}

/**
 * دریافت متن وضعیت به فارسی
 * @param status وضعیت پست
 * @returns متن فارسی وضعیت
 */
export function getStatusText(status: PublishStatus): string {
  const statusTexts = {
    draft: 'پیش‌نویس',
    published: 'منتشر شده',
    scheduled: 'برنامه‌ریزی شده'
  };
  
  return statusTexts[status];
}

/**
 * دریافت رنگ وضعیت برای نمایش در UI
 * @param status وضعیت پست
 * @returns کد رنگ hex
 */
export function getStatusColor(status: PublishStatus): string {
  const statusColors = {
    draft: '#6b7280', // gray
    published: '#10b981', // green
    scheduled: '#f59e0b' // yellow
  };
  
  return statusColors[status];
}

/**
 * بررسی اینکه آیا پست در حال حاضر قابل مشاهده است یا نه
 * @param status وضعیت پست
 * @param expireAt تاریخ انقضا
 * @returns true اگر قابل مشاهده باشد
 */
export function isPostVisible(
  status: PublishStatus,
  expireAt?: string | Date | null
): boolean {
  if (status !== 'published') return false;
  if (isPostExpired(expireAt)) return false;
  
  return true;
}

/**
 * محاسبه اولویت پست بر اساس وضعیت و تاریخ‌ها
 * @param status وضعیت پست
 * @param scheduledFor تاریخ برنامه‌ریزی شده
 * @param expireAt تاریخ انقضا
 * @returns عدد اولویت (کمتر = اولویت بیشتر)
 */
export function calculatePostPriority(
  status: PublishStatus,
  scheduledFor?: string | Date | null,
  expireAt?: string | Date | null
): number {
  let priority = 0;
  
  // اولویت بر اساس وضعیت
  switch (status) {
    case 'published':
      priority = 1;
      break;
    case 'scheduled':
      priority = 2;
      break;
    case 'draft':
      priority = 3;
      break;
  }
  
  // اگر برنامه‌ریزی شده و زمانش نزدیک است
  if (status === 'scheduled' && scheduledFor) {
    const timeUntilPublish = getTimeUntilPublish(scheduledFor);
    const hoursUntilPublish = timeUntilPublish / (1000 * 60 * 60);
    
    if (hoursUntilPublish <= 1) {
      priority = 0; // بالاترین اولویت
    } else if (hoursUntilPublish <= 24) {
      priority = 1;
    }
  }
  
  // اگر نزدیک انقضا است
  if (expireAt) {
    const timeUntilExpire = getTimeUntilExpire(expireAt);
    const hoursUntilExpire = timeUntilExpire / (1000 * 60 * 60);
    
    if (hoursUntilExpire <= 24) {
      priority = Math.max(0, priority - 1); // افزایش اولویت
    }
  }
  
  return priority;
}

// Export constants
export const SCHEDULE_CONSTANTS = {
  STATUSES: {
    DRAFT: 'draft' as const,
    PUBLISHED: 'published' as const,
    SCHEDULED: 'scheduled' as const
  },
  COLORS: {
    DRAFT: '#6b7280',
    PUBLISHED: '#10b981',
    SCHEDULED: '#f59e0b'
  },
  TEXTS: {
    DRAFT: 'پیش‌نویس',
    PUBLISHED: 'منتشر شده',
    SCHEDULED: 'برنامه‌ریزی شده'
  }
} as const;