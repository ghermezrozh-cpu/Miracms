import { defineField, defineType } from 'sanity'
import { User } from 'lucide-react'

export default defineType({
  name: 'aboutme',
  title: 'About Me Page',
  type: 'document',
  icon: User,
  fields: [
    // Hero Section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'title',
          title: 'Professional Title',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'intro',
          title: 'Introduction Text',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'text',
              rows: 4,
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'text',
              rows: 4,
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'heroImagePersian',
          title: 'Hero Background Image (Persian)',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'heroImageEnglish',
          title: 'Hero Background Image (English)',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'welcomeBadge',
          title: 'Welcome Badge Text',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'ctaButtons',
          title: 'Call to Action Buttons',
          type: 'object',
          fields: [
            defineField({
              name: 'primaryButton',
              title: 'Primary Button',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Button Text',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }),
                defineField({
                  name: 'link',
                  title: 'Button Link',
                  type: 'string'
                })
              ]
            }),
            defineField({
              name: 'secondaryButton',
              title: 'Secondary Button',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Button Text',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }),
                defineField({
                  name: 'link',
                  title: 'Button Link',
                  type: 'string'
                })
              ]
            })
          ]
        }),
        defineField({
          name: 'stats',
          title: 'Hero Statistics',
          type: 'array',
          of: [
            {
              name: 'stat',
              title: 'Statistic',
              type: 'object',
              fields: [
                defineField({
                  name: 'number',
                  title: 'Number',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon Name',
                  type: 'string',
                  description: 'Lucide React icon name (e.g., Calendar, FileText, Users)',
                  validation: Rule => Rule.required()
                })
              ]
            }
          ],
          validation: Rule => Rule.max(3)
        }),
        defineField({
          name: 'scrollText',
          title: 'Scroll Indicator Text',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string'
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string'
            })
          ]
        })
      ]
    }),

    // Content Sections
    defineField({
      name: 'contentSections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          name: 'contentSection',
          title: 'Content Section',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Section ID',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'object',
              fields: [
                defineField({
                  name: 'fa',
                  title: 'Persian',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'en',
                  title: 'English',
                  type: 'string',
                  validation: Rule => Rule.required()
                })
              ]
            }),
            defineField({
              name: 'subtitle',
              title: 'Section Subtitle',
              type: 'object',
              fields: [
                defineField({
                  name: 'fa',
                  title: 'Persian',
                  type: 'string',
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'en',
                  title: 'English',
                  type: 'string',
                  validation: Rule => Rule.required()
                })
              ]
            }),
            defineField({
              name: 'content',
              title: 'Section Content',
              type: 'object',
              fields: [
                defineField({
                  name: 'fa',
                  title: 'Persian',
                  type: 'text',
                  rows: 4,
                  validation: Rule => Rule.required()
                }),
                defineField({
                  name: 'en',
                  title: 'English',
                  type: 'text',
                  rows: 4,
                  validation: Rule => Rule.required()
                })
              ]
            }),
            defineField({
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Lucide React icon name (e.g., FileText, Megaphone, Target)',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                })
              ]
            }),
            defineField({
              name: 'colorScheme',
              title: 'Color Scheme',
              type: 'string',
              options: {
                list: [
                  { title: 'Primary', value: 'primary' },
                  { title: 'Secondary', value: 'secondary' },
                  { title: 'Accent', value: 'accent' }
                ]
              },
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'stats',
              title: 'Section Statistics',
              type: 'array',
              of: [
                {
                  name: 'sectionStat',
                  title: 'Statistic',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'number',
                      title: 'Number',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }),
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'fa',
                          title: 'Persian',
                          type: 'string'
                        }),
                        defineField({
                          name: 'en',
                          title: 'English',
                          type: 'string'
                        })
                      ]
                    })
                  ]
                }
              ]
            }),
            defineField({
              name: 'highlights',
              title: 'Section Highlights',
              type: 'array',
              of: [
                {
                  name: 'highlight',
                  title: 'Highlight',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }
              ]
            }),
            defineField({
              name: 'goals',
              title: 'Section Goals',
              type: 'array',
              of: [
                {
                  name: 'goal',
                  title: 'Goal',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }
              ]
            })
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'subtitle.en',
              media: 'image'
            }
          }
        }
      ]
    }),

    // Contact Section
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Contact Title',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string',
              validation: Rule => Rule.required()
            })
          ]
        }),
        defineField({
          name: 'description',
          title: 'Contact Description',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'text',
              rows: 3
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'text',
              rows: 3
            })
          ]
        }),
        defineField({
          name: 'buttons',
          title: 'Contact Buttons',
          type: 'array',
          of: [
            {
              name: 'contactButton',
              title: 'Contact Button',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Button Text',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'fa',
                      title: 'Persian',
                      type: 'string'
                    }),
                    defineField({
                      name: 'en',
                      title: 'English',
                      type: 'string'
                    })
                  ]
                }),
                defineField({
                  name: 'link',
                  title: 'Button Link',
                  type: 'string'
                }),
                defineField({
                  name: 'icon',
                  title: 'Icon Name',
                  type: 'string',
                  description: 'Lucide React icon name'
                }),
                defineField({
                  name: 'style',
                  title: 'Button Style',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' }
                    ]
                  }
                })
              ]
            }
          ],
          validation: Rule => Rule.max(3)
        })
      ]
    }),

    // SEO and Meta
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'string'
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'string'
            })
          ]
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'object',
          fields: [
            defineField({
              name: 'fa',
              title: 'Persian',
              type: 'text',
              rows: 3
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'text',
              rows: 3
            })
          ]
        })
      ]
    })
  ],

  preview: {
    select: {
      title: 'heroSection.name.en',
      subtitle: 'heroSection.title.en',
      media: 'heroSection.heroImageEnglish'
    }
  }
})