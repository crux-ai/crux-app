import React from 'react';

export default function Footer() {
  return (
    <footer className="p-5 text-center font-sans">
      <small className="mb-2 block">
        &copy; 2024 Crux. All rights reserved.
      </small>
      <div>
        <p className="mb-2">
          Email:
          {' '}
          <a href="mailto:info@crux.com" className="text-blue-600 hover:underline">info@crux.com</a>
        </p>
        <p>
          <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
          {' '}
          |
          <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
