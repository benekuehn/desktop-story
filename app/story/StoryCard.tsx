"use client";

import { useCallback } from "react";
import { StoryCardProvider, useStoryCard } from "./StoryCardContext";
import { ProgressBar } from "./ProgressBar";
import { VideoControls, PlayPauseButton, MuteButton } from "./VideoControls";
import { NavigationButtons, PreviousButton, NextButton } from "./NavigationButtons";
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
function Video({ className = "absolute inset-0 w-full h-full object-cover" }: VideoProps) {
    const { state } = useStoryCard();
    const { currentSubstory, isMuted, videoRef } = state;

    return (
        <video
            ref={videoRef}
            key={currentSubstory.id}
            loop={false}
            muted={isMuted}
            playsInline
            className={className}
            src={currentSubstory.videoUrl}
        />
    );
}

// ============================================================================
// Click Overlay Component
// ============================================================================

/**
 * Invisible overlay for play/pause on click.
 * Only renders for active stories.
 */
function ClickOverlay() {
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
}

// ============================================================================
// Overlay Components
// ============================================================================

/**
 * Dark overlay for inactive stories.
 */
function InactiveOverlay() {
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
}

/**
 * Gradient overlays for active stories (top and bottom).
 */
function GradientOverlays() {
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
}

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
function Frame({ children }: FrameProps) {
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
        >
            {/* Navigation buttons outside content overflow */}
            <NavigationButtons />

            {/* Inner container with overflow hidden */}
            <div className='relative w-full h-full overflow-hidden'>{children}</div>
        </div>
    );
}

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
function DefaultLayout() {
    return (
        <Frame>
            <Video />
            <ClickOverlay />
            <InactiveOverlay />
            <GradientOverlays />
            <ProgressBar />
            <VideoControls />
        </Frame>
    );
}

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
function StoryCardRoot(props: StoryCardProps) {
    return (
        <StoryCardProvider {...props}>
            <DefaultLayout />
        </StoryCardProvider>
    );
}

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
    /** Default layout component */
    DefaultLayout,
});

// Re-export types
export type { StoryCardProps, StoryCardPosition } from "./types";
export { useStoryCard } from "./StoryCardContext";
