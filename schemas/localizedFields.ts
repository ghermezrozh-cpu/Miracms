// studio/schemas/localizedFields.ts
// تعریف فیلدهای دوزبانه برای Sanity Studio

import {defineField} from 'sanity'

/**
 * ایجاد یک فیلد string دوزبانه
 */
export function localizedString(fieldName: string, title: string, description?: string) {
  return defineField({
    name: fieldName,
    title: title,
    type: 'object',
    description,
    fields: [
      {
        name: 'fa',
        title: 'پارسی',
        type: 'string',
        validation: (rule) => rule.required().error('متن پارسی الزامی است'),
      },
      {
        name: 'en',
        title: 'English',
        type: 'string',
        validation: (rule) => rule.required().error('English text is required'),
      },
    ],
    preview: {
      select: {
        fa: 'fa',
        en: 'en',
      },
      prepare({fa, en}) {
        return {
          title: fa || en || 'بدون عنوان',
          subtitle: `${fa ? 'ꕥ' : ''}${en ? '🇺🇸' : ''}`,
        }
      },
    },
  })
}

/**
 * ایجاد یک فیلد text دوزبانه
 */
export function localizedText(fieldName: string, title: string, description?: string) {
  return defineField({
    name: fieldName,
    title: title,
    type: 'object',
    description,
    fields: [
      {
        name: 'fa',
        title: 'پارسی',
        type: 'text',
        rows: 4,
        validation: (rule) => rule.required().error('متن پارسی الزامی است'),
      },
      {
        name: 'en',
        title: 'English',
        type: 'text',
        rows: 4,
        validation: (rule) => rule.required().error('English text is required'),
      },
    ],
    preview: {
      select: {
        fa: 'fa',
        en: 'en',
      },
      prepare({fa, en}) {
        const faPreview = fa ? fa.substring(0, 50) + (fa.length > 50 ? '...' : '') : ''
        const enPreview = en ? en.substring(0, 50) + (en.length > 50 ? '...' : '') : ''

        return {
          title: faPreview || enPreview || 'بدون متن',
          subtitle: `${fa ? 'ꕥ' : ''}${en ? '🇺🇸' : ''}`,
        }
      },
    },
  })
}

/**
 * ایجاد یک فیلد array دوزبانه برای محتوای پیچیده (Portable Text)
 */
export function localizedBlockContent(fieldName: string, title: string, description?: string) {
  return defineField({
    name: fieldName,
    title: title,
    type: 'object',
    description,
    fields: [
      {
        name: 'fa',
        title: 'محتوای پارسی',
        type: 'array',
        of: [{type: 'block'}, {type: 'image'}],
        validation: (rule) => rule.required().error('محتوای پارسی الزامی است'),
      },
      {
        name: 'en',
        title: 'English Content',
        type: 'array',
        of: [{type: 'block'}, {type: 'image'}],
        validation: (rule) => rule.required().error('English content is required'),
      },
    ],
    preview: {
      select: {
        faBlocks: 'fa',
        enBlocks: 'en',
      },
      prepare({faBlocks, enBlocks}) {
        const faText = faBlocks && faBlocks.length > 0 ? 'محتوای پارسی موجود' : ''
        const enText = enBlocks && enBlocks.length > 0 ? 'English content available' : ''

        return {
          title: faText || enText || 'بدون محتوا',
          subtitle: `${faBlocks?.length || 0} فا / ${enBlocks?.length || 0} en blocks`,
        }
      },
    },
  })
}

/**
 * ایجاد یک فیلد slug دوزبانه
 */
export function localizedSlug(
  fieldName: string,
  title: string,
  source: string,
  description?: string,
) {
  return defineField({
    name: fieldName,
    title: title,
    type: 'object',
    description,
    fields: [
      {
        name: 'fa',
        title: 'اسلاگ پارسی',
        type: 'slug',
        options: {
          source: `${source}.fa`,
          slugify: (input: string) => {
            // تبدیل متن پارسی به slug قابل استفاده
            return input
              .toLowerCase()
              .replace(/[\u0600-\u06FF\s]+/g, '-') // تبدیل حروف پارسی و فاصله به -
              .replace(/[^\w\-]+/g, '') // حذف کاراکترهای غیرمجاز
              .replace(/\-\-+/g, '-') // تبدیل چندین - به یکی
              .replace(/^-+/, '') // حذف - از ابتدا
              .replace(/-+$/, '') // حذف - از انتها
              .substring(0, 50) // محدود کردن طول
          },
        },
        validation: (rule) => rule.required().error('اسلاگ پارسی الزامی است'),
      },
      {
        name: 'en',
        title: 'English Slug',
        type: 'slug',
        options: {
          source: `${source}.en`,
          slugify: (input: string) => {
            return input
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]+/g, '')
              .replace(/\-\-+/g, '-')
              .replace(/^-+/, '')
              .replace(/-+$/, '')
              .substring(0, 50)
          },
        },
        validation: (rule) => rule.required().error('English slug is required'),
      },
    ],
    preview: {
      select: {
        fa: 'fa.current',
        en: 'en.current',
      },
      prepare({fa, en}) {
        return {
          title: fa || en || 'بدون اسلاگ',
          subtitle: `ꕥ ${fa || 'ندارد'} / 🇺🇸 ${en || 'ندارد'}`,
        }
      },
    },
  })
}
