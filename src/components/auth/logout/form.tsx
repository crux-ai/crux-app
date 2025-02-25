'use client';

import { useForm } from 'react-hook-form';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { buttonVariants } from '@/components/ui/utils/button-variants';
import { logout } from '@/lib/auth/actions';
import { cn } from '@/lib/utils';

export default function LogOutForm({ className, variant, size, ...props }: ButtonProps,
) {
  const { formState, handleSubmit } = useForm();
  const { isSubmitting } = formState;
  const onSubmit = async () => {
    await logout();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        )}
        Logout
      </Button>
    </form>
  );
}
