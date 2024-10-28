import Image from 'next/image';

import type { TimelineEntry } from '@/lib/types';

export const timelineData: TimelineEntry[] = [
  {
    title: 'Now',
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-white md:text-sm">
          Initial launch of our AI-powered code analysis tool
        </p>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Support for JavaScript, TypeScript, Python, and Java
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Basic code quality and security analysis
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ GitHub integration for seamless workflow
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Performance optimization suggestions
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://assets.aceternity.com/pro/hero-sections.png"
            alt="Code Analysis"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="https://assets.aceternity.com/features-section.png"
            alt="GitHub Integration"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Immenent',
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-white md:text-sm">
          Expansion of language support and introduction of collaboration features
        </p>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Support for Rust, Go, and Kotlin
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Real-time collaboration for team code reviews
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Integration with popular IDEs (VSCode, IntelliJ)
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Advanced code smell detection algorithms
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://assets.aceternity.com/templates/startup-3.webp"
            alt="Language Support"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="https://assets.aceternity.com/templates/startup-4.webp"
            alt="Collaboration Features"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Future',
    content: (
      <div>
        <p className="mb-8 text-xs font-normal text-white md:text-sm">
          Introduction of new features and improvements
        </p>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Support for C++, Swift, and Haskell
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Code refactoring suggestions
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            ✅ Integration with popular code hosting platforms (GitLab, Bitbucket)
          </div>
        </div>
        <p className="mb-8 text-xs font-normal text-white md:text-sm">
          Lorem ipsum is for people who are too lazy to write copy. But we are
          not. Here are some more example of beautiful designs I built.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://assets.aceternity.com/pro/hero-sections.png"
            alt="hero template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="https://assets.aceternity.com/features-section.png"
            alt="feature template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="https://assets.aceternity.com/pro/bento-grids.png"
            alt="bento template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <Image
            src="https://assets.aceternity.com/cards.png"
            alt="cards template"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: 'Requested Features',
    content: (
      <div className="flex flex-col items-center justify-center">
        <p className="mb-4 text-xs font-normal text-white md:text-sm">
          Top feature requests from our community
        </p>
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            🔥 Support for Ruby and PHP
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            🔥 Integration with GitLab and Bitbucket
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            🔥 AI-powered code completion
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            🔥 Custom rule creation for code analysis
          </div>
          <div className="flex items-center gap-2 text-xs text-white md:text-sm">
            🔥 Performance benchmarking tools
          </div>
          <div className="left-10 flex items-center justify-center pt-8">
            <div>
              <div className="group">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex transition-all duration-100 hover:scale-110 active:scale-105"
                >
                  <span className="relative inline-block overflow-hidden rounded-full p-px">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]" />
                    <div className="group-hover: inline-flex size-full cursor-pointer justify-center rounded-full bg-black px-4 py-2 text-sm font-medium leading-5 text-slate-200 backdrop-blur-xl dark:bg-black dark:text-slate-200">
                      Feature Request
                      <span className=" pl-4"> 🔥</span>
                    </div>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];
