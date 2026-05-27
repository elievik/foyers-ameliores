import { Epilogue, Work_Sans } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Foyers Améliorés Togo - Une cuisson propre pour un Togo durable",
  description: "Protégez votre santé et préservez nos forêts avec les technologies de cuisson améliorées les plus performantes d'Afrique de l'Ouest.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${epilogue.variable} ${workSans.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-work-sans bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
