/** پیکربندی عمومی سایت نووا */
export const SITE = {
  name: 'نووا',
  nameEn: 'NOVA',
  slogan: 'کهکشانِ رتبه‌های برتر',
  tagline: 'گروه مشاوره تخصصی کنکور سراسری',
  description:
    'نووا تیمی از رتبه‌های برتر کنکور است که با برنامه‌ریزی شخصی‌سازی‌شده، آزمون‌های شبیه‌ساز و پشتیبانی روزانه، مسیر رسیدن به رشته دلخواهت را کوتاه می‌کند.',
  url: 'https://nova-konkur.ir',
  foundedYear: 1397,
  contact: {
    phone: '۰۲۱-۹۱۰۰۲۲۳۳',
    phoneRaw: '+982191002233',
    mobile: '۰۹۱۲-۳۴۵-۶۷۸۹',
    mobileRaw: '+989123456789',
    whatsapp: '۰۹۱۲-۳۴۵-۶۷۸۹',
    email: 'hello@nova-konkur.ir',
    address: 'تهران، میدان ونک، خیابان ملاصدرا، کوچه ناهید، پلاک ۱۲، طبقه ۴',
    hours: 'شنبه تا پنجشنبه، ۹ صبح تا ۹ شب',
  },
  social: [
    { label: 'اینستاگرام', handle: '@nova.konkur', href: 'https://instagram.com/nova.konkur', icon: 'instagram' as const },
    { label: 'تلگرام', handle: '@novakonkur', href: 'https://t.me/novakonkur', icon: 'send' as const },
    { label: 'واتساپ', handle: '۰۹۱۲۳۴۵۶۷۸۹', href: 'https://wa.me/989123456789', icon: 'message-circle' as const },
    { label: 'آپارات', handle: 'نووا', href: 'https://aparat.com/nova', icon: 'play' as const },
  ],
  /** تاریخ کنکور سراسری برای شمارش معکوس */
  konkurDate: { year: 2027, month: 5, day: 6, label: 'کنکور سراسری ۱۴۰۶ — نوبت اول' },
};

export const NAV_LINKS = [
  { label: 'خانه', to: '/' },
  { label: 'مشاوره کنکور', to: '/services' },
  { label: 'مشاوران', to: '/consultants' },
  { label: 'رتبه‌برترها', to: '/toppers' },
  { label: 'آزمون آنلاین', to: '/exam' },
  { label: 'بلاگ', to: '/blog' },
  { label: 'درباره ما', to: '/about' },
];
