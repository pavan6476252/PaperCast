import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaperCast Builder",
  description: "PaperCast Schema-First Document Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="m-0 p-0 antialiased">
        <Script
          id="cancelation-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && (
                  event.reason.name === 'CancelationError' ||
                  event.reason.type === 'cancelation' ||
                  event.reason.message === 'Canceled' ||
                  (event.reason.msg && typeof event.reason.msg === 'string' && event.reason.msg.includes('manually canceled'))
                )) {
                  event.preventDefault();
                }
              });
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
