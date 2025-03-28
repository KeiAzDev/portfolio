"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";

export default function Template({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 最後のコマンドが完了するのを待つために少し長めの時間を設定
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000); // 10秒（必要に応じて調整）

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      {!isLoading && children}
    </>
  );
}
