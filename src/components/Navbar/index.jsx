"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.css";
import AnimatedLogo from "../Logo/AnimatedLogo";

// ナビゲーションリンク
const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Details", href: "/details" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
];

// ソーシャルリンク
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/KeiAzDev",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourprofile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/yourprofile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    ),
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 現在のパスがナビリンクと一致するか確認
  const isActive = (href) => {
    return pathname === href ? "page" : "";
  };

  return (
    <>
      {/* デスクトップ用ナビゲーション */}
      <header className={styles.navbar}>
        {/* ロゴ */}
        <Link href="/" className={styles.logo}>
          <AnimatedLogo />
        </Link>

        {/* ナビゲーションリンク */}
        <nav className={styles.nav}>
          <div className={styles.navList}>
            {navLinks.map(({ label, href }, index) => (
              <Link
                key={label}
                href={href}
                className={styles.navLink}
                style={{ "--item-index": index }} // CSSアニメーション用のインデックス
                aria-current={isActive(href)}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ソーシャルリンク */}
        <div className={styles.socialLinks}>
          {socialLinks.map(({ label, href, icon }, index) => (
            <a
              key={label}
              href={href}
              className={styles.socialLink}
              style={{ "--icon-index": index }} // CSSアニメーション用のインデックス
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </header>

      {/* モバイル用トグルボタン */}
      <button
        className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ""}`}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={styles.menuIcon}></span>
        <span className={styles.menuIcon}></span>
        <span className={styles.menuIcon}></span>
      </button>

      {/* モバイル用ナビゲーション */}
      <nav
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavVisible : ""}`}
      >
        {navLinks.map(({ label, href }, index) => (
          <Link
            key={label}
            href={href}
            className={styles.mobileNavLink}
            style={{ transitionDelay: `${index * 50 + 100}ms` }}
            aria-current={isActive(href)}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <div className={styles.navIcons}>
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
