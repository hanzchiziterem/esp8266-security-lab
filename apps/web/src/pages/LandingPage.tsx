import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsSection } from '../components/landing/StatsSection';
import { ObjectivesSection } from '../components/landing/ObjectivesSection';
import { CurriculumSection } from '../components/landing/CurriculumSection';
import { MethodologySection } from '../components/landing/MethodologySection';
import { AboutSection } from '../components/landing/AboutSection';
import { CommunitySection } from '../components/landing/CommunitySection';
import { SponsorshipSection } from '../components/landing/SponsorshipSection';
import { CtaSection } from '../components/landing/CtaSection';
import { Footer } from '../components/layout/Footer';

interface LandingPageProps {
  onSelectLesson?: (lessonId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectLesson }) => {
  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080F1C] text-[#F3F7FC] flex flex-col">
      <Navbar onStartLearning={scrollToCurriculum} onExploreCurriculum={scrollToCurriculum} />
      <main className="flex-grow">
        <HeroSection onStartLearning={scrollToCurriculum} onExploreCurriculum={scrollToCurriculum} />
        <StatsSection />
        <ObjectivesSection />
        <CurriculumSection onSelectLesson={onSelectLesson} />
        <MethodologySection />
        <AboutSection />
        <CommunitySection />
        <SponsorshipSection />
        <CtaSection onStartLearning={scrollToCurriculum} />
      </main>
      <Footer />
    </div>
  );
};
