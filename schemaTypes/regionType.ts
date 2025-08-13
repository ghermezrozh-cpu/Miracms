// ==========================================
// studio-eramtv/schemaTypes/regionType.ts
import {defineField, defineType} from 'sanity'

export const regionType = defineType({
  name: 'region',
  title: 'منطقه',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'ایران', value: 'iran'},
          {title: 'افغانستان', value: 'afghanistan'},
          {title: 'جهان', value: 'world'},
        ],
      },
    }),
    defineField({
      name: 'slug',
      title: 'اسلاگ',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'توضیحات',
      type: 'text',
    }),
    defineField({
      name: 'code',
      title: 'کد منطقه',
      type: 'string',
      description: 'کد کوتاه برای منطقه (مثل IR, AF, WR)',
      options: {
        list: [
          {title: 'IR - ایران', value: 'IR'},
          {title: 'AF - افغانستان', value: 'AF'},
          {title: 'WR - جهان', value: 'WR'},
        ],
      },
    }),
    defineField({
      name: 'flag',
      title: 'پرچم/آیکون',
      type: 'image',
      description: 'تصویر پرچم یا آیکون نمایشی منطقه',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      code: 'code',
      media: 'flag',
    },
    prepare({title, code, media}) {
      return {
        title: title,
        subtitle: code ? `کد: ${code}` : '',
        media: media,
      }
    },
  },
})