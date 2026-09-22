import { Award, CalendarCheck, Sparkles, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  note: string;
}

/** آمار زنده گروه نووا (در صفحه اصلی با انیمیشن شمارش نمایش داده می‌شود) */
export const STATS: StatItem[] = [
  { icon: Award, value: 148, suffix: '+', label: 'رتبه برتر ۱۴۰۵', note: 'زیر ۱۰۰۰ کشوری و منطقه' },
  { icon: CalendarCheck, value: 312, suffix: '+', label: 'رتبه برتر سال‌های قبل', note: 'از ۱۳۹۸ تا ۱۴۰۴' },
  { icon: Sparkles, value: 8, label: 'سال سابقه گروه', note: 'از مهر ۱۳۹۷ تا امروز' },
  { icon: Users, value: 42, label: 'مشاور فعال', note: 'همه از رتبه‌های برتر کنکور' },
];

export const COUNTER_FACTS = [
  { label: 'ساعت برنامه شخصی‌سازی‌شده نوشته‌شده', value: '۹۴٬۰۰۰' },
  { label: 'کارنامه تحلیل‌شده آزمون آزمایشی', value: '۲۷٬۵۰۰' },
  { label: 'دانش‌آموز همراه‌شده تا روز کنکور', value: '۳٬۸۰۰' },
  { label: 'رضایت خانواده‌ها در نظرسنجی پایان دوره', value: '٪۹۶' },
];
