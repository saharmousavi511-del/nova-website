/**
 * ابزارهای فارسی‌سازی: رقم فارسی، تاریخ شمسی (جلالی)، اعتبارسنجی شماره موبایل و زمان.
 */

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const EN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const FA_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const FA_WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
export const FA_WEEKDAYS_SHORT = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

/** تبدیل رقم‌های لاتین/عربی به فارسی */
export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]).replace(/[٠-٩]/g, (d) => FA_DIGITS[d.charCodeAt(0) - 0x0660]);
}

/** تبدیل رقم‌های فارسی/عربی به لاتین (برای پردازش ورودی کاربر) */
export function toEn(input: string): string {
  return String(input)
    .replace(/[۰-۹]/g, (d) => EN_DIGITS[d.charCodeAt(0) - 0x06f0])
    .replace(/[٠-٩]/g, (d) => EN_DIGITS[d.charCodeAt(0) - 0x0660]);
}

/** عدد با جداکننده هزارگان فارسی: ۱٬۲۹۰٬۰۰۰ */
export function faNumber(value: number | string): string {
  const num = typeof value === 'number' ? value : Number(toEn(String(value)));
  if (Number.isNaN(num)) return toFa(value);
  return toFa(Math.round(num).toLocaleString('en-US'));
}

/** درصد با یک رقم اعشار و علامت ٪ */
export function faPercent(value: number, digits = 1): string {
  return `${toFa(value.toFixed(digits))}٪`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/* ------------------------------ تاریخ جلالی ------------------------------ */

function div(a: number, b: number): number {
  return ~~(a / b);
}
function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

function jalCal(jy: number) {
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function toJalali(date: Date): JalaliDate {
  const jdn = g2d(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm: number;
  let jd: number;

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

/** «۲ مرداد ۱۴۰۵» */
export function faDate(date: Date = new Date()): string {
  const { jy, jm, jd } = toJalali(date);
  return `${toFa(jd)} ${FA_MONTHS[jm - 1]} ${toFa(jy)}`;
}

/** «۱۴۰۵/۰۵/۰۲» */
export function faDateShort(date: Date = new Date()): string {
  const { jy, jm, jd } = toJalali(date);
  return `${toFa(jy)}/${toFa(pad2(jm))}/${toFa(pad2(jd))}`;
}

/** «شنبه ۲ مرداد ۱۴۰۵ — ساعت ۱۴:۳۰» */
export function faDateTime(date: Date = new Date()): string {
  return `${FA_WEEKDAYS[date.getDay()]} ${faDate(date)} — ساعت ${toFa(pad2(date.getHours()))}:${toFa(pad2(date.getMinutes()))}`;
}

/** اختلاف دو تاریخ به روز (برای شمارش معکوس تا کنکور) */
export function daysUntil(target: Date, from: Date = new Date()): number {
  const a = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const b = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.max(0, Math.round((a - b) / 86400000));
}

/* ------------------------------- اعتبارسنجی ------------------------------- */

/** شماره موبایل ایرانی: ۰۹۱۲۳۴۵۶۷۸۹ یا +۹۸۹۱۲... */
export function normalizeMobile(raw: string): string {
  let v = toEn(raw).replace(/[^\d+]/g, '');
  if (v.startsWith('+98')) v = '0' + v.slice(3);
  else if (v.startsWith('0098')) v = '0' + v.slice(4);
  else if (v.startsWith('98') && v.length === 12) v = '0' + v.slice(2);
  else if (v.startsWith('9') && v.length === 10) v = '0' + v;
  return v;
}

export function isValidMobile(raw: string): boolean {
  return /^09\d{9}$/.test(normalizeMobile(raw));
}

export function isValidPhoneOrMobile(raw: string): boolean {
  const v = toEn(raw).replace(/[^\d]/g, '');
  return /^0\d{9,10}$/.test(v);
}

export function isValidNationalId(raw: string): boolean {
  const v = toEn(raw).replace(/\D/g, '');
  if (v.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(v)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(v[i]) * (10 - i);
  const r = sum % 11;
  const check = Number(v[9]);
  return (r < 2 && check === r) || (r >= 2 && check === 11 - r);
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

/* --------------------------------- زمان --------------------------------- */

/** ۳۷۲۵ → «۱:۰۲:۰۵» */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = div(s, 3600);
  const m = div(mod(s, 3600), 60);
  const sec = mod(s, 60);
  return h > 0 ? `${toFa(h)}:${toFa(pad2(m))}:${toFa(pad2(sec))}` : `${toFa(pad2(m))}:${toFa(pad2(sec))}`;
}

/** ۹۵ → «۱ دقیقه و ۳۵ ثانیه» */
export function formatDurationWords(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = div(s, 3600);
  const m = div(mod(s, 3600), 60);
  const sec = mod(s, 60);
  const parts: string[] = [];
  if (h) parts.push(`${toFa(h)} ساعت`);
  if (m) parts.push(`${toFa(m)} دقیقه`);
  if (!h && sec) parts.push(`${toFa(sec)} ثانیه`);
  return parts.length ? parts.join(' و ') : 'کمتر از یک ثانیه';
}
