"use client";

import { createContext, use, useState, useCallback, useMemo } from "react";
import { useVideoPlayback } from "./hooks";
import type { StoryCardContextValue, StoryCardProps, StoryCardPosition } from "./types";

// ============================================================================
// Context
// ============================================================================

/**
 * Context for sharing state across StoryCard compound components.
 * Use the `use()` hook (React 19+) to access this context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, actions, meta } = use(StoryCardContext);
 *   // ...
 * }
 * ```
 */
export const StoryCardContext = createContext<StoryCardContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access StoryCard context. Throws if used outside a StoryCard.Provider.
 */
export const useStoryCard = (): StoryCardContextValue => {
    const context = use(StoryCardContext);
    if (!context) {
        throw new Error("useStoryCard must be used within a StoryCard.Provider");
    }
    return context;
}

// ============================================================================
// Utility Functions
// ============================================================================

const TRANSFORMS: Record<StoryCardPosition, string> = {
    "-3": "translateX(-996px) scale(0.6)",
    "-2": "translateX(-722px) scale(0.6)",
    "-1": "translateX(-448px) scale(0.6)",
    "0": "translateX(0) scale(1)",
    "1": "translateX(448px) scale(0.6)",
    "2": "translateX(722px) scale(0.6)",
    "3": "translateX(996px) scale(0.6)",
};

/**
 * Calculate the CSS transform for a card position.
 */
const getTransform = (position: StoryCardPosition, isPressed: boolean): string => {
    const baseTransform = TRANSFORMS[position];

    // Apply pressed scale effect for adjacent cards
    if (isPressed && (position === -1 || position === 1)) {
        return baseTransform.replace("scale(0.6)", "scale(0.45)");
    }
    return baseTransform;
}

/**
 * Calculate z-index based on position (closer to center = higher).
 */
const getZIndex = (position: StoryCardPosition): number => {
    return 3 - Math.abs(position);
}

// ============================================================================
// Provider
// ============================================================================

interface StoryCardProviderProps extends StoryCardProps {
    children: React.ReactNode;
}

/**
 * Provider component for StoryCard context.
 * Manages all state and provides it to child components.
 *
 * @example
 * ```tsx
 * <StoryCard.Provider story={story} position={0} isActive={true} isMuted={false} onToggleMute={toggle}>
 *   <StoryCard.Frame>
 *     <StoryCard.Video />
 *     <StoryCard.Progress />
 *     <StoryCard.Controls />
 *   </StoryCard.Frame>
 * </StoryCard.Provider>
 * ```
 */
export const StoryCardProvider = ({
    story,
    position,
    isActive,
    isMuted,
    onToggleMute,
    onEnded,
    startAtLastSubstory,
    onGoPrevious,
    onGoNext,
    canGoPrevious = true,
    canGoNext = true,
    onCardClick,
    children,
}: StoryCardProviderProps) => {
    // Derive initial substory index based on navigation direction
    const initialIndex = startAtLastSubstory && isActive ? story.substories.length - 1 : 0;

    const [currentSubstoryIndex, setCurrentSubstoryIndex] = useState(() => {
        // For inactive cards: left = last substory, right = first substory
        if (!isActive) {
            return position < 0 ? story.substories.length - 1 : 0;
        }
        return initialIndex;
    });

    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const currentSubstory = story.substories[currentSubstoryIndex];

    // Handle substory/story transitions when video ends
    const handleVideoEnded = useCallback(() => {
        if (currentSubstoryIndex < story.substories.length - 1) {
            setCurrentSubstoryIndex((idx) => idx + 1);
        } else {
            onEnded?.();
        }
    }, [currentSubstoryIndex, story.substories.length, onEnded]);

    // Video playback hook
    const { state: videoState, actions: videoActions } = useVideoPlayback({
        isActive,
        isMuted,
        onEnded: handleVideoEnded,
        videoKey: currentSubstory.id,
    });

    // Navigation actions
    const goPrevious = useCallback(() => {
        if (!isActive) return;
        if (currentSubstoryIndex > 0) {
            setCurrentSubstoryIndex((idx) => idx - 1);
            videoActions.reset();
        } else {
            onGoPrevious?.();
        }
    }, [isActive, currentSubstoryIndex, videoActions, onGoPrevious]);

    const goNext = useCallback(() => {
        if (!isActive) return;
        if (currentSubstoryIndex < story.substories.length - 1) {
            setCurrentSubstoryIndex((idx) => idx + 1);
            videoActions.reset();
        } else {
            onGoNext?.();
        }
    }, [isActive, currentSubstoryIndex, story.substories.length, videoActions, onGoNext]);

    const toggleMute = useCallback(() => {
        if (!isActive) return;
        onToggleMute();
    }, [isActive, onToggleMute]);

    // Compute metadata
    const meta = useMemo(
        () => ({
            canGoPrevious: currentSubstoryIndex > 0 || canGoPrevious,
            canGoNext: currentSubstoryIndex < story.substories.length - 1 || canGoNext,
            isClickable: !isActive && (position === -1 || position === 1),
            zIndex: getZIndex(position),
            transform: getTransform(position, isPressed),
        }),
        [
            currentSubstoryIndex,
            canGoPrevious,
            canGoNext,
            story.substories.length,
            isActive,
            position,
            isPressed,
        ],
    );

    // Handlers for pressed/hovered state
    const setHovered = useCallback((hovered: boolean) => {
        setIsHovered(hovered);
    }, []);

    const handleSetPressed = useCallback(
        (pressed: boolean) => {
            if (pressed && !meta.isClickable) return;
            setIsPressed(pressed);

            // Trigger click callback on press release
            if (!pressed && isPressed && onCardClick) {
                onCardClick();
            }
        },
        [meta.isClickable, isPressed, onCardClick],
    );

    // Build context value
    const contextValue = useMemo<StoryCardContextValue>(
        () => ({
            state: {
                story,
                currentSubstory,
                currentSubstoryIndex,
                position,
                isActive,
                isPlaying: videoState.isPlaying,
                isMuted,
                progress: videoState.progress,
                isHovered,
                isPressed,
                videoRef: videoState.videoRef,
            },
            actions: {
                togglePlayPause: videoActions.togglePlayPause,
                toggleMute,
                goPrevious,
                goNext,
                setHovered,
                setPressed: handleSetPressed,
            },
            meta,
        }),
        [
            story,
            currentSubstory,
            currentSubstoryIndex,
            position,
            isActive,
            videoState.isPlaying,
            isMuted,
            videoState.progress,
            isHovered,
            isPressed,
            videoState.videoRef,
            videoActions.togglePlayPause,
            toggleMute,
            goPrevious,
            goNext,
            setHovered,
            handleSetPressed,
            meta,
        ],
    );

    return <StoryCardContext value={contextValue}>{children}</StoryCardContext>;
}
