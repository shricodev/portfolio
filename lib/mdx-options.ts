import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'

export const PRETTY_CODE_OPTIONS: PrettyCodeOptions = {
  theme: { light: 'github-light-default', dark: 'github-dark-default' },
  keepBackground: false,
  defaultLang: 'plaintext',
}
