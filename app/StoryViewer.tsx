"use client";
import { useState, useCallback, useMemo } from "react";
import { X } from "@phosphor-icons/react";
import { StoryCard, type StoryCardPosition } from "./story";
import { videoStories, type Story as StoryType } from "./storiesData";

/** Visible story with position and navigation context */
interface VisibleStory {
    story: StoryType;
    position: StoryCardPosition;
    startAtLastSubstory?: boolean;
}

/** Props for the Story viewer component */
interface StoryProps {
    /** Whether the story viewer is open */
    isOpen: boolean;
    /** Callback to close the viewer */
    onClose: () => void;
}

/**
 * Full-screen story viewer with carousel navigation.
 * Displays stories in a carousel format with the active story centered.
 *
 * @example
 * ```tsx
 * <Story isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
 * ```
 */
export const StoryViewer = ({ isOpen, onClose }: StoryProps) => {
    const stories = videoStories;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [navigationDirection, setNavigationDirection] = useState<"forward" | "backward" | null>(
        null,
    );

    const goNextStory = useCallback(() => {
        setCurrentIndex((index) => {
            if (index < stories.length - 1) {
                setNavigationDirection("forward");
                return index + 1;
            }
            return index;
        });
    }, [stories.length]);

    const goPreviousStory = useCallback(() => {
        setCurrentIndex((index) => {
            if (index > 0) {
                setNavigationDirection("backward");
                return index - 1;
            }
            return index;
        });
    }, []);

    const handleStoryEnded = useCallback(() => {
        goNextStory();
    }, [goNextStory]);

    const toggleMute = useCallback(() => {
        setIsMuted((muted) => !muted);
    }, []);

    // Memoized visible stories calculation
    const visibleStories = useMemo(() => {
        const visible: VisibleStory[] = [];

        for (let offset = -3; offset <= 3; offset++) {
            const index = currentIndex + offset;
            if (index >= 0 && index < stories.length) {
                visible.push({
                    story: stories[index],
                    position: offset as StoryCardPosition,
                    startAtLastSubstory: offset === 0 && navigationDirection === "backward",
                });
            }
        }

        return visible;
    }, [currentIndex, navigationDirection, stories]);

    // Derived navigation availability
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < stories.length - 1;

    if (!isOpen) return null;

    return (
        <dialog
            open={isOpen}
            className='w-dvw h-dvh max-w-none max-h-none m-0 p-0 border-none overflow-hidden'
            style={{
                background: "var(--story-background)",
                overscrollBehavior: "contain",
                paddingTop: "env(safe-area-inset-top)",
                paddingRight: "env(safe-area-inset-right)",
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingLeft: "env(safe-area-inset-left)",
                boxSizing: "border-box",
            }}
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
            <div className='flex items-center justify-center h-full relative'>
                {/* Render all visible story cards */}
                {visibleStories.map(({ story, position, startAtLastSubstory }) => (
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
                        canGoPrevious={canGoPrevious}
                        canGoNext={canGoNext}
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
