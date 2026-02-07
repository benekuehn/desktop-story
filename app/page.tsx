"use client";
import { useState } from "react";
import { StoryViewer } from "./StoryViewer";

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <StoryViewer isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <div className='flex items-center justify-center min-h-screen'>
                <button onClick={() => setIsOpen(true)}>Open Stories</button>
            </div>
        </>
    );
}
