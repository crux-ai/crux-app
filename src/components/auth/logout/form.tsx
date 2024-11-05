'use client';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { logout } from '@/lib/auth/actions';

export default function LogOutForm() {
  const { formState, handleSubmit } = useForm();
  const { isSubmitting } = formState;
  const onSubmit = async () => {
    await logout();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button disabled={isSubmitting}>
        {isSubmitting && (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        )}
        Logout
      </Button>
    </form>
  );
}
