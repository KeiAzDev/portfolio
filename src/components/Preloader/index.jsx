"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.css";
import { slideUp, fadeOut } from "./anime";

// ターミナルに表示するコマンドとレスポンス
const terminalLines = [
  {
    type: "command",
    text: "cd portfolio-project",
  },
  {
    type: "response",
    text: "Changing directory to: /home/kei/projects/portfolio-project",
  },
  {
    type: "command",
    text: "npm install next react react-dom express mongoose mongodb framer-motion",
  },
  {
    type: "response",
    text: "Installing packages...\n+ next@14.0.4\n+ react@18.2.0\n+ react-dom@18.2.0\n+ express@4.18.2\n+ mongoose@8.0.3\n+ mongodb@6.3.0\n+ framer-motion@10.16.4\nPackages installed successfully",
  },
  {
    type: "command",
    text: 'git init && git add . && git commit -m "Initial commit"',
  },
  {
    type: "response",
    text: "Initialized empty Git repository\nAdded 216 files\n[main (root-commit) f3a8d2c] Initial commit",
  },
  {
    type: "command",
    text: "npm run build",
  },
  {
    type: "response",
    text: "> portfolio@1.0.0 build\n> next build\n\n- info Creating an optimized production build\n- info Compiled successfully\n- info Linting and checking validity of types\n- info Collecting page data\n- info Generating static pages (9/9)\n- info Finalizing page optimization\n\nRoute (app)                              Size     First Load JS\n┌ ○ /                                    5.3 kB        87.1 kB\n├ ○ /about                               4.8 kB        86.6 kB\n├ ○ /contact                             5.2 kB        87.0 kB\n├ ○ /details                             4.9 kB        86.7 kB\n└ ○ /projects                            5.1 kB        86.9 kB",
  },
  {
    type: "command",
    text: "mongod --version && node -v && npm -v",
  },
  {
    type: "response",
    text: "db version v7.0.4\nv20.10.0\n10.2.3",
  },
  {
    type: "command",
    text: "node server.js",
  },
  {
    type: "response",
    text: "MongoDB connected successfully\nExpress server running on port 3000\nAPI endpoints initialized\nConnected to database: portfolio_db\nEnvironment: development\nServer ready to accept connections",
  },
  {
    type: "command",
    text: "launch --portfolio --welcome",
  },
  {
    type: "response",
    text: "Starting portfolio application...\nLoading assets: [PROGRESS_BAR] %PROGRESS%\nInitializing components...\n\nWelcome to Kei's Portfolio!\nFull-stack developer specialized in Next.js, Express, and MongoDB\nReady to explore? Navigate using the sidebar menu...",
    withLoading: true,
  },
];

export default function Preloader({ onFinish }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentTyping, setCurrentTyping] = useState("");
  const [cursorBlink, setCursorBlink] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [hasAddedLaunchCommand, setHasAddedLaunchCommand] = useState(false);

  const preloaderRef = useRef(null);
  const activeCommandRef = useRef(null);

  // スキップ処理
  const handleSkip = () => {
    setSkipAnimation(true);
  };

  // ローディングバーのアニメーション
  useEffect(() => {
    if (isLoadingAssets && loadingProgress < 100) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const increment = Math.floor(Math.random() * 10) + 1; // 1〜10のランダムな増加
          const newProgress = Math.min(prev + increment, 100);

          // 100%に到達したら読み込み完了を設定
          if (newProgress === 100) {
            setTimeout(() => {
              setLoadingComplete(true);
            }, 500);
          }

          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isLoadingAssets, loadingProgress]);

  // スキップアニメーション効果
  useEffect(() => {
    if (skipAnimation) {
      // 最後のコマンドとレスポンスだけを表示
      setCurrentLineIndex(terminalLines.length - 2);
      setCurrentCharIndex(0);
      setCurrentTyping("");
      setDisplayedLines([]);
    }
  }, [skipAnimation]);

  // タイピングアニメーション
  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    const currentTerminalLine = terminalLines[currentLineIndex];

    // スキップモードでローディングバーがある行に到達したら
    if (skipAnimation && currentTerminalLine.withLoading) {
      setIsLoadingAssets(true);
      return;
    }

    // コマンド入力のシミュレーション（文字ごとに表示）
    if (currentTerminalLine.type === "command") {
      if (currentCharIndex < currentTerminalLine.text.length) {
        const timer = setTimeout(
          () => {
            const newChar = currentTerminalLine.text.charAt(currentCharIndex);
            setCurrentTyping((prev) => prev + newChar);
            setCurrentCharIndex(currentCharIndex + 1);
          },
          skipAnimation ? 5 : 15 + Math.random() * 10, // 高速化: 元は 30 + Math.random() * 30
        );
        return () => clearTimeout(timer);
      } else {
        // コマンド入力完了後、完成したコマンドを表示済みラインに追加
        const timer = setTimeout(
          () => {
            // 最後のlaunchコマンドの場合
            if (currentTerminalLine.text === "launch --portfolio --welcome") {
              // launchコマンドがまだ追加されていない場合のみ追加
              if (!hasAddedLaunchCommand) {
                setDisplayedLines((prev) => [
                  ...prev,
                  {
                    type: "command",
                    text: currentTyping,
                  },
                ]);
                setHasAddedLaunchCommand(true);
              }
            } else {
              // 通常のコマンドは常に追加
              setDisplayedLines((prev) => [
                ...prev,
                {
                  type: "command",
                  text: currentTyping,
                },
              ]);
            }

            setCurrentTyping("");
            setCurrentLineIndex(currentLineIndex + 1);
            setCurrentCharIndex(0);
          },
          skipAnimation ? 30 : 100,
        ); // 高速化: 元は 200
        return () => clearTimeout(timer);
      }
    }
    // レスポンスは一気に表示
    else if (currentTerminalLine.type === "response") {
      // ローディングバーを含む特別なレスポンス
      if (currentTerminalLine.withLoading) {
        setIsLoadingAssets(true);
        return;
      }

      const timer = setTimeout(
        () => {
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
        },
        skipAnimation ? 50 : 200,
      ); // 高速化: 元は 400
      return () => clearTimeout(timer);
    }
  }, [
    currentLineIndex,
    currentCharIndex,
    currentTyping,
    skipAnimation,
    isLoadingAssets,
    hasAddedLaunchCommand,
  ]);

  // ローディングが完了したらプログレスバーの次の行を表示
  useEffect(() => {
    if (loadingComplete && isLoadingAssets) {
      // ローディング完了後に最終メッセージを表示
      const lastLine = terminalLines[terminalLines.length - 1];
      const progressText = lastLine.text
        .replace("[PROGRESS_BAR]", "████████████████████")
        .replace("%PROGRESS%", "100");

      // レスポンスのみを追加（launchコマンドは既に追加済み）
      setDisplayedLines((prev) => {
        return [
          ...prev,
          {
            type: "response",
            text: progressText,
          },
        ];
      });

      // 3秒後にプリローダーを終了
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 3000);
    }
  }, [loadingComplete, isLoadingAssets, onFinish]);

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

  // ローディングバーの生成
  const generateLoadingBar = (progress) => {
    const barLength = 20; // 全体のバーの長さ
    const filledLength = Math.floor((barLength * progress) / 100);
    const emptyLength = barLength - filledLength;

    return "█".repeat(filledLength) + " ".repeat(emptyLength);
  };

  return (
    <motion.div
      className={styles.terminal}
      variants={slideUp}
      initial="initial"
      exit="exit"
      onClick={handleSkip}
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
        {!loadingComplete && (
          <div className={styles.skipButton}>Click anywhere to skip</div>
        )}
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

          {/* 現在入力中のコマンドラインを表示 */}
          {currentLineIndex < terminalLines.length &&
            terminalLines[currentLineIndex].type === "command" &&
            !isLoadingAssets && (
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

          {/* ローディングバーを表示 */}
          {isLoadingAssets && !loadingComplete && (
            <div className={styles.terminalLine}>
              {!hasAddedLaunchCommand && (
                <>
                  <span className={styles.prompt}>$ </span>
                  <span>launch --portfolio --welcome</span>
                </>
              )}
              <div className={styles.responseText}>
                Starting portfolio application...
                <br />
                Loading assets: {generateLoadingBar(loadingProgress)}{" "}
                {loadingProgress}%
              </div>
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
