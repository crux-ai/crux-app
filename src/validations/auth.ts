import { z } from 'zod';

export const SignUpFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-z]/i, { message: 'Contain at least one letter.' })
    .regex(/\d/, { message: 'Contain at least one number.' })
    .regex(/[^a-z0-9]/i, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-z]/i, { message: 'Contain at least one letter.' })
    .regex(/\d/, { message: 'Contain at least one number.' })
    .regex(/[^a-z0-9]/i, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});
