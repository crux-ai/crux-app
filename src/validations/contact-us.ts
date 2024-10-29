import { z } from 'zod';

export const contactSchema = z.object({
  emailAddress: z.string().email({ message: 'You must provide a valid email address' }),
  emailContent: z.string().min(20, { message: 'Your content must have more than 20 characters' }).max(1000, { message: 'Your content must have fewer than 1000 characters' }),
});
