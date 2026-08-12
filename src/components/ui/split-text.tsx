"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: "left" | "center" | "right";
  from?: { opacity?: number; y?: number; x?: number; scale?: number };
  to?: { opacity?: number; y?: number; x?: number; scale?: number };
}

export default function SplitText({
  text,
  className = "",
  delay = 40,
  duration = 0.5,
  splitType = "chars",
  tag = "p",
  textAlign = "center",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const Tag = tag;

  const words = text.split(" ");

  if (splitType === "words") {
    return (
      <Tag
        ref={ref as any}
        className={className}
        style={{
          textAlign,
          display: "flex",
          flexWrap: "wrap",
          justifyContent:
            textAlign === "center"
              ? "center"
              : textAlign === "right"
              ? "flex-end"
              : "flex-start",
          gap: "0.3em",
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={from}
            animate={isInView ? to : from}
            transition={{
              duration,
              delay: (i * delay) / 1000,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            style={{ display: "inline-block", willChange: "transform, opacity" }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    );
  }

  // chars mode
  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {words.map((word, wi) => (
        <span key={`word-${wi}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, ci) => {
            const globalIndex = words.slice(0, wi).join(" ").length + ci + (wi > 0 ? 1 : 0);
            return (
              <motion.span
                key={`${char}-${wi}-${ci}`}
                initial={from}
                animate={isInView ? to : from}
                transition={{
                  duration,
                  delay: (globalIndex * delay) / 1000,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                style={{ display: "inline-block", willChange: "transform, opacity" }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
