// ==========================================
// studio-eramtv/schemaTypes/tagType.ts
import {defineField, defineType} from 'sanity'

export const tagType = defineType({
 name: 'tag',
 title: 'برچسب',
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
 ],
})