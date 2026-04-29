"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { HeroA } from "@/components/heroes/HeroA";
import { FontGrid } from "@/components/FontGrid";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [customText] = useState("");
  const [size] = useState(96);

  return (
    <>
      <TopBar />
      <main>
        <HeroA />
        <FontGrid customText={customText} size={size} />
      </main>
      <Footer />
    </>
  );
}
