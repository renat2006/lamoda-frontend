import type { Metadata } from "next";
// Временно используем системные шрифты до добавления CoFo Sans
// import localFont from "next/font/local";
import "./globals.css";

// const cofoSans = localFont({
//   src: [
//     {
//       path: "./fonts/CoFoSans-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "./fonts/CoFoSans-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "./fonts/CoFoSans-SemiBold.woff2",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "./fonts/CoFoSans-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//   ],
//   variable: "--font-cofo-sans",
//   fallback: ["system-ui", "arial"],
// });

export const metadata: Metadata = {
  title: "Lamoda Seller",
  description: "Приложение продавца для управления товарами, заказами и аналитикой",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
