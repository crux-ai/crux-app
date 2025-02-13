'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { type FieldValues, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';
import { SignUpFormSchema } from '@/validations/auth';

type LoginFormProps = {} & React.HTMLAttributes<HTMLDivElement>;

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const { formState, register, reset, handleSubmit } = useForm({
    resolver: zodResolver(SignUpFormSchema.omit({ confirmPassword: true })),
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = async (formData: FieldValues) => {
    try {
      // if successful it will redirect
      // work out where to put reset
      const { success, error } = await signIn(formData);
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
      <h1 className="mb-5 text-2xl"> Login </h1>
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
            {errors.password && <span className="text-destructive">Incorrect password</span>}
          </div>
          <Button disabled={isSubmitting}>
            {isSubmitting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign In with Email
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
          <Link className="bg-background px-2" href="/create-account">Create Account</Link>
        </div>
      </div>

    </div>
  );
}
