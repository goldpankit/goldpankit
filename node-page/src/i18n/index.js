import { createI18n } from 'vue-i18n'
import en from './langs/en'
import zh from './langs/zh'
const messages = {
  en, zh
}

const i18n = createI18n({
  locale: 'en',
  messages
})

export default i18n
