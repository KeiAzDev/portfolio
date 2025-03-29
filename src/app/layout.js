import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Portfolio",
  description: "My personal portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body cz-shortcut-listen="true">
        {/* レイアウト内でのナビバーの呼び出しを削除 */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
