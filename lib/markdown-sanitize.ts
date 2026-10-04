import { defaultSchema } from 'rehype-sanitize'
import type { Schema } from 'hast-util-sanitize'

/**
 * GitHub-compatible HTML plus the three internal placeholder elements emitted
 * by remarkDevtoEmbeds. Syntax-highlighting markup is added after sanitization.
 */
export const MARKDOWN_SANITIZE_SCHEMA: Schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'embed-youtube',
    'embed-tweet',
    'embed-fallback',
  ],
  attributes: {
    ...defaultSchema.attributes,
    'embed-youtube': ['dataArg'],
    'embed-tweet': ['dataArg'],
    'embed-fallback': ['dataKind', 'dataTarget'],
  },
}
