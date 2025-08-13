// studio-eramtv/schemaTypes/imageSlider.ts
import {defineField, defineType} from 'sanity'

export const imageSliderType = defineType({
  name: 'imageSlider',
  title: 'Image Slider',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان اسلایدر',
      type: 'string',
      description: 'عنوان اختیاری برای اسلایدر تصاویر',
    }),
    defineField({
      name: 'slides',
      title: 'اسلایدها',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'اسلاید',
          fields: [
            defineField({
              name: 'image',
              title: 'تصویر',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'عنوان تصویر',
              type: 'string',
              description: 'عنوان که روی تصویر نمایش داده می‌شود',
            }),
            defineField({
              name: 'description',
              title: 'توضیحات',
              type: 'text',
              description: 'توضیحات مختصر در مورد تصویر',
              rows: 3,
            }),
            defineField({
              name: 'link',
              title: 'لینک (اختیاری)',
              type: 'object',
              fields: [
                defineField({
                  name: 'url',
                  title: 'آدرس لینک',
                  type: 'url',
                }),
                defineField({
                  name: 'text',
                  title: 'متن دکمه',
                  type: 'string',
                  initialValue: 'مشاهده بیشتر',
                }),
                defineField({
                  name: 'openInNewTab',
                  title: 'باز کردن در تب جدید',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
            }),
            defineField({
              name: 'order',
              title: 'ترتیب نمایش',
              type: 'number',
              description: 'شماره ترتیب برای نمایش اسلاید (شروع از 1)',
              initialValue: 1,
              validation: (rule) => rule.min(1).integer(),
            }),
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
    }),
    defineField({
      name: 'settings',
      title: 'تنظیمات اسلایدر',
      type: 'object',
      fields: [
        defineField({
          name: 'autoplay',
          title: 'پخش خودکار',
          type: 'boolean',
          description: 'آیا اسلایدر به صورت خودکار تغییر کند؟',
          initialValue: true,
        }),
        defineField({
          name: 'duration',
          title: 'مدت زمان هر اسلاید (ثانیه)',
          type: 'number',
          description: 'مدت زمان نمایش هر اسلاید به ثانیه',
          initialValue: 5,
          validation: (rule) => rule.min(1).max(30),
          hidden: ({parent}) => !parent?.autoplay,
        }),
        defineField({
          name: 'showDots',
          title: 'نمایش نقاط ناوبری',
          type: 'boolean',
          description: 'آیا نقاط ناوبری زیر اسلایدر نمایش داده شود؟',
          initialValue: true,
        }),
        defineField({
          name: 'showArrows',
          title: 'نمایش فلش‌های ناوبری',
          type: 'boolean',
          description: 'آیا فلش‌های چپ و راست نمایش داده شود؟',
          initialValue: true,
        }),
        defineField({
          name: 'height',
          title: 'ارتفاع اسلایدر',
          type: 'string',
          description: 'ارتفاع اسلایدر (مثال: 400px یا 50vh)',
          initialValue: '400px',
          validation: (rule) => rule.required(),
        }),
        defineField({
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
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
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
})