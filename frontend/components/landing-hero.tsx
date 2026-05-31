"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Command,
  Globe,
  BrainCircuit,
  Activity,
  Database,
  Cloud,
} from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_01";

const COMPANY_LOGOS = [
  { name: "Acme Corp", icon: Command },
  { name: "NeuroSync", icon: BrainCircuit },
  { name: "PulseCore", icon: Activity },
  { name: "MedBase", icon: Database },
  { name: "CareCloud", icon: Cloud },
  { name: "GlobalHealth", icon: Globe },
];

function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState<{ char: string; isScrambled: boolean }[]>([]);

  useEffect(() => {
    let iteration = 0;
    let scrambleInterval: ReturnType<typeof setInterval>;

    const startAnimation = () => {
      clearInterval(scrambleInterval);
      iteration = 0;

      scrambleInterval = setInterval(() => {
        setDisplay(
          text.split("").map((char, index) => {
            if (char === " ") return { char: " ", isScrambled: false };
            
            if (index < Math.floor(iteration)) {
              return { char: text[index], isScrambled: false };
            }
            
            return {
              char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
              isScrambled: true,
            };
          }),
        );

        if (iteration >= text.length) {
          clearInterval(scrambleInterval);
        }

        iteration += 1 / 4;
      }, 40);
    };

    startAnimation();

    const loopInterval = setInterval(() => {
      startAnimation();
    }, 6000);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(loopInterval);
    };
  }, [text]);

  return (
    <span className="inline-flex">
      {display.map((item, i) => (
        <span
          key={i}
          className={
            item.isScrambled
              ? "font-mono text-sky-400 opacity-80"
              : "text-foreground"
          }
        >
          {item.char}
        </span>
      ))}
    </span>
  );
}

export function LandingHero() {
  return (
    <section className="relative flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center overflow-hidden bg-background py-20">
      
      {/* Arka Plan Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.12, 0.20, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-[600px] w-[600px] rounded-full bg-sky-400/20 blur-[120px]"
        />
      </div>

      <div className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 text-center">
        
        {/* Üst Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex items-center gap-2 rounded-full border border-border/40 bg-muted/10 p-1 pr-4 shadow-sm backdrop-blur-md"
        >
          <Badge variant="secondary" className="rounded-full bg-background px-3 py-1 font-medium shadow-sm">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-sky-500" />
            New
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            MIT-BIH Dataset integration is now live
          </span>
        </motion.div>

        {/* Ana Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <h1 className="text-6xl font-bold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            <ScrambleText text="LUMINA" />
            <span className="text-muted-foreground/30">.ai</span>
          </h1>
        </motion.div>

        {/* Açıklama Metni */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
            Detect arrhythmia with machine learning. A clean pipeline transforming raw heartbeat signals into structural predictions.
          </p>
        </motion.div>

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group h-14 rounded-full px-8 text-base font-medium transition-all hover:scale-[1.02]"
          >
            <Link href="/predict">
              Start Prediction
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-14 rounded-full px-8 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/10 hover:text-foreground"
          >
            <Link href="#methodology">
              Explore Methodology
            </Link>
          </Button>
        </motion.div>

        {/* Sonsuz Kayan Markalar (Trusted By) Bölümü */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-28 w-full max-w-[900px]"
        >
          <div className="relative mx-auto w-fit mb-8 text-center">
            
            {/* Doodle Arrow (Vurgu Oku) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 185 }}
              animate={{
                opacity: 0.85, 
                scale: 1,
                x: [0, 8, 0],
                y: [0, 8, 0], 
                rotate: 185,
              }}
              transition={{
                opacity: { duration: 0.5, delay: 1.2 },
                scale: { type: "spring", delay: 1.2, bounce: 0.5 },
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -left-10 -top-12 w-12 sm:-left-24 sm:-top-16 sm:w-16 pointer-events-none"
            >
              <img
                src="/arrows.png"
                alt="Highlight arrow"
                className="w-full h-auto drop-shadow-sm"
              />
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by forward-thinking clinical and tech teams
            </p>
          </div>
          <div className="relative mx-auto flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 35,
                repeat: Infinity,
              }}
              className="flex w-max items-center gap-20 pr-20"
            >
              {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, index) => {
                const Icon = company.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground/30 transition-colors hover:text-muted-foreground/70"
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                    <span className="text-xl font-bold tracking-tight">
                      {company.name}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}