// studio-eramtv/schemaTypes/fields/postFields.ts
// فیلدهای ساده برای postType

import { defineField } from 'sanity';

/**
 * فیلد کد رهگیری 12 رقمی
 */
export const trackingIdField = defineField({
  name: 'trackingId',
  title: 'کد رهگیری',
  type: 'string',
  description: 'کد رهگیری یونیک 12 رقمی برای اعتبارسنجی خبر',
  validation: (rule) => 
    rule
      .required()
      .length(12)
      .regex(/^[1-9]\d{11}$/, {
        name: 'tracking-id',
        invert: false
      })
      .error('کد رهگیری باید دقیقاً 12 رقم باشد و با صفر شروع نشود'),
  
  initialValue: () => {
    // تولید عدد 12 رقمی که با صفر شروع نمی‌شود
    const first = Math.floor(Math.random() * 9) + 1; // 1-9
    let remaining = '';
    for (let i = 0; i < 11; i++) {
      remaining += Math.floor(Math.random() * 10); // 0-9
    }
    return first + remaining;
  }
});

/**
 * فیلد تاریخ برنامه‌ریزی انتشار
 */
export const scheduledForField = defineField({
  name: 'scheduledFor',
  title: 'برنامه‌ریزی انتشار',
  type: 'datetime',
  description: 'زمان برنامه‌ریزی شده برای انتشار خودکار پست',
  validation: (rule) => 
    rule.custom((value, context) => {
      if (!value) return true;
      
      const scheduledDate = new Date(value);
      const now = new Date();
      
      if (scheduledDate <= now) {
        return 'تاریخ برنامه‌ریزی باید در آینده باشد';
      }
      
      return true;
    })
});

/**
 * فیلد تاریخ انقضا
 */
export const expireAtField = defineField({
  name: 'expireAt',
  title: 'تاریخ انقضا',
  type: 'datetime',
  description: 'تاریخ و زمان انقضای پست (اختیاری)',
  validation: (rule) => 
    rule.custom((value, context) => {
      if (!value) return true;
      
      const expireDate = new Date(value);
      const now = new Date();
      
      if (expireDate <= now) {
        return 'تاریخ انقضا باید در آینده باشد';
      }
      
      return true;
    })
});

/**
 * فیلد وضعیت انتشار
 */
export const publishStatusField = defineField({
  name: 'publishStatus',
  title: 'وضعیت انتشار',
  type: 'string',
  readOnly: true,
  options: {
    list: [
      { title: 'پیش‌نویس', value: 'draft' },
      { title: 'برنامه‌ریزی شده', value: 'scheduled' },
      { title: 'منتشر شده', value: 'published' }
    ]
  },
  initialValue: 'draft'
});

export const newPostFields = [
  trackingIdField,
  scheduledForField,
  expireAtField,
  publishStatusField
];