"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface GlassEditorProps {
  code: string;
  language?: string;
  typingSpeed?: number;
  showLineNumbers?: boolean;
}

const GlassEditor: React.FC<GlassEditorProps> = ({
  code,
  language = 'markdown',
  typingSpeed = 30,
  showLineNumbers = true,
}) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [replayCountdown, setReplayCountdown] = useState(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const replayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Reset animation when code changes
  useEffect(() => {
    setDisplayedCode('');
    setCurrentIndex(0);
    setIsAnimating(true);
    setReplayCountdown(0);
    
    // Clear any existing timers
    clearAllTimers();
  }, [code]);

  // Clear all timers
  const clearAllTimers = () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    animationTimerRef.current = null;
    replayTimerRef.current = null;
    countdownIntervalRef.current = null;
  };

  // Typing animation effect
  useEffect(() => {
    if (!isAnimating || currentIndex >= code.length) return;
    
    animationTimerRef.current = setTimeout(() => {
      setDisplayedCode(prev => prev + code[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, typingSpeed);
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [currentIndex, code, typingSpeed, isAnimating]);

  // Handle animation completion
  useEffect(() => {
    if (currentIndex >= code.length && isAnimating) {
      // Animation completed
      setIsAnimating(false);
      startReplayCountdown();
    }
  }, [currentIndex, code, isAnimating]);

  // Start replay countdown
  const startReplayCountdown = () => {
    setReplayCountdown(5);
    
    // Set up replay after 5 seconds
    replayTimerRef.current = setTimeout(() => {
      resetAnimation();
    }, 5000);
    
    // Set up countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setReplayCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset animation
  const resetAnimation = () => {
    clearAllTimers();
    setDisplayedCode('');
    setCurrentIndex(0);
    setIsAnimating(true);
    setReplayCountdown(0);
  };

  // Scroll to bottom as typing progresses
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }
  }, [displayedCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Calculate line numbers
  const lineCount = displayedCode.split('\n').length;
  const totalLines = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, totalLines) }, (_, i) => i + 1);

  // Custom renderers for Markdown
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={document.documentElement.classList.contains('dark') ? vscDarkPlus : vs}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`bg-gray-200 dark:bg-gray-700 px-1 rounded ${className || ''}`} {...props}>
          {children}
        </code>
      );
    },
    em({ children }: any) {
      return <em className="italic">{children}</em>;
    },
    strong({ children }: any) {
      return <strong className="font-bold">{children}</strong>;
    },
    blockquote({ children }: any) {
      return <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300">{children}</blockquote>;
    },
    a({ children, href }: any) {
      return <a href={href} className="text-blue-500 hover:underline">{children}</a>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-5">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5">{children}</ol>;
    },
    h1({ children }: any) {
      return <h1 className="text-3xl font-bold my-4">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-2xl font-bold my-3">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-xl font-bold my-2">{children}</h3>;
    },
    del({ children }: any) {
      return <del className="line-through">{children}</del>;
    },
    table({ children }: any) {
      return <table className="w-full border-collapse my-4">{children}</table>;
    },
    thead({ children }: any) {
      return <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>;
    },
    th({ children }: any) {
      return <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 font-bold text-left">{children}</th>;
    },
    td({ children }: any) {
      return <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>;
    },
    img({ src, alt }: any) {
      return <img src={src} alt={alt} className="max-w-full my-2 rounded-lg" />;
    },
  };

  return (
    <div className="rounded-xl overflow-hidden w-full">
      <div className="p-4 bg-gray-100/30 dark:bg-gray-900/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-2 text-sm font-mono text-gray-500 dark:text-gray-400">
            {language}
          </div>
          {!isAnimating && replayCountdown > 0 && (
            <div className="ml-auto text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300">
              Replaying in {replayCountdown}s
            </div>
          )}
        </div>
        
        <div 
          ref={editorRef}
          className="border rounded-lg font-mono text-sm overflow-auto max-h-96
                    bg-white/60 backdrop-blur-md border-gray-300/70
                    dark:bg-gray-800/30 dark:backdrop-blur-md dark:border-gray-700/50"
        >
          <div className="flex w-full">
            {showLineNumbers && (
              <div className="py-4 pl-4 pr-3 select-none text-gray-400 dark:text-gray-500 
                              bg-gray-100/30 dark:bg-gray-900/20">
                {lineNumbers.map(num => (
                  <div key={num} className="text-right pr-2">
                    {num}
                  </div>
                ))}
              </div>
            )}
            <div className="flex-1 py-4 pl-3 pr-4 text-gray-800 dark:text-gray-100 w-full">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={renderers}
              >
                {displayedCode}
              </ReactMarkdown>
              {isAnimating && <span className="ml-1 animate-pulse">|</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassEditor;