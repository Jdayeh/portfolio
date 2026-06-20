import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zaid Jdayeh — Frontend Developer',
  description: 'Frontend Developer specializing in React, TypeScript, and Next.js. Building responsive, accessible, and high-performance web applications.',
  authors: [{ name: 'Zaid Jdayeh', url: 'https://github.com/Jdayeh' }],
  creator: 'Zaid Jdayeh',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Designed & built by Zaid Jdayeh — https://github.com/Jdayeh */}
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          console.log('%c Designed & Built by Zaid Jdayeh ', 'background:#0066b1;color:#fff;font-size:14px;font-weight:bold;padding:6px 12px;');
          console.log('%c https://github.com/Jdayeh ', 'color:#0066b1;font-size:12px;');
        `}} />
      </body>
    </html>
  );
}
