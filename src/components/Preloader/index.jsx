"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import { slideUp, fadeOut } from "./anime";

// ターミナルに表示するコマンドとレスポンス
const terminalLines = [
  {
    type: "command",
    text: "cd portfolio",
  },
  {
    type: "response",
    text: "Changing directory to: /home/user/portfolio",
  },
  {
    type: "command",
    text: "ls -la",
  },
  {
    type: "response",
    text: "total 28\ndrwxr-xr-x 4 user user 4096 Mar 28 2025 .\ndrwxr-xr-x 20 user user 4096 Mar 28 2025 ..\n-rw-r--r-- 1 user user  220 Mar 28 2025 .gitignore\ndrwxr-xr-x 8 user user 4096 Mar 28 2025 .next\n-rw-r--r-- 1 user user  642 Mar 28 2025 next.config.mjs\n-rw-r--r-- 1 user user  553 Mar 28 2025 package.json\ndrwxr-xr-x 3 user user 4096 Mar 28 2025 src",
  },
  {
    type: "command",
    text: "npm run dev",
  },
  {
    type: "response",
    text: "> portfolio@0.1.0 dev\n> next dev\n\n- ready started server on 0.0.0.0:3000, url: http://localhost:3000\n- event compiled client and server successfully in 248 ms (17 modules)\n- wait compiling...\n- event compiled successfully in 28 ms (17 modules)",
  },
  {
    type: "command",
    text: "start portfolio --welcome",
  },
  {
    type: "response",
    text: "Starting portfolio application...\nLoading assets: ████████████████████ 100%\nInitializing components...\nWelcome to my portfolio!",
  },
];

export default function Preloader() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentTyping, setCurrentTyping] = useState("");
  const [cursorBlink, setCursorBlink] = useState(true);
  const preloaderRef = useRef(null);
  const activeCommandRef = useRef(null);

  // タイピングアニメーション
  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    const currentTerminalLine = terminalLines[currentLineIndex];

    // コマンド入力のシミュレーション（文字ごとに表示）
    if (currentTerminalLine.type === "command") {
      if (currentCharIndex < currentTerminalLine.text.length) {
        const timer = setTimeout(
          () => {
            const newChar = currentTerminalLine.text.charAt(currentCharIndex);
            setCurrentTyping((prev) => prev + newChar);
            setCurrentCharIndex(currentCharIndex + 1);
          },
          50 + Math.random() * 50,
        ); // ランダムなタイピング速度
        return () => clearTimeout(timer);
      } else {
        // コマンド入力完了後、完成したコマンドを表示済みラインに追加
        const timer = setTimeout(() => {
          setDisplayedLines((prev) => [
            ...prev,
            {
              type: "command",
              text: currentTyping,
            },
          ]);
          setCurrentTyping("");
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentCharIndex(0);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
    // レスポンスは一気に表示
    else if (currentTerminalLine.type === "response") {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev,
          {
            type: "response",
            text: currentTerminalLine.text,
          },
        ]);

        // 自動スクロール
        if (preloaderRef.current) {
          preloaderRef.current.scrollTop = preloaderRef.current.scrollHeight;
        }

        // 次のラインへ
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, currentTyping]);

  // スクロール処理
  useEffect(() => {
    if (preloaderRef.current) {
      preloaderRef.current.scrollTop = preloaderRef.current.scrollHeight;
    }

    if (activeCommandRef.current) {
      activeCommandRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedLines, currentTyping]);

  // カーソル点滅エフェクト
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      className={styles.terminal}
      variants={slideUp}
      initial="initial"
      exit="exit"
    >
      <motion.div
        className={styles.terminalHeader}
        variants={fadeOut}
        initial="initial"
        exit="exit"
      >
        <div className={styles.terminalButtons}>
          <span className={styles.closeBtn}></span>
          <span className={styles.minimizeBtn}></span>
          <span className={styles.maximizeBtn}></span>
        </div>
        <div className={styles.terminalTitle}>portfolio ~ bash</div>
      </motion.div>

      <div className={styles.terminalBody} ref={preloaderRef}>
        <div className={styles.terminalContent}>
          {/* すでに実行済みのコマンドとレスポンスを表示 */}
          {displayedLines.map((line, i) => (
            <div key={i} className={styles.terminalLine}>
              {line.type === "command" && (
                <>
                  <span className={styles.prompt}>$ </span>
                  <span>{line.text}</span>
                </>
              )}
              {line.type === "response" && (
                <div className={styles.responseText}>{line.text}</div>
              )}
            </div>
          ))}

          {/* 現在入力中のコマンドラインを表示（terminalLinesが残っている場合のみ） */}
          {currentLineIndex < terminalLines.length &&
            terminalLines[currentLineIndex].type === "command" && (
              <div className={styles.terminalLine} ref={activeCommandRef}>
                <span className={styles.prompt}>$ </span>
                <span>{currentTyping}</span>
                <span
                  className={`${styles.cursor} ${cursorBlink ? styles.blink : ""}`}
                >
                  ▋
                </span>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
