// studio-eramtv/schemaTypes/postType.ts
import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'کد رهگیری',
      type: 'slug',
      description: 'کد رهگیری یونیک 12 رقمی برای اعتبارسنجی خبر',
      options: {
        source: () => {
          // تولید عدد 12 رقمی که با صفر شروع نمی‌شود
          const first = Math.floor(Math.random() * 9) + 1 // 1-9
          let remaining = ''
          for (let i = 0; i < 11; i++) {
            remaining += Math.floor(Math.random() * 10) // 0-9
          }
          return first + remaining
        },
        maxLength: 12,
        slugify: (input: string) => {
          // اگر ورودی عدد 12 رقمی معتبر است، همان را برگردان
          if (typeof input === 'string' && /^[1-9]\d{11}$/.test(input)) {
            return input
          }
          // در غیر این صورت عدد جدید تولید کن
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

          // بررسی طول
          if (slug.length !== 12) {
            return 'کد رهگیری باید دقیقاً 12 رقم باشد'
          }

          // بررسی اینکه فقط عدد باشد
          if (!/^\d+$/.test(slug)) {
            return 'کد رهگیری باید فقط شامل اعداد باشد'
          }

          // بررسی اینکه با صفر شروع نشود
          if (slug.startsWith('0')) {
            return 'کد رهگیری نمی‌تواند با صفر شروع شود'
          }

          return true
        }),
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    // فیلد scheduledFor حذف شد - Sanity خودش مدیریت می‌کند
    // حالا از طریق Schedule button در Studio استفاده می‌شود

    // فیلد تاریخ انقضا
    defineField({
      name: 'expireAt',
      title: 'تاریخ انقضا',
      type: 'datetime',
      description: 'تاریخ و زمان انقضای پست (اختیاری)',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true

          const expireDate = new Date(value)
          const now = new Date()

          if (expireDate <= now) {
            return 'تاریخ انقضا باید در آینده باشد'
          }

          return true
        }),
    }),

    defineField({
      name: 'image',
      type: 'image',
    }),

    // Author field (optional - manual override)
    defineField({
      name: 'author',
      title: 'نویسنده (اختیاری)',
      type: 'object',
      description: 'در صورت خالی بودن، نام کاربر ایجادکننده نمایش داده می‌شود',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'name',
          title: 'نام نویسنده',
          type: 'string',
        },
        {
          name: 'bio',
          title: 'بیوگرافی کوتاه',
          type: 'text',
        },
        {
          name: 'avatar',
          title: 'تصویر نویسنده',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // Category field
    defineField({
      name: 'category',
      title: 'دسته‌بندی',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),

    // Region field
    defineField({
      name: 'region',
      title: 'منطقه',
      type: 'reference',
      to: [{type: 'region'}],
      validation: (rule) => rule.required(),
    }),

    // Topic field
    defineField({
      name: 'topic',
      title: 'موضوع',
      type: 'reference',
      to: [{type: 'topic'}],
      validation: (rule) => rule.required(),
    }),

    // Important field
    defineField({
      name: 'important',
      title: 'مهم',
      type: 'boolean',
      description: 'آیا این پست مهم و ویژه است؟',
      initialValue: false,
    }),

    // Tags field
    defineField({
      name: 'tags',
      title: 'برچسب‌ها',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
    }),

    // SEO section
    defineField({
      name: 'seo',
      title: 'تنظیمات SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'metaTitle',
          title: 'عنوان متا (Meta Title)',
          type: 'string',
          description: 'عنوان برای موتورهای جستجو (حداکثر 60 کاراکتر)',
          validation: (rule) => rule.max(60).warning('عنوان متا بهتر است کمتر از 60 کاراکتر باشد'),
        },
        {
          name: 'metaDescription',
          title: 'توضیحات متا (Meta Description)',
          type: 'text',
          description: 'توضیحات برای موتورهای جستجو (حداکثر 160 کاراکتر)',
          validation: (rule) =>
            rule.max(160).warning('توضیحات متا بهتر است کمتر از 160 کاراکتر باشد'),
        },
        {
          name: 'keywords',
          title: 'کلمات کلیدی',
          type: 'array',
          of: [{type: 'string'}],
          description: 'کلمات کلیدی مرتبط با مطلب',
        },
        {
          name: 'ogImage',
          title: 'تصویر شبکه‌های اجتماعی (OG Image)',
          type: 'image',
          description: 'تصویر برای نمایش در شبکه‌های اجتماعی (1200x630 پیکسل)',
        },
        {
          name: 'noIndex',
          title: 'عدم نمایه‌سازی',
          type: 'boolean',
          description: 'از نمایه‌سازی این صفحه توسط موتورهای جستجو جلوگیری کن',
          initialValue: false,
        },
      ],
    }),

    defineField({
      name: 'body',
      type: 'array',
      of: [
        {type: 'block'},
        // Custom Image Block
        {
          type: 'object',
          name: 'customImage',
          title: 'عکس',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'تصویر',
              options: {
                hotspot: true,
                accept: 'image/*',
              },
              validation: (Rule) => Rule.required().error('تصویر الزامی است'),
            },
            {
              name: 'alt',
              type: 'string',
              title: 'متن جایگزین',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'توضیحات',
            },
          ],
        },
        // Custom Video Block
        {
          type: 'object',
          name: 'customVideo',
          title: 'ویدیو',
          fields: [
            {
              name: 'videoFile',
              type: 'file',
              title: 'فایل ویدیو',
              options: {
                accept: 'video/*',
              },
            },
            {
              name: 'videoUrl',
              type: 'url',
              title: 'لینک ویدیو (YouTube, Vimeo)',
            },
            {
              name: 'poster',
              type: 'image',
              title: 'تصویر پیش‌نمایش',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'توضیحات',
            },
          ],
        },
        // Custom Link Block
        {
          type: 'object',
          name: 'customLink',
          title: 'لینک',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'عنوان لینک',
              description: 'متن نمایشی لینک',
              validation: (Rule) => Rule.required().error('عنوان لینک الزامی است'),
            },
            {
              name: 'url',
              type: 'url',
              title: 'آدرس لینک',
              description: 'آدرس کامل لینک (شامل http:// یا https://)',
              validation: (Rule) => Rule.required().error('آدرس لینک الزامی است'),
            },
            {
              name: 'description',
              type: 'text',
              title: 'توضیحات',
              description: 'توضیح اختیاری درباره لینک',
            },
            {
              name: 'openInNewTab',
              type: 'boolean',
              title: 'باز کردن در تب جدید',
              description: 'آیا لینک در تب جدید باز شود؟',
              initialValue: true,
            },
            {
              name: 'style',
              type: 'string',
              title: 'نوع نمایش',
              options: {
                list: [
                  {title: 'دکمه اصلی', value: 'button-primary'},
                  {title: 'دکمه ثانویه', value: 'button-secondary'},
                  {title: 'لینک ساده', value: 'text-link'},
                  {title: 'کارت لینک', value: 'card-link'},
                ],
                layout: 'radio',
              },
              initialValue: 'button-primary',
            },
            {
              name: 'icon',
              type: 'string',
              title: 'آیکون',
              description: 'نام آیکون اختیاری',
              options: {
                list: [
                  {title: 'بدون آیکون', value: ''},
                  {title: 'لینک خارجی', value: 'external-link'},
                  {title: 'دانلود', value: 'download'},
                  {title: 'ایمیل', value: 'mail'},
                  {title: 'تلفن', value: 'phone'},
                  {title: 'پیکان', value: 'arrow-right'},
                  {title: 'خانه', value: 'home'},
                ],
                layout: 'dropdown',
              },
              initialValue: '',
            },
          ],
          preview: {
            select: {
              title: 'title',
              url: 'url',
              style: 'style',
            },
            prepare(selection: any) {
              const {title, url, style} = selection
              const styleLabels: {[key: string]: string} = {
                'button-primary': 'دکمه اصلی',
                'button-secondary': 'دکمه ثانویه',
                'text-link': 'لینک ساده',
                'card-link': 'کارت لینک',
              }

              return {
                title: title || 'لینک بدون عنوان',
                subtitle: `${styleLabels[style] || style} - ${url}`,
              }
            },
          },
        },
        // Custom Quote Block
        {
          type: 'object',
          name: 'customQuote',
          title: 'نقل قول',
          fields: [
            {
              name: 'quote',
              type: 'text',
              title: 'متن نقل قول',
              validation: (rule) => rule.required(),
            },
            {
              name: 'author',
              type: 'string',
              title: 'نویسنده',
            },
            {
              name: 'source',
              type: 'string',
              title: 'منبع',
            },
            {
              name: 'authorImage',
              type: 'image',
              title: 'تصویر نویسنده',
            },
          ],
        },
        // Custom Table Block
        {
          type: 'object',
          name: 'customTable',
          title: 'جدول',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'عنوان جدول',
            },
            {
              name: 'rows',
              type: 'array',
              title: 'سطرها',
              of: [
                {
                  type: 'object',
                  name: 'tableRow',
                  title: 'سطر',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      title: 'ستون‌ها',
                      of: [
                        {
                          type: 'string',
                          title: 'محتوای ستون',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'caption',
              type: 'string',
              title: 'توضیحات جدول',
            },
          ],
        },
        // Instagram Post Block
        {
          type: 'object',
          name: 'instagramPost',
          title: 'پست اینستاگرام',
          fields: [
            {
              name: 'embedCode',
              type: 'text',
              title: 'کد Embed اینستاگرام',
              description: 'کد HTML embed کامل که از اینستاگرام کپی می‌کنید',
              validation: (rule) =>
                rule.required().custom((embedCode: any) => {
                  if (typeof embedCode === 'string' && !embedCode.includes('instagram-media')) {
                    return 'لطفاً کد embed معتبر اینستاگرام وارد کنید'
                  }
                  return true
                }),
            },
            {
              name: 'fallbackUrl',
              type: 'url',
              title: 'لینک پست (پشتیبان)',
              description: 'لینک مستقیم پست برای نمایش در صورت مشکل',
            },
            {
              name: 'caption',
              type: 'text',
              title: 'توضیحات',
              description: 'توضیحات اضافی برای پست (اختیاری)',
            },
            {
              name: 'maxWidth',
              type: 'number',
              title: 'حداکثر عرض (پیکسل)',
              description: 'حداکثر عرض نمایش پست (پیش‌فرض: 540)',
              initialValue: 540,
              validation: (rule) => rule.min(320).max(800),
            },
            {
              name: 'centerAlign',
              type: 'boolean',
              title: 'وسط‌چین',
              description: 'آیا پست در وسط صفحه قرار گیرد؟',
              initialValue: true,
            },
          ],
        },
        // X (Twitter) Post Block
        {
          type: 'object',
          name: 'xPost',
          title: 'پست X (توییتر)',
          fields: [
            {
              name: 'embedCode',
              type: 'text',
              title: 'کد Embed X/Twitter',
              description: 'کد HTML embed که از X یا Twitter کپی می‌کنید',
              validation: (rule) =>
                rule.required().custom((embedCode: any) => {
                  if (
                    typeof embedCode === 'string' &&
                    !(embedCode.includes('x.com') || embedCode.includes('twitter.com'))
                  ) {
                    return 'لطفاً کد embed معتبر X یا Twitter وارد کنید'
                  }
                  return true
                }),
            },
            {
              name: 'fallbackUrl',
              type: 'url',
              title: 'لینک پست (پشتیبان)',
              description: 'لینک مستقیم پست برای نمایش در صورت مشکل',
            },
            {
              name: 'caption',
              type: 'text',
              title: 'توضیحات',
              description: 'توضیحات اضافی برای پست (اختیاری)',
            },
            {
              name: 'theme',
              type: 'string',
              title: 'تم نمایش',
              options: {
                list: [
                  {title: 'روشن', value: 'light'},
                  {title: 'تیره', value: 'dark'},
                ],
                layout: 'radio',
              },
              initialValue: 'dark',
            },
          ],
        },
        // Telegram Post Block
        {
          type: 'object',
          name: 'telegramPost',
          title: 'پست تلگرام',
          fields: [
            {
              name: 'embedCode',
              type: 'text',
              title: 'کد Embed تلگرام',
              description: 'کد HTML embed که از تلگرام کپی می‌کنید',
              validation: (rule) => rule.required(),
            },
            {
              name: 'channelUsername',
              type: 'string',
              title: 'نام کاربری کانال (پشتیبان)',
              description: 'نام کاربری کانال تلگرام بدون @ (برای فال‌بک)',
            },
            {
              name: 'messageId',
              type: 'number',
              title: 'شناسه پیام (پشتیبان)',
              description: 'شماره پیام در کانال تلگرام (برای فال‌بک)',
            },
            {
              name: 'caption',
              type: 'text',
              title: 'توضیحات',
              description: 'توضیحات اضافی برای پست (اختیاری)',
            },
            {
              name: 'colorScheme',
              type: 'string',
              title: 'رنگ‌بندی',
              options: {
                list: [
                  {title: 'آبی (پیش‌فرض)', value: 'blue'},
                  {title: 'سبز', value: 'green'},
                  {title: 'خاکستری', value: 'gray'},
                ],
                layout: 'dropdown',
              },
              initialValue: 'blue',
            },
          ],
        },

        // Image Slider Block
        {
          type: 'object',
          name: 'imageSlider',
          title: 'اسلایدر تصاویر',
          fields: [
            {
              name: 'title',
              title: 'عنوان اسلایدر',
              type: 'string',
              description: 'عنوان اختیاری برای اسلایدر تصاویر',
            },
            {
              name: 'slides',
              title: 'اسلایدها',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'اسلاید',
                  fields: [
                    {
                      name: 'image',
                      title: 'تصویر',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                      validation: (rule) => rule.required(),
                    },
                    {
                      name: 'title',
                      title: 'عنوان تصویر',
                      type: 'string',
                      description: 'عنوان که روی تصویر نمایش داده می‌شود',
                    },
                    {
                      name: 'description',
                      title: 'توضیحات',
                      type: 'text',
                      description: 'توضیحات مختصر در مورد تصویر',
                      rows: 3,
                    },
                    {
                      name: 'link',
                      title: 'لینک (اختیاری)',
                      type: 'object',
                      fields: [
                        {
                          name: 'url',
                          title: 'آدرس لینک',
                          type: 'url',
                        },
                        {
                          name: 'text',
                          title: 'متن دکمه',
                          type: 'string',
                          initialValue: 'مشاهده بیشتر',
                        },
                        {
                          name: 'openInNewTab',
                          title: 'باز کردن در تب جدید',
                          type: 'boolean',
                          initialValue: false,
                        },
                      ],
                    },
                    {
                      name: 'order',
                      title: 'ترتیب نمایش',
                      type: 'number',
                      description: 'شماره ترتیب برای نمایش اسلاید (شروع از 1)',
                      initialValue: 1,
                      validation: (rule) => rule.min(1).integer(),
                    },
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'description',
                      media: 'image',
                      order: 'order',
                    },
                    prepare(selection) {
                      const {title, subtitle, media, order} = selection
                      return {
                        title: title || 'بدون عنوان',
                        subtitle: `ترتیب ${order}: ${subtitle || 'بدون توضیحات'}`,
                        media: media,
                      }
                    },
                  },
                },
              ],
              validation: (rule) => rule.min(1).max(10).required(),
            },
            {
              name: 'settings',
              title: 'تنظیمات اسلایدر',
              type: 'object',
              fields: [
                {
                  name: 'autoplay',
                  title: 'پخش خودکار',
                  type: 'boolean',
                  description: 'آیا اسلایدر به صورت خودکار تغییر کند؟',
                  initialValue: true,
                },
                {
                  name: 'duration',
                  title: 'مدت زمان هر اسلاید (ثانیه)',
                  type: 'number',
                  description: 'مدت زمان نمایش هر اسلاید به ثانیه',
                  initialValue: 5,
                  validation: (rule) => rule.min(1).max(30),
                  hidden: ({parent}) => !parent?.autoplay,
                },
                {
                  name: 'showDots',
                  title: 'نمایش نقاط ناوبری',
                  type: 'boolean',
                  description: 'آیا نقاط ناوبری زیر اسلایدر نمایش داده شود؟',
                  initialValue: true,
                },
                {
                  name: 'showArrows',
                  title: 'نمایش فلش‌های ناوبری',
                  type: 'boolean',
                  description: 'آیا فلش‌های چپ و راست نمایش داده شود؟',
                  initialValue: true,
                },
                {
                  name: 'height',
                  title: 'ارتفاع اسلایدر',
                  type: 'string',
                  description: 'ارتفاع اسلایدر (مثال: 400px یا 50vh)',
                  initialValue: '400px',
                  validation: (rule) => rule.required(),
                },
                {
                  name: 'borderRadius',
                  title: 'گردی کردن گوشه‌ها',
                  type: 'string',
                  description: 'میزان گردی گوشه‌ها (مثال: 0px، 8px، 16px)',
                  initialValue: '8px',
                  options: {
                    list: [
                      {title: 'بدون گردی', value: '0px'},
                      {title: 'کم', value: '4px'},
                      {title: 'متوسط', value: '8px'},
                      {title: 'زیاد', value: '16px'},
                      {title: 'خیلی زیاد', value: '24px'},
                    ],
                  },
                },
              ],
              options: {
                collapsible: true,
                collapsed: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              slides: 'slides',
              media: 'slides.0.image',
            },
            prepare(selection) {
              const {title, slides, media} = selection
              const slideCount = slides?.length || 0
              return {
                title: title || 'اسلایدر تصاویر',
                subtitle: `${slideCount} اسلاید`,
                media: media,
              }
            },
          },
        },

        // Social Media Embed (Universal)
        {
          type: 'object',
          name: 'socialEmbed',
          title: 'شبکه اجتماعی (عمومی)',
          description: 'برای شبکه‌های اجتماعی دیگر یا embed کدهای خاص',
          fields: [
            {
              name: 'platform',
              type: 'string',
              title: 'پلتفرم',
              options: {
                list: [
                  {title: 'اینستاگرام', value: 'instagram'},
                  {title: 'X (توییتر)', value: 'x'},
                  {title: 'تلگرام', value: 'telegram'},
                  {title: 'یوتوب', value: 'youtube'},
                  {title: 'فیسبوک', value: 'facebook'},
                  {title: 'تیک‌تاک', value: 'tiktok'},
                  {title: 'لینکدین', value: 'linkedin'},
                  {title: 'واتساپ', value: 'whatsapp'},
                  {title: 'دیگر', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (rule) => rule.required(),
            },
            {
              name: 'url',
              type: 'url',
              title: 'لینک پست',
              description: 'لینک کامل پست در شبکه اجتماعی',
              validation: (rule) => rule.required(),
            },
            {
              name: 'embedCode',
              type: 'text',
              title: 'کد Embed (اختیاری)',
              description: 'کد HTML embed ارائه شده توسط پلتفرم',
            },
            {
              name: 'caption',
              type: 'text',
              title: 'توضیحات',
              description: 'توضیحات یا کپشن برای نمایش',
            },
            {
              name: 'showBorder',
              type: 'boolean',
              title: 'نمایش حاشیه',
              description: 'آیا حاشیه دور محتوا نمایش داده شود؟',
              initialValue: true,
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      important: 'important',
      category: 'category.title',
      region: 'region.title',
      topic: 'topic.title',
      trackingId: 'slug.current',
      expireAt: 'expireAt',
      media: 'image',
    },
    prepare({title, author, important, category, region, topic, trackingId, expireAt, media}) {
      const subtitle = [
        trackingId && `🔍 ${trackingId}`,
        important && '⭐ مهم',
        category && `📂 ${category}`,
        region && `🌍 ${region}`,
        topic && `🏷️ ${topic}`,
        expireAt && `⏳ انقضا`,
        author && `✍️ ${author}`,
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