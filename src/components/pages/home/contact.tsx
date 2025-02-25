'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FaPaperPlane } from 'react-icons/fa';
import Lottie from 'react-lottie';
import ClipLoader from 'react-spinners/ClipLoader';

import SectionHeading from '@/components/pages/home/section-heading';
import { sendEmail } from '@/lib/actions';
import { useSectionInView } from '@/lib/hooks';
import darkData from '@/lotties/dark-success.json';
import lightData from '@/lotties/light-success.json';
import { contactSchema } from '@/validations/contact-us';

function SuccessMessage() {
  const lottieOptionsLight = {
    loop: false,
    autoplay: true,
    animationData: lightData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const lottieOptionsDark = {
    loop: false,
    autoplay: true,
    animationData: darkData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="text-center">
      <div className="hidden dark:block">
        <Lottie
          options={lottieOptionsDark}
          height={400}
          width={400}
        />
      </div>
      <div className="dark:hidden">
        <Lottie
          options={lottieOptionsLight}
          height={400}
          width={400}
        />
      </div>
      <p className="-mt-10 mb-10 text-lg font-medium">Thank you for your message, we shall reply in due course.</p>
    </div>
  );
}

function ContactForm() {
  const { register, formState, handleSubmit, reset } = useFormContext();

  const { errors, isSubmitting } = formState;

  const onSubmit = async (formData: FieldValues) => {
    await sendEmail(formData);
    reset();
  };

  return (
    <>
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
      <form
        className="mt-10 flex flex-col dark:text-gray-900"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="h-14 rounded-lg border border-black/10 bg-white/80 px-4 py-2 text-lg placeholder:text-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400"
          {...register('emailAddress')}
          placeholder="Your email"
        />
        {errors.emailAddress && <span className="text-destructive">{String(errors.emailAddress.message)}</span>}
        <textarea
          className="mt-4 h-52 rounded-lg border border-black/10 px-4 py-2 text-lg placeholder:text-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400"
          {...register('emailContent')}
          placeholder="Please write here..."
          rows={8}
        />
        {errors.emailContent && <span className="text-destructive">{String(errors.emailContent.message)}</span>}
        <button
          className="group mx-auto mt-4 flex w-32 items-center justify-center rounded-lg bg-black px-4 py-2 text-white hover:scale-105 focus:scale-100 dark:bg-white dark:text-gray-900 md:w-48"
          type="submit"
          disabled={isSubmitting}
        >
          {!isSubmitting && `Submit`}
          {isSubmitting ? <ClipLoader color="#808080" aria-label="Loading Spinner" /> : <FaPaperPlane className="ml-2 group-hover:-translate-y-1 group-hover:translate-x-2 group-hover:scale-110" /> }
        </button>
      </form>
    </>
  );
}

export default function Contact() {
  const { ref } = useSectionInView('Contact', 0.1);
  const methods = useForm(
    {
      resolver: zodResolver(contactSchema),
    },
  );
  const showForm = methods.formState.isSubmitSuccessful;
  return (
    <section
      className="mb-28 mt-4 scroll-mt-28 px-4 md:mb-10 md:w-[38rem] lg:w-[48rem]"
      id="contact"
      ref={ref}
    >
      <div className="mx-auto w-full rounded-lg border border-black/10 bg-white px-10 py-8 dark:bg-white/0 dark:bg-gradient-to-r dark:from-slate-900/50 dark:to-slate-700/50 dark:outline dark:outline-white/20">
        <FormProvider {...methods}>
          {showForm ? <SuccessMessage /> : <ContactForm />}
        </FormProvider>
      </div>
    </section>
  );
}
