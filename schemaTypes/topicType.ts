// ==========================================
// studio-eramtv/schemaTypes/topicType.ts
import {defineField, defineType} from 'sanity'

export const topicType = defineType({
  name: 'topic',
  title: 'موضوع',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان',
      type: 'string',
      validation: (rule) => rule.required(),
      options: {
        list: [
          {title: 'زنده', value: 'live'},
          {title: 'خبر', value: 'news'},
          {title: 'پادکست', value: 'podcast'},
          {title: 'برنامه', value: 'program'},
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
      name: 'color',
      title: 'رنگ',
      type: 'string',
      options: {
        list: [
          {title: 'قرمز (زنده)', value: '#ef4444'},
          {title: 'آبی (خبر)', value: '#3b82f6'},
          {title: 'بنفش (پادکست)', value: '#8b5cf6'},
          {title: 'سبز (برنامه)', value: '#10b981'},
          {title: 'نارنجی', value: '#f97316'},
          {title: 'صورتی', value: '#ec4899'},
        ],
        layout: 'dropdown',
      },
      initialValue: '#3b82f6',
    }),
    defineField({
      name: 'icon',
      title: 'آیکون',
      type: 'string',
      description: 'نام آیکون برای نمایش در رابط کاربری',
      options: {
        list: [
          {title: '📺 تلویزیون (زنده)', value: 'tv'},
          {title: '📰 روزنامه (خبر)', value: 'newspaper'},
          {title: '🎧 هدفون (پادکست)', value: 'headphones'},
          {title: '🎬 کلاپر (برنامه)', value: 'clapperboard'},
        ],
      },
    }),
    defineField({
      name: 'priority',
      title: 'اولویت',
      type: 'number',
      description: 'عدد کمتر یعنی اولویت بیشتر',
      initialValue: 1,
      validation: (rule) => rule.min(1).max(10),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
      icon: 'icon',
    },
    prepare({title, color, icon}) {
      return {
        title: title,
        subtitle: icon ? `آیکون: ${icon}` : '',
      }
    },
  },
})