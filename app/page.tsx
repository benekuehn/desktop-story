"use client";
import { useState } from "react";
import { Story } from "./story";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <Story isOpen={isOpen} onClose={() => setIsOpen(false)} />
    <div className="flex items-center justify-center min-h-screen"><button onClick={() => setIsOpen(true)}>Open Image</button></div>
    </>
  )
}
