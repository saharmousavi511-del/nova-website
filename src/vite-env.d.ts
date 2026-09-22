/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** آدرس اختیاری بک‌اند/وب‌هوک برای دریافت فرم‌ها و کارنامه‌ها */
  readonly VITE_SUBMISSIONS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
