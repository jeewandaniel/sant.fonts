"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchSpotlight } from "./SearchSpotlight";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global shortcuts: `/` and `Cmd/Ctrl+K` open the spotlight from any
  // route. We bail when the user is typing in another input/textarea
  // so the / key doesn't hijack normal text entry.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <SantFontsMark />
          <span className="flex items-baseline gap-0.5">
            <span className="font-display text-[20px] font-medium leading-none tracking-tight2 text-text-primary">
              sant
            </span>
            <span className="font-display text-[20px] font-medium leading-none tracking-tight2 text-accent">
              .fonts
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink href="/pairings">Pairings</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/cli">CLI</NavLink>
          <NavLink href="/mcp">MCP</NavLink>
          <NavLink href="https://github.com/jeewandaniel/sant.fonts" external>
            GitHub
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search fonts"
            title="Search (/  or  ⌘K)"
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-3 py-1.5 font-sans text-[12px] text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
          >
            <SearchGlyph />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded border border-border-subtle px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-faint md:inline">
              /
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <SearchSpotlight open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function SearchGlyph() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    "relative font-sans text-[13px] text-text-secondary transition-colors hover:text-text-primary";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function SantFontsMark() {
  // Tighter viewBox crops the empty padding so the glyph fills the box.
  // Aspect ~16:20 — taller than wide. Tracks --color-text-primary so the
  // mark inverts cleanly between light (warm near-black) and dark (cream).
  return (
    <svg
      width="22"
      height="28"
      viewBox="295 232 462 560"
      className="-my-1 shrink-0 text-text-primary transition-colors"
      fill="currentColor"
      aria-hidden
    >
      <path d="M674.162 239.723C699.175 240.016 724.19 240.108 749.204 240C748.929 245.009 748.947 251.015 749.06 256.082C749.79 288.924 747.911 322.745 749.324 355.492C739.073 355.516 725.274 356.179 715.527 355.676L715.534 384.022C722.892 383.203 740.875 383.872 749.279 383.944C748.357 396.754 749.032 418.879 749.039 432.23L749.436 475.183C749.493 483.176 749.126 490.568 749.537 498.612C738.433 498.607 726.62 498.927 715.597 498.621C714.797 521.181 715.618 549.116 715.625 572.047L715.484 719.36L715.46 757.475C715.481 761.072 716.246 781.822 714.707 783.814L712.625 783.941C675.739 784.034 634.777 784.831 598.244 783.757C598.635 751.336 597.963 717.231 597.96 684.591L598.012 444.329L597.97 357.806C597.961 340.535 597.317 321.31 599.338 304.331C600.969 290.623 607.096 276.44 616.255 266.079C632.89 247.259 649.839 241.484 674.162 239.723Z" />
      <path d="M383.765 526.75C385.34 526.616 386.918 526.532 388.498 526.497C406.6 526.131 425.949 526.676 444.255 526.721C466.005 526.775 491.248 524.858 512.151 530.14C525.133 533.612 534.708 540.126 544.387 548.925C578.237 579.695 569.912 623.984 570.964 664.623C571.551 700.502 571.915 731.406 544.686 758.63C519.806 783.505 497.145 784.014 464.538 784.012L431.029 783.989C388.861 783.958 345.681 783.484 303.59 784.034C303.805 777.125 303.627 769.332 303.625 762.355C303.71 731.013 304.422 712.6 328.264 688.313C353.183 662.93 391.112 667.04 423.81 667.416L476.941 667.513C477.023 658.271 477.024 649.028 476.945 639.786C463.503 638.818 447.288 639.469 433.671 639.521C394.18 639.674 351.012 634.847 317.625 660.643C312.337 664.728 308.004 669.45 303.52 674.374L303.493 633.051C303.313 603.166 301.589 579.037 322.732 554.839C340.736 534.233 357.375 528.655 383.765 526.75Z" />
      <path d="M382.274 383.689C390.26 382.727 410.521 383.445 419.696 383.42C441.157 383.57 462.673 383.299 484.13 383.413C509.835 383.55 530.045 391.307 548.095 409.671C573.101 435.113 570.874 469.539 570.719 502.493C570.661 514.802 570.725 527.014 570.466 539.287C565.211 533.952 561.391 529.051 555.56 523.81C536.479 506.658 518.41 500.945 493.676 498.554C486.126 498.47 477.665 497.825 470.213 498.041C456.198 498.33 442.004 498.737 427.984 498.564C379.422 497.963 337.695 494.906 303.706 536.873C303.551 524.243 303.81 512.809 303.432 499.925C302.485 467.7 301.522 436.328 324.63 410.765C340.871 392.8 358.16 385.135 382.274 383.689Z" />
      <path d="M392.407 239.713C398.955 240.024 405.789 239.44 412.389 239.752C458.062 241.911 511.087 229.338 546.066 267.074C571.497 294.511 571.58 321.313 570.948 356.2C570.701 369.788 571.115 383.563 570.796 397.185C568.474 394.5 566.131 391.833 563.769 389.183C540.252 362.987 517.871 357.593 484.194 355.743C464.202 355.428 443.83 355.966 423.816 355.936C402.834 355.905 380.5 355.174 359.838 358.63C341.917 361.627 325.027 372.069 312.587 385.007C309.796 387.888 306.605 391.439 303.539 393.941C303.053 365.172 300.895 328.647 307.637 300.521C309.847 291.304 318.321 277.56 324.592 270.322C343.607 248.374 364.49 241.974 392.407 239.713Z" />
    </svg>
  );
}
