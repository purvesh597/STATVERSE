import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STATVERSE — Virtual Statistics Lab",
  description:
    "An interactive, gamified virtual lab for learning statistical techniques in data analysis and computing. Explore descriptive statistics, correlation, probability, and AI dashboards.",
  keywords: [
    "statistics",
    "data analysis",
    "interactive learning",
    "virtual lab",
    "probability",
    "correlation",
    "descriptive statistics",
  ],
  openGraph: {
    title: "STATVERSE — Virtual Statistics Lab",
    description: "Turning Raw Data into Smart Decisions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
