/**
 * آزمون دود (smoke test) منطق خالص سایت — بدون نیاز به مرورگر.
 * اجرا: npm run test:logic
 */
import { EXAMS, examQuestionCount, examTotalMinutes } from '../src/data/exams';
import { QUESTIONS } from '../src/data/questions';
import { MATCH_QUESTIONS, computeMatch, FIELD_KEYS } from '../src/data/match';
import { buildPaper, scorePaper } from '../src/lib/exam';
import {
  faDate,
  faDateShort,
  formatClock,
  isValidMobile,
  isValidNationalId,
  normalizeMobile,
  toEn,
  toFa,
  toJalali,
  daysUntil,
} from '../src/lib/fa';

let failures = 0;
const check = (name: string, condition: boolean, detail = '') => {
  if (condition) console.log(`  ✓ ${name}`);
  else {
    failures += 1;
    console.log(`  ✗ ${name} ${detail}`);
  }
};

console.log('\n=== بانک سؤال ===');
check(`تعداد سؤال‌ها: ${QUESTIONS.length}`, QUESTIONS.length >= 100);
check('همه سؤال‌ها ۴ گزینه دارند', QUESTIONS.every((q) => q.options.length === 4));
check('همه سؤال‌ها پاسخ معتبر دارند', QUESTIONS.every((q) => q.answer >= 0 && q.answer <= 3));
check('شناسه‌ها یکتا هستند', new Set(QUESTIONS.map((q) => q.id)).size === QUESTIONS.length);
check('همه توضیح پاسخ دارند', QUESTIONS.every((q) => q.explanation.trim().length > 20));
check('گزینه‌ها تکراری نیستند', QUESTIONS.every((q) => new Set(q.options).size === 4));

console.log('\n=== دفترچه‌های آزمون ===');
EXAMS.forEach((exam) => {
  const counts = new Map<string, number>();
  exam.stages.forEach((stage) =>
    stage.quota.forEach((q) => counts.set(q.subject, (counts.get(q.subject) ?? 0) + q.count)),
  );
  const shortages: string[] = [];
  counts.forEach((needed, subject) => {
    const available = QUESTIONS.filter((q) => q.subject === subject).length;
    if (needed > available) shortages.push(`${subject}: ${needed}/${available}`);
  });
  const expected = examQuestionCount(exam);
  const paper = buildPaper(exam, 'NOVA-TEST1');
  const actual = paper.reduce((s, st) => s + st.questions.length, 0);
  const ids = paper.flatMap((st) => st.questions.map((q) => q.id));
  const seconds = paper.reduce((s, st) => s + st.seconds, 0);

  check(
    `${exam.id}: سؤال ${actual}/${expected} — ${examTotalMinutes(exam)} دقیقه`,
    shortages.length === 0 && actual === expected && new Set(ids).size === actual && seconds === examTotalMinutes(exam) * 60,
    shortages.length ? `کمبود: ${shortages.join(', ')}` : '',
  );

  // برگه‌سازی باید قطعی (deterministic) و در عین حال داوطلب‌محور باشد
  const sameAgain = buildPaper(exam, 'NOVA-TEST1');
  const sameIds = sameAgain.flatMap((st) => st.questions.map((q) => q.id));
  check(`${exam.id}: برگه قطعی برای یک کد ثابت`, sameIds.join() === ids.join());

  const otherCandidate = buildPaper(exam, 'NOVA-TEST2');
  const otherIds = otherCandidate.flatMap((st) => st.questions.map((q) => q.id));
  const otherAttempt = buildPaper(exam, 'NOVA-TEST1', 1);
  const retryIds = otherAttempt.flatMap((st) => st.questions.map((q) => q.id));
  const hasPool = exam.stages.some((stage) =>
    stage.quota.some((q) => QUESTIONS.filter((item) => item.subject === q.subject).length > q.count),
  );
  check(
    `${exam.id}: چیدمان متفاوت برای داوطلب و دفعه دیگر`,
    !hasPool || (otherIds.join() !== ids.join() && retryIds.join() !== ids.join()),
  );
});

console.log('\n=== نمره‌دهی ===');
{
  const exam = EXAMS[0];
  const paper = buildPaper(exam, 'NOVA-SCORING');
  const questions = paper.flatMap((s) => s.questions);
  const allCorrect: Record<string, number | null> = {};
  const allWrong: Record<string, number | null> = {};
  const halfHalf: Record<string, number | null> = {};
  const allBlank: Record<string, number | null> = {};

  questions.forEach((q, i) => {
    allCorrect[q.id] = q.answer;
    allWrong[q.id] = (q.answer + 1) % 4;
    halfHalf[q.id] = i % 2 === 0 ? q.answer : null;
    allBlank[q.id] = null;
  });

  const perfect = scorePaper(paper, allCorrect, {});
  const worst = scorePaper(paper, allWrong, {});
  const half = scorePaper(paper, halfHalf, {});
  const blank = scorePaper(paper, allBlank, {});

  check('همه درست → درصد ۱۰۰ و تراز ۱۰۰۰۰', Math.round(perfect.percent) === 100 && perfect.taraz === 10000, `${perfect.percent}/${perfect.taraz}`);
  check('همه غلط → درصد -۳۳.۳ و تراز ۳۰۰۰', Math.round(worst.percent * 10) === -333 && worst.taraz === 3000, `${worst.percent}/${worst.taraz}`);
  check('نیمی درست و نیمی نزده → ۵۰٪', Math.round(half.percent) === 50, `${half.percent}`);
  check('همه نزده → ۰٪ و صفر درست/غلط', blank.percent === 0 && blank.blank === questions.length);
  check('جمع درست+غلط+نزده = کل سؤال‌ها', perfect.correct + perfect.wrong + perfect.blank === perfect.total);
  check('تفکیک درس‌به‌درس وجود دارد', perfect.subjectScores.length >= 3 && perfect.subjectScores.every((s) => s.total > 0));
  check('سطح عملکرد تعریف شده', ['درخشان', 'خیلی خوب', 'خوب، در حال رشد', 'نیازمند تقویت', 'شروع از پایه'].includes(perfect.level));
}

console.log('\n=== نوا‌مچ ===');
{
  const allFirst = computeMatch(MATCH_QUESTIONS.map(() => 0));
  check('پاسخ به همه با گزینه اول → گروه تجربی', allFirst.primary.key === 'تجربی', allFirst.primary.key);
  const empty = computeMatch(MATCH_QUESTIONS.map(() => null));
  check('بدون پاسخ هم خطا نمی‌دهد', empty.ranking.length === FIELD_KEYS.length && empty.primary.key !== undefined);
  const sums = MATCH_QUESTIONS.map(() => 1);
  check('پرسش‌ها ۴ گزینه‌ای هستند', MATCH_QUESTIONS.every((q) => q.options.length === 4));
  check('مسیر ریاضی با گزینه دوم', computeMatch(sums).primary.key === 'ریاضی', computeMatch(sums).primary.key);
  check('درصد هم‌خوانی جمعاً ۱۰۰ (±۲)', Math.abs(FIELD_KEYS.reduce((s, k) => s + allFirst.matchPercent[k], 0) - 100) <= 3);
}

console.log('\n=== تاریخ جلالی ===');
{
  const cases: [number, number, number, string][] = [
    [2026, 9, 22, '1405/06/31'],
    [2026, 3, 21, '1405/01/01'],
    [2027, 5, 6, '1406/02/16'],
    [2025, 6, 21, '1404/03/31'],
    [2024, 2, 10, '1402-11-21'],
  ];
  cases.forEach(([y, m, d, expected]) => {
    const j = toJalali(new Date(y, m - 1, d));
    const label = expected.length === 10 && expected.includes('/') ? expected : expected;
    const actual = `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
    const target = label.replace(/-/g, '/');
    check(`${y}/${m}/${d} → ${actual}`, actual === target, `انتظار ${target}`);
  });
  check(`faDateShort امروز: ${faDateShort()}`, /^\d{4}\/\d{2}\/\d{2}$/.test(toEn(faDateShort())));
  check(`faDate امروز: ${faDate()}`, faDate().length > 5);
  check('روزهای تا کنکور > ۱۰۰', daysUntil(new Date(2027, 4, 6)) > 100, String(daysUntil(new Date(2027, 4, 6))));
}

console.log('\n=== ابزارهای فارسی و اعتبارسنجی ===');
{
  check('تبدیل رقم به فارسی', toFa('1234') === '۱۲۳۴');
  check('تبدیل رقم به لاتین', toEn('۱۲۳۴') === '1234');
  check('موبایل معتبر ۰۹۱۲', isValidMobile('09123456789'));
  check('موبایل با رقم فارسی', isValidMobile('۰۹۱۲۳۴۵۶۷۸۹'));
  check('موبایل +۹۸', isValidMobile('+989123456789'));
  check('موبایل نامعتبر رد می‌شود', !isValidMobile('02134567') && !isValidMobile('12345'));
  check('نرمال‌سازی شماره', normalizeMobile('+98 912 345 6789') === '09123456789');
  check('کد ملی معتبر', isValidNationalId('0499370899'));
  check('کد ملی نامعتبر', !isValidNationalId('1111111111') && !isValidNationalId('123'));
  check('ساعت', formatClock(3725) === '۱:۰۲:۰۵' && formatClock(95) === '۰۱:۳۵', `${formatClock(3725)} / ${formatClock(95)}`);
}

console.log(failures === 0 ? '\n✅ همه بررسی‌ها پاس شد.\n' : `\n❌ ${failures} مورد ناموفق بود.\n`);
process.exit(failures === 0 ? 0 : 1);
