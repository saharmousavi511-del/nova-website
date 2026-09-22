import { Compass, Languages, Microscope, Palette, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type FieldKey = 'تجربی' | 'ریاضی' | 'انسانی' | 'هنر' | 'زبان';

export interface MatchOption {
  text: string;
  scores: Partial<Record<FieldKey, number>>;
}

export interface MatchQuestion {
  id: string;
  text: string;
  hint?: string;
  options: MatchOption[];
}

export interface FieldResult {
  key: FieldKey;
  icon: LucideIcon;
  gradient: string;
  title: string;
  subtitle: string;
  description: string;
  majors: string[];
  careers: string[];
  strength: string;
  caution: string;
  recommendedExam: string;
}

export const MATCH_QUESTIONS: MatchQuestion[] = [
  {
    id: 'q1',
    text: 'کدام فعالیت، بیشتر از همه تو را سر ذوق می‌آورد؟',
    hint: 'بدون فکر کردن زیاد، اولین چیزی که به ذهنت می‌آید را انتخاب کن.',
    options: [
      { text: 'آزمایش‌های زیست‌شناسی، شناخت بدن انسان و موجودات زنده', scores: { تجربی: 3 } },
      { text: 'حل مسئله، کار با اعداد، الگوها و شکل‌های هندسی', scores: { ریاضی: 3 } },
      { text: 'خواندن درباره جامعه، تاریخ، حقوق و روان انسان‌ها', scores: { انسانی: 3 } },
      { text: 'طراحی، نقاشی، موسیقی، عکاسی یا ساختن چیزهای بصری', scores: { هنر: 3 } },
    ],
  },
  {
    id: 'q2',
    text: 'در درس‌های مدرسه، کدام یک برایت لذت‌بخش‌تر است؟',
    options: [
      { text: 'زیست‌شناسی و شیمی', scores: { تجربی: 3 } },
      { text: 'فیزیک، حسابان و هندسه', scores: { ریاضی: 3 } },
      { text: 'ادبیات، عربی، اقتصاد و جامعه‌شناسی', scores: { انسانی: 3 } },
      { text: 'زبان انگلیسی و زبان‌های خارجی', scores: { زبان: 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'اگر ده سال دیگر سر کار باشی، کدام محیط برایت جذاب‌تر است؟',
    options: [
      { text: 'بیمارستان، کلینیک یا آزمایشگاه', scores: { تجربی: 3 } },
      { text: 'شرکت فناوری، کارگاه مهندسی یا سایت پروژه', scores: { ریاضی: 3 } },
      { text: 'دادگاه، مدرسه، رسانه یا یک نهاد اجتماعی', scores: { انسانی: 3 } },
      { text: 'آتلیه، استودیو، صحنه تئاتر یا گالری', scores: { هنر: 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'وقتی با یک مسئله سخت روبه‌رو می‌شوی، معمولاً چه می‌کنی؟',
    options: [
      { text: 'آزمون و خطای عملی می‌کنم تا ببینم چه چیزی واقعاً کار می‌کند', scores: { تجربی: 3, ریاضی: 1 } },
      { text: 'مدل و فرمول می‌سازم و مرحله‌به‌مرحله حلش می‌کنم', scores: { ریاضی: 3 } },
      { text: 'زوایای مختلف را تحلیل می‌کنم و با دیگران بحث می‌کنم', scores: { انسانی: 3 } },
      { text: 'دنبال یک راه‌حل خلاقانه و غیرمعمول می‌گردم', scores: { هنر: 3, زبان: 1 } },
    ],
  },
  {
    id: 'q5',
    text: 'کدام دسته از اخبار بیشتر توجهم را جلب می‌کند؟',
    options: [
      { text: 'پزشکی، سلامت و کشف‌های زیستی', scores: { تجربی: 3 } },
      { text: 'فناوری، هوش مصنوعی، فضا و مهندسی', scores: { ریاضی: 3 } },
      { text: 'سیاست، اقتصاد و رویدادهای اجتماعی', scores: { انسانی: 3 } },
      { text: 'سینما، موسیقی، هنرهای تجسمی و ادبیات', scores: { هنر: 3 } },
    ],
  },
  {
    id: 'q6',
    text: 'ساعت مطالعه‌ات را بیشتر روی چه نوع محتوایی می‌گذاری؟',
    options: [
      { text: 'حفظیات مفهومی، نمودارها و چرخه‌های زیستی', scores: { تجربی: 3 } },
      { text: 'محاسبات، اثبات و حل تست‌های چندمرحله‌ای', scores: { ریاضی: 3 } },
      { text: 'متن‌خوانی، تفسیر و تحلیل محتوا', scores: { انسانی: 3 } },
      { text: 'واژگان، گرامر و مکالمه یک زبان تازه', scores: { زبان: 3 } },
    ],
  },
  {
    id: 'q7',
    text: 'در کار گروهی معمولاً چه نقشی به تو می‌رسد؟',
    options: [
      { text: 'اجراکننده دقیق؛ کار عملی را من انجام می‌دهم', scores: { تجربی: 3 } },
      { text: 'تحلیل‌گر و محاسبه‌گر؛ داده‌ها و زمان‌بندی با من است', scores: { ریاضی: 3 } },
      { text: 'سخنور و هماهنگ‌کننده؛ با همه حرف می‌زنم و قانعشان می‌کنم', scores: { انسانی: 3 } },
      { text: 'ایده‌پرداز و طراح؛ شکل نهایی کار از ذهن من می‌آید', scores: { هنر: 3 } },
    ],
  },
  {
    id: 'q8',
    text: 'کدام جمله بیشتر به تو شبیه است؟',
    options: [
      { text: 'دوست دارم کارم مستقیماً به سلامت و زندگی آدم‌ها کمک کند', scores: { تجربی: 3 } },
      { text: 'دوست دارم چیزی بسازم که کار کند و قابل اندازه‌گیری باشد', scores: { ریاضی: 3 } },
      { text: 'دوست دارم بفهمم آدم‌ها و جامعه چطور کار می‌کنند و صدایشان باشم', scores: { انسانی: 3 } },
      { text: 'دوست دارم چیزی خلق کنم که تا حالا وجود نداشته است', scores: { هنر: 3, زبان: 1 } },
    ],
  },
];

export const FIELD_RESULTS: Record<FieldKey, FieldResult> = {
  تجربی: {
    key: 'تجربی',
    icon: Microscope,
    gradient: 'from-nova-300 via-nova-500 to-nova-700',
    title: 'گروه علوم تجربی',
    subtitle: 'مسیر سلامت، زیست و علوم آزمایشگاهی',
    description:
      'تو با پدیده‌های زنده، بدن انسان و آزمایش عملی ارتباط برقرار می‌کنی. حافظه مفهومی قوی و علاقه به کار عملی، دو دارایی اصلی تو در این گروه است. رقابت در تجربی سنگین است، ولی مسیر شغلی‌اش روشن و ملموس است.',
    majors: ['پزشکی', 'دندانپزشکی', 'داروسازی', 'فیزیوتراپی', 'پرستاری', 'زیست‌شناسی', 'علوم آزمایشگاهی', 'تغذیه', 'ژنتیک', 'دامپزشکی'],
    careers: ['پزشک متخصص', 'داروساز', 'پژوهشگر زیست‌فناوری', 'کارشناس آزمایشگاه', 'متخصص تغذیه'],
    strength: 'حافظه مفهومی قوی، دقت در جزئیات و علاقه به کار عملی',
    caution: 'حجم بالای حفظیات مفهومی زیست و رقابت سنگین در رشته‌های تاپ؛ نیازمند پیوستگی مطالعه بدون وقفه',
    recommendedExam: 'placement-tajrobi',
  },
  ریاضی: {
    key: 'ریاضی',
    icon: Compass,
    gradient: 'from-comet-300 via-comet-500 to-nebula-500',
    title: 'گروه ریاضی و فیزیک',
    subtitle: 'مسیر مهندسی، فناوری و علوم پایه',
    description:
      'ذهن تو با الگو، ساختار و حل مسئله چندمرحله‌ای روشن می‌شود. در گروه ریاضی، تسلط بر حسابان، هندسه و فیزیک مزیت رقابتی بزرگی است و بازار کار مهندسی و فناوری هم مسیرهای متنوعی پیش رویت می‌گذارد.',
    majors: ['مهندسی برق', 'مهندسی کامپیوتر', 'مهندسی مکانیک', 'مهندسی عمران', 'مهندسی هوافضا', 'مهندسی شیمی', 'معماری', 'ریاضیات و کاربردها', 'فیزیک', 'علوم داده'],
    careers: ['مهندس نرم‌افزار', 'طراح سازه', 'تحلیل‌گر داده', 'مهندس هوافضا', 'پژوهشگر ریاضیات'],
    strength: 'تفکر تحلیلی، توانایی مدل‌سازی و پشتکار در حل مسئله',
    caution: 'دروس مسئله‌محور بدون تمرین پیوسته افت می‌کنند؛ تکرار بدون تحلیل بازدهی کمی دارد',
    recommendedExam: 'placement-riazi',
  },
  انسانی: {
    key: 'انسانی',
    icon: Scale,
    gradient: 'from-nebula-300 via-nebula-500 to-rose-400',
    title: 'گروه علوم انسانی',
    subtitle: 'مسیر حقوق، روان‌شناسی، مدیریت و علوم اجتماعی',
    description:
      'تو به انسان، جامعه، زبان و استدلال علاقه داری و در تحلیل متن و بیان منظور توانمندی. دروس انسانی برخلاف تصور رایج، حفظیِ صرف نیستند؛ دسته‌بندی و فهم روابط میان مفاهیم، کلید درصد بالا در این گروه است.',
    majors: ['حقوق', 'روان‌شناسی', 'مدیریت', 'حسابداری', 'علوم تربیتی', 'اقتصاد', 'جامعه‌شناسی', 'علوم سیاسی', 'ادبیات فارسی', 'فلسفه'],
    careers: ['وکیل', 'روان‌شناس بالینی', 'مدیر منابع انسانی', 'پژوهشگر علوم اجتماعی', 'حسابدار رسمی'],
    strength: 'توانایی استدلال کلامی، درک متن و ارتباط مؤثر با دیگران',
    caution: 'تنوع زیاد دروس و شباهت مفاهیم؛ نیازمند خلاصه‌نویسی و دسته‌بندی منظم برای جلوگیری از تداخل',
    recommendedExam: 'placement-ensani',
  },
  هنر: {
    key: 'هنر',
    icon: Palette,
    gradient: 'from-rose-400 via-nova-400 to-nova-300',
    title: 'گروه هنر',
    subtitle: 'مسیر خلاقیت، طراحی و هنرهای تجسمی و نمایشی',
    description:
      'تو دنیا را با تصویر، رنگ، صدا و فرم می‌بینی. کنکور هنر ترکیبی از درک عمومی هنر، خلاقیت عملی و آزمون عملی است؛ مسیری که هم می‌توانی همراه یکی از گروه‌های اصلی شرکت کنی و هم به‌صورت مستقل.',
    majors: ['گرافیک', 'نقاشی', 'سینما', 'تئاتر', 'موسیقی', 'عکاسی', 'طراحی صنعتی', 'فرش', 'معماری داخلی', 'هنرهای تجسمی'],
    careers: ['طراح گرافیک', 'کارگردان', 'طراح صنعتی', 'عکاس حرفه‌ای', 'هنرمند تجسمی'],
    strength: 'خلاقیت، دید بصری قوی و توان خلق اثر تازه',
    caution: 'نیاز به پرتفولیو و تمرین عملی مستمر در کنار درس؛ مسیر درآمدی‌اش نیازمند ساخت برند شخصی است',
    recommendedExam: 'aptitude',
  },
  زبان: {
    key: 'زبان',
    icon: Languages,
    gradient: 'from-mint-400 via-comet-400 to-nebula-400',
    title: 'گروه زبان‌های خارجی',
    subtitle: 'مسیر مترجمی، آموزش زبان و ارتباطات بین‌المللی',
    description:
      'یادگیری زبان برای تو یک لذت است نه یک تکلیف. گروه زبان رقابت کمتری دارد و می‌توانی آن را در کنار گروه اصلی خودت هم شرکت کنی؛ ضمن اینکه تسلط زبان، مزیت بزرگی در همه رشته‌ها و بازار کار جهانی است.',
    majors: ['مترجمی زبان انگلیسی', 'آموزش زبان انگلیسی', 'زبان و ادبیات انگلیسی', 'زبان فرانسه', 'زبان آلمانی', 'زبان‌های باستانی', 'ارتباطات بین‌الملل'],
    careers: ['مترجم رسمی', 'مدرس زبان', 'کارشناس روابط بین‌الملل', 'تولیدکننده محتوای دوزبانه'],
    strength: 'حافظه واژگانی، گوش شنوا و علاقه به فرهنگ‌های متفاوت',
    caution: 'بازار کار مستقیم محدودتر است؛ بهتر است زبان را با یک مهارت دیگر (حقوق، مدیریت، فناوری) ترکیب کنی',
    recommendedExam: 'final-exam-simulator',
  },
};

export const FIELD_KEYS: FieldKey[] = ['تجربی', 'ریاضی', 'انسانی', 'هنر', 'زبان'];

export interface MatchOutcome {
  scores: Record<FieldKey, number>;
  maxScore: number;
  ranking: FieldKey[];
  primary: FieldResult;
  secondary: FieldResult;
  matchPercent: Record<FieldKey, number>;
}

export function computeMatch(answers: (number | null)[]): MatchOutcome {
  const scores = FIELD_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<FieldKey, number>);

  answers.forEach((answerIndex, questionIndex) => {
    const question = MATCH_QUESTIONS[questionIndex];
    if (!question || answerIndex === null || answerIndex === undefined) return;
    const option = question.options[answerIndex];
    if (!option) return;
    Object.entries(option.scores).forEach(([key, value]) => {
      scores[key as FieldKey] += value ?? 0;
    });
  });

  const ranking = [...FIELD_KEYS].sort((a, b) => scores[b] - scores[a]);
  const maxScore = scores[ranking[0]] || 1;
  const total = FIELD_KEYS.reduce((sum, key) => sum + scores[key], 0) || 1;

  const matchPercent = FIELD_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: Math.round((scores[key] / total) * 100) }),
    {} as Record<FieldKey, number>,
  );

  return {
    scores,
    maxScore,
    ranking,
    primary: FIELD_RESULTS[ranking[0]],
    secondary: FIELD_RESULTS[ranking[1]],
    matchPercent,
  };
}
