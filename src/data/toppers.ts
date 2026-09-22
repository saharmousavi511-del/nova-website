export interface Topper {
  id: string;
  name: string;
  rank: string;
  field: 'تجربی' | 'ریاضی' | 'انسانی';
  quota: string;
  city: string;
  accepted: string;
  year: string;
  quote: string;
  studyHours: string;
  gradient: string;
  badge?: string;
}

export const TOPPERS: Topper[] = [
  {
    id: 't1',
    name: 'الناز شریفی',
    rank: 'رتبه ۲۳',
    field: 'تجربی',
    quota: 'کشوری',
    city: 'تهران',
    accepted: 'پزشکی — دانشگاه علوم پزشکی تهران',
    year: '۱۴۰۵',
    quote: 'تا دی‌ماه تراز ۶۱۰۰ بودم. چیزی که عوض شد ساعت مطالعه نبود، ترتیب مرور و تحلیل آزمون بود.',
    studyHours: 'میانگین ۹ ساعت در روز',
    gradient: 'from-nova-200 via-nova-500 to-nova-700',
    badge: 'رتبه برتر کشوری',
  },
  {
    id: 't2',
    name: 'محمدطاها رضوی',
    rank: 'رتبه ۴۱',
    field: 'ریاضی',
    quota: 'منطقه ۱',
    city: 'مشهد',
    accepted: 'مهندسی برق — دانشگاه صنعتی شریف',
    year: '۱۴۰۵',
    quote: 'حسابان را با درخت مهارت امیرحسین جمع کردم؛ هر تستی که غلط می‌زدم به یک شاخه وصل می‌شد.',
    studyHours: 'میانگین ۸ ساعت در روز',
    gradient: 'from-comet-300 via-comet-500 to-nebula-500',
    badge: 'رتبه دو رقمی',
  },
  {
    id: 't3',
    name: 'ریحانه کاظمی',
    rank: 'رتبه ۱۲',
    field: 'انسانی',
    quota: 'کشوری',
    city: 'شیراز',
    accepted: 'حقوق — دانشگاه تهران',
    year: '۱۴۰۵',
    quote: 'علوم و فنون ادبی از ۳۸ درصد به ۸۲ رسید؛ فقط با تست روزانه و خلاصه‌نویسی آرایه‌ها.',
    studyHours: 'میانگین ۷.۵ ساعت در روز',
    gradient: 'from-nebula-300 via-nebula-500 to-rose-400',
    badge: 'رتبه برتر کشوری',
  },
  {
    id: 't4',
    name: 'امیرمحمد حسینی',
    rank: 'رتبه ۸۸',
    field: 'تجربی',
    quota: 'منطقه ۲',
    city: 'اهواز',
    accepted: 'دندانپزشکی — دانشگاه علوم پزشکی اصفهان',
    year: '۱۴۰۵',
    quote: 'سال دوم پشت کنکور بودم. نووا به جای فشار بیشتر، برنامه را ساده‌تر و قابل اندازه‌گیری کرد.',
    studyHours: 'میانگین ۱۰ ساعت در روز',
    gradient: 'from-nova-300 via-rose-400 to-nebula-500',
  },
  {
    id: 't5',
    name: 'سوفیا میرزایی',
    rank: 'رتبه ۶۴',
    field: 'تجربی',
    quota: 'منطقه ۱',
    city: 'کرج',
    accepted: 'داروسازی — دانشگاه علوم پزشکی شهید بهشتی',
    year: '۱۴۰۵',
    quote: 'شیمی مسئله‌دار همیشه پاشنه آشیل من بود؛ با روش مرحله‌به‌مرحله به ۷۹ درصد رسیدم.',
    studyHours: 'میانگین ۸.۵ ساعت در روز',
    gradient: 'from-mint-400 via-comet-400 to-nebula-400',
  },
  {
    id: 't6',
    name: 'آرمان دهقانی',
    rank: 'رتبه ۱۵۶',
    field: 'ریاضی',
    quota: 'منطقه ۲',
    city: 'تبریز',
    accepted: 'مهندسی کامپیوتر — دانشگاه صنعتی امیرکبیر',
    year: '۱۴۰۵',
    quote: 'هندسه و گسسته را صفر بودم. سه ماه آخر فقط روی همین دو درس تمرکز کردم و نتیجه داد.',
    studyHours: 'میانگین ۹ ساعت در روز',
    gradient: 'from-comet-400 via-nebula-400 to-nova-300',
  },
  {
    id: 't7',
    name: 'نیکا انصاری',
    rank: 'رتبه ۳۷',
    field: 'انسانی',
    quota: 'منطقه ۱',
    city: 'اصفهان',
    accepted: 'روان‌شناسی — دانشگاه علامه طباطبائی',
    year: '۱۴۰۴',
    quote: 'جلسات ماهانه با خانواده، فشار خانه را از روی دوشم برداشت و ساعت مطالعه‌ام پایدار شد.',
    studyHours: 'میانگین ۷ ساعت در روز',
    gradient: 'from-rose-400 via-nova-300 to-nova-500',
  },
  {
    id: 't8',
    name: 'سینا مرادپور',
    rank: 'رتبه ۱۰۹',
    field: 'تجربی',
    quota: 'منطقه ۳',
    city: 'سنندج',
    accepted: 'فیزیوتراپی — دانشگاه علوم پزشکی ایران',
    year: '۱۴۰۴',
    quote: 'از یک شهر کوچک و بدون کلاس کنکور؛ فقط با برنامه نووا و آزمون‌های آنلاین شبیه‌ساز.',
    studyHours: 'میانگین ۸ ساعت در روز',
    gradient: 'from-nova-400 via-nova-600 to-nebula-600',
  },
  {
    id: 't9',
    name: 'بهار قربانی',
    rank: 'رتبه ۷۵',
    field: 'ریاضی',
    quota: 'منطقه ۱',
    city: 'تهران',
    accepted: 'مهندسی هوافضا — دانشگاه صنعتی شریف',
    year: '۱۴۰۴',
    quote: 'فیزیک را با تحلیل خطا جمع کردم: هر غلطم را دسته‌بندی می‌کردم که محاسباتی بوده یا مفهومی.',
    studyHours: 'میانگین ۹ ساعت در روز',
    gradient: 'from-nebula-400 via-comet-300 to-mint-400',
  },
];

export interface ReportCard {
  id: string;
  name: string;
  year: string;
  field: string;
  gpa: string;
  rank: string;
  quota: string;
  subjects: { name: string; percent: number }[];
}

/** کارنامه نمونه رتبه‌برترها (قابل نمایش در صفحه رتبه‌برترها) */
export const REPORT_CARDS: ReportCard[] = [
  {
    id: 'r1',
    name: 'الناز شریفی',
    year: '۱۴۰۵',
    field: 'علوم تجربی',
    gpa: '۱۹.۸۶',
    rank: '۲۳ کشوری',
    quota: 'منطقه ۱',
    subjects: [
      { name: 'زیست‌شناسی', percent: 88 },
      { name: 'شیمی', percent: 81 },
      { name: 'فیزیک', percent: 76 },
      { name: 'ریاضی', percent: 72 },
    ],
  },
  {
    id: 'r2',
    name: 'محمدطاها رضوی',
    year: '۱۴۰۵',
    field: 'ریاضی و فیزیک',
    gpa: '۱۹.۶۲',
    rank: '۴۱ منطقه ۱',
    quota: 'منطقه ۱',
    subjects: [
      { name: 'حسابان', percent: 92 },
      { name: 'هندسه و گسسته', percent: 78 },
      { name: 'فیزیک', percent: 85 },
      { name: 'شیمی', percent: 74 },
    ],
  },
  {
    id: 'r3',
    name: 'ریحانه کاظمی',
    year: '۱۴۰۵',
    field: 'علوم انسانی',
    gpa: '۱۹.۹۱',
    rank: '۱۲ کشوری',
    quota: 'منطقه ۲',
    subjects: [
      { name: 'علوم و فنون ادبی', percent: 82 },
      { name: 'عربی تخصصی', percent: 79 },
      { name: 'ریاضی و آمار', percent: 71 },
      { name: 'اقتصاد و منطق', percent: 88 },
    ],
  },
];
