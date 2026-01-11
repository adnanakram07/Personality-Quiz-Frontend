import { Geist, Geist_Mono, REM } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "@/context/QuizContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rem = REM({
  variable: "--font-rem",
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: "Paradox Personality Quiz",
  description: "Interactive personality assessment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rem.variable} antialiased`}
      >
        {/* Global Quiz State */}
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}