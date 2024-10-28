import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useActiveSection } from '@/context/use-active-section';
import { links } from '@/lib/data';
import type { SectionName } from '@/lib/types';

const linkMap = new Map(links.map(link => [link.name, link.hash]));

export function useSectionInView(sectionName: SectionName, threshold: number = 0.5) {
  const { ref, inView } = useInView({
    threshold,
  });
  const { setActiveSection, timeOfLastClick } = useActiveSection();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
      window.history.replaceState(null, '', linkMap.get(sectionName));
    }
  }, [inView, setActiveSection, timeOfLastClick, sectionName]);

  return { ref };
}
