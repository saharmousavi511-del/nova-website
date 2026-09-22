import { useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { WhyNova } from '@/components/home/WhyNova';
import { Plans } from '@/components/home/Plans';
import { Roadmap } from '@/components/home/Roadmap';
import { ExamCTA } from '@/components/home/ExamCTA';
import { MatchBanner } from '@/components/home/MatchBanner';
import { ToppersPreview } from '@/components/home/ToppersPreview';
import { ConsultantsPreview } from '@/components/home/ConsultantsPreview';
import { Testimonials } from '@/components/home/Testimonials';
import { PostsPreview } from '@/components/home/PostsPreview';
import { FaqPreview } from '@/components/home/FaqPreview';
import { CtaBanner } from '@/components/home/CtaBanner';
import { SITE } from '@/data/site';

export function HomePage() {
  useEffect(() => {
    document.title = `نووا | ${SITE.slogan} — مشاوره کنکور، آزمون آنلاین و انتخاب رشته`;
  }, []);

  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesPreview />
      <WhyNova />
      <Plans limit={4} />
      <Roadmap />
      <ExamCTA />
      <MatchBanner />
      <ToppersPreview />
      <ConsultantsPreview />
      <Testimonials />
      <PostsPreview />
      <FaqPreview />
      <CtaBanner />
    </>
  );
}
