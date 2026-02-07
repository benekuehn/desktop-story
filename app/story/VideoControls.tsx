"use client";

import { Play, Pause, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useStoryCard } from "./StoryCardContext";

// ============================================================================
// Control Button
// ============================================================================

interface ControlButtonProps {
    /** Click handler */
    onClick: () => void;
    /** Accessible label */
    ariaLabel: string;
    /** Tooltip text */
    title: string;
    /** Button content */
    children: React.ReactNode;
}

/**
 * Styled control button for video controls.
 */
const ControlButton = ({ onClick, ariaLabel, title, children }: ControlButtonProps) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className='text-white rounded-full p-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:bg-white/10 transition-colors'
            aria-label={ariaLabel}
            title={title}
        >
            {children}
        </button>
    );
}

// ============================================================================
// Play/Pause Button
// ============================================================================

export interface PlayPauseButtonProps {
    /** Icon size in pixels */
    size?: number;
}

/**
 * Play/pause toggle button.
 *
 * @example
 * ```tsx
 * <PlayPauseButton size={24} />
 * ```
 */
export const PlayPauseButton = ({ size = 24 }: PlayPauseButtonProps) => {
    const { state, actions } = useStoryCard();
    const { isPlaying } = state;

    return (
        <ControlButton
            onClick={actions.togglePlayPause}
            ariaLabel={isPlaying ? "Pause video" : "Play video"}
            title={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying ? (
                <Pause size={size} weight='regular' />
            ) : (
                <Play size={size} weight='regular' />
            )}
        </ControlButton>
    );
}

// ============================================================================
// Mute Button
// ============================================================================

export interface MuteButtonProps {
    /** Icon size in pixels */
    size?: number;
}

/**
 * Mute/unmute toggle button.
 *
 * @example
 * ```tsx
 * <MuteButton size={24} />
 * ```
 */
export const MuteButton = ({ size = 24 }: MuteButtonProps) => {
    const { state, actions } = useStoryCard();
    const { isMuted } = state;

    return (
        <ControlButton
            onClick={actions.toggleMute}
            ariaLabel={isMuted ? "Unmute video" : "Mute video"}
            title={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? (
                <SpeakerSlash size={size} weight='regular' />
            ) : (
                <SpeakerHigh size={size} weight='regular' />
            )}
        </ControlButton>
    );
}

// ============================================================================
// Video Controls
// ============================================================================

export interface VideoControlsProps {
    /** Additional CSS classes */
    className?: string;
    /** Whether to show play/pause button */
    showPlayPause?: boolean;
    /** Whether to show mute button */
    showMute?: boolean;
    /** Icon size in pixels */
    iconSize?: number;
}

/**
 * Video control overlay with play/pause and mute buttons.
 * Only visible when the story is active and hovered.
 *
 * @example
 * ```tsx
 * <StoryCard.Controls className="absolute top-6 right-3" />
 * ```
 */
export const VideoControls = ({
    className = "absolute top-6 right-3",
    showPlayPause = true,
    showMute = true,
    iconSize = 24,
}: VideoControlsProps) => {
    const { state } = useStoryCard();
    const { isActive, isHovered } = state;

    // Only show for active story
    if (!isActive) return null;

    return (
        <div
            className={`flex gap-2 z-10 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
            } ${className}`}
        >
            {showPlayPause && <PlayPauseButton size={iconSize} />}
            {showMute && <MuteButton size={iconSize} />}
        </div>
    );
}
