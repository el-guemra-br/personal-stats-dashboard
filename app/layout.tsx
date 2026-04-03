import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Personal Stats Dashboard | Portfolio Analytics Hub",
  description:
    "A live analytics dashboard showing GitHub contributions, coding activity, language trends, and portfolio growth metrics.",
  openGraph: {
    title: "Personal Stats Dashboard",
    description:
      "Track and share your professional growth: repositories, coding activity, social presence, and trends in one dashboard.",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Personal Stats Dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Stats Dashboard",
    description:
      "A beautiful public dashboard for your coding output, activity, and portfolio growth signals.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
