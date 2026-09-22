/**
 * لایه ذخیره‌سازی سمت کلاینت.
 * همه داده‌ها در localStorage مرورگر نگه داشته می‌شوند و در صورت تنظیم
 * متغیر محیطی VITE_SUBMISSIONS_URL به یک بک‌اند/وب‌هوک نیز ارسال می‌گردند.
 */

const PREFIX = 'nova:';

export const STORAGE_KEYS = {
  registrations: `${PREFIX}registrations`,
  examResults: `${PREFIX}exam-results`,
  formDraft: `${PREFIX}form-draft`,
  examSession: `${PREFIX}exam-session`,
  candidate: `${PREFIX}candidate`,
  messages: `${PREFIX}messages`,
  newsletter: `${PREFIX}newsletter`,
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

export function readList<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeList<T>(key: string, items: T[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* حافظه پر یا دسترسی بسته است — بی‌صدا رد می‌شویم */
  }
}

export function readValue<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeValue(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function removeKey(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function clearAll(): void {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}

/** شناسه یکتا بدون وابستگی به crypto */
export function uid(prefix = ''): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-5);
  return `${prefix}${time}${rnd}`;
}

/** کد رهگیری مثل NOVA-4F72K */
export function trackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let body = '';
  for (let i = 0; i < 5; i += 1) body += chars[Math.floor(Math.random() * chars.length)];
  return `NOVA-${body}`;
}
