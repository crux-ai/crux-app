import * as React from 'react';
import type { z } from 'zod';

import type { contactSchema } from '@/validations/contact-us';

export const EmailTemplate: React.FC<z.infer<typeof contactSchema>> = ({
  emailAddress,
  emailContent,
}) => (
  <div>
    <h1>
      You got a message!
    </h1>
    <p>
      The email address
      {' '}
      {emailAddress}
      {' '}
      sent you the following message:
      {' '}
    </p>
    <br />
    <p>{emailContent}</p>
  </div>
);
