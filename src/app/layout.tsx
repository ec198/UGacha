// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Your site description here" />
        <title>UGacha</title>
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
