import "./globals.css";

export const metadata = {
  title: "Advixio - B2B Sourcing & Trade",
  description:
    "Connect with verified manufacturers, suppliers and businesses across India.",

  verification: {
    google: "g4FBWIUecVW5CCrQuZuR06-QO-SS0edg112vuHSlJqE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}