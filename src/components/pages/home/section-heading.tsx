import React from 'react';

export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 text-center text-3xl font-medium md:text-5xl">{children}</h2>
  );
}
