import React from 'react';

import LogOutForm from '@/components/auth/logout/form';
import { authenticatePage } from '@/lib/auth/actions';

export default async function Page() {
  await authenticatePage();
  return (
    <div>
      <div>Page</div>
      <LogOutForm />
    </div>

  );
}
