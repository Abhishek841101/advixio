
import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MXMG7MGB"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
            title="Google Tag Manager"
          />
        </noscript>

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MXMG7MGB');
            `,
          }}
        />

        {/* Website Content */}
        <ScrollReveal>{children}</ScrollReveal>
      </body>
    </html>
  );
}
