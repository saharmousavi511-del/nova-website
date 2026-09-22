import type { ExamResult, Registration } from './types';
import { STORAGE_KEYS, readList, trackingCode, uid, writeList } from './storage';

/**
 * آدرس اختیاری بک‌اند/وب‌هوک برای دریافت فرم‌ها.
 * در فایل .env مقدار VITE_SUBMISSIONS_URL را تنظیم کنید (مثلاً یک Google Apps Script
 * یا Netlify Function). اگر تنظیم نشود، اطلاعات فقط در مرورگر کاربر ذخیره می‌شود
 * و از طریق «داشبورد نووا» قابل مشاهده و خروجی گرفتن است.
 */
const ENDPOINT: string = (import.meta.env.VITE_SUBMISSIONS_URL as string | undefined)?.trim() ?? '';

export interface SubmitOutcome {
  ok: boolean;
  id: string;
  code: string;
  synced: boolean;
  message?: string;
}

async function pushRemote(kind: string, payload: unknown): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, payload, receivedAt: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function getRegistrations(): Registration[] {
  return readList<Registration>(STORAGE_KEYS.registrations).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function findRegistration(code: string): Registration | undefined {
  const needle = code.trim().toUpperCase();
  return getRegistrations().find((r) => r.trackingCode.toUpperCase() === needle || r.mobile.includes(needle));
}

export async function submitRegistration(data: Omit<Registration, 'id' | 'trackingCode' | 'createdAt' | 'status'>): Promise<SubmitOutcome> {
  const record: Registration = {
    ...data,
    id: uid('reg-'),
    trackingCode: trackingCode(),
    createdAt: new Date().toISOString(),
    status: 'جدید',
  };
  const list = readList<Registration>(STORAGE_KEYS.registrations);
  list.push(record);
  writeList(STORAGE_KEYS.registrations, list);
  const synced = await pushRemote('registration', record);
  return { ok: true, id: record.id, code: record.trackingCode, synced };
}

export function updateRegistrationStatus(id: string, status: Registration['status']): void {
  const list = readList<Registration>(STORAGE_KEYS.registrations);
  const next = list.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item));
  writeList(STORAGE_KEYS.registrations, next);
}

export function deleteRegistration(id: string): void {
  writeList(
    STORAGE_KEYS.registrations,
    readList<Registration>(STORAGE_KEYS.registrations).filter((item) => item.id !== id),
  );
}

export function getExamResults(): ExamResult[] {
  return readList<ExamResult>(STORAGE_KEYS.examResults).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function submitExamResult(result: ExamResult): Promise<boolean> {
  const list = readList<ExamResult>(STORAGE_KEYS.examResults);
  list.push(result);
  writeList(STORAGE_KEYS.examResults, list);
  return pushRemote('exam-result', result);
}

export function deleteExamResult(id: string): void {
  writeList(
    STORAGE_KEYS.examResults,
    readList<ExamResult>(STORAGE_KEYS.examResults).filter((item) => item.id !== id),
  );
}
