// studio/schemaTypes/localizedSchemas.ts
import { defineField, defineType } from 'sanity'
import { localizedString, localizedText, localizedSlug } from '../schemas/localizedFields'

// دسته‌بندی دوزبانه
export const localizedCategoryType = defineType({
  name: 'category',
  title: 'دسته‌بندی / Category',
  type: 'document',
  fields: [
    localizedString('title', 'عنوان / Title'),
    localizedSlug('slug', 'اسلاگ / Slug', 'title'),
    localizedText('description', 'توضیحات / Description'),
    defineField({
      name: 'color',
      title: 'رنگ / Color',
      type: 'string',
      options: {
        list: [
          { title: 'قرمز / Red', value: '#ef4444' },
          { title: 'آبی / Blue', value: '#3b82f6' },
          { title: 'سبز / Green', value: '#10b981' },
          { title: 'زرد / Yellow', value: '#f59e0b' },
          { title: 'بنفش / Purple', value: '#8b5cf6' },
          { title: 'صورتی / Pink', value: '#ec4899' },
          { title: 'نارنجی / Orange', value: '#f97316' },
          { title: 'خاکستری / Gray', value: '#6b7280' },
        ],
        layout: 'dropdown',
      },
      initialValue: '#3b82f6',
    }),
  ],
  preview: {
    select: {
      titleFa: 'title.fa',
      titleEn: 'title.en',
      color: 'color'
    },
    prepare({ titleFa, titleEn, color }) {
      return {
        title: `${titleFa || ''} ${titleEn ? `/ ${titleEn}` : ''}`,
        subtitle: `رنگ: ${color}`,
      }
    },
  },
})

// برچسب دوزبانه
export const localizedTagType = defineType({
  name: 'tag',
  title: 'برچسب / Tag',
  type: 'document',
  fields: [
    localizedString('title', 'عنوان / Title'),
    localizedSlug('slug', 'اسلاگ / Slug', 'title'),
    localizedText('description', 'توضیحات / Description'),
  ],
  preview: {
    select: {
      titleFa: 'title.fa',
      titleEn: 'title.en'
    },
    prepare({ titleFa, titleEn }) {
      return {
        title: `#${titleFa || titleEn}`,
        subtitle: titleFa && titleEn ? `🌐 ${titleFa} / ${titleEn}` : (titleFa || titleEn),
      }
    },
  },
})

// منطقه دوزبانه
export const localizedRegionType = defineType({
  name: 'region',
  title: 'منطقه / Region',
  type: 'document',
  fields: [
    localizedString('title', 'عنوان / Title'),
    localizedSlug('slug', 'اسلاگ / Slug', 'title'),
    localizedText('description', 'توضیحات / Description'),
    defineField({
      name: 'code',
      title: 'کد منطقه / Region Code',
      type: 'string',
      description: 'کد کوتاه برای منطقه (مثل IR, AF, WR)',
      options: {
        list: [
          { title: 'IR - ایران / Iran', value: 'IR' },
          { title: 'AF - افغانستان / Afghanistan', value: 'AF' },
          { title: 'WR - جهان / World', value: 'WR' },
        ],
      },
    }),
    defineField({
      name: 'flag',
      title: 'پرچم/آیکون / Flag/Icon',
      type: 'image',
      description: 'تصویر پرچم یا آیکون نمایشی منطقه',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      titleFa: 'title.fa',
      titleEn: 'title.en',
      code: 'code',
      media: 'flag',
    },
    prepare({ titleFa, titleEn, code, media }) {
      return {
        title: `${titleFa || ''} ${titleEn ? `/ ${titleEn}` : ''}`,
        subtitle: code ? `کد: ${code}` : '',
        media: media,
      }
    },
  },
})

// موضوع دوزبانه
export const localizedTopicType = defineType({
  name: 'topic',
  title: 'موضوع / Topic',
  type: 'document',
  fields: [
    localizedString('title', 'عنوان / Title'),
    localizedSlug('slug', 'اسلاگ / Slug', 'title'),
    localizedText('description', 'توضیحات / Description'),
    defineField({
      name: 'color',
      title: 'رنگ / Color',
      type: 'string',
      options: {
        list: [
          { title: 'قرمز (زنده) / Red (Live)', value: '#ef4444' },
          { title: 'آبی (خبر) / Blue (News)', value: '#3b82f6' },
          { title: 'بنفش (پادکست) / Purple (Podcast)', value: '#8b5cf6' },
          { title: 'سبز (برنامه) / Green (Program)', value: '#10b981' },
          { title: 'نارنجی / Orange', value: '#f97316' },
          { title: 'صورتی / Pink', value: '#ec4899' },
        ],
        layout: 'dropdown',
      },
      initialValue: '#3b82f6',
    }),
    defineField({
      name: 'icon',
      title: 'آیکون / Icon',
      type: 'string',
      description: 'نام آیکون برای نمایش در رابط کاربری',
      options: {
        list: [
          { title: '📺 تلویزیون (زنده) / TV (Live)', value: 'tv' },
          { title: '📰 روزنامه (خبر) / Newspaper (News)', value: 'newspaper' },
          { title: '🎧 هدفون (پادکست) / Headphones (Podcast)', value: 'headphones' },
          { title: '🎬 کلاپر (برنامه) / Clapperboard (Program)', value: 'clapperboard' },
        ],
      },
    }),
    defineField({
      name: 'priority',
      title: 'اولویت / Priority',
      type: 'number',
      description: 'عدد کمتر یعنی اولویت بیشتر',
      initialValue: 1,
      validation: (rule) => rule.min(1).max(10),
    }),
  ],
  preview: {
    select: {
      titleFa: 'title.fa',
      titleEn: 'title.en',
      color: 'color',
      icon: 'icon',
    },
    prepare({ titleFa, titleEn, color, icon }) {
      return {
        title: `${titleFa || ''} ${titleEn ? `/ ${titleEn}` : ''}`,
        subtitle: icon ? `آیکون: ${icon}` : '',
      }
    },
  },
})