import { FaPaperPlane } from 'react-icons/fa';

import SectionHeading from '@/components/pages/home/section-heading';

export default function Contact() {
  return (
    <section className="mb-28 mt-4 scroll-mt-28 px-4 md:mb-[100rem] md:w-[38rem] lg:w-[48rem]" id="contact">
      <div className="mx-auto w-full rounded-lg border border-black/10 bg-white px-10 py-8 dark:bg-white/0 dark:bg-gradient-to-r dark:from-slate-900/50 dark:to-slate-700/50 dark:outline dark:outline-white/20">
        <SectionHeading>Contact Us</SectionHeading>
        <p className="text-center text-gray-700 dark:text-gray-400">
          Please contact me directly at
          {' '}
          <a className="underline" href="mailto:crux.dev@proton.me">
            crux.dev@proton.me
          </a>
          {' '}
          or through this form.
        </p>
        <form className="mt-10 flex flex-col dark:text-gray-900">
          <input
            className="h-14 rounded-lg border border-black/10 bg-white/80 px-4 py-2 text-lg placeholder:text-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400"
            name="email"
            type="email"
            required
            maxLength={500}
            placeholder="Your email"
          />
          <textarea
            className="mt-4 h-52 rounded-lg border border-black/10 px-4 py-2 text-lg placeholder:text-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400"
            required
            maxLength={5000}
            placeholder="Please write here..."
            rows={8}
          />
          <button
            className="group mx-auto mt-4 flex w-32 items-center justify-center rounded-lg bg-black px-4 py-2 text-white hover:scale-105 dark:bg-white dark:text-gray-900 md:w-48"
            type="submit"
          >
            Submit
            <FaPaperPlane className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-2 group-hover:scale-110" />
          </button>
        </form>
      </div>
    </section>
  );
}
