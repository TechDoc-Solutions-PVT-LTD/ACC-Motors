import React from 'react';

export const AppFooter = () => {
  return (
    <footer className="flex items-center justify-center text-sm text-center text-gray-600 bg-white border-t shadow-sm h-14">
      <p>
        Developed by{' '}
        <a
          href="https://techdocsolutions.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          TechDoc Solutions (Pvt) Ltd
        </a>
      </p>
    </footer>
  );
};