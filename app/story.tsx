"use client";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { StoryCard } from "./StoryCard";
import { stories, type Story as StoryType } from "./storiesData";

type VisibleStory = {
    story: StoryType;
    position: -3 | -2 | -1 | 0 | 1 | 2 | 3;
    startAtLastSubstory?: boolean;
};

export const Story = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [navigationDirection, setNavigationDirection] = useState<"forward" | "backward" | null>(
        null,
    );

    const goNextStory = () => {
        setCurrentIndex((index) => {
            if (index < stories.length - 1) {
                setNavigationDirection("forward");
                return index + 1;
            }
            return index;
        });
    };

    const goPreviousStory = () => {
        setCurrentIndex((index) => {
            if (index > 0) {
                setNavigationDirection("backward");
                return index - 1;
            }
            return index;
        });
    };

    const handleStoryEnded = () => {
        goNextStory();
    };

    const toggleMute = () => {
        setIsMuted((muted) => !muted);
    };

    // Calculate which stories to render and their positions
    const getVisibleStories = () => {
        const visible: VisibleStory[] = [];

        for (let offset = -3; offset <= 3; offset++) {
            const index = currentIndex + offset;
            if (index >= 0 && index < stories.length) {
                visible.push({
                    story: stories[index],
                    position: offset as -3 | -2 | -1 | 0 | 1 | 2 | 3,
                    startAtLastSubstory: offset === 0 && navigationDirection === "backward",
                });
            }
        }

        return visible;
    };

    if (!isOpen) return null;

    return (
        <dialog
            open={isOpen}
            className='w-dvw h-dvh max-w-none max-h-none m-0 p-0 border-none'
            style={{ background: "var(--story-background)" }}
        >
            {/* Close button */}
            <div className='absolute top-10 right-10 z-50'>
                <button
                    onClick={onClose}
                    className='text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition'
                    aria-label='Close story viewer'
                    title='Close'
                >
                    <X size={24} weight='bold' />
                </button>
            </div>

            {/* Story carousel container */}
            <div className='flex items-center justify-center h-screen relative'>
                {/* Render all visible story cards */}
                {getVisibleStories().map(({ story, position, startAtLastSubstory }) => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        position={position}
                        isActive={position === 0}
                        isMuted={isMuted}
                        onToggleMute={toggleMute}
                        onEnded={handleStoryEnded}
                        startAtLastSubstory={startAtLastSubstory}
                        onGoPrevious={goPreviousStory}
                        onGoNext={goNextStory}
                        canGoPrevious={currentIndex > 0}
                        canGoNext={currentIndex < stories.length - 1}
                        onCardClick={
                            position === -1
                                ? goPreviousStory
                                : position === 1
                                  ? goNextStory
                                  : undefined
                        }
                    />
                ))}
            </div>
        </dialog>
    );
};
