// ==========================================
// studio-eramtv/schemaTypes/categoryType.ts
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
 name: 'category',
 title: 'دسته‌بندی',
 type: 'document',
 fields: [
   defineField({
     name: 'title',
     title: 'عنوان',
     type: 'string',
     validation: (rule) => rule.required(),
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
         {title: 'قرمز', value: '#ef4444'},
         {title: 'آبی', value: '#3b82f6'},
         {title: 'سبز', value: '#10b981'},
         {title: 'زرد', value: '#f59e0b'},
         {title: 'بنفش', value: '#8b5cf6'},
         {title: 'صورتی', value: '#ec4899'},
         {title: 'نارنجی', value: '#f97316'},
         {title: 'خاکستری', value: '#6b7280'},
       ],
       layout: 'dropdown',
     },
     initialValue: '#3b82f6',
   }),
 ],
})
