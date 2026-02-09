"use client";

import { useCallback } from "react";
import { StoryCardProvider, useStoryCard } from "./StoryCardContext";
import { ProgressBar } from "./ProgressBar";
import { VideoControls, PlayPauseButton, MuteButton } from "./VideoControls";
import { NavigationButtons, PreviousButton, NextButton } from "./NavigationButtons";
import { useKeyboardNavigation } from "./hooks";
import type { StoryCardProps } from "./types";

// ============================================================================
// Constants
// ============================================================================

/** Card dimensions in pixels */
const CARD_WIDTH = 390;
const CARD_HEIGHT_REM = "43.75rem";

// ============================================================================
// Video Component
// ============================================================================

export interface VideoProps {
    /** Additional CSS classes */
    className?: string;
}

/**
 * Video element that auto-plays when active.
 *
 * @example
 * ```tsx
 * <StoryCard.Video className="absolute inset-0" />
 * ```
 */
const Video = ({ className = "absolute inset-0 w-full h-full object-cover" }: VideoProps) => {
    const { state } = useStoryCard();
    const { currentSubstory, isMuted, isActive, videoRef } = state;

    // Auto-play when video is ready (handles substory navigation)
    const handleCanPlay = useCallback(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Ignore autoplay errors (browser policy)
            });
        }
    }, [isActive, videoRef]);

    return (
        <video
            ref={videoRef}
            key={currentSubstory.id}
            loop={false}
            muted={isMuted}
            preload='auto'
            playsInline
            className={className}
            src={currentSubstory.videoUrl}
            onCanPlay={handleCanPlay}
        />
    );
};

// ============================================================================
// Click Overlay Component
// ============================================================================

/**
 * Invisible overlay for play/pause on click.
 * Only renders for active stories.
 */
const ClickOverlay = () => {
    const { state, actions } = useStoryCard();
    const { isActive, isPlaying } = state;

    if (!isActive) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            actions.togglePlayPause();
        }
    };

    return (
        <div
            className='absolute inset-0 z-2 cursor-pointer'
            onClick={actions.togglePlayPause}
            onKeyDown={handleKeyDown}
            role='button'
            tabIndex={0}
            aria-label={isPlaying ? "Pause video" : "Play video"}
        />
    );
};

// ============================================================================
// Overlay Components
// ============================================================================

/**
 * Dark overlay for inactive stories.
 */
const InactiveOverlay = () => {
    const { state } = useStoryCard();

    if (state.isActive) return null;

    return (
        <div
            className='absolute inset-0 z-1 pointer-events-none'
            style={{
                background: "var(--background-backdrop, rgba(16, 17, 18, 0.4))",
            }}
        />
    );
};

/**
 * Gradient overlays for active stories (top and bottom).
 */
const GradientOverlays = () => {
    const { state } = useStoryCard();

    if (!state.isActive) return null;

    const gradientTop =
        "linear-gradient(in oklch to bottom, oklch(0.149 0.004 250) 0%, oklch(0.149 0.004 250 / 0.7) 25%, oklch(0.149 0.004 250 / 0.3) 50%, oklch(0.149 0.004 250 / 0.1) 70%, oklch(0.149 0.004 250 / 0) 100%)";
    const gradientBottom =
        "linear-gradient(in oklch to top, oklch(0.149 0.004 250) 0%, oklch(0.149 0.004 250 / 0.7) 25%, oklch(0.149 0.004 250 / 0.3) 50%, oklch(0.149 0.004 250 / 0.1) 70%, oklch(0.149 0.004 250 / 0) 100%)";

    return (
        <>
            <div
                className='absolute top-0 left-0 right-0 h-24 z-1 pointer-events-none'
                style={{ background: gradientTop }}
            />
            <div
                className='absolute bottom-0 left-0 right-0 h-24 z-1 pointer-events-none'
                style={{ background: gradientBottom }}
            />
        </>
    );
};

// ============================================================================
// Keyboard Navigation Component
// ============================================================================

/**
 * Keyboard navigation handler for story navigation.
 * Only active when the story card is focused/active.
 *
 * - Left/Right: navigate between substories
 * - Up/Down: jump to previous/next story (skip substories)
 */
const KeyboardNavigation = () => {
    const { state, actions, meta } = useStoryCard();

    useKeyboardNavigation({
        isEnabled: state.isActive,
        actions: {
            goPrevious: actions.goPrevious,
            goNext: actions.goNext,
            goPreviousStory: actions.goPreviousStory,
            goNextStory: actions.goNextStory,
        },
        meta: {
            canGoPrevious: meta.canGoPrevious,
            canGoNext: meta.canGoNext,
            canGoPreviousStory: meta.canGoPreviousStory,
            canGoNextStory: meta.canGoNextStory,
        },
    });

    return null;
};

// ============================================================================
// Frame Component
// ============================================================================

export interface FrameProps {
    /** Child components */
    children: React.ReactNode;
}

/**
 * Main frame container with positioning and interaction handlers.
 *
 * @example
 * ```tsx
 * <StoryCard.Frame>
 *   <StoryCard.Video />
 *   <StoryCard.Progress />
 * </StoryCard.Frame>
 * ```
 */
const Frame = ({ children }: FrameProps) => {
    const { actions, meta } = useStoryCard();
    const { isClickable, zIndex, transform } = meta;

    const handleMouseDown = useCallback(() => {
        actions.setPressed(true);
    }, [actions]);

    const handleMouseUp = useCallback(() => {
        actions.setPressed(false);
    }, [actions]);

    const handleMouseEnter = useCallback(() => {
        actions.setHovered(true);
    }, [actions]);

    const handleMouseLeave = useCallback(() => {
        actions.setPressed(false);
        actions.setHovered(false);
    }, [actions]);

    return (
        <div
            className={`absolute w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT_REM}] transition-transform duration-700 ease-in-out ${isClickable ? "cursor-pointer" : ""}`}
            style={{
                width: `${CARD_WIDTH}px`,
                height: CARD_HEIGHT_REM,
                transform,
                zIndex,
                left: "50%",
                marginLeft: `-${CARD_WIDTH / 2}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            {/* Navigation buttons outside content overflow */}
            <NavigationButtons />

            {/* Inner container with overflow hidden - hover detection only here */}
            <div
                className='relative w-full h-full overflow-hidden'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
        </div>
    );
};

// ============================================================================
// Default Layout Component
// ============================================================================

/**
 * Default story card layout with all standard components.
 * Use this for a quick setup without customization.
 *
 * @example
 * ```tsx
 * <StoryCard.Provider {...props}>
 *   <StoryCard.DefaultLayout />
 * </StoryCard.Provider>
 * ```
 */
const DefaultLayout = () => {
    return (
        <Frame>
            <Video />
            <ClickOverlay />
            <InactiveOverlay />
            <GradientOverlays />
            <ProgressBar />
            <VideoControls />
            <KeyboardNavigation />
        </Frame>
    );
};

// ============================================================================
// Main StoryCard Component
// ============================================================================

/**
 * Complete story card component with default layout.
 * For custom layouts, use the compound component API.
 *
 * @example
 * ```tsx
 * // Simple usage
 * <StoryCard
 *   story={storyData}
 *   position={0}
 *   isActive={true}
 *   isMuted={false}
 *   onToggleMute={() => setMuted(m => !m)}
 * />
 *
 * // Custom layout
 * <StoryCard.Provider story={storyData} position={0} isActive={true} isMuted={false} onToggleMute={toggle}>
 *   <StoryCard.Frame>
 *     <StoryCard.Video />
 *     <StoryCard.Progress />
 *     {customContent}
 *   </StoryCard.Frame>
 * </StoryCard.Provider>
 * ```
 */
const StoryCardRoot = (props: StoryCardProps) => {
    return (
        <StoryCardProvider {...props}>
            <DefaultLayout />
        </StoryCardProvider>
    );
};

// ============================================================================
// Compound Component Export
// ============================================================================

/**
 * Story card compound component with all subcomponents.
 *
 * @example
 * ```tsx
 * // Default usage
 * <StoryCard story={story} position={0} isActive={true} isMuted={false} onToggleMute={toggle} />
 *
 * // Custom composition
 * <StoryCard.Provider {...props}>
 *   <StoryCard.Frame>
 *     <StoryCard.Video />
 *     <StoryCard.Progress />
 *     <StoryCard.Controls />
 *   </StoryCard.Frame>
 * </StoryCard.Provider>
 * ```
 */
export const StoryCard = Object.assign(StoryCardRoot, {
    /** Provider for custom layouts */
    Provider: StoryCardProvider,
    /** Main frame with positioning */
    Frame,
    /** Video player */
    Video,
    /** Click overlay for play/pause */
    ClickOverlay,
    /** Dark overlay for inactive cards */
    InactiveOverlay,
    /** Gradient overlays for active cards */
    GradientOverlays,
    /** Progress bar */
    Progress: ProgressBar,
    /** Video controls (play/pause + mute) */
    Controls: VideoControls,
    /** Play/pause button only */
    PlayPauseButton,
    /** Mute button only */
    MuteButton,
    /** Navigation buttons (prev + next) */
    Navigation: NavigationButtons,
    /** Previous button only */
    PreviousButton,
    /** Next button only */
    NextButton,
    /** Keyboard navigation handler */
    KeyboardNavigation,
    /** Default layout component */
    DefaultLayout,
});

// Re-export types
export type { StoryCardProps, StoryCardPosition } from "./types";
export { useStoryCard } from "./StoryCardContext";
