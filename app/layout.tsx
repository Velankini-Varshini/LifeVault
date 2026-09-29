
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeVault AI - Your Digital Life, Organized.",
  description: "Securely store, organize, search, verify, and manage important personal documents using AI and OCR.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LifeVault AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('lifevault_theme');
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-150 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}