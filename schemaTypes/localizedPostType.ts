// studio/schemaTypes/localizedPostType.ts
import {defineField, defineType} from 'sanity'

export const localizedPostType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fieldsets: [
    {
      name: 'content',
      title: '📝 محتوا و عنوان / Content & Title',
      options: {
        collapsible: true,
        collapsed: false,
        columns: 1,
      },
    },
    {
      name: 'metadata',
      title: '🏷️ اطلاعات تکمیلی / Metadata',
      options: {
        collapsible: true,
        collapsed: false,
        columns: 2,
      },
    },
    {
      name: 'seo',
      title: '🔍 تنظیمات SEO',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: 'publishing',
      title: '📅 تنظیمات انتشار / Publishing',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    // کد رهگیری در بالا (مهم‌ترین فیلد)
    defineField({
      name: 'slug',
      title: '🔍 کد رهگیری / Tracking ID',
      type: 'slug',
      description: 'کد رهگیری یونیک 12 رقمی - این کد برای هر دو زبان یکسان است',
      fieldset: 'content',
      options: {
        source: () => {
          const first = Math.floor(Math.random() * 9) + 1
          let remaining = ''
          for (let i = 0; i < 11; i++) {
            remaining += Math.floor(Math.random() * 10)
          }
          return first + remaining
        },
        maxLength: 12,
        slugify: (input: string) => {
          if (typeof input === 'string' && /^[1-9]\d{11}$/.test(input)) {
            return input
          }
          const first = Math.floor(Math.random() * 9) + 1
          let remaining = ''
          for (let i = 0; i < 11; i++) {
            remaining += Math.floor(Math.random() * 10)
          }
          return first + remaining
        },
      },
      validation: (rule) =>
        rule.required().custom((value: any) => {
          if (!value || !value.current) return 'کد رهگیری الزامی است'
          const slug = value.current
          if (slug.length !== 12) return 'کد رهگیری باید دقیقاً 12 رقم باشد'
          if (!/^\d+$/.test(slug)) return 'کد رهگیری باید فقط شامل اعداد باشد'
          if (slug.startsWith('0')) return 'کد رهگیری نمی‌تواند با صفر شروع شود'
          return true
        }),
    }),

    // عنوان دوزبانه - ساده و در کنار هم
    defineField({
      name: 'title',
      title: '📰 عنوان مقاله / Article Title',
      type: 'object',
      fieldset: 'content',
      description: 'عنوان مقاله به دو زبان - هر دو باید پر شوند',
      fields: [
        {
          name: 'fa',
          title: 'ꕥ عنوان پارسی',
          type: 'string',
          validation: (rule) => rule.required().error('عنوان پارسی الزامی است'),
          placeholder: 'عنوان مقاله را به پارسی وارد کنید...',
        },
        {
          name: 'en',
          title: '🇺🇸 عنوان انگلیسی',
          type: 'string',
          validation: (rule) => rule.required().error('English title is required'),
          placeholder: 'Enter article title in English...',
        },
      ],
      options: {
        columns: 1, // عنوان‌ها زیر هم برای خوانایی بهتر
      },
    }),

    // تصویر شاخص
    defineField({
      name: 'image',
      title: '🖼️ تصویر شاخص / Featured Image',
      type: 'image',
      fieldset: 'content',
      description: 'تصویر اصلی مقاله - برای هر دو زبان یکسان',
      options: {
        hotspot: true,
      },
    }),

    // خلاصه مطلب - ساده
    defineField({
      name: 'excerpt',
      title: '📋 خلاصه مقاله / Article Summary',
      type: 'object',
      fieldset: 'content',
      description: 'خلاصه کوتاه برای نمایش در لیست اخبار',
      fields: [
        {
          name: 'fa',
          title: 'ꕥ خلاصه پارسی',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().error('خلاصه پارسی الزامی است'),
          placeholder: 'خلاصه‌ای از مقاله به پارسی بنویسید...',
        },
        {
          name: 'en',
          title: '🇺🇸 خلاصه انگلیسی',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().error('English summary is required'),
          placeholder: 'Write a summary of the article in English...',
        },
      ],
      options: {
        columns: 1,
      },
    }),

    // محتوای اصلی - با UI بهتر
    defineField({
      name: 'body',
      title: '✍️ محتوای کامل مقاله / Full Article Content',
      type: 'object',
      fieldset: 'content',
      description: '⚠️ توجه: محتوای هر دو زبان باید کامل و یکسان باشد',
      fields: [
        {
          name: 'fa',
          title: 'ꕥ محتوای پارسی',
          type: 'array',
          of: [{type: 'block'}, {type: 'image'}],
          validation: (rule) => rule.required().error('محتوای پارسی الزامی است'),
        },
        {
          name: 'en',
          title: '🇺🇸 محتوای انگلیسی',
          type: 'array',
          of: [{type: 'block'}, {type: 'image'}],
          validation: (rule) => rule.required().error('English content is required'),
        },
      ],
    }),

    // تاریخ انتشار
    defineField({
      name: 'publishedAt',
      title: '📅 تاریخ انتشار / Published Date',
      type: 'datetime',
      fieldset: 'publishing',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    // تاریخ انقضا
    defineField({
      name: 'expireAt',
      title: '⏰ تاریخ انقضا / Expire Date',
      type: 'datetime',
      fieldset: 'publishing',
      description: 'تاریخ و زمان انقضای پست (اختیاری)',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const expireDate = new Date(value)
          const now = new Date()
          if (expireDate <= now) return 'تاریخ انقضا باید در آینده باشد'
          return true
        }),
    }),

    // دسته‌بندی، منطقه، موضوع در یک ردیف
    defineField({
      name: 'category',
      title: '📂 دسته‌بندی / Category',
      type: 'reference',
      fieldset: 'metadata',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'region',
      title: '🌍 منطقه / Region',
      type: 'reference',
      fieldset: 'metadata',
      to: [{type: 'region'}],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'topic',
      title: '🏷️ موضوع / Topic',
      type: 'reference',
      fieldset: 'metadata',
      to: [{type: 'topic'}],
      validation: (rule) => rule.required(),
    }),

    // مهم و برچسب‌ها
    defineField({
      name: 'important',
      title: '⭐ مقاله مهم / Important Article',
      type: 'boolean',
      fieldset: 'metadata',
      description: 'آیا این مقاله مهم و اولویت‌دار است؟',
      initialValue: false,
    }),

    defineField({
      name: 'tags',
      title: '🏷️ برچسب‌ها / Tags',
      type: 'array',
      fieldset: 'metadata',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      description: 'برچسب‌های مرتبط با مقاله',
    }),

    // نویسنده (ساده‌شده)
    defineField({
      name: 'author',
      title: '✍️ نویسنده / Author',
      type: 'object',
      fieldset: 'metadata',
      description: 'اطلاعات نویسنده (اختیاری - در صورت خالی بودن، نام شما نمایش داده می‌شود)',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'name',
          title: 'نام نویسنده / Author Name',
          type: 'object',
          fields: [
            {
              name: 'fa',
              title: 'ꕥ نام پارسی',
              type: 'string',
              placeholder: 'نام نویسنده به پارسی',
            },
            {
              name: 'en',
              title: '🇺🇸 English Name',
              type: 'string',
              placeholder: 'Author name in English',
            },
          ],
        },
        {
          name: 'bio',
          title: 'بیوگرافی / Bio',
          type: 'object',
          fields: [
            {
              name: 'fa',
              title: 'ꕥ بیوگرافی پارسی',
              type: 'text',
              rows: 2,
              placeholder: 'بیوگرافی کوتاه به پارسی',
            },
            {
              name: 'en',
              title: '🇺🇸 English Bio',
              type: 'text',
              rows: 2,
              placeholder: 'Short bio in English',
            },
          ],
        },
        {
          name: 'avatar',
          title: 'تصویر نویسنده / Avatar',
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),

    // تنظیمات SEO (ساده‌شده)
    defineField({
      name: 'seo',
      title: '🔍 تنظیمات SEO',
      type: 'object',
      fieldset: 'seo',
      description: 'تنظیمات بهینه‌سازی موتورهای جستجو',
      fields: [
        {
          name: 'metaTitle',
          title: 'عنوان SEO / SEO Title',
          type: 'object',
          description: 'عنوان برای موتورهای جستجو (حداکثر 60 کاراکتر)',
          fields: [
            {
              name: 'fa',
              title: 'ꕥ عنوان SEO پارسی',
              type: 'string',
              validation: (rule) => rule.max(60).warning('بهتر است کمتر از 60 کاراکتر باشد'),
              placeholder: 'عنوان برای گوگل پارسی...',
            },
            {
              name: 'en',
              title: '🇺🇸 English SEO Title',
              type: 'string',
              validation: (rule) => rule.max(60).warning('Should be less than 60 characters'),
              placeholder: 'Title for Google English...',
            },
          ],
        },
        {
          name: 'metaDescription',
          title: 'توضیحات SEO / SEO Description',
          type: 'object',
          description: 'توضیحات برای موتورهای جستجو (حداکثر 160 کاراکتر)',
          fields: [
            {
              name: 'fa',
              title: 'ꕥ توضیحات SEO پارسی',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.max(160).warning('بهتر است کمتر از 160 کاراکتر باشد'),
              placeholder: 'توضیحات برای گوگل پارسی...',
            },
            {
              name: 'en',
              title: '🇺🇸 English SEO Description',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.max(160).warning('Should be less than 160 characters'),
              placeholder: 'Description for Google English...',
            },
          ],
        },
        {
          name: 'ogImage',
          title: '📱 تصویر شبکه‌های اجتماعی / Social Media Image',
          type: 'image',
          description: 'تصویر برای نمایش در فیسبوک، تلگرام و... (1200x630 پیکسل)',
        },
        {
          name: 'noIndex',
          title: '🚫 عدم نمایه‌سازی / No Index',
          type: 'boolean',
          description: 'اگر تیک بزنید، این مقاله در گوگل نمایش داده نمی‌شود',
          initialValue: false,
        },
      ],
    }),
  ],

  preview: {
    select: {
      titleFa: 'title.fa',
      titleEn: 'title.en',
      important: 'important',
      category: 'category.title.fa',
      region: 'region.title.fa',
      topic: 'topic.title.fa',
      trackingId: 'slug.current',
      expireAt: 'expireAt',
      media: 'image',
    },
    prepare({titleFa, titleEn, important, category, region, topic, trackingId, expireAt, media}) {
      const title = titleFa || titleEn || 'بدون عنوان'
      const subtitle = [
        trackingId && `🔍 ${trackingId}`,
        important && '⭐ مهم',
        category && `📂 ${category}`,
        region && `🌍 ${region}`,
        topic && `🏷️ ${topic}`,
        expireAt && `⏳ انقضا`,
        titleFa && titleEn && '🌐 دوزبانه',
      ]
        .filter(Boolean)
        .join(' • ')

      return {
        title: title,
        subtitle: subtitle || 'پست جدید',
        media: media,
      }
    },
  },
})
