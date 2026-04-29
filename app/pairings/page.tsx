"use client";

import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { PairingShowcase } from "@/components/PairingShowcase";

export default function PairingsPage() {
  return (
    <>
      <TopBar />
      <PairingShowcase variant="full" />
      <Footer />
    </>
  );
}
