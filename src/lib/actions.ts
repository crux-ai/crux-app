'use server';

import type { FieldValues } from 'react-hook-form';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/pages/home/email-template';
import { logger } from '@/lib/logger';
import { contactSchema } from '@/validations/contact-us';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(contactData: FieldValues) {
  const parseResult = contactSchema.safeParse({
    emailAddress: contactData.emailAddress,
    emailContent: contactData.emailContent,
  });

  if (!parseResult.success) {
    logger.error('Validation failed', parseResult.error);
    return;
  }

  const { emailAddress, emailContent } = parseResult.data;

  const email = {
    from: 'onboarding@resend.dev',
    to: 'jackbcordery@gmail.com',
    subject: `Contact Submission - ${emailAddress}`,
    react: EmailTemplate({ emailAddress, emailContent }),
  };

  const { data, error } = await resend.emails.send(email);

  if (error) {
    logger.error(Response.json({ error }, { status: 500 }));
  }

  logger.info(Response.json(data));
}
