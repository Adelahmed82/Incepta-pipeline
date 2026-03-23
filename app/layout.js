import './globals.css';

export const metadata = {
  title: 'Incepta Pipeline',
  description: 'نظام إدارة المناقصات والمشاريع — إنسبتا',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
