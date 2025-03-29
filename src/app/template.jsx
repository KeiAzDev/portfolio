// src/app/template.jsx
"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";

export default function Template({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  // プリローダーが完了したときの処理
  const handlePreloaderFinish = () => {
    setIsLoading(false);
    // プリローダーが消えた後にナビバーを表示
    setTimeout(() => {
      setShowNavbar(true);
    }, 300);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onFinish={handlePreloaderFinish} />}
      </AnimatePresence>

      {/* プリローダーが終了した後にのみナビバーを表示 */}
      {showNavbar && <Navbar />}

      {children}
    </>
  );
}
