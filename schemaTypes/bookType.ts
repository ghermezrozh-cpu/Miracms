// studio-eramtv/schemaTypes/bookType.ts
import { defineField, defineType } from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: '📚 کتاب / Book',
  type: 'document',
  fieldsets: [
    {
      name: 'content',
      title: '📝 محتوا / Content',
      options: { 
        collapsible: true, 
        collapsed: false,
        columns: 1 
      }
    },
    {
      name: 'files',
      title: '📎 فایل‌ها / Files',
      options: { 
        collapsible: true, 
        collapsed: false,
        columns: 2 
      }
    },
    {
      name: 'metadata',
      title: '🏷️ اطلاعات تکمیلی / Metadata',
      options: { 
        collapsible: true, 
        collapsed: true 
      }
    }
  ],
  fields: [
    // عنوان کتاب
    defineField({
      name: 'title',
      title: '📖 عنوان کتاب / Book Title',
      type: 'string',
      fieldset: 'content',
      description: 'عنوان کامل کتاب',
      validation: (rule) => rule.required().error('عنوان کتاب الزامی است'),
      placeholder: 'عنوان کتاب را وارد کنید...'
    }),

    // اسلاگ برای URL
    defineField({
      name: 'slug',
      title: '🔗 اسلاگ / URL Slug',
      type: 'slug',
      fieldset: 'content',
      description: 'آدرس URL کتاب در سایت',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => {
          return input
            .toLowerCase()
            .replace(/[\u0600-\u06FF\s]+/g, '-') // فارسی و فاصله به -
            .replace(/[^\w\-]+/g, '') // حذف کاراکترهای غیرمجاز
            .replace(/\-\-+/g, '-') // چندین - به یکی
            .replace(/^-+/, '') // حذف - از ابتدا
            .replace(/-+$/, '') // حذف - از انتها
            .substring(0, 50)
        }
      },
      validation: (rule) => rule.required().error('اسلاگ الزامی است')
    }),

    // توضیحات کوتاه
    defineField({
      name: 'shortDescription',
      title: '📋 توضیحات کوتاه / Short Description',
      type: 'text',
      fieldset: 'content',
      description: 'خلاصه‌ای کوتاه از کتاب (برای نمایش در لیست کتاب‌ها)',
      rows: 3,
      validation: (rule) => rule.required().max(300).error('توضیحات کوتاه الزامی است و باید کمتر از 300 کاراکتر باشد'),
      placeholder: 'خلاصه‌ای از محتوای کتاب بنویسید...'
    }),

    // تصویر جلد کتاب
    defineField({
      name: 'thumbnail',
      title: '🖼️ تصویر جلد / Book Cover',
      type: 'image',
      fieldset: 'files',
      description: 'تصویر جلد کتاب (نسبت توصیه شده: 3:4)',
      options: {
        hotspot: true,
        accept: 'image/*'
      },
      validation: (rule) => rule.required().error('تصویر جلد کتاب الزامی است'),
      fields: [
        {
          name: 'alt',
          title: 'متن جایگزین تصویر',
          type: 'string',
          description: 'توضیح تصویر برای نابینایان و موتورهای جستجو'
        }
      ]
    }),

    // فایل PDF کتاب
    defineField({
      name: 'pdfFile',
      title: '📄 فایل PDF کتاب / PDF File',
      type: 'file',
      fieldset: 'files',
      description: 'فایل PDF کامل کتاب',
      options: {
        accept: '.pdf'
      },
      validation: (rule) => rule.required().error('فایل PDF کتاب الزامی است')
    }),

    // توضیحات طولانی
    defineField({
      name: 'longDescription',
      title: '📖 توضیحات کامل / Full Description',
      type: 'array',
      fieldset: 'content',
      description: 'توضیحات کامل و جزئیات کتاب',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'معمولی', value: 'normal' },
            { title: 'عنوان اصلی', value: 'h1' },
            { title: 'عنوان فرعی', value: 'h2' },
            { title: 'عنوان سوم', value: 'h3' },
            { title: 'نقل قول', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'قوی', value: 'strong' },
              { title: 'کج', value: 'em' },
              { title: 'زیرخط', value: 'underline' }
            ],
            annotations: [
              {
                title: 'لینک',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'آدرس',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          title: 'تصویر',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'متن جایگزین',
              type: 'string'
            },
            {
              name: 'caption',
              title: 'توضیح تصویر',
              type: 'string'
            }
          ]
        }
      ],
      validation: (rule) => rule.required().error('توضیحات کامل کتاب الزامی است')
    }),

    // نویسنده
    defineField({
      name: 'author',
      title: '✍️ نویسنده / Author',
      type: 'string',
      fieldset: 'metadata',
      description: 'نام نویسنده یا نویسندگان کتاب',
      placeholder: 'نام نویسنده را وارد کنید...'
    }),

    // ناشر
    defineField({
      name: 'publisher',
      title: '🏢 ناشر / Publisher',
      type: 'string',
      fieldset: 'metadata',
      description: 'نام ناشر کتاب',
      placeholder: 'نام ناشر را وارد کنید...'
    }),

    // سال انتشار
    defineField({
      name: 'publishYear',
      title: '📅 سال انتشار / Publication Year',
      type: 'number',
      fieldset: 'metadata',
      description: 'سال انتشار کتاب',
      validation: (rule) => rule.min(1400).max(new Date().getFullYear() + 1).integer()
    }),

    // تعداد صفحات
    defineField({
      name: 'pageCount',
      title: '📄 تعداد صفحات / Page Count',
      type: 'number',
      fieldset: 'metadata',
      description: 'تعداد صفحات کتاب',
      validation: (rule) => rule.min(1).integer()
    }),

    // زبان کتاب
    defineField({
      name: 'language',
      title: '🌐 زبان / Language',
      type: 'string',
      fieldset: 'metadata',
      description: 'زبان اصلی کتاب',
      options: {
        list: [
          { title: 'فارسی', value: 'fa' },
          { title: 'انگلیسی', value: 'en' },
          { title: 'عربی', value: 'ar' },
          { title: 'دری', value: 'prs' },
          { title: 'پشتو', value: 'ps' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'fa'
    }),

    // دسته‌بندی کتاب
    defineField({
      name: 'category',
      title: '📂 دسته‌بندی / Category',
      type: 'string',
      fieldset: 'metadata',
      description: 'دسته‌بندی موضوعی کتاب',
      options: {
        list: [
          { title: '📚 ادبیات', value: 'literature' },
          { title: '📖 تاریخ', value: 'history' },
          { title: '🔬 علمی', value: 'science' },
          { title: '🎨 هنر', value: 'art' },
          { title: '💼 اقتصاد', value: 'economy' },
          { title: '⚖️ حقوق', value: 'law' },
          { title: '🧠 روانشناسی', value: 'psychology' },
          { title: '🏛️ فلسفه', value: 'philosophy' },
          { title: '🕌 مذهبی', value: 'religious' },
          { title: '📚 آموزشی', value: 'educational' },
          { title: '🌟 سایر', value: 'other' }
        ],
        layout: 'dropdown'
      }
    }),

    // برچسب‌ها
    defineField({
      name: 'tags',
      title: '🏷️ برچسب‌ها / Tags',
      type: 'array',
      fieldset: 'metadata',
      description: 'کلمات کلیدی مرتبط با کتاب',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),

    // وضعیت انتشار
    defineField({
      name: 'status',
      title: '📊 وضعیت / Status',
      type: 'string',
      fieldset: 'metadata',
      description: 'وضعیت انتشار کتاب',
      options: {
        list: [
          { title: '📝 پیش‌نویس', value: 'draft' },
          { title: '✅ منتشر شده', value: 'published' },
          { title: '🚫 آرشیو شده', value: 'archived' }
        ],
        layout: 'radio'
      },
      initialValue: 'draft'
    }),

    // تاریخ افزودن
    defineField({
      name: 'createdAt',
      title: '📅 تاریخ افزودن / Created At',
      type: 'datetime',
      fieldset: 'metadata',
      description: 'تاریخ افزودن کتاب به سیستم',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),

    // محبوبیت/امتیاز
    defineField({
      name: 'featured',
      title: '⭐ کتاب ویژه / Featured Book',
      type: 'boolean',
      fieldset: 'metadata',
      description: 'آیا این کتاب در بخش کتاب‌های ویژه نمایش داده شود؟',
      initialValue: false
    }),

    // تعداد دانلود (فیلد خودکار)
    defineField({
      name: 'downloadCount',
      title: '📥 تعداد دانلود / Download Count',
      type: 'number',
      fieldset: 'metadata',
      description: 'تعداد دفعات دانلود کتاب',
      initialValue: 0,
      readOnly: true
    })
  ],

  // پیش‌نمایش در لیست
  preview: {
    select: {
      title: 'title',
      author: 'author',
      category: 'category',
      status: 'status',
      featured: 'featured',
      media: 'thumbnail'
    },
    prepare({ title, author, category, status, featured, media }) {
      const statusIcons = {
        draft: '📝',
        published: '✅',
        archived: '🚫'
      }

      const categoryLabels: { [key: string]: string } = {
        literature: '📚 ادبیات',
        history: '📖 تاریخ',
        science: '🔬 علمی',
        art: '🎨 هنر',
        economy: '💼 اقتصاد',
        law: '⚖️ حقوق',
        psychology: '🧠 روانشناسی',
        philosophy: '🏛️ فلسفه',
        religious: '🕌 مذهبی',
        educational: '📚 آموزشی',
        other: '🌟 سایر'
      }

      const subtitle = [
        statusIcons[status as keyof typeof statusIcons] || '❓',
        featured && '⭐ ویژه',
        author && `نویسنده: ${author}`,
        category && categoryLabels[category]
      ]
        .filter(Boolean)
        .join(' • ')

      return {
        title: title || 'کتاب بدون عنوان',
        subtitle: subtitle || 'کتاب جدید',
        media: media
      }
    }
  },

  // ترتیب‌بندی پیش‌فرض
  orderings: [
    {
      title: 'تاریخ افزودن (جدیدترین)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'عنوان (الفبایی)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'نویسنده (الفبایی)',
      name: 'authorAsc',
      by: [{ field: 'author', direction: 'asc' }]
    },
    {
      title: 'محبوبیت (ویژه ابتدا)',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'createdAt', direction: 'desc' }
      ]
    }
  ]
})