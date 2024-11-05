import React from 'react';

import LoginForm from '@/components/auth/login/form';
import { skipAuthentication } from '@/lib/auth/actions';

export default async function Login() {
  await skipAuthentication();
  return (
    <LoginForm />
  );
}
