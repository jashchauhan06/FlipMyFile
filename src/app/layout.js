import "./globals.css";

export const metadata = {
  title: "FlipMyFile — Stop Fighting File Formats",
  description:
    "Drop a file, pick a format, done. Convert images and videos between any format — JPG, PNG, WebP, MP4, MOV, AVI, and more. No signup, no limits.",
  keywords: [
    "file converter",
    "image converter",
    "video converter",
    "convert jpg to png",
    "convert mp4 to webm",
    "FlipMyFile",
    "online file converter",
  ],
  openGraph: {
    title: "FlipMyFile — Stop Fighting File Formats",
    description:
      "Drop a file, pick a format, done. Fast, free, and secure file conversion.",
    type: "website",
    locale: "en_US",
    siteName: "FlipMyFile",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlipMyFile — Stop Fighting File Formats",
    description:
      "Drop a file, pick a format, done. Fast, free, and secure file conversion.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
