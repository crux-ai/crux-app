import React from 'react';

import Footer from '@/components/layout/footer';
import About from '@/components/pages/home/about';
import Contact from '@/components/pages/home/contact';
import Features from '@/components/pages/home/features';
import Header from '@/components/pages/home/header';
import Intro from '@/components/pages/home/intro';
import Languages from '@/components/pages/home/languages';
import SectionDivider from '@/components/pages/home/section-divider';
import { Timeline } from '@/components/pages/home/timeline';
import { timelineData } from '@/components/pages/home/timeline-data';
import ActiveSectionContextProvider from '@/context/active-section';

export default function Home() {
  return (
    <>
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(#c0c0c0_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[#000000] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)]"></div>
      <main className="flex flex-col items-center justify-center">
        <ActiveSectionContextProvider>
          <Header />
          <Intro />
          <SectionDivider />
          <Features />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Languages />
          <SectionDivider />
          <Timeline data={timelineData} />
          <SectionDivider />
          <Contact />
          <Footer />
        </ActiveSectionContextProvider>
      </main>
    </>
  );
}
