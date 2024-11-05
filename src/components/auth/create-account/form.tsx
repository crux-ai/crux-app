'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAccount } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import { SignUpFormSchema } from '@/validations/auth';

type SignUpFormProps = {} & React.HTMLAttributes<HTMLDivElement>;

export default function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { formState, register, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(SignUpFormSchema),
  });
  const { errors, isSubmitting } = formState;
  const watchConfirmPassword = watch('confirmPassword');
  const watchPassword = watch('password');

  const onSubmit = async (formData: FieldValues) => {
    try {
      // if successful it will redirect
      // work out where to put reset
      const { success, error } = await createAccount(formData);
      if (!success) {
        toast.error(error);
        return;
      }
    } catch {
      toast.error('Something went wrong!');
      return;
    }
    reset();
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="mb-5 text-2xl"> Create Account </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              {...register('email')}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
            />
            {errors.email && <span className="text-destructive">{String(errors.email.message)}</span>}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              {...register('password')}
              placeholder="Secret password"
              type="password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="text-destructive">{String(errors.password.message)}</span>}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Confirm password
            </Label>
            <Input
              id="Confirm password"
              {...register('confirmPassword')}
              placeholder="Confirm Password"
              type="password"
              disabled={isSubmitting}
            />
            {(watchPassword !== watchConfirmPassword) && (watchConfirmPassword.length > 0) && <span className="text-destructive">Passwords must match</span>}
          </div>
          <Button disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Create Account
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isSubmitting}>
        {isSubmitting
          ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )
          : (
              <Icons.google className="mr-2 size-4" />
            )}
        {' '}
        Google
      </Button>
      <div className="relative">
        <div className="relative flex justify-center text-xs underline">
          <Link className="bg-background px-2" href="/login">Already have an account?</Link>
        </div>
      </div>

    </div>

  );
}
