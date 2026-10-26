
import type { Metadata } from "next";
import "./globals.css";
import ScrollReveal from "@/components/layout/ScrollReveal";

export const metadata: Metadata = {
  title: "Advixio - B2B Sourcing & Trade",
  description:
    "Connect with verified manufacturers, suppliers and businesses across India.",

  verification: {
    google: "g4FBWIUecVW5CCrQuZuR06-QO-SS0edg112vuHSlJqE",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://advixio360.com/#organization",
  name: "Advixio360",
  url: "https://advixio360.com/",
  description:
    "Connect with verified manufacturers, suppliers and businesses across India.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://advixio360.com/#website",
  name: "Advixio360",
  url: "https://advixio360.com/",
  publisher: {
    "@id": "https://advixio360.com/#organization",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <ScrollReveal>{children}</ScrollReveal>
      </body>
    </html>
  );
}
